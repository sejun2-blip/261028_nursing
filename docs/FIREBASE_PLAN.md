# 2차 Firebase 연동 계획서

> 대상: Firebase **Spark(무료) 요금제** — Firestore + Authentication(Google)만 사용
> 사용하지 않음: Cloud Functions, Cloud Storage, Hosting(→ Netlify 사용), 실시간 구독(`onSnapshot`), 유료 기능

## 1. 목표와 원칙

| 항목 | 내용 |
| --- | --- |
| 목표 | 1차 Mock 구현을 Firebase 구현으로 교체해, 실제 구글 로그인과 **여러 사람이 함께 보는 토론**을 제공 |
| 교체 범위 | `src/services/index.ts` 한 파일의 import 경로 변경 + `src/services/firebase/` 신규 작성 |
| 화면 코드 | **변경 없음** (인터페이스 `src/services/types.ts` 를 그대로 구현) |
| 데이터 조회 | `getDocs` / `getDoc` 1회 조회 + `limit` 페이지 단위. `onSnapshot` 사용 안 함 |
| 보안 | 화면의 권한 표시는 보조 수단. 실제 보호는 **Firestore 보안 규칙** |

## 2. 작업 순서

1. (교수님) README 5장의 콘솔 설정 완료: 프로젝트·웹 앱·Google 로그인·Firestore(서울)·Netlify 환경변수·승인된 도메인
2. `npm install firebase` (공식 SDK 하나만 추가)
3. 신규 파일 작성

   | 파일 | 역할 |
   | --- | --- |
   | `src/services/firebase/app.ts` | `import.meta.env.VITE_FIREBASE_*` 로 `initializeApp`, `getAuth`, `getFirestore` 내보내기 |
   | `src/services/firebase/firebaseAuthService.ts` | `signInWithPopup(GoogleAuthProvider)`, `signOut`, `onAuthStateChanged`, 최초 로그인 시 `users/{uid}` 생성 |
   | `src/services/firebase/firebaseResearchService.ts` | `research` 컬렉션 조회 (`orderBy('createdAt','desc')`, `limit`) |
   | `src/services/firebase/firebaseMaterialService.ts` | `materials` 컬렉션 조회 (`where('course','==',…)`) |
   | `src/services/firebase/firebaseDiscussionService.ts` | 글·댓글 CRUD, 페이지 단위 조회, `commentCount` 갱신 |
   | `src/services/firebase/convert.ts` | Firestore `Timestamp` ↔ ISO 문자열 변환 |

4. `src/services/index.ts` 의 import 를 firebase 구현체로 변경, `IS_MOCK = false`
5. `src/data/research.json`, `materials.json` 내용을 Firestore 로 1회 옮기기 (관리자 계정으로 콘솔에서 직접 입력하거나 1회용 스크립트) — **또는 6장의 "JSON 유지" 안 채택**
6. 보안 규칙(4장) 게시 → 규칙 시뮬레이터로 점검
7. 로그인 화면의 Mock 입력칸은 `IS_MOCK=false` 일 때 자동으로 숨겨짐 → 버튼만 남음
8. 배포 후 점검: 비로그인 읽기 / 대학원생 작성·본인 삭제 / 관리자 전체 삭제 / 다른 사용자 글 삭제 거부

## 3. 데이터 모델 (Firestore 컬렉션 ↔ `src/types.ts`)

| 경로 | 필드 | 비고 |
| --- | --- | --- |
| `users/{uid}` | name, email, role(`admin`\|`member`), createdAt | uid = Firebase Auth uid. 이메일이 있으므로 **본인·관리자만 읽기** |
| `research/{id}` | title, summary, abstract, methods, results, tags[], year, status(`ongoing`\|`completed`), links[{label,url}], createdAt | `methods`·`results` 는 상세 화면 요구로 추가된 필드 |
| `materials/{id}` | title, description, course, links[{label,url}], createdAt | |
| `posts/{id}` | title, content, authorId, authorName, researchId?, createdAt, commentCount | `commentCount` 는 목록에서 댓글을 따로 세지 않기 위한 값 |
| `posts/{id}/comments/{cid}` | content, authorId, authorName, createdAt | 하위 컬렉션 |

- `createdAt` 은 저장 시 `serverTimestamp()` 사용, 읽을 때 ISO 문자열로 변환해 화면에 전달
- 문서 `id` 는 본문에 저장하지 않고 문서 ID 를 사용

### 필요한 색인(무료)

