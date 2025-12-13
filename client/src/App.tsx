
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { GameProvider } from "@/lib/game-context";
import WelcomeScreen from "@/pages/WelcomeScreen";
import WorldMap from "@/pages/WorldMap";
import LevelView from "@/pages/LevelView";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WelcomeScreen} />
      <Route path="/map" component={WorldMap} />
      <Route path="/level/:id" component={LevelView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <Router />
        <Toaster />
      </GameProvider>
    </QueryClientProvider>
  );
}

export default App;
