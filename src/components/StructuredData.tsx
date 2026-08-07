import type { BlogPost, BlogCategory } from "@prisma/client";

// ==================== BASE SCHEMAS ====================

export function WebSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://clockhive.cc/#website",
        url: "https://clockhive.cc/",
        name: "ClockHive",
        description:
          "Beautiful timezone management platform for remote teams, developers, travelers, and global businesses.",
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://clockhive.cc/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebApplication",
        "@id": "https://clockhive.cc/#app",
        name: "ClockHive",
        url: "https://clockhive.cc/",
        description:
          "All-in-one timezone management: compare world times, plan meetings across timezones, convert times, AI scheduler, scrum poker, and more.",
        applicationCategory: "BusinessApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "World time comparison",
          "Meeting planner",
          "Time converter",
          "AI-powered scheduler",
          "Scrum poker / Planning poker",
          "Country & city time lookup",
          "DST detection & alerts",
          "Favorite cities dashboard",
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://clockhive.cc/#org",
        name: "ClockHive",
        url: "https://clockhive.cc/",
        logo: "https://clockhive.cc/favicon.svg",
        description:
          "ClockHive is a beautiful timezone management platform for remote teams and global businesses. Compare times, plan meetings, track world clocks, and stay in sync.",
        foundingDate: "2024",
        sameAs: [],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ==================== FAQ SCHEMA ====================

interface FAQ {
  q: string;
  a: string;
}

export function FAQSchema({ faqs }: { faqs: FAQ[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ==================== BLOG POSTING SCHEMA ====================

interface BlogPostData {
  post: BlogPost & { category?: BlogCategory | null };
  url: string;
}

export function BlogPostingSchema({ post, url }: BlogPostData) {
  const tags = post.tags ? (JSON.parse(post.tags) as string[]) : [];

  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}/#article`,
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "",
    url,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: {
      "@type": "Person",
      name: "ClockHive",
      url: "https://clockhive.cc/",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://clockhive.cc/#org",
      name: "ClockHive",
      logo: {
        "@type": "ImageObject",
        url: "https://clockhive.cc/favicon.svg",
      },
    },
    image: post.featuredImage || "https://clockhive.cc/favicon.svg",
    keywords: tags.join(", "),
    wordCount: post.content?.split(/\s+/).length,
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ==================== BREADCRUMB SCHEMA ====================

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ==================== HOW-TO SCHEMA (for Meeting Planner, Converter, etc.) ====================

interface HowToStep {
  name: string;
  text: string;
}

export function HowToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: HowToStep[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
