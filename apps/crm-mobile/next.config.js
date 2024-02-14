module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui", "utils"],
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    SITE_URL: process.env.SITE_URL,
  },
  images: {
    domains: ["sy8yuqagyg7iftc8.public.blob.vercel-storage.com"],
  },
};
