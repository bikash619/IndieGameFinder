interface RatingDisplayProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const RatingDisplay = ({ score, size = "md" }: RatingDisplayProps) => {
  // Get color based on score
  const getColorClass = (score: number) => {
    if (score >= 75) return "bg-accent";
    if (score >= 60) return "bg-[#FBBF24]";
    return "bg-[#EF4444]";
  };
  
  // Get size classes
  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "w-6 h-6 text-xs";
      case "lg":
        return "w-10 h-10 text-xl";
      default:
        return "w-8 h-8 text-lg";
    }
  };

  const colorClass = getColorClass(score);
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`${colorClass} text-primary font-bold rounded ${sizeClasses} flex items-center justify-center`}>
      {score}
    </div>
  );
};

export default RatingDisplay;
