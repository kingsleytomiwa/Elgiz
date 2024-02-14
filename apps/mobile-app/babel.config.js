module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "jotai/babel/preset"],
    plugins: [
      "nativewind/babel",
      "@babel/plugin-transform-export-namespace-from",
      "react-native-reanimated/plugin",
      "jotai/babel/plugin-react-refresh",
      "jotai/babel/plugin-debug-label",
    ],
  };
};
