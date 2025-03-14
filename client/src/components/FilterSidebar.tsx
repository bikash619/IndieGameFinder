import { useState, useEffect, useCallback, useRef } from "react";
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
}

const FilterSidebar = ({ filters, onFilterChange }: FilterSidebarProps) => {
  // Local state for filter values
  const [localFilters, setLocalFilters] = useState<Partial<Filter>>(filters);
  
  // Debounce timer for applying filters automatically
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update local filters when parent filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Fetch genres and platforms
  const { data: genresData, isLoading: genresLoading } = useQuery({
    queryKey: ['/api/genres'],
  });

  const { data: platformsData, isLoading: platformsLoading } = useQuery({
    queryKey: ['/api/platforms'],
  });
  
  // Define the types for our API responses
  type ApiResponse<T> = {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
  };
  
  type GenreType = {
    id: number;
    name: string;
    slug: string;
  };
  
  type PlatformType = {
    id: number;
    name: string;
    slug: string;
  };

  // Extract results with proper type checking
  const genres: GenreType[] = genresData ? (genresData as any).results || [] : [];
  const platforms: PlatformType[] = platformsData ? (platformsData as any).results || [] : [];

  // Apply filters after a delay
  const applyFiltersWithDebounce = useCallback((newFilters: Partial<Filter>) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      onFilterChange(newFilters);
    }, 500); // 500ms delay
  }, [onFilterChange]);

  // Update local filter state
  const updateFilter = (key: keyof Filter, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    
    // Always make sure "indie" is included in the genres
    if (key === "genres" && Array.isArray(value) && !value.includes("indie")) {
      newFilters.genres = [...value, "indie"];
    }
    
    setLocalFilters(newFilters);
    applyFiltersWithDebounce(newFilters);
  };

  // Toggle genre selection
  const toggleGenre = (genreSlug: string) => {
    setLocalFilters((prev) => {
      const currentGenres = prev.genres || [];
      const updated = currentGenres.includes(genreSlug)
        ? currentGenres.filter((g) => g !== genreSlug)
        : [...currentGenres, genreSlug];
      
      // Always make sure "indie" is included in the genres
      // but we don't show it in the UI as a toggleable option
      let finalGenres = updated;
      if (!finalGenres.includes("indie")) {
        finalGenres = [...finalGenres, "indie"];
      }
      
      const newFilters = { ...prev, genres: finalGenres };
      // Apply filters with debounce
      applyFiltersWithDebounce(newFilters);
      return newFilters;
    });
  };

  // Determine if a genre is selected
  const isGenreSelected = (genreSlug: string) => {
    return (localFilters.genres || []).includes(genreSlug);
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
              {genres.filter((genre) => genre.slug !== "indie").map((genre) => (
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

        <p className="text-center text-xs text-gray-400 mt-4">
          Filters are applied automatically
        </p>
      </div>
    </aside>
  );
};

export default FilterSidebar;
