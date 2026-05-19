# QA Agent Web

Friday QA 자동화 리포트 viewer. Next.js static export → GitHub Pages.

## 구조

```
reports/                  # PBI별 단일 리포트 (source of truth)
├── _index.json
└── <PBI-ID>/
    ├── report.json
    ├── screenshots/
    └── videos/           # H.265 240p 5fps 압축본
qa-agent-web/             # (this repo) Next.js webapp
public/artifacts/         # build 시 reports/ 복사 (gitignored)
scripts/prepare-artifacts.sh
.github/workflows/deploy.yml
```

## 로컬

```bash
npm install
scripts/prepare-artifacts.sh
npm run build   # out/ 생성
# 또는
npm run dev
```

## 배포

push 시 `.github/workflows/deploy.yml` 자동 실행 → GitHub Pages.

수동 trigger:
```bash
gh workflow run deploy.yml
```

## URL

- 배포: https://delightroom.github.io/qa-agent-web/reports/CO-108
- 도메인 (선택): `qa-agent.delightroom.com`
