import { useState } from 'react';
import { signInWithGoogle } from '@/services/firebase';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Chrome, Loader2, Play, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

type AuthScreenProps = {
  onDemoMode: () => void;
};

export function AuthScreen({ onDemoMode }: AuthScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/20 to-accent/10 relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-4 right-4 rounded-full"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
      
      <Card className="w-full max-w-md shadow-2xl border-2 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="relative inline-block mx-auto">
            <Sparkles className="w-20 h-20 text-primary animate-pulse" />
            <div className="absolute inset-0 blur-2xl bg-primary/30 rounded-full animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold mb-2 gradient-text">
              AI Chat Assistant
            </CardTitle>
            <CardDescription className="text-base">
              Experience intelligent conversations powered by cutting-edge AI technology
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              size="lg"
              className="w-full text-base h-12 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Chrome className="mr-2 h-5 w-5" />
                  Sign in with Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              onClick={onDemoMode}
              variant="outline"
              size="lg"
              className="w-full text-base h-12"
            >
              <Play className="mr-2 h-5 w-5" />
              Try Demo Mode
            </Button>
          </div>

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
