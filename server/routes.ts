import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import fetch from "node-fetch";
import { filterSchema, type Filter, type RawgResponse } from "@shared/schema";

const RAWG_API_KEY = process.env.RAWG_API_KEY || "6340d05733ef4c4cb00d2d337f150e7d";
const RAWG_BASE_URL = "https://api.rawg.io/api";

// Simple cache mechanism
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const fetchWithCache = async (url: string) => {
  const now = Date.now();
  const cachedData = cache.get(url);

  if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
    return cachedData.data;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    cache.set(url, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Get games list with filters
  app.get("/api/games", async (req, res) => {
    try {
      const queryParams = filterSchema.parse({
        genres: req.query.genres ? (Array.isArray(req.query.genres) ? req.query.genres : [req.query.genres]) : undefined,
        minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
        minReviews: req.query.minReviews ? Number(req.query.minReviews) : undefined,
        yearStart: req.query.yearStart ? Number(req.query.yearStart) : undefined,
        yearEnd: req.query.yearEnd ? Number(req.query.yearEnd) : undefined,
        platforms: req.query.platforms 
          ? (Array.isArray(req.query.platforms) 
            ? req.query.platforms.map(Number) 
            : [Number(req.query.platforms)])
          : undefined,
        ordering: req.query.ordering as string | undefined,
        search: req.query.search as string | undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        page_size: req.query.page_size ? Number(req.query.page_size) : 20,
      });

      // Build the API URL with query parameters
      let apiUrl = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}`;
      
      // Always include 'indie' in genres if not searching for specific genres
      if (queryParams.genres && queryParams.genres.length > 0) {
        apiUrl += `&genres=${queryParams.genres.join(",")}`;
      } else {
        apiUrl += `&genres=indie`;
      }

      if (queryParams.minRating !== undefined) {
        apiUrl += `&metacritic=${queryParams.minRating},100`;
      }

      if (queryParams.minReviews !== undefined) {
        // Use as part of ordering instead
        if (!queryParams.ordering) {
          apiUrl += `&ordering=-ratings_count`;
        }
      }

      if (queryParams.yearStart && queryParams.yearEnd) {
        apiUrl += `&dates=${queryParams.yearStart}-01-01,${queryParams.yearEnd}-12-31`;
      } else if (queryParams.yearStart) {
        apiUrl += `&dates=${queryParams.yearStart}-01-01,2030-12-31`;
      } else if (queryParams.yearEnd) {
        apiUrl += `&dates=1980-01-01,${queryParams.yearEnd}-12-31`;
      }

      if (queryParams.platforms && queryParams.platforms.length > 0) {
        apiUrl += `&parent_platforms=${queryParams.platforms.join(",")}`;
      }

      if (queryParams.ordering) {
        apiUrl += `&ordering=${queryParams.ordering}`;
      }

      if (queryParams.search) {
        apiUrl += `&search=${encodeURIComponent(queryParams.search)}`;
      }

      apiUrl += `&page=${queryParams.page}&page_size=${queryParams.page_size}`;

      const data = await fetchWithCache(apiUrl) as RawgResponse;
      res.json(data);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  // Get a single random game
  app.get("/api/games/random", async (req, res) => {
    try {
      // Parse the filter parameters
      const queryParams = filterSchema.parse({
        genres: req.query.genres ? (Array.isArray(req.query.genres) ? req.query.genres : [req.query.genres]) : undefined,
        minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
        minReviews: req.query.minReviews ? Number(req.query.minReviews) : undefined,
        yearStart: req.query.yearStart ? Number(req.query.yearStart) : undefined,
        yearEnd: req.query.yearEnd ? Number(req.query.yearEnd) : undefined,
        platforms: req.query.platforms 
          ? (Array.isArray(req.query.platforms) 
            ? req.query.platforms.map(Number) 
            : [Number(req.query.platforms)])
          : undefined,
      });

      // Get a larger page size to have more options to choose from
      let apiUrl = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&page_size=40`;
      
      // Always include 'indie' in genres if not searching for specific genres
      if (queryParams.genres && queryParams.genres.length > 0) {
        apiUrl += `&genres=${queryParams.genres.join(",")}`;
      } else {
        apiUrl += `&genres=indie`;
      }

      if (queryParams.minRating !== undefined) {
        apiUrl += `&metacritic=${queryParams.minRating},100`;
      }

      if (queryParams.yearStart && queryParams.yearEnd) {
        apiUrl += `&dates=${queryParams.yearStart}-01-01,${queryParams.yearEnd}-12-31`;
      } else if (queryParams.yearStart) {
        apiUrl += `&dates=${queryParams.yearStart}-01-01,2030-12-31`;
      } else if (queryParams.yearEnd) {
        apiUrl += `&dates=1980-01-01,${queryParams.yearEnd}-12-31`;
      }

      if (queryParams.platforms && queryParams.platforms.length > 0) {
        apiUrl += `&parent_platforms=${queryParams.platforms.join(",")}`;
      }

      // Use a random ordering to get different results
      const orderings = ['-rating', '-released', '-added', '-created', '-updated', '-metacritic', '-name'];
      const randomOrdering = orderings[Math.floor(Math.random() * orderings.length)];
      apiUrl += `&ordering=${randomOrdering}`;

      // Get a random page between 1 and 5
      const randomPage = Math.floor(Math.random() * 5) + 1;
      apiUrl += `&page=${randomPage}`;

      const data = await fetchWithCache(apiUrl) as RawgResponse;
      
      if (!data.results || data.results.length === 0) {
        return res.status(404).json({ message: "No games found matching the criteria" });
      }

      // Pick a random game from the results
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const randomGame = data.results[randomIndex];

      // If we have a game ID, fetch its full details
      if (randomGame) {
        const gameDetailUrl = `${RAWG_BASE_URL}/games/${randomGame.id}?key=${RAWG_API_KEY}`;
        const gameDetail = await fetchWithCache(gameDetailUrl);
        res.json(gameDetail);
      } else {
        res.status(404).json({ message: "No games found matching the criteria" });
      }
    } catch (error) {
      console.error("Error getting random game:", error);
      res.status(500).json({ message: "Failed to get random game" });
    }
  });

  // Get a single game by ID
  app.get("/api/games/:id", async (req, res) => {
    try {
      const gameId = req.params.id;
      const apiUrl = `${RAWG_BASE_URL}/games/${gameId}?key=${RAWG_API_KEY}`;
      const data = await fetchWithCache(apiUrl);
      res.json(data);
    } catch (error) {
      console.error("Error fetching game details:", error);
      res.status(500).json({ message: "Failed to fetch game details" });
    }
  });

  // Get similar games
  app.get("/api/games/:id/similar", async (req, res) => {
    try {
      const gameId = req.params.id;
      const apiUrl = `${RAWG_BASE_URL}/games/${gameId}/game-series?key=${RAWG_API_KEY}`;
      
      // First try to get games from the same series
      let data = await fetchWithCache(apiUrl) as RawgResponse;
      
      // If no games in the series, get games with similar tags/genres
      if (!data.results || data.results.length < 3) {
        // Get the game details first to extract genres
        const gameDetailsUrl = `${RAWG_BASE_URL}/games/${gameId}?key=${RAWG_API_KEY}`;
        const gameDetails = await fetchWithCache(gameDetailsUrl) as any;
        
        if (gameDetails.genres && gameDetails.genres.length > 0) {
          // Get genres from the game, but always include indie
          let genreSlugs = "indie";  // Always start with indie
          
          // Add other genres (up to 2 more) from the original game
          const otherGenres = gameDetails.genres
            .filter((g: any) => g.slug !== "indie")
            .slice(0, 2)
            .map((g: any) => g.slug);
            
          if (otherGenres.length > 0) {
            genreSlugs += `,${otherGenres.join(',')}`;
          }
          
          const similarUrl = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&genres=${genreSlugs}&exclude_additions=true&page_size=6`;
          data = await fetchWithCache(similarUrl) as RawgResponse;
          
          // Filter out the current game
          if (data.results) {
            data.results = data.results.filter(game => game.id !== Number(gameId));
          }
        }
      }
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching similar games:", error);
      res.status(500).json({ message: "Failed to fetch similar games" });
    }
  });

  // Get all available genres
  app.get("/api/genres", async (req, res) => {
    try {
      const apiUrl = `${RAWG_BASE_URL}/genres?key=${RAWG_API_KEY}`;
      const data = await fetchWithCache(apiUrl);
      res.json(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).json({ message: "Failed to fetch genres" });
    }
  });

  // Get all available platforms
  app.get("/api/platforms", async (req, res) => {
    try {
      const apiUrl = `${RAWG_BASE_URL}/platforms/lists/parents?key=${RAWG_API_KEY}`;
      const data = await fetchWithCache(apiUrl);
      res.json(data);
    } catch (error) {
      console.error("Error fetching platforms:", error);
      res.status(500).json({ message: "Failed to fetch platforms" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
