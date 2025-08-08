import { useParams, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { staticSpots } from "@/data/spots";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useComments } from "@/hooks/useFirestore";
import { useSavedSpots } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";

export default function SpotDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const spot = staticSpots.find(s => s.id === id);
  const { comments, loading: commentsLoading } = useComments(id);
  const { savedSpots, addSavedSpot } = useSavedSpots(user?.id);

  // Check if this spot is already saved
  useEffect(() => {
    if (savedSpots && spot) {
      const isSpotSaved = savedSpots.some(saved => saved.spotId === spot.id);
      setIsSaved(isSpotSaved);
    }
  }, [savedSpots, spot]);

  if (!spot) {
    return <div>Spot not found</div>;
  }

  const goBack = () => {
    setLocation("/");
  };

  const handleCheckIn = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to check in",
        variant: "destructive",
      });
      return;
    }
    setLocation(`/check-in/${spot.id}`);
  };

  const handleSaveForLater = async () => {
    if (!user) {
      toast({
        title: "Sign in required", 
        description: "Please sign in to save spots",
        variant: "destructive",
      });
      return;
    }

    if (isSaved) {
      toast({
        title: "Already saved",
        description: "Spot already saved!",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await addSavedSpot({
        userId: user.id,
        spotId: spot.id,
      });
      setIsSaved(true);
      toast({
        title: "Saved!",
        description: "The spot has been saved",
      });
    } catch (error) {
      if (error instanceof Error && error.message?.includes("already exists")) {
        setIsSaved(true);
        toast({
          title: "Saved!",
          description: "The spot has been saved",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save spot",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="mr-4 p-2 -ml-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900">{spot.name}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Spot Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center mb-2">
            <StarRating rating={spot.averageRating} size="md" />
            <span className="text-lg font-semibold text-gray-900 ml-2">
              {spot.averageRating}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              ({spot.totalRatings} reviews)
            </span>
          </div>
          <p className="text-gray-600">{spot.address}</p>
        </div>

        {/* Recent Comments Section */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Comments</h2>
          
          {commentsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{comment.userName}</span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{comment.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to check in!</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
        <div className="flex space-x-3 max-w-md mx-auto">
          <Button 
            onClick={handleCheckIn}
            className="flex-1 bg-matcha-500 text-white hover:bg-matcha-600 py-3"
          >
            Check In
          </Button>
          <Button 
            variant="outline"
            onClick={handleSaveForLater}
            disabled={isSaved || isSaving}
            className={`flex-1 py-3 ${
              isSaved 
                ? "bg-matcha-100 text-matcha-700 border-matcha-300 cursor-not-allowed" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
            }`}
          >
            {isSaving ? "Saving..." : isSaved ? "Saved ✓" : "Save for Later"}
          </Button>
        </div>
      </div>
    </div>
  );
}
