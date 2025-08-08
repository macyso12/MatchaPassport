import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { MapPin, Wifi, Battery, Signal } from "lucide-react";
import { staticSpots } from "@/data/spots";
import { Spot } from "@shared/schema";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MapView() {
  const [, setLocation] = useLocation();
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock time for status bar
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });

  const handleSpotClick = (spot: Spot) => {
    setSelectedSpot(spot);
  };

  const viewSpotDetails = () => {
    if (selectedSpot) {
      setLocation(`/spot/${selectedSpot.id}`);
    }
  };

  return (
    <div className="h-screen relative bg-cream-100">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="flex justify-between items-center px-4 pt-2 text-sm font-medium text-gray-900">
          <span>{currentTime}</span>
          <div className="flex items-center space-x-1">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Map Header */}
      <div className="absolute top-8 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center px-4 py-3">
          <MapPin className="w-5 h-5 text-matcha-500 mr-3" />
          <h1 className="text-lg font-semibold text-gray-900">MatchaMap</h1>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(45deg, #f0f4e8 25%, transparent 25%), 
                           linear-gradient(-45deg, #f0f4e8 25%, transparent 25%), 
                           linear-gradient(45deg, transparent 75%, #f0f4e8 75%), 
                           linear-gradient(-45deg, transparent 75%, #f0f4e8 75%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          backgroundColor: "#e8ede0"
        }}
      >
        {/* Map Grid Lines */}
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-8 grid-rows-12 h-full w-full">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="border-r border-gray-300"></div>
            ))}
            <div></div>
          </div>
          <div className="absolute inset-0 grid grid-rows-12 grid-cols-8 h-full w-full">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="border-b border-gray-300 col-span-8"></div>
            ))}
          </div>
        </div>

        {/* Map Pins */}
        {staticSpots.map((spot, index) => {
          const positions = [
            { top: "32%", left: "16%" },
            { top: "48%", left: "32%" },
            { top: "64%", left: "48%" },
            { top: "80%", left: "24%" },
            { top: "96%", left: "40%" },
          ];
          
          const position = positions[index] || positions[0];
          
          return (
            <div
              key={spot.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ top: position.top, left: position.left }}
            >
              <button
                onClick={() => handleSpotClick(spot)}
                className="w-8 h-8 bg-matcha-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-matcha-600 transition-colors"
              >
                <MapPin className="w-4 h-4 text-white fill-current" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Spot Preview Card */}
      {selectedSpot && (
        <Card className="absolute bottom-20 left-4 right-4 shadow-xl border border-gray-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{selectedSpot.name}</h3>
              <div className="flex items-center">
                <StarRating rating={selectedSpot.averageRating} size="sm" />
                <span className="text-sm font-medium text-gray-700 ml-1">
                  {selectedSpot.averageRating}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{selectedSpot.address}</p>
            <Button 
              onClick={viewSpotDetails}
              className="w-full bg-matcha-500 text-white hover:bg-matcha-600"
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
