import { Map, BookOpen, Bookmark } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { 
      id: "map", 
      label: "Map", 
      icon: Map, 
      path: "/" 
    },
    { 
      id: "passport", 
      label: "Passport", 
      icon: BookOpen, 
      path: "/passport" 
    },
    { 
      id: "saved", 
      label: "Saved", 
      icon: Bookmark, 
      path: "/saved" 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
      <div className="flex">
        {navItems.map(({ id, label, icon: Icon, path }) => {
          const isActive = location === path;
          
          return (
            <button
              key={id}
              onClick={() => setLocation(path)}
              className={cn(
                "flex-1 flex flex-col items-center py-2 transition-colors",
                isActive 
                  ? "text-matcha-500" 
                  : "text-gray-400 hover:text-matcha-500"
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
