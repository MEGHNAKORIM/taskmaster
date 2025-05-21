import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { 
  signInWithEmail, 
  signInWithGoogle, 
  signUpWithEmail, 
  logout 
} from '@/lib/firebase';
import { setUser, clearUser, setLoading, setError } from '@/store/auth-slice';
import { useState } from 'react';

export function useAuth() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  
  const login = async (email: string, password: string) => {
    setIsLoggingIn(true);
    dispatch(setLoading(true));
    
    try {
      const userCredential = await signInWithEmail(email, password);
      
      dispatch(setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
      }));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      dispatch(setError(errorMessage));
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      
      return false;
    } finally {
      setIsLoggingIn(false);
      dispatch(setLoading(false));
    }
  };
  
  const loginWithGoogle = async () => {
    setIsLoggingIn(true);
    dispatch(setLoading(true));
    
    try {
      const userCredential = await signInWithGoogle();
      
      dispatch(setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
      }));
      
      toast({
        title: "Google login successful",
        description: `Welcome${userCredential.user.displayName ? `, ${userCredential.user.displayName}` : ""}!`,
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Google login failed";
      dispatch(setError(errorMessage));
      
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: errorMessage,
      });
      
      return false;
    } finally {
      setIsLoggingIn(false);
      dispatch(setLoading(false));
    }
  };
  
  const signup = async (email: string, password: string) => {
    setIsLoggingIn(true);
    dispatch(setLoading(true));
    
    try {
      const userCredential = await signUpWithEmail(email, password);
      
      dispatch(setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
      }));
      
      toast({
        title: "Signup successful",
        description: "Your account has been created!",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      dispatch(setError(errorMessage));
      
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: errorMessage,
      });
      
      return false;
    } finally {
      setIsLoggingIn(false);
      dispatch(setLoading(false));
    }
  };
  
  const logoutUser = async () => {
    dispatch(setLoading(true));
    
    try {
      await logout();
      dispatch(clearUser());
      
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      dispatch(setError(errorMessage));
      
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: errorMessage,
      });
      
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  return {
    user,
    loading,
    error,
    isLoggingIn,
    login,
    loginWithGoogle,
    signup,
    logout: logoutUser,
  };
}
