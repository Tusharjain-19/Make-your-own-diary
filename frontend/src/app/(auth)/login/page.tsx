"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, ArrowRight, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push(redirectPath);
    } else {
      setError(result.error || "Unable to sign in");
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    const result = await loginWithGoogle();
    setIsSubmitting(false);

    if (result.success) {
      router.push(redirectPath);
    } else {
      setError(result.error || "Google sign in failed");
    }
  };

  const quickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setIsSubmitting(true);
    const result = await login(demoEmail);
    setIsSubmitting(false);
    if (result.success) {
      router.push(redirectPath);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight text-accent">
              Storybound
            </span>
          </Link>
          <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-text">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Sign in to continue crafting your personal book
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-border bg-surface shadow-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-base font-medium">Sign in to your account</CardTitle>
            <CardDescription className="text-xs">
              Enter your email or select a demo profile to test RLS isolation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-[8px] border border-danger/20 bg-danger/5 p-3 text-xs text-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text">Email address</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-text">Password</label>
                  <span className="text-[11px] text-text-muted">Optional for prototype</span>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in with Email"}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-text-muted">
                <span className="bg-surface px-2">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Quick Multi-User Test Selector */}
            <div className="rounded-[8px] border border-border bg-accent-soft/40 p-3 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-text">
                <UserCheck className="h-3.5 w-3.5 text-accent" />
                Quick Multi-User RLS Testing:
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs justify-start"
                  onClick={() => quickLogin("tushar@storybound.app")}
                >
                  <Sparkles className="mr-1 h-3 w-3 text-amber-600" />
                  Tushar (Jaipur)
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs justify-start"
                  onClick={() => quickLogin("sarah@storybound.app")}
                >
                  <Sparkles className="mr-1 h-3 w-3 text-emerald-600" />
                  Sarah (Goa)
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border pt-4 text-xs text-text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="ml-1 font-medium text-accent hover:underline">
              Sign up
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <LoginForm />
    </React.Suspense>
  );
}
