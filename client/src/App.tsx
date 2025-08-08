import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { BottomNavigation } from "@/components/BottomNavigation";
import MapView from "@/pages/MapView";
import SpotDetail from "@/pages/SpotDetail";
import CheckIn from "@/pages/CheckIn";
import Passport from "@/pages/Passport";
import Saved from "@/pages/Saved";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-cream-100 max-w-md mx-auto relative overflow-hidden">
      <Switch>
        <Route path="/" component={MapView} />
        <Route path="/spot/:id" component={SpotDetail} />
        <Route path="/check-in/:id" component={CheckIn} />
        <Route path="/passport" component={Passport} />
        <Route path="/saved" component={Saved} />
        <Route component={NotFound} />
      </Switch>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
