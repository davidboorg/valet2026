import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
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
    ],
  },
};

export default nextConfig;
