import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
      border: "hsl(var(--border))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      ring: "hsl(var(--ring))",
      card: "hsl(var(--card))",
      muted: "hsl(var(--muted))"
      }
    },
  },
  plugins: [],
}

export default config
