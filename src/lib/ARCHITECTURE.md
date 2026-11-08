# Data architecture

Google Trends website session -> explore TIMESERIES token -> multiline daily data -> validation and removal of partial dates -> in-process country snapshot cache -> dashboard.

`google-trends.ts` uses the public website endpoints, not the restricted official API alpha. Requests are serialized. HTTP 429 triggers a five-minute cooldown. Google may change these endpoints or limit access.

`trends.ts` maps local-language searches back to Korean display keywords. Country is part of every keyword record and the ERP join key. Per-keyword scores are normalized to that keyword's own peak; growth is recent seven-day mean versus the preceding seven days. Unavailable baselines are explicitly marked. Category charts use Google's two-term comparison values.

The cache shares in-flight requests and keeps successful country snapshots for one hour and failures for five minutes. Server restart clears it. Dynamic routes avoid capturing a build-time snapshot. Failures produce empty datasets with visible source status, never invented values.

Sales, inventory, FX and the opportunity score are demo data/logic. The agent is a rule-based demonstration, with no LLM connection or measured confidence. The recommendations page contains explicitly labelled fixed examples.
