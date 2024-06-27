const fs = require("node:fs");
const path = require("node:path");

const { ProvidePlugin } = require("webpack");
const { merge } = require("webpack-merge");

const CopyWebpackPlugin = require("copy-webpack-plugin");

const localeReplacements = [
  {
    source: "nb_NO",
    target: "no",
  },
];

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  const commonConfig = {
    devtool: isDevelopment ? "inline-cheap-source-map" : false,
    output: {
      path: path.resolve("dist"),
      publicPath: "",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
      alias: {
        "~": path.resolve("src"),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "swc-loader",
            options: {
              env: {
                targets: "last 2 years",
              },
              jsc: {
                transform: {
                  react: {
                    runtime: "automatic",
                  },
                },
              },
            },
          },
        },
      ],
    },
    plugins: [
      new ProvidePlugin({
        browser: "webextension-polyfill",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "**/*",
            context: "public",
          },
          {
            from: "**/*",
            context: `overrides/${env.platform}`,
          },
          {
            from: "**/*",
            context: "locales",
            filter: (resourcePath) => {
              try {
                const data = JSON.parse(fs.readFileSync(resourcePath, "utf-8"));

                if (data.extensionName == null) {
                  return false;
                }
              } catch {} // eslint-disable-line no-empty

              return true;
            },
            to: (pathData) => {
              const relativePath = path
                .relative(pathData.context, pathData.absoluteFilename)
                .replace(/\\/g, "/");

              return `_locales/${localeReplacements.reduce(
                (result, { source, target }) => result.replace(source, target),
                relativePath,
              )}`;
            },
          },
        ],
      }),
    ],
    cache: {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    },
  };

  return [
    merge(commonConfig, {
      target: "webworker",
      entry: {
        background: "./src/background/index.ts",
      },
    }),
  ];
};
