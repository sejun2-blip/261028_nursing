/** Tailwind 설정: 학술 톤의 차분한 색상(남색 계열)을 기본 강조색으로 사용 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard"', '"Noto Sans KR"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef3f9',
          100: '#d6e2f0',
          600: '#2c4f7c',
          700: '#233f63',
          800: '#1b304b',
        },
      },
    },
  },
  plugins: [],
};