| 컬렉션 | 필드 | 용도 |
| --- | --- | --- |
| `posts` | `researchId` 오름차순 + `createdAt` 내림차순 | 연구 상세의 "이 연구에 대한 토론" |
| `materials` | `course` 오름차순 + `createdAt` 내림차순 | 과목 필터 |

처음 쿼리를 실행하면 콘솔 오류 메시지에 색인 생성 링크가 나오며, 클릭 한 번으로 만들 수 있습니다.

### 구현 메모

- **페이지 단위 조회**: `query(collection(db,'posts'), orderBy('createdAt','desc'), limit(10), startAfter(커서))`. 인터페이스의 `nextCursor` 는 문자열이므로 마지막 글의 `createdAt`(밀리초)을 문자열로 담아 `startAfter(Timestamp.fromMillis(...))` 로 사용 → 커서용 추가 읽기 0회
- **댓글 작성**: `writeBatch` 로 ① 댓글 생성 ② `posts/{id}.commentCount` 에 `increment(1)` 을 한 번에 처리
- **댓글 삭제**: 같은 방식으로 `increment(-1)`
- **글 삭제**: Firestore 는 하위 컬렉션을 자동 삭제하지 않으므로, `writeBatch` 로 ① 해당 글의 댓글 전부 ② 글 문서를 함께 삭제(한 번에 최대 500건)
- **권한 오류 처리**: 규칙에 막히면 `permission-denied` 오류 → "권한이 없습니다" 문구로 변환해 표시

## 4. Firestore 보안 규칙 초안

