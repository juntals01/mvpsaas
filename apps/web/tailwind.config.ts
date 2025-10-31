import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: { lg: '10px', md: '8px', sm: '6px' },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
