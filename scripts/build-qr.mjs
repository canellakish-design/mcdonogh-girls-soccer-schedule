// Generates the Tryout Check-In QR code in public/ from the URL in
// src/data/schedule.js. schedule.js stays the single source of truth.
// Run via `npm run build:qr` (also runs automatically before `npm run build`).
//
// While checkIn.url is empty this writes nothing and removes any stale QR,
// so the site never shows a code that scans to the wrong place.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import { checkIn } from '../src/data/schedule.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(here, '..', 'public', checkIn.qr.replace(/^\//, ''))

if (!checkIn.url) {
  if (fs.existsSync(out)) {
    fs.unlinkSync(out)
    console.log(`Removed ${path.basename(out)} — checkIn.url is empty`)
  } else {
    console.log('Skipped QR — checkIn.url is empty in src/data/schedule.js')
  }
  process.exit(0)
}

// High error correction: the code still scans with a scuffed or partly
// covered print, which matters if this gets taped to a cone or a clipboard.
const svg = await QRCode.toString(checkIn.url, {
  type: 'svg',
  errorCorrectionLevel: 'H',
  margin: 1,
  color: { dark: '#141414', light: '#ffffff' },
})

fs.writeFileSync(out, svg)
console.log(`Wrote ${path.basename(out)} -> ${checkIn.url}`)
