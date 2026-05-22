"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email) next.email = "Email is required";
    else if (!EMAIL_RE.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "Min 6 characters";

    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      // Stub auth: accept any valid-looking credentials for now.
      await new Promise((r) => setTimeout(r, 600));
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "wanderlust-user",
          JSON.stringify({ email, loggedInAt: Date.now() }),
        );
      }
      router.push("/");
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Login failed" });
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <Sparkles className="h-6 w-6 text-amber-700" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue planning your next adventure.
          </p>
        </div>

        {errors.form && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                aria-invalid={!!errors.email}
                disabled={submitting}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-60"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                Password
              </label>
              <Link href="#" className="text-xs font-medium text-amber-700 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                }}
                aria-invalid={!!errors.password}
                disabled={submitting}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-10 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to Wanderlust AI?{" "}
          <Link href="/discover" className="font-medium text-amber-700 hover:underline">
            Start exploring
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
