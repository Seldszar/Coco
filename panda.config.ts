import { defineConfig, defineGlobalStyles } from "@pandacss/dev";

const globalCss = defineGlobalStyles({
  html: {
    fontSize: 14,
  },

  body: {
    backgroundColor: { base: "neutral.100", _dark: "neutral.900" },
    color: { base: "black", _dark: "white" },
    fontFamily: "sans",
    fontSize: "unset",
  },
});

export default defineConfig({
  globalCss,

  preflight: true,
  minify: true,
  hash: true,

  outdir: "src/browser/styled-system",
  outExtension: "js",

  jsxFramework: "react",
  jsxStyleProps: "all",

  include: ["src/browser/**/*.{js,jsx,ts,tsx}"],

  conditions: {
    extend: {
      popout: ".popout &, [data-popout] &",
    },
  },

  theme: {
    extend: {
      tokens: {
        fonts: {
          sans: {
            value:
              "'Plus Jakarta Sans', system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
          },
        },
      },
    },
  },
});
