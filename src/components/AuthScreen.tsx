import { useState } from 'react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/services/firebase';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, Chrome, Loader2, Play, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

type AuthScreenProps = {
  onDemoMode: () => void;
};

export function AuthScreen({ onDemoMode }: AuthScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome! Signed in successfully');
    } catch (error: any) {
      console.error('Sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled');
      } else if (error.code === 'auth/configuration-not-found') {
        toast.error('Firebase is not configured. Please add your Firebase credentials to environment variables.');
      } else {
        toast.error('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success('Welcome! Signed in successfully');
    } catch (error: any) {
      console.error('Sign-in error:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        toast.error('Invalid email or password');
      } else {
        toast.error('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await signUpWithEmail(email, password);
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Sign-up error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/20 to-accent/10 relative">
      {/* <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-4 right-4 rounded-full z-10"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button> */}
      
      <Card className="w-full max-w-md shadow-2xl border-2 bg-card/95 backdrop-blur-sm mx-4">
        <CardHeader className="text-center space-y-4 pb-6 md:pb-8">
          <div className="relative inline-block mx-auto">
            <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-primary animate-pulse" />
            <div className="absolute inset-0 blur-2xl bg-primary/30 rounded-full animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold mb-2 gradient-text">
              AI Chat Assistant
            </CardTitle>
            <CardDescription className="text-sm md:text-base px-2">
              Experience intelligent conversations powered by cutting-edge AI technology
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4 mt-4">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Chrome className="mr-2 h-5 w-5" />
                Sign in with Google
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-4">
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Chrome className="mr-2 h-5 w-5" />
                Sign up with Google
              </Button>
            </TabsContent>
          </Tabs>

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div> */}

          {/* <Button
            onClick={onDemoMode}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Play className="mr-2 h-5 w-5" />
            Try Demo Mode
          </Button> */}

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold">Features:</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Real-time chat synchronization</li>
              <li>• Multiple conversation management</li>
              <li>• Intelligent AI responses</li>
              <li>• Secure Firebase authentication</li>
            </ul>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
