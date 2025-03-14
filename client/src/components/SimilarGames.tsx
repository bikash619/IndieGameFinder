
import { useQuery } from "@tanstack/react-query";
import { getSimilarGames } from "@/lib/api";
import GameCard from "./GameCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Game } from "@shared/schema";

interface SimilarGamesProps {
  gameId: string;
  genres?: { id: number; name: string; slug: string }[];
}

const SimilarGames = ({ gameId, genres = [] }: SimilarGamesProps) => {
  const { data, isLoading } = useQuery({
    queryKey: [`/api/games/${gameId}/similar`],
    queryFn: () => getSimilarGames(gameId)
  });

  if (isLoading) {
    return <SimilarGamesSkeleton />;
  }

  if (!data?.results || data.results.length === 0) {
    return null;
  }

  // Filter and limit to 3 games, excluding the current game
  const similarGames = data.results
    .filter(game => game.id !== parseInt(gameId))
    .slice(0, 3);

  if (similarGames.length === 0) {
    return null;
  }

  const genreNames = genres
    .slice(0, 3)
    .map((g) => g.name)
    .join(", ");

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading font-semibold text-2xl">
          Similar Games You Might Like
        </h2>
      </div>
      
      <p className="text-gray-400 mb-6">
        {genreNames ? `Based on ${genreNames}` : "Games you might enjoy"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarGames.map((game: Game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
};

const SimilarGamesSkeleton = () => (
  <section>
    <div className="flex items-center justify-between mb-5">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-6 w-20" />
    </div>
    
    <Skeleton className="h-6 w-72 mb-6" />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
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
  </section>
);

export default SimilarGames;
