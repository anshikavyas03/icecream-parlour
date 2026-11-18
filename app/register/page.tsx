"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getSupabaseClient } from "../../lib/supabase";

export default function RegisterPage() {
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
      const { data, error } = await getSupabaseClient().auth.signUp({ email, password });
      if (error) throw error;
      setMessage(
        data.session
          ? "Your account is ready. Taking you to the flavours…"
          : "Check your email to confirm your account, then come back and sign in.",
      );
      if (data.session) window.setTimeout(() => router.push("/"), 700);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create your account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50 px-6 py-12 text-rose-950">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-rose-100">
        <Link className="text-sm font-semibold text-pink-600" href="/">← Back to Scoop & Smile</Link>
        <h1 className="mt-6 text-3xl font-extrabold">Make it official 🍦</h1>
        <p className="mt-2 text-rose-800">Create an account to save your perfect scoop.</p>
        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">Email<input className="mt-2 w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:border-pink-500" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label className="block text-sm font-semibold">Password<input className="mt-2 w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:border-pink-500" type="password" autoComplete="new-password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required /><span className="mt-1 block text-xs font-normal text-rose-700">Use at least 6 characters.</span></label>
          {message && <p className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-900">{message}</p>}
          <button className="w-full rounded-full bg-pink-500 px-5 py-3 font-bold text-white transition hover:bg-pink-600 disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Creating account…" : "Create account"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-rose-800">Already have an account? <Link className="font-bold text-pink-600" href="/login">Sign in</Link></p>
      </section>
    </main>
  );
}
