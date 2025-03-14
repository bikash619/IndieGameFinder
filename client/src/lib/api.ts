import { Filter, Game, RawgResponse } from "@shared/schema";

// Helper function to build query parameters
export const buildQueryString = (filter: Partial<Filter>): string => {
  const params = new URLSearchParams();

  if (filter.genres && filter.genres.length > 0) {
    filter.genres.forEach(genre => params.append('genres', genre));
  }

  if (filter.minRating !== undefined) {
    params.append('minRating', filter.minRating.toString());
  }

  if (filter.minReviews !== undefined) {
    params.append('minReviews', filter.minReviews.toString());
  }

  if (filter.yearStart !== undefined) {
    params.append('yearStart', filter.yearStart.toString());
  }

  if (filter.yearEnd !== undefined) {
    params.append('yearEnd', filter.yearEnd.toString());
  }

  if (filter.platforms && filter.platforms.length > 0) {
    filter.platforms.forEach(platform => params.append('platforms', platform.toString()));
  }

  if (filter.ordering !== undefined) {
    params.append('ordering', filter.ordering);
  }

  if (filter.search !== undefined) {
    params.append('search', filter.search);
  }

  if (filter.page !== undefined) {
    params.append('page', filter.page.toString());
  }

  if (filter.page_size !== undefined) {
    params.append('page_size', filter.page_size.toString());
  }

  return params.toString();
};

// API Functions
export const getGames = async (filter: Partial<Filter> = {}): Promise<RawgResponse> => {
  const queryString = buildQueryString(filter);
  const response = await fetch(`/api/games?${queryString}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }
  
  return response.json();
};

export const getRandomGame = async (filter: Partial<Filter> = {}): Promise<Game> => {
  const queryString = buildQueryString(filter);
  const response = await fetch(`/api/games/random?${queryString}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch random game');
  }
  
  return response.json();
};

export const getGameById = async (id: string): Promise<Game> => {
  const response = await fetch(`/api/games/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch game details');
  }
  
  return response.json();
};

export const getSimilarGames = async (id: string): Promise<RawgResponse> => {
  const response = await fetch(`/api/games/${id}/similar`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch similar games');
  }
  
  return response.json();
};

export const getGenres = async (): Promise<any> => {
  const response = await fetch('/api/genres');
  
  if (!response.ok) {
    throw new Error('Failed to fetch genres');
  }
  
  return response.json();
};

export const getPlatforms = async (): Promise<any> => {
  const response = await fetch('/api/platforms');
  
  if (!response.ok) {
    throw new Error('Failed to fetch platforms');
  }
  
  return response.json();
};
