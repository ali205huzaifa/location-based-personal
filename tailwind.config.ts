import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/App.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        product: ['"Product Sans"', ...defaultTheme.fontFamily.sans],
        urbanist: ['"Urbanist"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
