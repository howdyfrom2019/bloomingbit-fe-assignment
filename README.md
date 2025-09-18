# 블루밍비트 프론트엔드 과제 - DataGrid 구현

## 1. 개요

블루밍비트 프론트엔드 엔지니어 채용 과제 중 **과제 1번 (DataGrid 컴포넌트로 데이터 1만건 이상 구현)** 을 채택하여 구현했습니다.

본 프로젝트는 MUI X DataGrid와 React Query를 활용하여 대용량 데이터(10,000건)를 효율적으로 처리하고 페이지네이션을 적용한 데이터 그리드 시스템을 구현했습니다.

## 2. 실행 방법

```bash
# 사전 요구사항(패키지매니저 Bun)
# For Linux & macOS
curl -fsSL https://bun.sh/install | bash
# For Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

```bash
# 의존성 설치
bun install

# 개발 서버 실행 (데이터 시드 포함)
bun run dev
```

## 3. 사용한 라이브러리

### 핵심 라이브러리

- **@mui/x-data-grid**: 데이터 그리드 UI 컴포넌트
- **@tanstack/react-query**: 서버 상태 관리 및 캐싱
- **better-sqlite3**: 로컬 데이터베이스 (SQLite)
- **@faker-js/faker**: 테스트 데이터 생성

### 기타 라이브러리

- **Next.js 15**: React 프레임워크
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 스타일링
- **Axios**: HTTP 클라이언트

## 4. 과제 주안점

### 4.1 테스트 1만건 row 생성 로직에 대한 seed.ts 해설

```typescript
// src/database/seed.ts
export const generateUsers = (count: number = 10_000) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: faker.location.streetAddress({ useFullAddress: true }),
      phone: faker.phone.number(),
      createdAt: faker.date.past(),
    });
  }
  return users;
};
```

**핵심 설계 포인트:**

- **Faker.js 활용**: 실제와 유사한 가짜 데이터 생성으로 현실적인 테스트 환경 구성
- **배치 처리**: `insertMany` 트랜잭션을 통한 효율적인 대량 데이터 삽입
- **중복 방지**: 기존 데이터 존재 여부 확인 후 시드 실행
- **성능 최적화**: prepared statement를 통한 쿼리 최적화
- **Package 스크립트 추가**: 해당 스크립트를 run dev 시작 전 실행시켜 사전 데이터 시딩

### 4.2 페이지네이션을 적용한 API를 X Grid-Data에서 해결하는 과정

#### API 설계 (Server-side Pagination)

```typescript
// src/app/api/users/route.ts
export const GET = async (request: Request) => {
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 50;
  const offset = (page - 1) * size;

  const totalCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
  const users = db
    .prepare(`SELECT * FROM users LIMIT ? OFFSET ?`)
    .all(size, offset);

  return NextResponse.json({
    count: totalCount,
    page: page,
    list: users,
  });
};
```

**Q. 페이지네이션 채택 이유**

- 최초에 IntersectionObserver API를 사용해서 무한 스크롤을 통해 구현하려고 시도.
- 그러나 X Grid-Data에서 스크롤 Footer 고정 문제로 인해 데이터 패칭이 다수 발생하는 것을 발견.
- 해당 방법 우회 후 Pagination을 통해 데이터 처리

#### React Query와 DataGrid 연동

```typescript
// src/features/data-grid/component/data-grid-with-infinite-scroll.tsx
const { data: users, isLoading } = useQuery(
  userOptions({ page: pagination.page + 1, size: pagination.pageSize })
);

<DataGrid
  rows={users?.list ?? []}
  columns={columns}
  loading={isLoading}
  paginationMode="server"
  rowCount={users?.count ?? 0}
  paginationModel={pagination}
  onPaginationModelChange={setPagination}
/>;
```

**Grid-Data와 PlaceholderData의 관계성:**

- **PlaceholderData**: `placeholderData: (prev) => prev` 설정으로 페이지 전환 시 이전 데이터 유지
- **Smooth UX**: 로딩 중에도 이전 페이지 데이터가 표시되어 깜빡임 현상 방지

### 4.3 코딩 스타일 해설

#### 목적 기반의 Feature-based 구조

```
src/
├── features/
│   └── data-grid/
│       ├── component/     # UI 컴포넌트
│       ├── config/        # 설정 파일
│       └── page/          # 페이지 컴포넌트
├── service/               # API 서비스 레이어
├── types/                 # 타입 정의
└── hook/                  # 커스텀 훅
```

**설계 철학:**

- **관심사 분리**: 각 feature별로 독립적인 구조
- **재사용성**: 컴포넌트와 서비스의 명확한 분리
- **확장성**: 새로운 feature 추가 시 기존 코드 영향 최소화

#### 코드 추상화 수준

**1. 서비스 레이어 추상화**

```typescript
// src/service/user.ts
export function userOptions(payload: User.Payload) {
  return queryOptions({
    queryKey: ["users", payload],
    queryFn: () => fetchUsers(payload),
    staleTime: 5 * 1000,
    placeholderData: (prev) => prev,
  });
}
```

**2. 타입 안정성**

```typescript
// src/types/user.d.ts
declare namespace User {
  type Item = DBUser;
  type Insert = DBUserInsert;
  type Payload = UserPayload;
  type Response = UserResponse;
}
```

**3. 설정 분리**

```typescript
// src/features/data-grid/config/column-config.ts
export const columns = [
  { field: "id", headerName: "ID", width: 250 },
  { field: "name", headerName: "이름", width: 200 },
  // ...
];
```

**추상화 수준의 장점:**

- **유지보수성**: 각 레이어의 책임이 명확
- **테스트 용이성**: 독립적인 단위 테스트 가능
- **타입 안정성**: 컴파일 타임 오류 방지
- **재사용성**: 다른 프로젝트에서도 활용 가능한 구조

## 5. 주요 기능

- ✅ 요구사항에 따른 10,000건 데이터 처리
- ✅ 서버사이드 페이지네이션
- ✅ React Query를 통한 효율적인 상태 관리
- ✅ MUI X DataGrid의 기능 활용

## 6. 기술적 하이라이트

1. **성능 최적화**: 서버사이드 페이지네이션으로 메모리 효율성 확보
2. **사용자 경험**: PlaceholderData를 통한 부드러운 페이지 전환
3. **코드 품질**: Feature-based 아키텍처와 명확한 관심사 분리
4. **확장성**: 새로운 기능 추가 시 기존 구조에 미치는 영향 최소화
