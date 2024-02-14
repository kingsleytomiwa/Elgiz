module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui", "utils"],
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    SITE_URL: process.env.SITE_URL,
  }
};
