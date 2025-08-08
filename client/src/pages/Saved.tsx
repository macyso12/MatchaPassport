import { useSavedSpots } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import { useToastState } from "@/hooks/useToastState";
import { staticSpots } from "@/data/spots";
import { StarRating } from "@/components/StarRating";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function Saved() {
  const { user, signIn } = useAuth();
  const { savedSpots, loading, removeSavedSpot } = useSavedSpots(user?.id);
  const { showToast } = useToastState();

  const handleRemoveSaved = async (spotId: string) => {
    try {
      await removeSavedSpot(spotId);
      showToast("Spot removed from saved list");
    } catch (error) {
      showToast("Failed to remove spot", "error");
    }
  };

  if (!user) {
    return (
      <div className="h-screen bg-white flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-900">Saved Spots</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Sign in to view saved spots</h2>
            <p className="text-gray-600 mb-4">Save your favorite matcha cafes for later</p>
            <Button onClick={signIn} className="bg-matcha-500 text-white hover:bg-matcha-600">
              Sign In with Google
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-semibold text-gray-900">Saved Spots</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {loading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : savedSpots.length > 0 ? (
          <div className="p-4 space-y-4">
            {savedSpots.map((savedSpot) => {
              const spot = staticSpots.find(s => s.id === savedSpot.spotId);
              if (!spot) return null;

              return (
                <Card key={savedSpot.id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{spot.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{spot.address}</p>
                        <div className="flex items-center">
                          <StarRating rating={spot.averageRating} size="sm" />
                          <span className="text-sm text-gray-600 ml-2">
                            {spot.averageRating} ({spot.totalRatings} reviews)
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSaved(spot.id)}
                        className="ml-4 text-gray-400 hover:text-red-500 p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">No saved spots yet</h2>
              <p className="text-gray-600">Save matcha cafes you want to visit later!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
