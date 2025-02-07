export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      keyframes: {
        scrollRightToLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        scrollLeftToRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        scroll: 'scrollRightToLeft 15s linear infinite',
        scrollReverse: 'scrollLeftToRight 15s linear infinite',
      },
      fontFamily: {
        beyonder: ['Beyonders', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
