import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dice5 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Filter } from "@shared/schema";
import { getRandomGame } from "@/lib/api";

interface RandomGameButtonProps {
  filters: Partial<Filter>;
}

const RandomGameButton = ({ filters }: RandomGameButtonProps) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const randomGameMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      // Make sure indie genre is always included in random game search
      const updatedFilters = { ...filters };
      if (!updatedFilters.genres || !updatedFilters.genres.includes("indie")) {
        updatedFilters.genres = [...(updatedFilters.genres || []), "indie"];
      }
      return await getRandomGame(updatedFilters);
    },
    onSuccess: (data) => {
      if (data && data.id) {
        navigate(`/game/${data.id}`);
      } else {
        toast({
          title: "No games found",
          description: "No games match your current filter settings. Try broadening your search.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to find a random game. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const handleClick = () => {
    randomGameMutation.mutate();
  };

  return (
    <section className="mb-10">
      <Button
        onClick={handleClick}
        disabled={isLoading}
        className="w-full bg-secondary hover:bg-opacity-90 py-4 rounded-xl font-medium text-lg transition-colors h-auto"
      >
        <Dice5 className="mr-2" />
        {isLoading ? "Finding a game..." : "Find Random Game"}
      </Button>
    </section>
  );
};

export default RandomGameButton;
