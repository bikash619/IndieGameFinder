import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGames } from "@/lib/api";
import FilterSidebar from "@/components/FilterSidebar";
import RandomGameButton from "@/components/RandomGameButton";
import GameCard from "@/components/GameCard";
import { Filter, Game } from "@shared/schema";
import CustomPagination from "@/components/CustomPagination";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  // Initial filter state
  const [filters, setFilters] = useState<Partial<Filter>>({
    // Always include "indie" genre by default to ensure only indie games are shown
    genres: ["indie"],
    minRating: 0,
    minReviews: 0,
    yearStart: 2000,
    yearEnd: new Date().getFullYear(),
    page: 1,
  });

  // Query for games with current filters
  const { data, isLoading, isPending, error, refetch } = useQuery({
    queryKey: ["/api/games", filters],
    queryFn: () => getGames(filters),
  });

  const games = data?.results || [];
  const totalPages = data ? Math.ceil(data.count / 20) : 0;

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<Filter>) => {
    // Ensure 'indie' is always included in the genres
    const updatedFilters = { ...newFilters };
    if (!updatedFilters.genres || !updatedFilters.genres.includes("indie")) {
      updatedFilters.genres = [...(updatedFilters.genres || []), "indie"];
    }
    
    setFilters({ ...updatedFilters, page: 1 });
    // No need to manually refetch as the query will automatically update with new filter values
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => {
      // Ensure 'indie' is still included in the genres during pagination
      const updatedFilters = { ...prev, page };
      if (!updatedFilters.genres || !updatedFilters.genres.includes("indie")) {
        updatedFilters.genres = [...(updatedFilters.genres || []), "indie"];
      }
      return updatedFilters;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="font-heading font-bold text-4xl md:text-5xl mb-3 text-text">
          Find Your Next Indie Game
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Discover hidden gems in the indie game world
        </p>
      </section>

      <div className="lg:flex gap-8">
        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <div className="flex-1">
          {/* Random Game Button */}
          <RandomGameButton filters={filters} />

          {/* Game Grid */}
          <section>
            {isLoading || isPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden shadow-lg">
                    <Skeleton className="w-full h-40" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-3" />
                      <div className="flex gap-1 mb-3">
                        {[...Array(3)].map((_, j) => (
                          <Skeleton key={j} className="h-4 w-16 rounded-full" />
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-background rounded-xl p-6 text-center">
                <h2 className="text-xl font-medium mb-2">Error loading games</h2>
                <p className="text-gray-400">
                  There was a problem loading the games. Please try again later.
                </p>
              </div>
            ) : games.length === 0 ? (
              <div className="bg-background rounded-xl p-6 text-center">
                <h2 className="text-xl font-medium mb-2">No games found</h2>
                <p className="text-gray-400">
                  No games match your current filter settings. Try broadening your search.
                </p>
              </div>
            ) : (
              <>
                <div className="max-w-2xl mx-auto mb-8">
                  {games.length > 0 && <GameCard game={games[0]} />}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <CustomPagination
                      currentPage={filters.page || 1}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
