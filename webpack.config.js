const fs = require("node:fs");
const path = require("node:path");

const { EnvironmentPlugin, ProvidePlugin } = require("webpack");
const { merge } = require("webpack-merge");

const { EntryWrapperPlugin } = require("@seldszar/yael");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
          test: /\.gql$/,
          exclude: /node_modules/,
          loader: path.resolve(".webpack/loaders/graphql"),
        },
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
      new EnvironmentPlugin({
        TWITCH_CLIENT_ID: "kimne78kx3ncx6brgo4mv6wki5h1ko",
      }),
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
            filter(resourcePath) {
              try {
                const data = JSON.parse(fs.readFileSync(resourcePath, "utf-8"));

                if (data.extensionName == null) {
                  return false;
                }
              } catch {} // eslint-disable-line no-empty

              return true;
            },
            to(pathData) {
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
    merge(commonConfig, {
      target: "web",
      entry: {
        popup: "./src/browser/popup/main.tsx",
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
          },
        ],
      },
      optimization: {
        splitChunks: {
          name: "commons",
          chunks: "all",
        },
      },
      plugins: [
        new MiniCssExtractPlugin(),
        new EntryWrapperPlugin({
          template: "./src/browser/entry-template.tsx",
          test: /\.tsx$/,
        }),
        new HtmlWebpackPlugin({
          template: "./src/browser/entry-template.html",
          filename: "popup.html",
          chunks: ["popup"],
        }),
      ],
      resolve: {
        alias: {
          react: "preact/compat",
          "react-dom": "preact/compat",
          "react/jsx-runtime": "preact/jsx-runtime",
        },
      },
    }),
  ];
};
