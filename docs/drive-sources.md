# Drive source material

The product copy in `src/data/products.json` is written against the specifications
in Google Drive, owned by aidan@theatlaselite.com. Drive is the source of truth for
what a product *is*; this repo is the source of truth for how it reads on the page.

Root: **AAA Apex - Everything Live** → **Final Boss Descriptions**
`https://drive.google.com/drive/folders/1acsy_vEykovZLQugZg2IfCAeXj8pub_7`

Each subfolder holds one `apex-product-N-*.md` specification, laid out in six
sections: technical definition, production flow, target personas, psychological
drivers, commercial impact, and blueprint/script. Those map onto the product page
template in `src/components/ProductDetail.tsx` as:

| Spec section | Page section | JSON field |
| --- | --- | --- |
| 1. Technical & strategic definition | lede | `concept` |
| 2. Production flow & stack | How it is produced | `pipeline` |
| 3. Target persona | Who uses this | `personas` |
| 4. Psychological & behavioral drivers | Why it works | `why` |
| 5. Commercial & economic impact | The owner’s math | `math` |
| 6. Blueprint & script template | The blueprint | `blueprint` |

## Folder → route

| Drive folder | Spec | Route |
| --- | --- | --- |
| Apex 365 | `apex-product-1-365.md` | — (no route yet) |
| Apex Anthem | `apex-product-2-anthem (1).md` | `/products/signature-films/anthem` |
| Apex Flagship | `apex-product-3-flagship.md` | `/products/signature-films/flagship` |
| Apex International | `apex-product-4-international.md` | `/products/signature-films/international` |
| Dining | `apex-product-5-dining.md` | `/products/billboards/dining` |
| Accomodation | `apex-product-6-accommodations.md` | `/products/billboards/accommodation` |
| Grounds & Recreation | `apex-product-7-grounds-recreation.md` | `/products/billboards/grounds-recreation` |
| Health & Wellness | `apex-product-8-wellness.md` | `/products/specialized-venues/health-wellness` |
| Weddings | `apex-product-9-weddings.md` | `/products/specialized-venues/weddings` |
| Corporate Events | `apex-product-10-corporate-mice.md` | `/products/specialized-venues/corporate-events` |
| Apex Events | `apex-product-11-events.md` | `/products/events-promotions/events` |
| Apex Promotions | `apex-product-12-promotions.md` | `/products/events-promotions/promotions` |
| Apex Live | `apex-product-13-live.md` | `/products/events-promotions/live` |
| Apex Invite | `apex-product-14-invite.md` | `/products/vip-guest-services/invite` |
| Apex Welcome | `apex-product-15-welcome.md` | `/products/vip-guest-services/welcome` |
| Apex Goodbye | — (folder empty) | `/products/vip-guest-services/goodbye` |
| Apex Atlas | `apex-product-17-atlas.md` | `/products/guidebooks/atlas` |
| On Site Guide | `apex-product-18-onsite-guide.md` | `/products/guidebooks/on-site` |
| Off Site Guide | `apex-product-19-offsite-guide.md` | `/products/guidebooks/off-site` |

## Page wireframes

Product specs say what a product *is*. Page wireframes say what its landing page
*does* — sections, widgets, layout, and the copy in place. They live in
`docs/pages/`, one file per page, and are committed so the spec travels with the
code it describes.

| Page | Wireframe | Route |
| --- | --- | --- |
| Apex Welcome | `docs/pages/apex-welcome-landing-v4.md` | `/products/vip-guest-services/welcome` |

A page with a wireframe gets a real route file and is built to it. Everything
else still renders through the shared `ProductDetail` template off
`products.json`.

One deliberate departure from the Welcome wireframe: it specifies a dark
charcoal-and-gold design system with its own sticky header and Playfair Display
headlines. That is not used. The page is reached from the Apex header and has to
look like the rest of the site, so it is built on v34's tokens — light ground,
Inter, the shared `.btn` and `.pwrap`. The structure, the copy and the
seven-section order are the wireframe's.

## Status

**Apex Welcome** has a full landing page and product copy written from source.
The other seventeen routes still carry the short three-field placeholder copy
(`concept` / `math` / `quote`) and have not been reconciled against Drive.
