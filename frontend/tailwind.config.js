module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#0a0a0a",
        "neon-blue": "#00f0ff",
        "jarvis-glow": "#00f0ff",
        "jarvis-plasma": "#0099ff",
        "hologram-cyan": "rgba(0, 240, 255, 0.2)",
        "glass-bg": "rgba(10, 10, 10, 0.6)",
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px #00f0ff' },
          '50%': { opacity: 0.6, boxShadow: '0 0 40px #00f0ff' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
