# Character Art Prompts — Headshots & Logos

This guide gives you a **ready-to-paste prompt for every attendee's headshot and every
company's logo** so the showcase directory can show real images instead of initials.
All people and companies here are fictional (named after public-domain literary
characters), so AI-generated art is exactly right.

## How to use it

1. Copy a prompt below into your image generator (Midjourney, DAL·E, Ideogram, etc.).
2. Save the result with the **exact filename** from the table and drop it into the repo:
   - Headshots → `public/photos/<id>.jpg`
   - Logos → `public/logos/<company-slug>.png`
3. Tell me when they're in and I'll wire up `members.json`, add a graceful fallback so any
   missing image quietly falls back to initials, push, and verify it live.

> **Tip for a cohesive set:** generate all 17 headshots with the same model/style settings
> (and, if your tool supports it, a fixed style reference or seed) so the lighting,
> backdrop, and color grade match across the whole directory. Same for the logos.

## Technical specs

| | Headshots | Logos |
|---|---|---|
| Shape | **Square 1:1** | **Square 1:1** |
| Size | 1024×1024 (or larger) | 1024×1024 |
| Format | **JPG** | **PNG, transparent background** |
| Rendered as | square avatar **and** a full-width 228px banner (center-cropped) | tiny **40×40** tile, `contain` (no crop) |
| So design for | head-and-shoulders, centered, **leave headroom** so a center crop never cuts the face | a **compact emblem / 1–2 letter monogram** that stays legible at 40px — *not* a long wordmark |

