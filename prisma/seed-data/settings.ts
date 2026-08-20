import { PrismaClient } from "@prisma/client";

export async function seedSettings(prisma: PrismaClient) {
  const defaultSettings = [
    { key: "app_name", value: '"ClockHive"', group: "general" },
    { key: "app_description", value: '"The most beautiful timezone management platform"', group: "general" },
    { key: "timezone", value: '"UTC"', group: "general" },
    { key: "language", value: '"en"', group: "general" },
    { key: "currency", value: '"USD"', group: "general" },
    { key: "date_format", value: '"MM/DD/YYYY"', group: "general" },
    { key: "maintenance_mode", value: "false", group: "general" },
    { key: "terms_url", value: '"/terms"', group: "general" },
    { key: "privacy_url", value: '"/privacy"', group: "general" },
    { key: "cookie_url", value: '"/cookies"', group: "general" },
    { key: "google_analytics_id", value: '""', group: "integrations" },
    { key: "adsense_publisher_id", value: '""', group: "ads" },
    { key: "mailchimp_api_key", value: '""', group: "email" },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({ where: { key: setting.key }, update: {}, create: setting });
  }

  const sections = [
    { section: "hero_banner", enabled: true, order: 1 },
    { section: "search", enabled: true, order: 2 },
    { section: "timeline", enabled: true, order: 3 },
    { section: "meeting_planner", enabled: true, order: 4 },
    { section: "featured_countries", enabled: true, order: 5 },
    { section: "news", enabled: false, order: 6 },
    { section: "ads", enabled: true, order: 7 },
  ];

  for (const section of sections) {
    await prisma.homepageSection.upsert({ where: { section: section.section }, update: {}, create: section });
  }

  await prisma.advertisement.create({
    data: {
      name: "Sample Header Banner",
      type: "html",
      placement: "header_banner",
      content: '<div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:15px;text-align:center;border-radius:8px;font-weight:bold;">🌟 Your Ad Here - 728x90 Leaderboard</div>',
      priority: 1, weight: 1, status: "active",
    },
  });

  await prisma.themeConfig.upsert({
    where: { id: "default" },
    update: {},
    create: { primaryColor: "#3b82f6", accentColor: "#d946ef", fontFamily: "Inter", borderRadius: "0.5rem" },
  });

  console.log(`✅ Settings, sections, ads & theme seeded`);
}
