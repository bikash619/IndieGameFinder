import { Link } from "wouter";
import { Game } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RatingDisplay from "./RatingDisplay";

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const releaseYear = game.released ? new Date(game.released).getFullYear() : "TBA";
  // Only show developer name if it exists and is not null
  const developerName = game.developers && 
                       game.developers.length > 0 && 
                       game.developers[0]?.name ? 
                       game.developers[0].name : "";
  
  // Prioritize the indie genre and get up to 3 genres for display
  let genres = [];
  
  // Check if game has genres
  if (game.genres && game.genres.length > 0) {
    // Find the indie genre
    const indieGenre = game.genres.find(g => g.slug === 'indie' || g.name.toLowerCase() === 'indie');
    
    // If indie genre exists, put it first
    if (indieGenre) {
      // Add indie genre first
      genres.push(indieGenre);
      
      // Add up to 2 more non-indie genres
      const otherGenres = game.genres
        .filter(g => g.id !== indieGenre.id)
        .slice(0, 2);
      
      genres = [...genres, ...otherGenres];
    } else {
      // If no indie genre, just take the first 3
      genres = game.genres.slice(0, 3);
    }
  }

  return (
    <Card className="game-card bg-background rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
      <div className="relative">
        <img
          src={game.background_image || "https://placehold.co/400x225/27272A/F4F4F5?text=No+Image+Available"}
          alt={`${game.name} thumbnail`}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
        {game.rating !== null && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-rating text-xs mr-1"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>{game.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-heading font-semibold text-lg mb-1 line-clamp-1">{game.name}</h3>
        <div className="flex items-center text-sm text-gray-400 mb-3">
          <span>{releaseYear}</span>
          {developerName && (
            <>
              <span className="mx-2">•</span>
              <span className="truncate">{developerName}</span>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {genres.map((genre) => (
            <Badge
              key={genre.id}
              variant="outline"
              className="text-xs px-2 py-0.5 bg-surface rounded-full font-normal"
            >
              {genre.name}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center">
          {game.metacritic && (
            <RatingDisplay score={game.metacritic} size="sm" />
          )}
          <Link 
            href={`/game/${game.id}`}
            className="text-xs px-3 py-1 bg-secondary rounded-full hover:bg-opacity-90 transition-colors"
          >
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
