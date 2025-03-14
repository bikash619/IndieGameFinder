import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Filter } from "@shared/schema";
import { getGenres, getPlatforms } from "@/lib/api";
import { FilterIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FilterSidebarProps {
  filters: Partial<Filter>;
  onFilterChange: (filters: Partial<Filter>) => void;
  onApplyFilters: () => void;
}

const FilterSidebar = ({ filters, onFilterChange, onApplyFilters }: FilterSidebarProps) => {
  // Local state for filter values before applying
  const [localFilters, setLocalFilters] = useState<Partial<Filter>>(filters);
  
  // Update local filters when parent filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Fetch genres and platforms
  const { data: genresData = { results: [] }, isLoading: genresLoading } = useQuery({
    queryKey: ['/api/genres'],
  });

  const { data: platformsData = { results: [] }, isLoading: platformsLoading } = useQuery({
    queryKey: ['/api/platforms'],
  });

  // Update local filter state
  const updateFilter = (key: keyof Filter, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle genre selection
  const toggleGenre = (genreSlug: string) => {
    setLocalFilters((prev) => {
      const currentGenres = prev.genres || [];
      const updated = currentGenres.includes(genreSlug)
        ? currentGenres.filter((g) => g !== genreSlug)
        : [...currentGenres, genreSlug];
      
      return { ...prev, genres: updated };
    });
  };

  // Determine if a genre is selected
  const isGenreSelected = (genreSlug: string) => {
    return (localFilters.genres || []).includes(genreSlug);
  };

  // Handle apply button click
  const handleApply = () => {
    onFilterChange(localFilters);
    onApplyFilters();
  };

  return (
    <aside className="lg:w-72 mb-8 lg:mb-0">
      <div className="bg-background rounded-xl p-5 shadow-lg sticky top-24">
        <div className="flex items-center mb-5">
          <FilterIcon className="mr-2 text-secondary" size={20} />
          <h2 className="font-heading font-semibold text-xl">Game Filters</h2>
        </div>
        <p className="text-sm text-gray-400 mb-6">Customize your game discovery</p>

        {/* Genres */}
        <div className="mb-6">
          <h3 className="font-heading font-medium mb-3">Genres</h3>
          {genresLoading ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="h-7 w-16 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {genresData?.results?.filter((genre: any) => genre.slug !== "indie").map((genre: any) => (
                <button
                  key={genre.slug}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    isGenreSelected(genre.slug)
                      ? "bg-secondary text-white"
                      : "bg-surface hover:bg-secondary hover:bg-opacity-70"
                  }`}
                  onClick={() => toggleGenre(genre.slug)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Minimum Rating */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-medium">Minimum Rating</h3>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-rating mr-1"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{localFilters.minRating || 0}% or higher</span>
            </div>
          </div>
          <Slider
            value={[localFilters.minRating || 0]}
            min={0}
            max={100}
            step={5}
            onValueChange={(value) => updateFilter("minRating", value[0])}
            className="w-full"
          />
        </div>

        {/* Minimum Reviews */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-medium">Minimum Reviews</h3>
            <span>{localFilters.minReviews || 0}+ reviews</span>
          </div>
          <Slider
            value={[localFilters.minReviews || 0]}
            min={0}
            max={1000}
            step={50}
            onValueChange={(value) => updateFilter("minReviews", value[0])}
            className="w-full"
          />
        </div>

        {/* Release Date Range */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-medium">Release Date Range</h3>
            <span>
              {localFilters.yearStart || 2000} - {localFilters.yearEnd || 2023}
            </span>
          </div>
          <div className="relative pt-1 space-y-4">
            <Slider
              value={[localFilters.yearStart || 2000]}
              min={2000}
              max={2023}
              step={1}
              onValueChange={(value) => updateFilter("yearStart", value[0])}
              className="w-full"
            />
            <Slider
              value={[localFilters.yearEnd || 2023]}
              min={2000}
              max={2023}
              step={1}
              onValueChange={(value) => updateFilter("yearEnd", value[0])}
              className="w-full"
            />
          </div>
        </div>

        <Button
          className="w-full bg-secondary hover:bg-opacity-90 transition-colors mt-4"
          onClick={handleApply}
        >
          Apply Filters
        </Button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
