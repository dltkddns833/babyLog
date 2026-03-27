# BabyLog

BabyTime 앱에서 내보낸 아기 활동 데이터를 시각화하는 웹 대시보드입니다.

## 주요 기능

- **일별 수유 요약 테이블** — 행 클릭 시 개별 활동 디테일 확인
- **수유 추이 차트** — 일별 횟수, 수유 간격, 1회 평균 시간
- **시간대별 수유 빈도** — 새벽/오전/오후/저녁 구간별 분포
- **좌/우 수유 비율** — 도넛 차트
- **수면/기저귀** — 밤잠·낮잠 패턴, 기저귀 교체 횟수

모바일 우선으로 설계되었습니다.

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4
- Recharts
- pnpm

## 시작하기

```bash
pnpm install
pnpm dev
```

## 데이터 추가

1. BabyTime 앱에서 월별 활동 데이터를 zip으로 내보내기
2. `zip/` 폴더에 저장
3. `data/{YYYYMM}/` 폴더에 압축 해제
4. `pnpm build`로 재빌드

## 배포

Vercel 정적 배포 (`output: "export"`)
