# BONK Rewards Tracker

A user-friendly dashboard for BONK lockers.

The goal is to make BONK rewards feel alive instead of static:

- live BONK reward counter
- reward speed estimates
- daily reward chart
- projected monthly rewards
- future Solana wallet + on-chain adapter

## MVP status

The first version uses mock data so the interface can be built fast.

Next step: connect a wallet and read BONK token/reward activity from Solana.

## Commands

```bash
npm install
npm run dev
```

## Product rule

The app should always separate:

- **Confirmed**: data read from chain
- **Estimated**: live calculation between confirmed updates
- **Projected**: forward-looking estimate based on recent reward rate
