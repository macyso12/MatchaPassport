import { useCheckIns } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import { staticSpots } from "@/data/spots";
import { StarRating } from "@/components/StarRating";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default function Passport() {
  const { user, signIn } = useAuth();
  const { checkIns, loading } = useCheckIns(user?.id);

  if (!user) {
    return (
      <div className="h-screen bg-white flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-900">Matcha Passport</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Sign in to view your passport</h2>
            <p className="text-gray-600 mb-4">Track your matcha cafe visits and ratings</p>
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
        <h1 className="text-xl font-semibold text-gray-900">Matcha Passport</h1>
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
        ) : checkIns.length > 0 ? (
          <div className="p-4 space-y-4">
            {checkIns.map((checkIn) => {
              const spot = staticSpots.find(s => s.id === checkIn.spotId);
              if (!spot) return null;

              return (
                <Card key={checkIn.id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{spot.name}</h3>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(checkIn.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <StarRating rating={checkIn.rating} size="sm" />
                    </div>
                    {checkIn.comment && (
                      <p className="text-sm text-gray-600">{checkIn.comment}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">No check-ins yet</h2>
              <p className="text-gray-600">Start exploring matcha cafes to build your passport!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
