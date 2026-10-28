# 간호학 연구실 웹사이트 (1차 MVP)

간호학과 교수가 **연구·수업 자료를 게시**하고, **대학원생과 연구 결과를 토론**하는 웹사이트입니다.

- **1차(현재)**: Firebase 없이 동작하는 시험 버전입니다.
  - 연구·수업 자료: `src/data/` 폴더의 JSON 파일 내용을 보여 줍니다.
  - 토론 글·댓글·로그인: **각자의 브라우저에만** 저장됩니다(다른 사람에게는 보이지 않음).
  - 로그인: "구글로 로그인" 버튼 모양의 **시험용(Mock) 로그인**입니다. 이름만 입력하면 로그인한 것처럼 동작합니다.
- **2차(예정)**: Firebase(무료 Spark 요금제)를 연결해 실제 구글 로그인과 공유 토론을 사용합니다. → `docs/FIREBASE_PLAN.md`

---

## 목차

1. [내 컴퓨터에서 실행해 보기](#1-내-컴퓨터에서-실행해-보기)
2. [GitHub에 올리기](#2-github에-올리기)
3. [Netlify로 인터넷에 배포하기](#3-netlify로-인터넷에-배포하기)
4. [연구·수업 자료 내용 바꾸기](#4-연구수업-자료-내용-바꾸기)
5. [2차 준비: Firebase 설정](#5-2차-준비-firebase-설정)
6. [권한 안내 / 폴더 구조](#6-권한-안내)

---

## 1. 내 컴퓨터에서 실행해 보기

### 처음 한 번만 준비

1. **Node.js 20 LTS** 를 설치합니다.
   - https://nodejs.org 에 접속 → **"LTS"** 라고 적힌 버전(20 이상)을 내려받아 설치합니다.
   - 설치 확인: 터미널(Windows는 "명령 프롬프트" 또는 "PowerShell", Mac은 "터미널")을 열고 `node -v` 를 입력합니다. `v20.` 이상이 나오면 성공입니다.
2. 이 프로젝트 폴더로 이동합니다. (예: `cd 바탕화면/261028_nursing`)
3. 필요한 라이브러리를 설치합니다. (몇 분 걸릴 수 있습니다)

   ```bash
   npm install
   ```

### 실행

```bash
npm run dev
```

화면에 나오는 주소(보통 `http://localhost:5173`)를 인터넷 브라우저에 붙여 넣으면 사이트가 열립니다.
끝낼 때는 터미널에서 `Ctrl + C` 를 누릅니다.

### 기타 명령

| 명령 | 하는 일 |
| --- | --- |
| `npm run build` | 배포용 파일을 `dist` 폴더에 만듭니다(오류 검사 포함). |
| `npm run preview` | 만들어진 배포용 파일을 미리 봅니다. |
| `npm run lint` | 코드 문법·습관 점검을 합니다. |

### 시험해 볼 것

1. 상단 **로그인** → 이름 입력 → **구글로 로그인** 클릭
2. **토론 → 글쓰기** 로 글 작성 → 댓글 달기 → 삭제
3. 브라우저를 새로고침해도 글과 로그인 상태가 남아 있는지 확인
4. **관리자 기능**을 시험하려면 로그인 시 이메일에 `src/config.ts` 의 `ADMIN_EMAILS` 에 적힌 주소(기본값 `professor@example.ac.kr`)를 입력합니다. 다른 사람의 글에도 삭제 버튼이 보입니다.

> 시험용 데이터를 지우고 처음 상태로 돌리려면: 브라우저 개발자 도구(F12) → Application(응용 프로그램) → Local Storage → `nursing-lab:v1:` 로 시작하는 항목을 삭제합니다.

---

## 2. GitHub에 올리기

GitHub는 코드를 보관하는 인터넷 저장소입니다. Netlify가 여기서 코드를 가져가 사이트를 만듭니다.

### 방법 A. 이미 저장소가 있는 경우 (지금 이 프로젝트)

이 프로젝트는 이미 GitHub 저장소 `sejun2-blip/261028_nursing` 에 올라가 있습니다. 내용을 고친 뒤 다시 올리려면:

```bash
git add .
```

```bash
git commit -m "수정 내용을 한 줄로 적기"
```

```bash
git push
```

### 방법 B. 새 저장소를 만드는 경우

1. https://github.com 에 로그인 → 오른쪽 위 **+** → **New repository**
2. Repository name 입력(예: `nursing-lab`) → **Private**(비공개) 권장 → **Create repository**
3. 프로젝트 폴더의 터미널에서 아래를 차례로 입력합니다(`내아이디`와 `저장소이름`은 바꿔서):

   ```bash
   git init
   ```

   ```bash
   git add .
   ```

   ```bash
   git commit -m "첫 업로드"
   ```

   ```bash
   git branch -M main
   ```

   ```bash
   git remote add origin https://github.com/내아이디/저장소이름.git
   ```

   ```bash
   git push -u origin main
   ```

> `node_modules`, `dist`, `.env` 는 `.gitignore` 설정으로 자동 제외됩니다. 비밀 설정값이 GitHub에 올라가지 않습니다.

---

## 3. Netlify로 인터넷에 배포하기

1. https://app.netlify.com 에 접속 → **GitHub 계정으로 로그인**합니다.
2. **Add new site → Import an existing project** 를 누릅니다.
3. **Deploy with GitHub** 선택 → GitHub 접근 권한을 허용 → 위 저장소를 선택합니다.
4. 배포할 브랜치(Branch to deploy)를 고릅니다(보통 `main`).
5. 빌드 설정은 저장소의 `netlify.toml` 파일이 자동으로 채워 줍니다. 아래처럼 보이면 그대로 둡니다.
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Deploy** 를 누르고 1~2분 기다리면 `https://임의이름.netlify.app` 주소가 생깁니다.
7. 주소 이름을 바꾸려면: **Site configuration → Change site name**.

이후에는 GitHub에 `git push` 할 때마다 Netlify가 **자동으로 다시 배포**합니다.

> `netlify.toml` 의 리다이렉트 설정 덕분에 `/research/...` 같은 주소에서 새로고침해도 "페이지 없음" 오류가 나지 않습니다.

---

## 4. 연구·수업 자료 내용 바꾸기

연구와 수업 자료는 `src/data/` 폴더의 JSON 파일에 들어 있습니다. 메모장이나 VS Code로 열어 수정한 뒤 저장 → GitHub에 올리면(2번) 사이트에 반영됩니다.

| 파일 | 내용 |
| --- | --- |
| `src/data/research.json` | 연구 목록 |
| `src/data/materials.json` | 수업 자료 목록 |
| `src/data/lab.json` | 연구실 소개·연구 분야·구성원·문의 이메일 (홈·소개 페이지) |

### JSON 작성 규칙 (중요)

- 글자는 반드시 **큰따옴표 `" "`** 로 감쌉니다.
- 항목 사이에는 **쉼표 `,`** 를 넣고, **마지막 항목 뒤에는 쉼표를 넣지 않습니다.**
- 글 안에 큰따옴표를 쓰려면 `\"` 처럼 앞에 `\` 를 붙입니다.
- 수정 후 `npm run build` 를 실행해 오류가 없는지 확인하면 안전합니다.

### 연구 1건의 형식 (`research.json`)

```json
{
  "id": "my-research-2026",
  "title": "연구 제목",
  "summary": "목록 카드에 보일 한두 문장 요약",
  "abstract": "초록",
  "methods": "연구 방법",
  "results": "결과 요약 (진행 중이면 빈 칸 \"\" 으로 두기)",
  "tags": ["종양간호", "유전간호"],
  "year": 2026,
  "status": "ongoing",
  "links": [
    { "label": "연구 계획서 (Google Drive)", "url": "https://drive.google.com/..." }
  ],
  "createdAt": "2026-10-28T00:00:00.000Z"
}
```

- `id`: 주소에 쓰이는 고유 이름입니다. **영문 소문자·숫자·하이픈(-)** 만 쓰고, 다른 연구와 겹치지 않게 합니다.
- `status`: 진행중이면 `"ongoing"`, 완료면 `"completed"`
- `createdAt`: 등록일. 최신순 정렬에 쓰입니다. 날짜 부분(`2026-10-28`)만 바꾸면 됩니다.

### 수업 자료 1건의 형식 (`materials.json`)

```json
{
  "id": "pharm-week5",
  "title": "5주차: 항생제",
  "description": "자료 설명",
  "course": "약리학",
  "links": [{ "label": "강의 슬라이드 (OneDrive)", "url": "https://..." }],
  "createdAt": "2026-10-28T00:00:00.000Z"
}
```

- `course`: 과목명. 같은 과목명끼리 묶여 **과목 필터 버튼**이 자동으로 만들어집니다(띄어쓰기까지 똑같이 적기).

### 파일 링크 만드는 법

이 사이트는 파일을 직접 올리지 않고 **공유 링크**로 연결합니다.

- **Google Drive**: 파일 오른쪽 클릭 → 공유 → 일반 액세스를 "링크가 있는 모든 사용자" → 링크 복사
- **OneDrive**: 파일 선택 → 공유 → "링크가 있는 모든 사용자" → 링크 복사

> ⚠️ 환자 개인정보, IRB 대상 원자료는 링크로도 공유하지 마십시오.

---

## 5. 2차 준비: Firebase 설정

2차 작업(코드 연동) 전에 교수님께서 미리 해 두시면 좋은 설정입니다. 모두 **무료(Spark) 요금제**에서 가능하며, **결제 수단을 등록하지 않습니다.** 자세한 기술 계획은 `docs/FIREBASE_PLAN.md` 를 참고하세요.

### 5-1. Firebase 프로젝트 만들기

1. https://console.firebase.google.com 에 구글 계정으로 로그인
2. **프로젝트 추가** → 이름 입력(예: `nursing-lab`) → Google 애널리틱스는 **사용 안 함** → 만들기
3. 왼쪽 아래 요금제가 **Spark** 인지 확인합니다. ("업그레이드" 버튼은 누르지 않습니다.)

### 5-2. 웹 앱 등록

1. 프로젝트 개요 화면에서 **웹(`</>`) 아이콘** 클릭
2. 앱 닉네임 입력(예: `nursing-lab-web`) → "Firebase 호스팅 설정"은 **체크하지 않음**(Netlify 사용) → 앱 등록
3. 화면에 나오는 `firebaseConfig` 값(apiKey, authDomain 등 6개)을 메모해 둡니다. → 5-5 에서 사용

### 5-3. Authentication(구글 로그인) 켜기

1. 왼쪽 메뉴 **빌드 → Authentication → 시작하기**
2. **로그인 방법** 탭 → **Google** → 사용 설정 → 프로젝트 지원 이메일 선택 → 저장

### 5-4. Firestore 데이터베이스 만들기

1. 왼쪽 메뉴 **빌드 → Firestore Database → 데이터베이스 만들기**
2. 위치: **asia-northeast3 (서울)** 권장 (한 번 정하면 바꿀 수 없습니다)
3. **프로덕션 모드**로 시작 → 만들기
4. 보안 규칙은 2차 작업 때 `docs/FIREBASE_PLAN.md` 의 초안을 적용합니다.

> Storage(파일 업로드)와 Functions 는 **켜지 않습니다.** (유료 요금제가 필요하거나 비용이 생길 수 있음)

### 5-5. Netlify 환경변수 등록

설정값은 코드에 적지 않고 Netlify에 등록합니다.

1. Netlify → 해당 사이트 → **Site configuration → Environment variables → Add a variable**
2. `.env.example` 에 있는 이름 6개를 하나씩 추가하고, 5-2에서 메모한 값을 넣습니다.

   | 변수 이름 | firebaseConfig 의 항목 |
   | --- | --- |
   | `VITE_FIREBASE_API_KEY` | apiKey |
   | `VITE_FIREBASE_AUTH_DOMAIN` | authDomain |
   | `VITE_FIREBASE_PROJECT_ID` | projectId |
   | `VITE_FIREBASE_STORAGE_BUCKET` | storageBucket |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
   | `VITE_FIREBASE_APP_ID` | appId |

3. 내 컴퓨터에서 실행할 때는 `.env.example` 을 복사해 `.env` 파일을 만들고 같은 값을 넣습니다.

> 참고: Firebase 웹 설정값은 브라우저에 공개되는 값이라 "비밀번호"는 아니지만, 관리 편의와 실수 방지를 위해 코드와 분리합니다. 실제 보호는 **Firestore 보안 규칙**이 담당합니다.

### 5-6. 승인된 도메인에 Netlify 주소 추가

이 설정이 없으면 배포된 사이트에서 구글 로그인 창이 거부됩니다.

1. Firebase 콘솔 → **Authentication → 설정(Settings) → 승인된 도메인**
2. **도메인 추가** → `임의이름.netlify.app` 입력 (앞의 `https://` 는 빼고 입력)
3. 나중에 별도 도메인을 연결하면 그 도메인도 추가합니다. (`localhost` 는 기본으로 들어 있습니다)

### 5-7. 관리자 이메일 지정

`src/config.ts` 의 `ADMIN_EMAILS` 를 교수님의 구글 계정 이메일로 바꿉니다. 2차에서는 보안 규칙에도 같은 이메일을 적습니다.

---

## 6. 권한 안내

| 사용자 | 연구·수업 자료·토론 읽기 | 토론 글·댓글 쓰기 | 본인 글·댓글 삭제 | 다른 사람 글·댓글 삭제 |
| --- | :---: | :---: | :---: | :---: |
| 비로그인 | ✅ | – | – | – |
| 로그인(대학원생) | ✅ | ✅ | ✅ | – |
| 관리자(교수) | ✅ | ✅ | ✅ | ✅ |

> 1차에서는 화면(UI) 수준의 권한입니다. 실제 보안은 2차의 Firestore 보안 규칙으로 적용됩니다.

### 폴더 구조

```
src/
├─ pages/          페이지(홈, 연구, 수업 자료, 토론, 로그인, 소개, 404)
├─ components/     여러 페이지에서 함께 쓰는 화면 조각(메뉴, 카드, 댓글 등)
├─ services/       데이터 접근 '약속'(인터페이스)과 교체 스위치(index.ts)
│  └─ mock/        1차 시험용 구현(JSON 읽기, 브라우저 저장소)
├─ data/           연구·수업 자료·연구실 소개 JSON
├─ hooks/          공통 기능(로그인 정보, 권한, 데이터 불러오기)
├─ context/        로그인 상태 공유
├─ types.ts        데이터 모양 정의(Firestore 컬렉션과 1:1)
└─ config.ts       사이트 이름, 관리자 이메일, 글자 수 제한 등 설정
docs/FIREBASE_PLAN.md   2차 연동 계획서
```

### 안내 문구

환자 정보·IRB 대상 원자료를 올리지 말라는 안내가 **토론 글쓰기 화면**과 **소개 페이지**에 표시됩니다. 문구는 `src/components/EthicsNotice.tsx` 에서 바꿀 수 있습니다.
