# 간호학 연구·교육 아카이브 (MVP)

교수 1인과 대학원생이 함께 쓰는 **연구·수업 자료 아카이브 + 연구 토론** 웹사이트입니다.

- 현재 단계: **시험용(mock) 데이터로 동작**합니다. 로그인도 임시 계정(교수/대학원생)으로 체험합니다.
- 작성한 댓글·연구·자료는 **사용 중인 브라우저에만 저장**됩니다(localStorage). 다른 사람과 공유되지 않습니다.
- 다음 단계에서 Firebase(무료 Spark 요금제)의 Firestore와 Google 로그인을 연결하면 실제로 공유됩니다.

> ⚠️ **연구윤리 고지:** 환자 개인정보, IRB 비공개 자료, 미발표 원자료는 업로드·게시하지 마세요.
> 이 사이트는 파일을 직접 올리지 않고, OneDrive·Google Drive·논문 주소 같은 **링크만** 저장합니다.

---

## 주요 화면

| 주소 | 내용 |
|---|---|
| `/` | 사이트 소개, 최근 연구 3건, 최근 수업 자료 3건 |
| `/research` | 연구 카드 목록, 태그 필터, 제목 검색 |
| `/research/:id` | 연구 상세(요약·태그·진행 상태·자료 링크) + 토론(댓글) |
| `/teaching` | 과목별 수업 자료 링크 |
| `/login` | Google 로그인 버튼(현재는 임시 계정 선택) |

**권한**
- 교수(admin): 연구·수업 자료 추가/수정/삭제, 댓글 작성, 모든 댓글 삭제(운영용)
- 대학원생(member): 열람, 댓글 작성, 본인 댓글 삭제
- 비로그인: 열람만 가능(댓글 입력창에 "로그인 후 작성 가능" 표시)

> 시험 데이터를 처음 상태로 되돌리려면: 브라우저 개발자 도구(F12) → Application → Local Storage에서 `nursing-archive:` 로 시작하는 항목을 지우고 새로고침합니다.

---

## 1. 내 컴퓨터에서 실행해 보기

### 1-1. 준비물 (처음 한 번만)
1. **Node.js** 설치: https://nodejs.org 에서 **LTS** 버전을 내려받아 설치합니다(20 이상).
2. 설치 확인: 터미널(Windows는 "명령 프롬프트" 또는 "PowerShell", Mac은 "터미널")을 열고 입력합니다.
   ```bash
   node -v
   ```
   `v20.x.x` 처럼 숫자가 나오면 성공입니다.

### 1-2. 실행
1. 이 프로젝트 폴더로 이동합니다. (예: 바탕화면에 내려받았다면)
   ```bash
   cd Desktop/261028_nursing
   ```
2. 필요한 부품을 설치합니다(처음 한 번, 1~2분 소요).
   ```bash
   npm install
   ```
3. 개발용 서버를 켭니다.
   ```bash
   npm run dev
   ```
4. 화면에 나온 주소(보통 `http://localhost:5173`)를 브라우저에서 엽니다.
5. 끌 때는 터미널에서 `Ctrl + C` 를 누릅니다.

### 1-3. 배포용 결과물 만들기(선택)
```bash
npm run build
```
오류 없이 끝나면 `dist` 폴더가 생깁니다. Netlify가 배포 때 이 과정을 자동으로 하므로 직접 할 필요는 없습니다.

---

## 2. GitHub에 올리기

> 이 저장소는 이미 GitHub(`sejun2-blip/261028_nursing`)에 있습니다. 아래는 코드를 고친 뒤 다시 올리는 방법입니다.

### 방법 A. GitHub Desktop 사용 (추천, 명령어 없이)
1. https://desktop.github.com 에서 GitHub Desktop을 설치하고 GitHub 계정으로 로그인합니다.
2. `File → Clone repository` 에서 `261028_nursing` 을 선택해 내 컴퓨터로 내려받습니다.
3. 파일을 수정하면 왼쪽에 바뀐 파일 목록이 보입니다.
4. 왼쪽 아래 **Summary** 칸에 변경 내용을 짧게 적고 **Commit to main** 을 누릅니다.
5. 위쪽 **Push origin** 을 누르면 GitHub에 올라갑니다.

### 방법 B. 명령어 사용
```bash
git add .
```
```bash
git commit -m "변경 내용 요약"
```
```bash
git push
```

> `.env` 파일(비밀 설정값), `node_modules`, `dist` 폴더는 `.gitignore` 에 의해 **자동으로 제외**되어 GitHub에 올라가지 않습니다.

---

## 3. Netlify로 배포하기 (무료)

1. https://app.netlify.com 에 접속해 **GitHub 계정으로 가입/로그인**합니다.
2. **Add new site → Import an existing project** 를 누릅니다.
3. **GitHub** 를 선택하고, 권한 허용 후 `261028_nursing` 저장소를 고릅니다.
4. 배포할 **Branch** 를 선택합니다(보통 `main`).
5. 빌드 설정은 저장소의 `netlify.toml` 이 자동으로 채웁니다. 아래와 같은지만 확인합니다.
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Deploy** 를 누르고 1~2분 기다리면 `https://임의이름.netlify.app` 주소가 생깁니다.
7. (선택) **Site configuration → Change site name** 에서 주소 앞부분을 바꿀 수 있습니다.

이후에는 GitHub에 올릴 때마다(Push) Netlify가 **자동으로 다시 배포**합니다.

> `netlify.toml` 의 리다이렉트 설정 덕분에 `/research/r1` 같은 주소에서 새로고침해도 "Page not found" 가 나지 않습니다.

### 다음 단계(Firebase) 때 할 일 미리보기
- Netlify → **Site configuration → Environment variables** 에 `.env.example` 의 6개 항목(`VITE_FIREBASE_...`) 값을 입력합니다.
- 비밀값은 코드나 GitHub에 직접 쓰지 않습니다.

---

## 폴더 구조 (참고용)

```
src/
  components/   화면 부품(상단 메뉴, 윤리 배너, 카드, 댓글 영역 등)
  pages/        주소별 화면(홈, 연구 목록·상세·작성, 수업 자료, 로그인)
  context/      로그인 상태 공유(AuthContext)
  services/
    types.ts        데이터 형식 정의
    authService.ts  로그인 기능 (현재 mock → 다음 단계에 Firebase Auth로 교체)
    dataService.ts  데이터 읽기/쓰기 (현재 mock → 다음 단계에 Firestore로 교체)
    mockData.ts     시험용 예시 데이터 (Firebase 연동 후 삭제)
  lib/
    firebase.ts     Firebase 초기화 자리(현재 비어 있음)
    date.ts         날짜 변환·표시를 한 곳에서 처리
    url.ts          링크 주소 안전성 검사(http/https만 허용)
```

화면(pages, components)은 `services` 의 기능만 호출하므로, 다음 단계에서는 `services` 와 `lib/firebase.ts` 만 바꾸면 됩니다.
