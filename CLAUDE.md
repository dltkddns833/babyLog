# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BabyTime 앱에서 내보낸 아기(성찬) 활동 데이터를 시각화하는 Next.js 웹 대시보드.
모바일 환경에서 주로 사용하며, 수유 데이터가 가장 중요한 지표다.

- **아기**: 이성찬 (2026년 1월 27일생, 남, 출생 체중 3,810g)
- **부모**: 이상운(아빠), 정채원(엄마)

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4
- Recharts (차트)
- pnpm (패키지 매니저)
- Vercel 정적 배포 (`output: "export"`)

## Commands

```bash
pnpm dev          # 개발 서버 (turbopack)
pnpm build        # 정적 빌드
pnpm lint         # ESLint
```

## Architecture

- **Static Site Generation** — `src/lib/parser.ts`가 빌드 타임에 `data/` 폴더의 txt 파일을 파싱. 서버 컴포넌트(`page.tsx`)에서 `loadAllData()` 호출 후 클라이언트 컴포넌트(`Dashboard`)에 props로 전달.
- **데이터 흐름**: `zip/` → `data/{YYYYMM}/` → `parser.ts` → `page.tsx` (server) → `Dashboard.tsx` (client) → 차트 컴포넌트들
- **차트**: Recharts 사용. 모든 차트 컴포넌트는 `"use client"` 지시어 필요.

## Data Format

BabyTime 앱 내보내기 txt 파일. `====================` 구분자로 레코드 분리.
활동 유형 8종: 모유(양쪽/왼쪽/오른쪽), 분유, 유축수유, 기저귀, 밤잠, 낮잠.

## Dashboard Components

수유 관련 (핵심):
- `DailySummaryChart` — 일별 수유 횟수 라인 차트
- `FeedingIntervalChart` — 일별 평균 수유 간격 추이 (평균 기준선 포함)
- `AvgFeedingDurationChart` — 1회 평균 수유 시간 추이 (평균 기준선 포함)
- `DayNightChart` — 낮(6~22시)/밤(22~6시) 수유 비율 스택 바 차트
- `FeedingHeatmap` — 0~23시 시간대별 수유 빈도 히트맵
- `FeedingBreakdown` — 좌/우 수유 비율 도넛 차트

기타:
- `SleepChart` — 밤잠/낮잠 시간 스택 바 차트
- `DiaperChart` — 일별 기저귀 교체 횟수 바 차트
- `StatCard` — 요약 통계 카드
- `MonthSelector` — 월별 선택 버튼

## Adding New Month Data

1. zip 파일을 `zip/` 폴더에 추가
2. `data/{YYYYMM}/` 폴더에 압축 해제
3. `pnpm build`로 재빌드 (parser가 자동으로 새 월 탐지)

## Design Decisions

- 모바일 우선 반응형 (sm: breakpoint로 데스크톱 확대)
- 일별 수유 차트는 라인 차트 사용 (바 차트는 모바일에서 가독성 떨어짐)
- 차트 margin `{ top: 10, right: 10, left: 5, bottom: 10 }`, Y축 width 35 (라벨 잘림 방지)
- 수유 횟수가 수유 시간보다 중요한 지표로 취급

## 작업 규칙

- **빌드(`pnpm build`) 및 git push는 사용자가 명시적으로 요청할 때만 실행한다.** 코드 변경 후 자동으로 빌드/push하지 않는다. 사용자가 dev 서버에서 검토를 완료한 뒤 직접 "빌드해줘", "푸쉬해줘" 등으로 요청해야만 수행한다.

## Deployment

Vercel 정적 배포. `zip/`만 `.gitignore`에 포함. `data/`는 git에 포함되어 Vercel 빌드 시 사용 가능.
GitHub: https://github.com/dltkddns833/babyLog
