# Sainsbury's Store OS — CFO Briefing Demo

A Next.js demo showing how an integrated grocery-retail operating system + AI transforms the manual finance and supply-chain activities that today consume Sainsbury's CFO's days. Audience: **Bláthnaid Bergin and finance leadership**.

> **Demo only.** Public information + mock data. No live Sainsbury's systems are connected.

---

## The story in one paragraph

Period close at a 600-store grocer takes 11 working days, hundreds of cash-office reconciliations are still done in spreadsheets, supplier-invoice 3-way matching misses SLA constantly, and shrinkage is discovered two weeks after the fact. **Store OS** unifies POS, Nectar, Argos, SAP S/4 HANA, Manhattan WMS and supplier feeds into one ledger. **Argos AI** — a financial co-pilot — closes 95%+ of store reconciliations exception-only, auto-matches invoices to POs and goods receipts, and surfaces shrinkage in real time. Period close drops from 11 days to 1. Working capital is freed. The CFO walks into the boardroom with current numbers.

---

## Run it

```bash
pnpm install
pnpm dev
# → http://localhost:3000
```

Built on Next.js 16 (Turbopack), React 19, Tailwind v4, framer-motion, recharts.

---

## The CFO demo flow (~10 minutes)

| # | Route | Talking point |
|---|---|---|
| 1 | `/` | Landing — "One platform. Every store. Every close." Three feature cards (Continuous Close · Invoice→PO→GRN · Portfolio P&L). |
| 2 | `/story/today` | The pain — manual day-in-the-life of period close. 11 days · 4 systems · 600+ stores · £2.1B UK shrinkage. |
| 3 | `/story/platform` | The solution — Store OS + Argos AI. AI-powered audit, 3-way invoice match, real-time shrinkage. |
| 4 | `/story/beyond` | The outcome — 11d→1d close, 97% auto-match, 24h shrink detection, working capital freed. |
| 5 | `/login` | Pick a role to enter the platform (CFO / Daily Audit Lead / Finance Ops / Store Manager / Supply-Chain Controller). |
| 6 | `/portfolio` | CFO view — Group revenue today, period-close status by region, estate by format. |
| 7 | `/audit` | Daily Store Audit — automated 10-step close, exception-only review. |
| 8 | `/reconciliation` | Cash Reconciliation — variances by category (Cash office vs Tellermate, Nectar vs SAP, Argos vs main till, Card vs bank). |
| 9 | `/finance-ops` | Continuous Close — UK store network, working capital trapped, shrinkage trend. |
| 10 | `/ops` | Invoice → PO → GRN — 3-way auto-match dashboard, supplier exceptions, working capital impact. |
| 11 | `/floor` | Shrinkage & Wastage — live loss intelligence, top 5 stores by shrink, 14-day trend by category. |
| 12 | `/data-feed` | DC ↔ Store Flow — trucks in transit, OTIF, OOS lines, click-and-collect, supply-chain pulse. |

The bottom-right **Argos AI** chat is available throughout — try prompts like *"What's holding period close today?"*, *"Show me invoice exceptions over £10k"*, or *"Top 5 stores by shrinkage today"*.

A small **store-level intelligence companion** mockup (single-store view) lives at <https://v0-sainsbury-s-market-analysis.vercel.app/> — linked from the landing page.

---

## What's in the box

```
app/
├── page.tsx                       # CFO landing (hero + feature cards + Argos AI section)
├── (story)/story/                 # Today → Platform → Beyond narrative
├── (dashboard)/
│   ├── portfolio/                 # CFO Portfolio P&L
│   ├── multi-site/                # UK store network grid
│   ├── audit/                     # Daily Store Audit (10-step automated)
│   ├── reconciliation/            # Cash reconciliation by variance category
│   ├── finance-ops/               # Continuous Close (cross-store ledger)
│   ├── ops/                       # Invoice → PO → GRN 3-way match
│   ├── floor/                     # Shrinkage & Wastage console
│   └── data-feed/                 # DC ↔ Store Flow
├── login/                         # Role-based demo login
└── api/oracle/                    # Argos AI chat endpoint (server-streamed)

components/house-os/               # Shell, Argos AI chat, demo guide, UK map, KPI cards
lib/house-os-context.tsx           # Shared state — 9 demo Sainsbury's stores
```

The 9 demo stores: Potters Bar, Nine Elms, King's Cross Local, Whitechapel, Cromwell Road, Holborn Local, Fulham Wharf, Argos Stratford, Brighton Marina.

---

## Provenance

Forked from [`Jack-WangY/v0-house-os-platform`](https://github.com/Jack-WangY/v0-house-os-platform) (a Soho House hospitality OS demo), then refactored end-to-end for Sainsbury's grocery retail with a CFO-targeted narrative. Visual language drawn from the Sainsbury's Potters Bar market-analysis mockup (see companion link above).
