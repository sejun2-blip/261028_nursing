// 외부 링크 안전성 검사: http/https 주소만 허용 (javascript: 등 위험한 주소 차단)

export function isSafeUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
