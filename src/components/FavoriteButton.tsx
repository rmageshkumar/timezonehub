"use client";

import { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function FavoriteButton({ cityId }: { cityId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);
  const [favId, setFavId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const prevCityId = useRef(cityId);

  // Reset state and re-check whenever cityId changes or session becomes available
  useEffect(() => {
    if (prevCityId.current !== cityId) {
      // Reset immediately when navigating to a different city
      setFavorited(false);
      setFavId(null);
      prevCityId.current = cityId;
    }

    if (status !== "authenticated" || !session) {
      setChecking(false);
      return;
    }

    setChecking(true);
    fetch(`/api/user/favorites?cityId=${cityId}`)
      .then((r) => r.json())
      .then((data) => {
        setFavorited(data.favorited);
        setFavId(data.id || null);
      })
      .catch(() => {
        setFavorited(false);
        setFavId(null);
      })
      .finally(() => setChecking(false));
  }, [cityId, session, status]);

  const toggle = async () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    try {
      if (favorited && favId) {
        // Remove favorite
        await fetch(`/api/user/favorites?id=${favId}`, { method: "DELETE" });
        setFavorited(false);
        setFavId(null);
        toast.success("Removed from favorites");
      } else {
        // Add favorite
        const res = await fetch("/api/user/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cityId }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setFavorited(true);
          setFavId(data.id || null);
          toast.success("Added to favorites!");
        } else {
          toast.error(data.error || "Failed to add favorite");
        }
      }
    } catch (err) {
      toast.error("Failed — try again");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading || checking}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        checking ? "opacity-50" : ""
      } ${
        favorited
          ? "bg-red-50 dark:bg-red-950 text-red-500"
          : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500"
      }`}
    >
      <Heart className={`w-3.5 h-3.5 ${favorited ? "fill-current" : ""}`} />
      {checking ? "..." : favorited ? "Favorited" : "Add to Favorites"}
    </button>
  );
}
