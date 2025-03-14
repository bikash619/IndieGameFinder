import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import GameDetails from "@/components/GameDetails";
import SimilarGames from "@/components/SimilarGames";
import { getGameById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  // Fetch game details
  const { data: game, isLoading, error } = useQuery({
    queryKey: [`/api/games/${id}`],
  });

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="text-gray-400 hover:text-white"
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>
      </div>

      {/* Game Details Component */}
      <GameDetails gameId={id} />

      {/* Similar Games Component */}
      {!isLoading && !error && game && (
        <SimilarGames gameId={id} genres={game.genres} />
      )}
    </>
  );
};

export default GamePage;