### Shared house style — headshots
> *This style is already baked into each prompt below; it's here so you can tweak globally.*
>
> Professional corporate headshot, head-and-shoulders, subject centered and facing camera
> with a natural, approachable expression. Square 1:1 with comfortable headroom and even
> space around the shoulders (not a tight crop), eyes on the upper third. Soft, even
> editorial studio lighting, gentle warm color grade. Plain, softly out-of-focus warm
> greige backdrop (tones around #E7E1D4 / #EFEBE1). Modern business-casual attire.
> Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no
> props, no hands.

### Shared house style — logos
> Minimal, modern **flat vector** logo on a fully **transparent** background, centered,
> square, legible at 40px. Restrained palette from deep forest green (#20281F / #2D3E33),
> warm brass gold (#9C7A3C), and soft cream (#EFEBE1). Clean geometry, generous negative
> space. No gradients, no 3D, no photorealism, no drop shadows. A simple emblem or compact
> monogram, **not** a long wordmark.

## Filename map

| Attendee | `id` (headshot file) | Company | Logo file |
|---|---|---|---|
| Prospero | `prospero` | Elevate | *use existing Elevate brand mark — no prompt needed* |
| Elizabeth Bennet | `elizabeth-bennet` | Longbourn | `longbourn` |
| Jay Gatsby | `jay-gatsby` | West Egg | `west-egg` |
| Sherlock Holmes | `sherlock-holmes` | Baker Street | `baker-street` |
| Jane Eyre | `jane-eyre` | Thornfield Learning | `thornfield` |
| Edmond Dantès | `edmond-dantes` | Château Capital | `chateau-capital` |
| Phileas Fogg | `phileas-fogg` | Reform Logistics | `reform` |
| Mina Harker | `mina-harker` | Harker Health | `harker-health` |
| Becky Sharp | `becky-sharp` | Vanity | `vanity` |
| Captain Nemo | `captain-nemo` | Nautilus | `nautilus` |
| Dorothea Brooke | `dorothea-brooke` | Middlemarch | `middlemarch` |
| Ebenezer Scrooge | `ebenezer-scrooge` | Marley & Co | `marley-co` |
| Allan Quatermain | `allan-quatermain` | Solomon | `solomon` |
| Natasha Rostova | `natasha-rostova` | Rostova | `rostova` |
| Heathcliff | `heathcliff` | Wuthering | `wuthering` |
| Hester Prynne | `hester-prynne` | Scarlet | `scarlet` |
| Marianne Dashwood | `marianne-dashwood` | Dashwood Studio | `dashwood` |

---

## Prospero — Elevate
**Files:** `public/photos/prospero.jpg` · logo: *existing Elevate mark (I'll wire this — no prompt needed)*

**Headshot**
```text
Professional corporate headshot of a distinguished man in his early 60s with a founder-chairman presence — silver hair, a neatly trimmed grey beard, warm and wise with calm authority. Wearing a dark charcoal blazer over an open-collar shirt. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

---

## Elizabeth Bennet — Longbourn
**Files:** `public/photos/elizabeth-bennet.jpg` · `public/logos/longbourn.png`

**Headshot**
```text
Professional corporate headshot of an English woman in her early 30s with bright intelligent eyes and a slight knowing smile, warm and quick-witted. Shoulder-length wavy chestnut-brown hair. Wearing a smart-casual blazer in a muted tone. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Longbourn", a marketplace for independent makers. A compact monogram letter "L" formed with a subtle hand-crafted woven or stitched motif suggesting craft and homegrown makers — warm and characterful yet clean. Centered, square, on a fully transparent background, legible at 40px. Palette of deep forest green (#20281F / #2D3E33), warm brass gold (#9C7A3C) and soft cream (#EFEBE1). Clean geometry, generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Jay Gatsby — West Egg
**Files:** `public/photos/jay-gatsby.jpg` · `public/logos/west-egg.png`

**Headshot**
```text
Professional corporate headshot of a charismatic man in his late 30s, immaculately groomed with a confident warm smile, polished and magnetic. Short neatly styled hair. Wearing a well-cut modern suit jacket. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "West Egg", an experiential hospitality brand. An elegant, subtly art-deco-inspired interlocked "WE" monogram with refined geometric lines and a touch of brass gold — premium and celebratory but minimal. Centered, square, on a fully transparent background, legible at 40px. Palette of deep forest green (#20281F / #2D3E33), warm brass gold (#9C7A3C) and soft cream (#EFEBE1). Clean geometry, generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Sherlock Holmes — Baker Street
**Files:** `public/photos/sherlock-holmes.jpg` · `public/logos/baker-street.png`

**Headshot**
```text
Professional corporate headshot of a man in his early 40s, lean with sharp angular features and keen perceptive eyes, composed and analytical. Dark hair. Wearing an understated dark shirt or slim blazer. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Baker Street", an AI fraud-detection and security company. An abstract geometric mark suggesting a magnifier lens or keyhole resolving into a circuit node — precise and intelligent. Centered, square, on a fully transparent background, legible at 40px. Palette of deep forest green (#20281F / #2D3E33) with a single warm brass-gold (#9C7A3C) accent and soft cream (#EFEBE1). Clean geometry, generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Jane Eyre — Thornfield Learning
**Files:** `public/photos/jane-eyre.jpg` · `public/logos/thornfield.png`

**Headshot**
```text
Professional corporate headshot of a woman in her early 30s, calm and composed with a quietly warm expression, principled and understated. Dark hair pulled back neatly. Wearing simple, elegant professional attire. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Thornfield Learning", an edtech tutoring platform. A friendly approachable emblem combining an open book or page with a small growing leaf/sprout, suggesting learning and growth. Rounded clean geometry. Centered, square, on a fully transparent background, legible at 40px. Palette of deep forest green (#20281F / #2D3E33) and soft cream (#EFEBE1) with optional brass-gold (#9C7A3C) accent. Generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Edmond Dantès — Château Capital
**Files:** `public/photos/edmond-dantes.jpg` · `public/logos/chateau-capital.png`

**Headshot**
```text
Professional corporate headshot of a refined man around 40, Mediterranean French, with composed worldly confidence and a subtle steadiness. Dark hair flecked with grey. Wearing an impeccably tailored jacket. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Château Capital", a modern wealth/fintech platform. A poised geometric "C" (or interlocked "CC") with a subtle nod to a tower or keystone, conveying trust and permanence. Centered, square, on a fully transparent background, legible at 40px. Palette of deep forest green (#20281F / #2D3E33) and warm brass gold (#9C7A3C). Restrained and premium, generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Phileas Fogg — Reform Logistics
**Files:** `public/photos/phileas-fogg.jpg` · `public/logos/reform.png`

**Headshot**
```text
Professional corporate headshot of a precise, unflappable English man around 50, impeccably neat with a calm punctual demeanor. Tidy greying hair and a trimmed beard. Wearing a crisp shirt and a fine-gauge blazer. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Reform Logistics", a precision global-logistics company. An abstract mark suggesting clockwork precision and forward motion — a circular arrow or compass formed from clean geometric segments, exact and engineered. Centered, square, on a fully transparent background, legible at 40px. Palette of deep forest green (#20281F / #2D3E33) with a warm brass-gold (#9C7A3C) accent. Generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Mina Harker — Harker Health
**Files:** `public/photos/mina-harker.jpg` · `public/logos/harker-health.png`

**Headshot**
```text
Professional corporate headshot of a woman in her early 30s, thoughtful and meticulous with a warm reassuring presence. Tidy hair. Wearing clean modern professional attire. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Harker Health", a preventive-health and longevity platform. A calm clinical-yet-warm emblem combining a subtle plus/cross or pulse line with an organic curve — balanced and trustworthy. Centered, square, on a fully transparent background, legible at 40px. Palette of soft green (#2D3E33) and cream (#EFEBE1) with an optional brass-gold (#9C7A3C) accent. Generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Becky Sharp — Vanity
**Files:** `public/photos/becky-sharp.jpg` · `public/logos/vanity.png`

**Headshot**
```text
Professional corporate headshot of a vivacious woman around 30, sharp and stylish with an expressive confident smile and lively eyes. Fashionable modern blazer, chic and charismatic. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Vanity", a bold social-commerce brand. A confident fashionable "V" monogram with crisp high-contrast strokes and a hint of editorial glamour, but flat and minimal. Centered, square, on a fully transparent background, legible at 40px. Palette of warm brass gold (#9C7A3C) and deep forest green (#20281F). Generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Captain Nemo — Nautilus
**Files:** `public/photos/captain-nemo.jpg` · `public/logos/nautilus.png`

**Headshot**
```text
Professional corporate headshot of an intense, independent man around 50, weathered and visionary with a steady searching gaze. Dark hair greying, short beard. Wearing dark, practical technical-but-refined attire. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Nautilus", an ocean-carbon and offshore-energy deep-tech company. A clean geometric nautilus spiral / shell motif, precise and scientific. Centered, square, on a fully transparent background, legible at 40px. Palette of deep teal-green (#20281F / #2D3E33) with a warm brass-gold (#9C7A3C) accent. Generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Dorothea Brooke — Middlemarch
**Files:** `public/photos/dorothea-brooke.jpg` · `public/logos/middlemarch.png`

**Headshot**
```text
Professional corporate headshot of a woman in her early 30s, earnest and sincere with a warm idealistic expression, understated and elegant. Soft natural hair. Wearing simple refined attire. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Middlemarch", an impact foundation. A quiet dignified emblem — a small radiating sun or set of interlinked circles suggesting community and quiet good. Warm, humble, understated. Centered, square, on a fully transparent background, legible at 40px. Palette of soft cream (#EFEBE1) and forest green (#2D3E33) with an optional brass-gold (#9C7A3C) accent. Generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Ebenezer Scrooge — Marley & Co
**Files:** `public/photos/ebenezer-scrooge.jpg` · `public/logos/marley-co.png`

**Headshot**
```text
Professional corporate headshot of a shrewd man in his 60s with intelligent eyes that have softened into warmth, distinguished and reformed-generous. Grey hair. Wearing a classic conservative suit. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Marley & Co", a growth-equity firm. A traditional trusted "M" monogram (or "M&Co") with a subtle ledger/anchor solidity — conservative and established. Centered, square, on a fully transparent background, legible at 40px. Palette of deep forest green (#20281F / #2D3E33) with a warm brass-gold (#9C7A3C) accent. Generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Allan Quatermain — Solomon
**Files:** `public/photos/allan-quatermain.jpg` · `public/logos/solomon.png`

**Headshot**
```text
Professional corporate headshot of a rugged experienced man around 50, tanned and weathered like someone who works in the field, calm and capable. Short hair, light stubble. Wearing a practical but smart jacket. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Solomon", a critical-minerals exploration company using AI to map the subsurface. An abstract faceted mineral/crystal or contour-map motif, strong and geological. Centered, square, on a fully transparent background, legible at 40px. Palette of deep forest green (#20281F / #2D3E33) with warm brass-gold (#9C7A3C) facets. Generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Natasha Rostova — Rostova
**Files:** `public/photos/natasha-rostova.jpg` · `public/logos/rostova.png`

**Headshot**
```text
Professional corporate headshot of a radiant woman in her late 20s, warm and vivacious with expressive eyes and creative energy, stylish and effortless. Wearing a chic creative-professional look. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Rostova", a creative brand studio. An elegant editorial "R" monogram with a graceful, slightly artistic stroke — refined and expressive but clean and flat. Centered, square, on a fully transparent background, legible at 40px. Palette of warm brass gold (#9C7A3C) and soft cream (#EFEBE1) on deep green. Generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Heathcliff — Wuthering
**Files:** `public/photos/heathcliff.jpg` · `public/logos/wuthering.png`

**Headshot**
```text
Professional corporate headshot of an intense brooding man around 40, with strong dark features and a driven, smoldering presence held in check. Dark tousled hair. Wearing a dark jacket, rugged yet sharp. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Wuthering", a renewable-energy developer. An abstract mark suggesting wind and motion — sweeping curved lines or a stylized turbine/gust over a moor horizon, bold and dynamic. Centered, square, on a fully transparent background, legible at 40px. Palette of deep forest green (#20281F / #2D3E33) with a warm brass-gold (#9C7A3C) accent. Generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Hester Prynne — Scarlet
**Files:** `public/photos/hester-prynne.jpg` · `public/logos/scarlet.png`

**Headshot**
```text
Professional corporate headshot of a woman in her early 30s, dignified and resilient with quiet composed strength and steady eyes. Simple elegant attire, understated confidence. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Scarlet", a digital-identity and privacy company. A single bold confident emblem — a clean monogram "S" or a shield/seal with one decisive accent stroke, suggesting owned identity and protection. Centered, square, on a fully transparent background, legible at 40px. One warm brass-gold (#9C7A3C) accent on deep forest green (#20281F). Generous negative space, no gradients, no 3D, no drop shadows.
```

---

## Marianne Dashwood — Dashwood Studio
**Files:** `public/photos/marianne-dashwood.jpg` · `public/logos/dashwood.png`

**Headshot**
```text
Professional corporate headshot of an expressive woman in her mid-20s with artistic warmth and passion and bright engaged eyes, creative-elegant style. Soft natural hair. Wearing a refined creative outfit. Head-and-shoulders, centered, facing camera with a natural approachable expression. Square 1:1 with comfortable headroom and even space around the shoulders, eyes on the upper third. Soft even editorial studio lighting, gentle warm color grade, plain softly out-of-focus warm greige backdrop (tones around #E7E1D4 / #EFEBE1). Photorealistic, sharp focus on the eyes, shallow depth of field. No text, no logos, no props, no hands.
```

**Logo**
```text
Minimal modern flat vector logo for "Dashwood Studio", a product-design studio. A refined minimal "D" monogram with an elegant precise cut and generous negative space — design-led and tasteful. Centered, square, on a fully transparent background, legible at 40px. Deep forest green (#20281F / #2D3E33) or warm brass-gold (#9C7A3C). No gradients, no 3D, no drop shadows.
```
