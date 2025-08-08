import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { staticSpots } from "@/data/spots";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCheckIns } from "@/hooks/useFirestore";
import { useComments } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import { useToastState } from "@/hooks/useToastState";

export default function CheckIn() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { showToast } = useToastState();
  
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const spot = staticSpots.find(s => s.id === id);
  const { addCheckIn } = useCheckIns(user?.id);
  const { addComment } = useComments(id);

  if (!spot) {
    return <div>Spot not found</div>;
  }

  const goBack = () => {
    setLocation(`/spot/${spot.id}`);
  };

  const handleSubmitCheckIn = async () => {
    if (!user) {
      showToast("Please sign in to check in", "error");
      return;
    }

    if (selectedRating === 0) {
      showToast("Please select a rating", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Add check-in
      await addCheckIn({
        userId: user.id,
        spotId: spot.id,
        rating: selectedRating,
        comment: comment.trim() || undefined,
      });

      // Add comment if provided
      if (comment.trim()) {
        await addComment({
          spotId: spot.id,
          userId: user.id,
          userName: user.displayName || "Anonymous",
          text: comment.trim(),
        });
      }

      showToast("Check-in successful!");
      setTimeout(() => setLocation("/passport"), 1500);
    } catch (error) {
      showToast("Failed to check in", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number) => {
    const texts = {
      1: "Poor",
      2: "Fair", 
      3: "Good",
      4: "Great",
      5: "Excellent"
    };
    return texts[rating as keyof typeof texts] || "";
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
        <h1 className="text-xl font-semibold text-gray-900">Check In</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {/* Spot Name */}
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{spot.name}</h2>
        
        {/* Rating Section */}
        <div className="mb-6">
          <p className="text-gray-700 mb-3">How was your experience?</p>
          <StarRating 
            rating={selectedRating}
            onRatingChange={setSelectedRating}
            interactive={true}
            size="lg"
          />
          
          {/* Current Rating Display */}
          {selectedRating > 0 && (
            <div className="flex items-center mt-3">
              <StarRating rating={selectedRating} size="sm" />
              <span className="text-sm text-gray-600 ml-2">
                {getRatingText(selectedRating)}
              </span>
            </div>
          )}
        </div>

        {/* Comment Section */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Add a comment (optional)</label>
          <Textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Share your thoughts about this spot..."
            className="resize-none focus:ring-matcha-500 focus:border-matcha-500"
          />
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmitCheckIn}
          disabled={selectedRating === 0 || isSubmitting}
          className="w-full bg-matcha-500 text-white hover:bg-matcha-600 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Check-In"}
        </Button>
      </div>
    </div>
  );
}
