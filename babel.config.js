module.exports = function (api) {
  api.cache(true);

  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
          },
        },
      ],
      "expo-router/babel",
      // tem que ser o ÚLTIMO
      "react-native-reanimated/plugin",
    ],
  };
};
