// 날짜를 한국식(2026. 10. 28.)으로 표시
const formatter = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

export default function DateText({ value }: { value: string }) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return <time dateTime={value}>{formatter.format(date)}</time>;
}
