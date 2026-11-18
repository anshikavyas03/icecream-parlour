"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getSupabaseClient } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const { error } = await getSupabaseClient().auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50 px-6 py-12 text-rose-950">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-rose-100">
        <Link className="text-sm font-semibold text-pink-600" href="/">
          ← Back to Scoop & Smile
        </Link>
        <h1 className="mt-6 text-3xl font-extrabold">Welcome back 🍨</h1>
        <p className="mt-2 text-rose-800">Sign in to see your saved favourite.</p>
        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">
            Email
            <input className="mt-2 w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:border-pink-500" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input className="mt-2 w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:border-pink-500" type="password" autoComplete="current-password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {message && <p className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-900">{message}</p>}
          <button className="w-full rounded-full bg-pink-500 px-5 py-3 font-bold text-white transition hover:bg-pink-600 disabled:opacity-60" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-rose-800">New here? <Link className="font-bold text-pink-600" href="/register">Create an account</Link></p>
      </section>
    </main>
  );
}
