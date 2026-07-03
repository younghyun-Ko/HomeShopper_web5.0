# 홈쇼퍼 (HomeShopper)

1인가구·빌라/원룸 시장을 대상으로 한 부동산 **풀서비스 대리인** 플랫폼입니다. 단순 중개가 아니라 매물 탐색 → 임장 → 권리분석 → 계약 → 이사·인테리어·대출까지 한 화면에서 이어지는 것을 목표로 합니다.

- 중개부터 사후 서비스까지 풀서비스
- 중개 수수료 = 법정 상한 요율의 1/2, 정찰제

> 현재 저장소는 **UI/UX와 클라이언트 상태 흐름을 검증하기 위한 프런트엔드 프로토타입**입니다. 모든 데이터는 `src/lib/api`의 mock 함수와 브라우저 `localStorage`(`AppContext`)로만 동작하며, 실제 백엔드나 인증 서버는 아직 연결되어 있지 않습니다.

## 기술 스택

- **Next.js 14** (App Router) + **TypeScript** (strict) + **Tailwind CSS** + **lucide-react**
- 상태 관리: React Context + `useReducer` (전역 상태 라이브러리 미사용, MVP 원칙)
- 데이터: 모든 외부 호출은 `src/lib/api/`의 mock 함수를 통해서만 이루어짐 (컴포넌트에서 `fetch` 직접 호출 금지)
- 배포 타깃: **Vercel**

## 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행 (http://localhost:3000)
npm run dev

# 3. 프로덕션 빌드
npm run build

# 4. 빌드된 앱 실행
npm start

# 5. 타입 체크만 (빌드 없이)
npx tsc --noEmit

