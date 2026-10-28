/** Tailwind 설정: 학술적인 톤을 위해 네이비(brand)와 청록(accent) 두 가지 포인트 색만 사용 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // 웹폰트를 따로 내려받지 않고, 설치된 한글 글꼴을 순서대로 사용 (속도·안정성 우선)
        sans: ['Pretendard', '"Apple SD Gothic Neo"', '"Noto Sans KR"', '"Malgun Gothic"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: { 50: '#eef2f8', 100: '#d5deec', 600: '#2b4a78', 700: '#1f3a63', 800: '#172c4b', 900: '#101f36' },
        accent: { 50: '#ecf8f7', 100: '#cdeeea', 600: '#0f7c75', 700: '#0b655f' },
      },
    },
  },
  plugins: [],
};
