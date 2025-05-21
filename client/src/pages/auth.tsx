import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/auth-slice";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmail(email, password);
      } else {
        userCredential = await signUpWithEmail(email, password);
      }
      
      const user = userCredential.user;
      
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
      
      toast({
        title: isLogin ? "Login successful" : "Account created",
        description: `Welcome${user.displayName ? `, ${user.displayName}` : ""}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;
      
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
      
      toast({
        title: "Login successful",
        description: `Welcome, ${user.displayName || "user"}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: "Unable to authenticate with Google",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 auth-bg">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Project Cost Tracker</h1>
            <p className="text-gray-600 mt-2">Track and manage your project expenses with ease</p>
          </div>
          
          <h2 className="text-xl font-medium mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
          
          <form onSubmit={handleEmailAuth}>
            <div className="mb-4">
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2"
                disabled={loading}
                required
              />
            </div>
            
            <div className="mb-6">
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2"
                disabled={loading}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
              disabled={loading}
            >
              {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
            </Button>
            
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <div className="px-3 text-sm text-gray-500">or</div>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium flex items-center justify-center"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <i className="fab fa-google text-red-500 mr-2"></i>
              Continue with Google
            </Button>
          </form>
          
          <div className="text-center mt-4 text-sm">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              className="text-blue-500 hover:text-blue-700 ml-1 font-medium focus:outline-none"
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