# 6. 린트
npm run lint
```

Node.js 18.18 이상, npm 권장. 별도의 환경 변수 없이 바로 실행됩니다(현재 mock 전용이므로 `.env` 불필요).

## 라우트맵

| 경로 | 설명 | 로그인 필요 |
|---|---|---|
| `/` | 홈 — 2갈래 진입(거래 시작하기 / 다른 서비스) | - |
| `/about` | 서비스 소개 랜딩 (문제 제기 → 해결 3단계 → 수수료 비교 → FAQ) | - |
| `/start/conditions` | 상담 신청 조건 입력 위저드 (6단계) | - |
| `/start/link` | 매물 링크/주소로 바로 시작하기 | - |
| `/start/link/assigned` | 담당자 배정 확인 화면 | - |
| `/results` | 조건 기반 추천 매물 리스트 | - |
| `/properties/[id]` | 매물 상세 (갤러리·서류 인증·거래 제안) | - |
| `/wishlist` | 찜한 매물 리스트 | - |
| `/visit` | 임장 장바구니 · 내 임장 현황 | 액션 시 필요 |
| `/analysis` | 매물 서류 분석 결과 | - |
| `/consult` | 상담 신청(매수·임차) / 매물 등록 신청(매도·임대) | 제출 시 필요 |
| `/deal/[id]/negotiate` | 거래 제안 검토 · 협상 | 필요 |
| `/deal/[id]` | 안전 거래 대시보드 (계약~잔금~완료 4단계, 타임라인 뷰) | 필요 |
| `/services` | 연계 서비스 허브 (이사·인테리어·대출·유지보수·해충퇴치·기타) | - |
| `/services/[category]` | 카테고리별 업체 리스트 | - |
| `/services/loan` | 대출 상품 추천 위저드 | - |
| `/login`, `/signup` | 로그인 / 회원가입 (+ 온보딩 1스텝) | - |
| `/mypage` | 진행 중 거래·임장 일정·신청 내역·서류 분석 이력·서비스 이용 내역 | 필요 |
| `/dev/components` | 디자인 시스템 컴포넌트 쇼케이스 | - (프로덕션 빌드에서는 404) |

`/dev/components`는 `src/app/dev/layout.tsx`에서 `process.env.NODE_ENV === "production"`일 때 `notFound()`를 호출해 프로덕션에서만 숨겨집니다.

## Mock → 실제 API 교체 가이드

모든 데이터 호출은 **`src/lib/api/index.ts`** 한 곳에 모여 있습니다. 실제 백엔드를 연결할 때는 이 파일의 함수 **내부 구현만** 실제 `fetch`/SDK 호출로 바꾸면 되고, 컴포넌트 쪽 코드는 수정할 필요가 없습니다(함수 시그니처를 유지하는 한).

| 함수 | 시그니처 | 현재 mock 동작 | 실제 API 교체 방향 |
|---|---|---|---|
| `parsePropertyLink` | `(url: string) => Property` | URL을 해시해 mock 매물 중 하나를 골라 반환 | `POST /api/properties/parse` — 네이버부동산·직방·다방 링크 파싱(크롤링 또는 제휴 API) |
| `getRecommendations` | `(conditions: SearchConditions) => Property[]` | mock 매물 8건을 조건별 점수로 정렬 | `GET /api/properties/recommendations` — 매물 DB 쿼리 + 추천/매칭 알고리즘 |
| `getProperty` | `(id: string) => Property \| undefined` | mock 배열에서 `find` | `GET /api/properties/:id` |
| `getVisitSlots` | `(date: string) => string[]` | 날짜를 해시해 임의로 2개 슬롯 제외 | `GET /api/visits/slots?date=` — 중개사 캘린더 연동(구글 캘린더 API, 사내 스케줄러 등) |
| `createVisit` | `(propertyId, date, time) => VisitCartItem` | 객체를 즉석 생성 | `POST /api/visits` — 임장 예약 생성 + 담당자 알림(SMS/카카오톡 알림톡) |
| `getAnalysis` | `(propertyId: string) => AnalysisResult` | 고정 안전/주의 케이스 2종을 id 해시로 번갈아 반환 | `GET /api/analysis/:propertyId` — 등기부등본 등 실제 서류 OCR/파싱 결과 또는 법무 검토 제휴사 API |
| `getDeal` | `(id: string) => Deal \| undefined` | 인메모리 배열에서 `find` | `GET /api/deals/:id` |
| `updateDealStage` | `(dealId, stage: DealStage) => Deal` | 인메모리 배열 갱신 | `PATCH /api/deals/:id/stage` |
| `submitOffer` | `(propertyId, proposedPrice, message?) => Deal` | 인메모리 생성/갱신, 경쟁 제안가는 랜덤 생성 | `POST /api/deals/offer` — 실거래가/경쟁 제안 데이터는 실제 매물 DB 기준으로 계산 |
| `getAgent` | `(role: Agent["role"]) => Agent \| undefined` | mock 배열에서 역할별 조회 | `GET /api/agents?role=` — 담당자 배정 시스템(CRM) 연동 |
| `getVendors` | `(category?, location?) => ServiceVendor[]` | mock 배열 필터링/거리순 정렬 | `GET /api/vendors?category=&location=` — 제휴 업체 DB |
| `getLoanProducts` | `(input?: LoanInquiryInput) => LoanProduct[]` | mock 배열 그대로 반환(조건 필터링 미구현) | `GET /api/loans?...` — 대출 비교 플랫폼 제휴 API, `input`(소득 구간·한도 등) 기반 실제 필터링 필요 |
| `submitConsult` | `(form: ConsultForm) => ConsultSubmission` | mock ID만 생성 | `POST /api/consults` — CRM/알림 시스템 연동 |

### 인증: `src/lib/auth.ts`

로그인/회원가입도 같은 패턴으로 별도 파일에 감싸 두었습니다.

| 함수 | 현재 mock 동작 | 실제 교체 방향 |
|---|---|---|
| `signIn(input)` | 입력값으로 `User` 객체를 즉석 생성 | Supabase Auth `signInWithOAuth`(카카오) / `signInWithPassword`(이메일) |
| `signOut()` | 지연만 흉내 | Supabase Auth `signOut()` |
| `getUser()` | 항상 `null` 반환(세션 확인 없음) | Supabase Auth `getUser()` / `getSession()` |

컴포넌트는 `signIn`/`signOut`의 결과를 받아 `AppContext`의 `setUser`/`login`/`logout`으로 클라이언트 상태에 반영하는 구조라, `auth.ts` 내부만 실제 Supabase 클라이언트 호출로 바꾸면 페이지 코드는 그대로 둘 수 있습니다.

### 그 외 마이그레이션 시 고려할 점

- **영속성**: 현재 위시리스트·임장 장바구니·거래·신청 내역·서류 분석 이력·서비스 이용 내역은 전부 `AppContext` → 브라우저 `localStorage`에만 저장됩니다(`src/context/AppContext.tsx`). 실 서비스 전환 시 사용자별 서버 저장소(DB)로 옮기고, `AppContext`는 서버에서 받아온 초기값으로 `HYDRATE`하는 방식으로 바꾸는 것을 권장합니다.
- **mock 지연**: 모든 mock 함수는 `delay()` 헬퍼로 300~600ms 인위적 지연을 흉내냅니다. 실제 API로 교체하면 이 헬퍼는 자연히 불필요해집니다.
- **법적 표현 규칙**: 서류 분석·수수료 관련 문구(점수/등급 표기 금지, 법적 효력 없음 고지, "법정 상한 요율의 1/2, 정찰제" 표기)는 실제 데이터로 교체되어도 반드시 유지해야 합니다.

## 배포 (Vercel)

이 프로젝트는 Git 저장소 루트가 아니라 `homeshopper-web/` 서브디렉터리에 있습니다. Vercel 프로젝트 설정에서 **Root Directory를 `homeshopper-web`으로 지정**해야 합니다.

```bash
# Vercel CLI 설치 (최초 1회)
npm i -g vercel

# homeshopper-web 디렉터리에서 실행
cd homeshopper-web
vercel login

# 프로젝트 연결 + 프리뷰 배포
vercel

# 프로덕션 배포
vercel --prod
```

CLI 실행 중 Root Directory를 묻는 프롬프트가 나오면 `homeshopper-web`(또는 이미 그 안에서 실행 중이면 `.`)을 지정하세요. Framework Preset은 Next.js가 자동 인식됩니다. 별도의 환경 변수는 현재 필요하지 않습니다.
