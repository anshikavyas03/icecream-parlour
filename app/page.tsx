"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseClient, hasSupabaseConfig } from "../lib/supabase";

const flavours = [
  { name: "Strawberry Bliss", emoji: "🍓", color: "bg-pink-100" },
  { name: "Chocolate Dream", emoji: "🍫", color: "bg-amber-100" },
  { name: "Vanilla Cloud", emoji: "🍦", color: "bg-yellow-100" },
];

type User = { id: string; email?: string } | null;

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [favorite, setFavorite] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(hasSupabaseConfig);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!hasSupabaseConfig) return;

    const supabase = getSupabaseClient();
    const loadUserAndFavourite = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      if (currentUser) {
        const { data, error } = await supabase
          .from("favorite_ice_creams")
          .select("flavour")
          .eq("user_id", currentUser.id)
          .maybeSingle();
        if (error) setNotice("We could not load your saved favourite yet.");
        else setFavorite(data?.flavour ?? null);
      }
      setIsLoading(false);
    };
    void loadUserAndFavourite();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setFavorite(null);
        setIsLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function chooseFavourite(flavour: string) {
    if (!user) {
      router.push("/login");
      return;
    }
    setNotice("");
    const { error } = await getSupabaseClient().from("favorite_ice_creams").upsert(
      { user_id: user.id, flavour },
      { onConflict: "user_id" },
    );
    if (error) {
      setNotice("We could not save that favourite. Check the Supabase SQL setup.");
      return;
    }
    setFavorite(flavour);
    setNotice(`${flavour} is saved as your favourite!`);
  }

  async function logout() {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) setNotice(error.message);
  }

  return (
    <main className="min-h-screen bg-rose-50 text-rose-950">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link className="text-2xl font-bold" href="/">🍦 Scoop & Smile</Link>
        <div className="flex items-center gap-4 text-sm font-semibold">
          {isLoading ? <span className="text-rose-700">Loading…</span> : user ? <><span className="hidden text-rose-800 sm:inline">{user.email}</span><button className="rounded-full border border-rose-300 px-4 py-2 hover:bg-white" onClick={() => void logout()}>Log out</button></> : <><Link href="/login">Login</Link><Link className="rounded-full bg-pink-500 px-4 py-2 text-white hover:bg-pink-600" href="/register">Register</Link></>}
        </div>
      </nav>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="font-bold tracking-[0.2em] text-pink-600">FRESHLY SCOOPED HAPPINESS</p>
        <h1 className="mt-5 text-5xl font-extrabold tracking-tight text-pink-600 sm:text-6xl">Life is sweeter with ice cream!</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-rose-900">Discover delicious flavours, then sign in to save the scoop you love most.</p>
        <a href="#flavours" className="mt-8 inline-block rounded-full bg-pink-500 px-8 py-3 font-bold text-white hover:bg-pink-600">Explore flavours</a>
      </section>
      <section id="flavours" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-center text-3xl font-bold">Our popular flavours</h2>
        <p className="mt-2 text-center text-rose-800">{user ? "Choose one and we’ll remember it for you." : "Sign in to save your favourite across visits."}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {flavours.map((flavour) => <article key={flavour.name} className={`${flavour.color} rounded-3xl p-10 text-center shadow-sm`}><div className="text-6xl">{flavour.emoji}</div><h3 className="mt-5 text-xl font-semibold">{flavour.name}</h3><button className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-semibold shadow-sm hover:bg-rose-50" onClick={() => void chooseFavourite(flavour.name)}>{favorite === flavour.name ? "♥ Your favourite" : "♡ Choose favourite"}</button></article>)}
        </div>
      </section>
      {user && <section className="mx-auto my-12 max-w-3xl rounded-3xl bg-white px-6 py-10 text-center shadow-sm ring-1 ring-rose-100"><h2 className="text-2xl font-bold">Your favourite scoop</h2><p className="mt-3 text-lg text-rose-900">{favorite ? `🍨 ${favorite}` : "You have not chosen a favourite yet."}</p></section>}
      {notice && <p className="mx-auto mb-8 max-w-xl rounded-xl bg-rose-100 px-4 py-3 text-center text-sm text-rose-900" role="status">{notice}</p>}
      {!hasSupabaseConfig && <p className="mx-auto mb-8 max-w-xl rounded-xl bg-amber-100 px-4 py-3 text-center text-sm text-amber-950">Add the public Supabase settings in <code>.env.local</code> to enable authentication.</p>}
      <footer className="mt-12 bg-pink-200 py-6 text-center text-sm">Made with love and lots of ice cream 🍨</footer>
    </main>
  );
}
