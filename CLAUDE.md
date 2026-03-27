# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BabyTime 앱에서 내보낸 아기(성찬) 활동 데이터를 시각화하는 웹 대시보드. 매달 zip 파일을 `zip/` 폴더에 넣고 `data/` 폴더에 압축 해제하면 빌드 시 자동 파싱된다.

## Commands

```bash
pnpm dev          # 개발 서버 (turbopack)
pnpm build        # 정적 빌드 (output: export)
pnpm lint         # ESLint
```

## Architecture

- **Static Site Generation** — `src/lib/parser.ts`가 빌드 타임에 `data/` 폴더의 txt 파일을 파싱. 서버 컴포넌트(`page.tsx`)에서 `loadAllData()` 호출 후 클라이언트 컴포넌트(`Dashboard`)에 props로 전달.
- **데이터 흐름**: `zip/` → `data/{YYYYMM}/` → `parser.ts` → `page.tsx` (server) → `Dashboard.tsx` (client) → 차트 컴포넌트들
- **차트**: Recharts 사용. 모든 차트 컴포넌트는 `"use client"` 지시어 필요.

## Data Format

BabyTime 앱 내보내기 txt 파일. `====================` 구분자로 레코드 분리. 활동 유형: 모유(양쪽/왼쪽/오른쪽), 분유, 유축수유, 기저귀, 밤잠, 낮잠.

## Adding New Month Data

1. zip 파일을 `zip/` 폴더에 추가
2. `data/{YYYYMM}/` 폴더에 압축 해제
3. `pnpm build`로 재빌드 (parser가 자동으로 새 월 탐지)

## Deployment

Vercel 정적 배포 (`output: "export"`). `zip/`, `data/`는 `.gitignore`에 포함되어 있으므로 빌드 전 로컬에서 데이터 준비 필요.
