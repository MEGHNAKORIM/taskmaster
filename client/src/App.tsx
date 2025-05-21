import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { store } from "./store";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import { useEffect } from "react";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./store/auth-slice";

function Router() {
  const [location, setLocation] = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }));
        
        // Redirect to dashboard if on auth page
        if (location === '/auth' || location === '/') {
          setLocation('/dashboard');
        }
      } else {
        dispatch(clearUser());
        // Redirect to auth if not already there
        if (location !== '/auth') {
          setLocation('/auth');
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={Auth} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppWithStore() {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppWithStore />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
