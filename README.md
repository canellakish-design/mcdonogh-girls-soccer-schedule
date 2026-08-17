# McDonogh Girls Varsity Soccer — Team Schedule

A standalone public site showing every training day and match of the season as a card.
A card list; tap a card for detail.

## Source of truth

**`src/data/schedule.js`** — edit this one file to update the site. Nothing else needs to change.

The match schedule mirrors the official McDonogh Athletics page:
<https://www.mcdonogh.org/athletics/teams-schedules/sport/girls-soccer/girls-varsity-soccer/2995>

## Season rules baked into the data

- Week 1 runs **Sat Aug 15 → Fri Aug 21**. Tryouts Aug 15–17 at **9:00 AM**.
  Training that week is 9:00 AM, except **Thu Aug 20 at 12:00 PM**;
  the Aug 19 Orange v. White match is **7:00 PM**.
- **Aug 22–23 off** (Sat/Sun). Training resumes **Mon Aug 24**.
- From Aug 24 on: **weekday training at 4:00 PM**; matches keep their listed times.
  Weekends are off unless there is a match.

## Card fields

| Field | Meaning |
| --- | --- |
| `type` | `'training'` (blue badge) or `'match'` (orange badge) |
| `home` | `true` = we host (`vs.`), `false` = we travel (`@`), `'neutral'` = third site |
| `scrimmage` | `true` adds a grey SCRIMMAGE tag |
| `playoff` | `true` adds a PLAYOFFS tag |
| `time` / `location` | Displayed on the card and detail view |
| `opponent` | Match days only |
| `result` | Fill in after the game — `W 3–1`, `L 0–2`, `T 1–1` |
| `focus` | Training theme, or a pre-match focus note |
| `note` | Bus time, uniforms, conflicts, anything else |
| `sortDate` | `YYYY-MM-DD` — drives ordering and the "Today" highlight. Keep accurate. |

## Behavior

- Today's card floats to the **top**, flagged **Today** (or **Next up** if today is an off day).
- Completed days collapse into a **Completed (n)** section below.
- Filter tabs: **All / Matches / Training**.

## Develop

```bash
npm install
npm run dev
```

Runs on port **5182** (5173 and 5180 are used by the other projects).

## Deploy

`netlify.toml` is configured for Netlify (`npm run build` → `dist`, SPA redirect, no-cache HTML).
