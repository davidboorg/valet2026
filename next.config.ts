import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/valet2026',
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      // Supabase Storage (vår primära bildkälla)
      {
        protocol: 'https',
        hostname: 'htleorhudrnmbklialsp.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'data.kb.se',
        pathname: '/iiif/**',
      },
      {
        protocol: 'https',
        hostname: 'affischerna.se',
      },
      // Wikimedia Commons (Wikipedia bildhostning)
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      // Sverigedemokraternas officiella sajt
      {
        protocol: 'https',
        hostname: 'www.sd.se',
      },
      {
        protocol: 'https',
        hostname: 'sd.se',
      },
      // Moderaternas officiella sajt
      {
        protocol: 'https',
        hostname: 'moderaterna.se',
      },
      // Mediaarkiv för fair-use citat
      {
        protocol: 'https',
        hostname: 'da.se',  // Dagens Arbete
      },
      {
        protocol: 'https',
        hostname: 'media.arto.se',  // Arbetet
      },
      {
        protocol: 'https',
        hostname: 'dagensopinion.se',
      },
      {
        protocol: 'https',
        hostname: 'static.bonniernews.se',
      },
      // DigitaltMuseum (Nordiska museet, läns- och stadsmuseer)
      {
        protocol: 'https',
        hostname: 'ems.dimu.org',
      },
      // Stockholmskällan (Stockholms stad)
      {
        protocol: 'https',
        hostname: 'stockholmskallan.stockholm.se',
      },
      // Flickr (Miljöpartiets officiella arkiv)
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
      },
      // Miljöpartiets officiella sajt
      {
        protocol: 'https',
        hostname: 'www.mp.se',
      },
      {
        protocol: 'https',
        hostname: 'mp.se',
      },
      // Liberalernas officiella sajt
      {
        protocol: 'https',
        hostname: 'www.liberalerna.se',
      },
      {
        protocol: 'https',
        hostname: 'liberalerna.se',
      },
      // Centerpartiet
      {
        protocol: 'https',
        hostname: 'www.centerpartiet.se',
      },
      {
        protocol: 'https',
        hostname: 'centerpartiet.se',
      },
      // Kristdemokraterna
      {
        protocol: 'https',
        hostname: 'www.kristdemokraterna.se',
      },
      {
        protocol: 'https',
        hostname: 'kristdemokraterna.se',
      },
      // Vänsterpartiet
      {
        protocol: 'https',
        hostname: 'www.vansterpartiet.se',
      },
      {
        protocol: 'https',
        hostname: 'vansterpartiet.se',
      },
      // Socialdemokraterna
      {
        protocol: 'https',
        hostname: 'www.socialdemokraterna.se',
      },
      {
        protocol: 'https',
        hostname: 'socialdemokraterna.se',
      },
    ],
  },
};

export default nextConfig;
