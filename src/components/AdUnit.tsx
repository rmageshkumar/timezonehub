"use client";

import { useEffect, useState } from "react";

interface AdUnitProps {
  placement: string;
  className?: string;
}

interface Ad {
  id: string;
  name: string;
  type: string;
  content: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
}

export function AdUnit({ placement, className = "" }: AdUnitProps) {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch(`/api/ads?placement=${placement}`);
        const data = await res.json();
        if (data.ads?.length > 0) {
          setAd(data.ads[0]);
          // Record impression
          fetch("/api/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "ad_impression", data: { adId: data.ads[0].id, placement } }),
          });
        }
      } catch {
        // silent
      }
    };
    fetchAd();
  }, [placement]);

  const handleClick = async () => {
    if (!ad) return;
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "ad_click", data: { adId: ad.id, placement } }),
      });
    } catch {}
  };

  if (!ad) return null;

  const Wrapper = ad.linkUrl ? "a" : "div";
  const wrapperProps = ad.linkUrl
    ? { href: ad.linkUrl, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...(wrapperProps as any)}
      onClick={handleClick}
      className={`ad-unit ad-${placement} ${className}`}
    >
      {ad.type === "html" || ad.type === "javascript" || ad.type === "google_adsense" || ad.type === "affiliate" ? (
        <div dangerouslySetInnerHTML={{ __html: ad.content || "" }} />
      ) : ad.type === "image" || ad.type === "custom_image" ? (
        <img
          src={ad.imageUrl || ""}
          alt={ad.name}
          className="w-full h-auto rounded-lg"
          loading="lazy"
        />
      ) : null}
    </Wrapper>
  );
}
