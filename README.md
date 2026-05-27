# BonkXSol Rewards Command Center

A professional BONK rewards dashboard for lockers who want to understand their position without confusing confirmed data with live estimates or projections.

The product goal is simple: make BONK rewards feel alive, trackable, and honest.

## MVP features

- BONK locked balance demo profiles
- confirmed reward snapshot cards
- live estimated reward counter
- adjustable BONK/hour reward speed
- confirmed vs estimated reward flow chart
- projected 24-hour, 7-day, and 30-day rewards
- wallet input placeholder for the future Solana adapter
- BONK mint display for product clarity

## MVP status

The current version is a polished demo interface using mock data so the product shape can be tested fast.

The next technical milestone is to replace demo profiles with real Solana wallet reads, BONK token accounts, and reward transaction parsing.

## Product rule

The app should always separate:

- **Confirmed**: data read from chain, token accounts, lock contracts, or reward transaction history
- **Estimated**: live calculation between confirmed updates
- **Projected**: forward-looking estimate based on recent or selected reward rate

This rule matters because the dashboard should feel exciting without pretending projections are guaranteed.

## Commands

```bash
npm install
npm run dev
```

## Next build targets

1. Add wallet adapter connection.
2. Read BONK token account balances.
3. Identify locked BONK and reward-related activity.
4. Replace demo snapshots with confirmed wallet data.
5. Store snapshots for historical charts.
