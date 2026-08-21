import BgVideo from './rv/BgVideo';
import Carousel from './rv/Carousel';

/**
 * The four feature bands lifted from /samples/page-one, sections 2 to 5.
 *
 * These do not go through page.tsx's section loop with the rest. The other
 * twenty-two are the site's own .wsec / .pwrap / .wsec-head shape and differ
 * only in what sits inside; these four are Revolut's layout end to end — their
 * own grid, their own type ramp, their own dark palette — and forcing them into
 * a .wsec-head with a "Section N" tag over the top would only misdescribe them.
 *
 * Everything is wrapped in one .rv1. That class is where page-one's stylesheet
 * puts its token block, so --bg, --fg and the rest are redefined for this
 * subtree and nothing leaks out of it: the band runs dark on an otherwise light
 * page, which is what these sections were drawn for.
 */

const MEDIA = {
  bandVideo: 'accommodation',
  cards: ['9x16/3', '9x16/5', '9x16/1', '9x16/2', '9x16/6'],
  phones: ['9x16/7', '9x16/4', '9x16/2'],
  contained: '1x1/3',
};

const CARD_RATIO = 0.7086614173228346;
const PHONE_RATIO = 0.5625;

const CARDS = [
  'Smart approvals and error detection',
  'Pay suppliers in 150+ destinations',
  'Capture every bill detail in seconds',
  'Build & approve purchase orders',
  '2-way sync with your accounting software',
];

export default function Revolut() {
  return (
    <div className="rv1 w2rv">
      {/* 27 ── feature items, cards variant */}
      <section id="s27">
        <div className="feat feat-center is-bleed pad-b">
          <div className="copy cards-copy">
            <h2 className="t-h2">Sync your company spend</h2>
            <span className="lede t-lede">
              <p>
                Bring purchasing and payments together, all in one place — from spend requests and
                purchase orders to receipts and reconciliation.
              </p>
            </span>
            <span className="cta">
              <a className="btn btn-solid" href="#">
                Get started
              </a>
            </span>
          </div>

          <div className="cardstage" style={{ aspectRatio: String(CARD_RATIO) }}>
            <Carousel
              ratio={CARD_RATIO}
              label="Sync your company spend"
              items={CARDS.map((title, i) => ({
                key: title,
                label: title,
                node: (
                  <div className="cardface">
                    <img src={`/media/samples/${MEDIA.cards[i]}.jpg`} alt={title} loading="lazy" />
                    <span className="cardcopy">
                      <span className="t-card">{title}</span>
                    </span>
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      {/* 28 ── feature items, media variant: looping video behind black copy */}
      <section id="s28" className="mediaband">
        <div className="bandmedia">
          <BgVideo name={MEDIA.bandVideo} />
        </div>
        <div className="feat feat-center">
          <div className="copy copy-onlight">
            <h2 className="t-h2s">Pay suppliers in 150+ destinations with Revolut BillPay</h2>
            <span className="lede t-lede">
              <p>
                Set your supplier payments to autopilot, while staying in complete control with
                built-in scheduling and approval rules.
              </p>
            </span>
            <span className="cta">
              <a className="btn btn-solid" href="#">
                Get started
              </a>
            </span>
          </div>
          <div className="mediacol is-spacer" />
        </div>
      </section>

      {/* 29 ── feature items, carousel variant: copy left, phones right */}
      <section id="s29">
        <div className="feat feat-split pad-b">
          <div className="copy copy-split">
            <h2 className="t-h2s">All your purchasing, fully integrated</h2>
            <span className="lede t-lede">
              <p>
                Manage purchase orders, approvals, and vendor details without leaving your Business
                account. Purchase records stay organised and automatically sync to your billing
                workflow.
              </p>
            </span>
            <span className="cta">
              <a className="btn btn-solid" href="#">
                Get started
              </a>
            </span>
          </div>

          <div className="phonestage">
            <Carousel
              ratio={PHONE_RATIO}
              label="All your purchasing, fully integrated"
              items={MEDIA.phones.map((src, i) => ({
                key: src + i,
                label: `Screen ${i + 1}`,
                node: (
                  <div className="cardface">
                    <img src={`/media/samples/${src}.jpg`} alt="" loading="lazy" />
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </section>

      {/* 30 ── feature items, media variant reversed: image left, copy right */}
      <section id="s30">
        <div className="feat feat-split is-reversed">
          <div className="copy copy-split">
            <h2 className="t-h2">Keep team spend on your terms</h2>
            <span className="lede t-lede">
              <p>
                Set limits, approvals, and permissions that ensure spend stays aligned with your
                policies. Out-of-policy purchases are blocked automatically, so you can stay on
                budget without micromanaging.
              </p>
            </span>
            <span className="cta">
              <a className="btn btn-solid" href="#">
                Get started
              </a>
            </span>
          </div>

          <div className="mediacol">
            <div className="mediafit" style={{ aspectRatio: '0.75' }}>
              <img src={`/media/samples/${MEDIA.contained}.jpg`} alt="" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
