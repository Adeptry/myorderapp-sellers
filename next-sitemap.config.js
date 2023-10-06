/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: process.env.NEXT_PUBLIC_ROBOTS_ALLOW,
        disallow: process.env.NEXT_PUBLIC_ROBOTS_DISALLOW,
      },
    ],
  },
  alternateRefs: [
    {
      href: `${process.env.NEXT_PUBLIC_SITE_URL}/es`,
      hreflang: "es",
    },
    {
      href: `${process.env.NEXT_PUBLIC_SITE_URL}/fr`,
      hreflang: "fr",
    },
    {
      href: `${process.env.NEXT_PUBLIC_SITE_URL}/ja`,
      hreflang: "ja",
    },
  ],
};
