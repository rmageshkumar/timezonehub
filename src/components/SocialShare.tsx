"use client";

import { useState } from "react";
import {
  Share2,
  Check,
  Link2,
} from "lucide-react";

function copyToClipboard(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  });
}

// Inline SVG icons to avoid adding another dependency
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.21 12.83c-.18 0-.36-.05-.51-.14-.66.44-1.55.72-2.53.85l.54 2.54 2.21-.47c.02-.76.64-1.37 1.41-1.37.78 0 1.41.63 1.41 1.41s-.63 1.41-1.41 1.41-1.41-.63-1.41-1.41l-2.46.52c-.15.03-.29-.01-.39-.13-.1-.12-.13-.28-.09-.41l.67-3.16c-1.05-.11-1.99-.4-2.68-.86-.15.09-.33.14-.52.14-.51 0-.92-.41-.92-.92 0-.37.22-.69.54-.84-.02-.16-.03-.32-.03-.48 0-2.35 2.73-4.26 6.1-4.26s6.1 1.91 6.1 4.26c0 .16-.01.32-.03.48.32.15.54.47.54.84 0 .51-.41.92-.92.92zm-4.76 2.55c.64.64 1.69.69 2.34.05.13-.13.13-.33 0-.46-.13-.13-.33-.13-.46 0-.38.37-1.01.34-1.36-.01-.34-.37-.26-.93.16-1.22.47-.32 1.14-.17 1.44.35.08.13.25.19.4.14.14-.05.23-.2.19-.35-.15-.6-.77-.92-1.37-.82-.49.08-.9.4-1.07.86-.17.48-.02 1.02.37 1.42l.36-.06zm2.17-.99c-.26 0-.47-.21-.47-.47s.21-.47.47-.47.47.21.47.47-.21.47-.47.47zm-5.48-1.88c-.26 0-.47.21-.47.47s.21.47.47.47.47-.21.47-.47-.21-.47-.47-.47z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface ShareButtonProps {
  platform: string;
  url: string;
  title: string;
}

function ShareButton({ platform, url, title }: ShareButtonProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    twitter: XIcon,
    linkedin: LinkedInIcon,
    facebook: FacebookIcon,
    reddit: RedditIcon,
    whatsapp: WhatsAppIcon,
  };

  const labels: Record<string, string> = {
    twitter: "Share on X",
    linkedin: "Share on LinkedIn",
    facebook: "Share on Facebook",
    reddit: "Share on Reddit",
    whatsapp: "Share on WhatsApp",
  };

  const Icon = icons[platform];
  if (!Icon) return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        window.open(
          shareLinks[platform],
          "share",
          "width=600,height=400"
        );
      }}
      aria-label={labels[platform]}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-500 transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
        <Share2 className="w-3.5 h-3.5" />
        Share:
      </span>
      <ShareButton platform="twitter" url={url} title={title} />
      <ShareButton platform="linkedin" url={url} title={title} />
      <ShareButton platform="facebook" url={url} title={title} />
      <ShareButton platform="reddit" url={url} title={title} />
      <ShareButton platform="whatsapp" url={url} title={title} />
      <button
        onClick={() => copyToClipboard(url, setCopied)}
        aria-label="Copy link"
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-500 transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