원칙: **읽기는 공개 / 쓰기는 로그인 사용자 본인 문서만 / 삭제는 본인 또는 관리자 / 연구·자료는 관리자만 수정**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ---------- 공통 함수 ----------
    function signedIn() {
      return request.auth != null;
    }
    // ⚠️ src/config.ts 의 ADMIN_EMAILS 와 같은 목록을 유지할 것
    function isAdmin() {
      return signedIn()
        && request.auth.token.email_verified == true
        && request.auth.token.email in ['professor@example.ac.kr'];
    }
    function isSelf(uid) {
      return signedIn() && request.auth.uid == uid;
    }
    function validText(v, max) {
      return v is string && v.size() > 0 && v.size() <= max;
    }
    function data() {
      return request.resource.data;
    }

    // ---------- 사용자 ----------
    match /users/{uid} {
      allow read: if isSelf(uid) || isAdmin();
      allow create: if isSelf(uid)
        && data().keys().hasOnly(['name', 'email', 'role', 'createdAt'])
        && validText(data().name, 30)
        && data().email == request.auth.token.email
        && (data().role == 'member' || (data().role == 'admin' && isAdmin()))
        && data().createdAt == request.time;
      // 이름만 본인이 수정 가능 (role 스스로 변경 불가)
      allow update: if isSelf(uid)
        && data().diff(resource.data).affectedKeys().hasOnly(['name'])
        && validText(data().name, 30);
      allow delete: if isAdmin();
    }

    // ---------- 연구 / 수업 자료 ----------
    match /research/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /materials/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // ---------- 토론 글 ----------
    match /posts/{postId} {
      allow read: if true;

      allow create: if signedIn()
        && data().keys().hasOnly(['title', 'content', 'authorId', 'authorName', 'researchId', 'createdAt', 'commentCount'])
        && data().authorId == request.auth.uid
        && validText(data().title, 100)
        && validText(data().content, 5000)
        && validText(data().authorName, 30)
        && (!('researchId' in data()) || data().researchId is string)
        && data().commentCount == 0
        && data().createdAt == request.time;

      // 글 내용 수정 기능은 없음. 댓글 작성·삭제 시 commentCount 만 ±1 허용
      allow update: if signedIn()
        && data().diff(resource.data).affectedKeys().hasOnly(['commentCount'])
        && (data().commentCount == resource.data.commentCount + 1
            || data().commentCount == resource.data.commentCount - 1)
        && data().commentCount >= 0;

      allow delete: if signedIn()
        && (resource.data.authorId == request.auth.uid || isAdmin());

      // ---------- 댓글 ----------
      match /comments/{commentId} {
        allow read: if true;

        allow create: if signedIn()
          && data().keys().hasOnly(['content', 'authorId', 'authorName', 'createdAt'])
          && data().authorId == request.auth.uid
          && validText(data().content, 1000)
          && validText(data().authorName, 30)
          && data().createdAt == request.time
          && exists(/databases/$(database)/documents/posts/$(postId));

        allow update: if false;

        // 댓글 작성자, 관리자, 그리고 '글 삭제 시 댓글 일괄 정리'를 위해 글 작성자도 허용
        allow delete: if signedIn() && (
          resource.data.authorId == request.auth.uid
          || isAdmin()
          || get(/databases/$(database)/documents/posts/$(postId)).data.authorId == request.auth.uid
        );
      }
    }
  }
}
```

### 규칙 관련 주의점

- **관리자 판단은 이메일 목록**으로 합니다. `users.role` 은 화면 표시용이며, 사용자가 스스로 `admin` 을 넣을 수 없도록 막았습니다. 관리자 추가 시 `config.ts` 와 규칙 **두 곳**을 함께 수정합니다.
- `commentCount` ±1 허용 규칙은 단순화를 위한 타협입니다. 로그인 사용자가 의도적으로 숫자만 바꾸는 것은 가능하지만, 글 내용·작성자는 바꿀 수 없어 피해는 "댓글 수 표시 오차"에 그칩니다. 문제가 되면 3차에서 보완합니다.
- 글 작성자의 댓글 삭제 허용은 글 삭제 시 하위 댓글 정리를 위한 것입니다. 화면에서는 글 작성자에게 남의 댓글 개별 삭제 버튼을 보여 주지 않습니다.
- 규칙 게시 전 콘솔의 **규칙 플레이그라운드**로 비로그인 읽기·타인 글 삭제 거부 등을 점검합니다.
- 테스트 모드(30일간 전체 허용) 규칙을 **그대로 두지 않습니다.**

## 5. Spark 무료 한도 대비 주의사항

| 항목 | 무료 한도 | 예상 사용량과 대응 |
| --- | --- | --- |
| 저장 용량 | **1 GiB** | 텍스트만 저장(파일은 외부 링크) → 글 1건 ≈ 수 KB, 수만 건도 여유 |
| 문서 읽기 | **일 50,000회** | 홈 1회 방문 ≈ 9회(연구3+자료3+토론3). 토론 목록 1페이지 = 10회. 하루 수천 회 방문까지 여유 |
| 문서 쓰기 | **일 20,000회** | 글 1건 = 1회, 댓글 1건 = 2회(댓글+카운트) |
| 문서 삭제 | 일 20,000회 | 글 삭제 = 1 + 댓글 수 |
| 네트워크 전송 | 월 10 GiB | 텍스트 위주라 문제 적음 |

- 한도는 **태평양 표준시 자정(한국 시간 오후 4~5시)** 에 초기화됩니다. 초과 시 요금이 나가지 않고, 그날 남은 시간 동안 읽기/쓰기가 **오류로 거부**됩니다(Spark 는 결제 수단이 없으므로 과금 없음).
- **실시간 구독(`onSnapshot`) 금지**: 문서가 바뀔 때마다 접속자 수만큼 읽기가 발생해 한도를 빠르게 소모합니다.
- **항상 `limit` 사용**: 목록 전체를 한 번에 가져오지 않습니다(토론 10건, 댓글 50건 단위).
- **댓글 수는 `commentCount` 필드로**: 목록에서 글마다 댓글을 세면 읽기가 크게 늘어납니다.
- **연구·수업 자료는 JSON 유지 검토**: 관리자만 바꾸는 데이터이므로 지금처럼 `src/data/*.json` 에 두면 **Firestore 읽기 0회**입니다. 수정 빈도가 낮다면 이 방식을 권장하고, 웹에서 직접 편집이 필요해질 때 Firestore 로 옮깁니다.
- 콘솔의 **사용량(Usage)** 탭을 주 1회 확인합니다.
- **업그레이드(Blaze) 버튼을 누르지 않습니다.** 결제 계정이 연결되면 한도 초과분이 과금될 수 있습니다.

## 6. 2차에서 교체·추가되는 파일 요약

| 구분 | 파일 |
| --- | --- |
| 수정 | `src/services/index.ts` (import 경로, `IS_MOCK=false`) |
| 수정 | `package.json` (`firebase` 추가) |
| 신규 | `src/services/firebase/*.ts` (3장 표 참고) |
| 신규 | `firestore.rules` (4장 규칙을 파일로 보관, 콘솔에 붙여 넣어 게시) |
| 유지 | `src/pages/**`, `src/components/**`, `src/hooks/**`, `src/types.ts` — 변경 없음 |
| 선택 | `src/services/mock/**` — 로컬 시험용으로 남겨 두거나 삭제 |
