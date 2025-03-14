import { Game } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { getGameById } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import RatingDisplay from "./RatingDisplay";

interface GameDetailsProps {
  gameId: string;
}

const GameDetails = ({ gameId }: GameDetailsProps) => {
  const { data: game, isLoading, error } = useQuery({
    queryKey: [`/api/games/${gameId}`],
  });

  if (isLoading) {
    return <GameDetailsSkeleton />;
  }

  if (error || !game) {
    return (
      <div className="bg-background rounded-xl p-6">
        <h2 className="text-xl font-medium">Error loading game details</h2>
        <p className="text-gray-400 mt-2">
          There was a problem loading the game details. Please try again later.
        </p>
      </div>
    );
  }

  const releaseDate = game.released
    ? new Date(game.released).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "TBA";

  return (
    <section className="bg-background rounded-xl overflow-hidden mb-10">
      <div className="relative">
        <img
          src={game.background_image || "https://placehold.co/1200x400/27272A/F4F4F5?text=No+Image+Available"}
          alt={`${game.name} header`}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h2 className="font-heading font-bold text-3xl mb-2">{game.name}</h2>
          <div className="flex items-center space-x-4 flex-wrap">
            {game.rating !== null && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-rating mr-1"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>{game.rating.toFixed(1)}</span>
              </div>
            )}
            <div className="text-gray-400">{game.ratings_count} reviews</div>
            {game.released && (
              <div className="px-2 py-0.5 bg-surface rounded text-sm">
                {new Date(game.released).getFullYear()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Genres */}
        {game.genres && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {game.genres.map((genre) => (
              <Badge
                key={genre.id}
                className="px-3 py-1 bg-secondary text-white rounded-full font-normal"
              >
                {genre.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Platforms */}
        {game.platforms && game.platforms.length > 0 && (
          <div className="mb-6">
            <div className="text-lg font-medium mb-2">Platforms</div>
            <div className="flex flex-wrap gap-2">
              {game.platforms.map((item) => (
                <span
                  key={item.platform.id}
                  className="px-3 py-1 bg-surface rounded-md text-sm"
                >
                  {item.platform.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface p-4 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Rating</div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-rating mr-2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-xl font-medium">
                {game.rating ? game.rating.toFixed(1) : "N/A"}
              </span>
            </div>
          </div>
          <div className="bg-surface p-4 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Released</div>
            <div className="text-xl font-medium">{releaseDate}</div>
          </div>
          <div className="bg-surface p-4 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Metacritic</div>
            {game.metacritic ? (
              <div className="flex items-center">
                <RatingDisplay score={game.metacritic} />
                <span className="ml-2">
                  {game.metacritic >= 75
                    ? "Excellent"
                    : game.metacritic >= 60
                    ? "Good"
                    : "Average"}
                </span>
              </div>
            ) : (
              <div className="text-xl font-medium">N/A</div>
            )}
          </div>
        </div>

        {/* Description */}
        {game.description_raw && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">About</h3>
            <div className="text-gray-300 leading-relaxed space-y-4">
              {game.description_raw
                .split("\n")
                .filter((paragraph: string) => paragraph.trim().length > 0)
                .map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Skeleton loader for GameDetails
const GameDetailsSkeleton = () => (
  <section className="bg-background rounded-xl overflow-hidden mb-10">
    <div className="relative">
      <Skeleton className="w-full h-64" />
      <div className="absolute bottom-0 left-0 p-6">
        <Skeleton className="h-10 w-64 mb-2" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>

    <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      <div className="mb-6">
        <Skeleton className="h-7 w-32 mb-2" />
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-32 rounded-md" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>

      <Skeleton className="h-7 w-32 mb-3" />
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-4 w-full mb-2" />
      ))}
    </div>
  </section>
);

export default GameDetails;
