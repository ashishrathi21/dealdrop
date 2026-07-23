"use client";

import { createClient } from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AuthModal({ isOpen, onClose }) {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { origin } = window.location;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border border-zinc-200/80 rounded-xl shadow-2xl bg-white/95 backdrop-blur-xl">
      

        <div className="p-8 relative flex flex-col items-center">
          {/* Logo container */}
          <div className="mt-4 mb-5 flex justify-center">
            <img src="/logo-2.png" alt="DealDrop Logo" className="h-11 w-auto" />
          </div>

          <DialogHeader className="text-center w-full">
            <DialogTitle className="text-xl font-extrabold text-zinc-950 tracking-tight text-center">
              Welcome back
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs mt-2 max-w-xs mx-auto leading-relaxed text-center">
              Sign in to manage your active alerts, price history charts, and automatic email price drop alerts!
            </DialogDescription>
          </DialogHeader>

          {/* Separation indicator line */}
          <div className="w-full flex items-center justify-center gap-3 my-6">
            <div className="h-px bg-zinc-150 flex-1" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Secured Login
            </span>
            <div className="h-px bg-zinc-150 flex-1" />
          </div>

          {/* Login Button with Google */}
          <div className="w-full">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full gap-3 h-12 bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-200 hover:border-violet-500/30 hover:shadow-md transition-all duration-300 !rounded-lg text-sm font-semibold cursor-pointer"
              size="lg"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Footer note */}
          <p className="text-[10px] text-zinc-400 mt-6 leading-relaxed text-center max-w-[240px]">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}