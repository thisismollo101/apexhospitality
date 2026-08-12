import BgVideo from './BgVideo';
import Carousel from './Carousel';
import Faq, { type Entry } from './Faq';
import './style.css';

export const metadata = { title: 'Sample Page One' };

/**
 * Sample Page One — a rebuild of revolut.com/business/bills/.
 *
 * Body only: no header, no footer, as asked. Copy is theirs verbatim; the
 * layout, type ramp and carousel geometry are transcribed from their rendered
 * stylesheet in ./style.css.
 *
 * Every asset is local. Revolut's own images are product screenshots on their
 * CDN, so the slots below carry stand-ins instead — swap the paths in MEDIA and
 * nothing else has to move.
 */
const MEDIA = {
  heroVideo: 'international',
  bandVideo: 'accommodation',
  cards: ['9x16/3', '9x16/5', '9x16/1', '9x16/2', '9x16/6'],
  phones: ['9x16/7', '9x16/4', '9x16/2'],
  contained: '1x1/3',
  avatar: 'avatar/4',
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

const FAQ: Entry[] = [
  {
    q: 'What is Revolut BillPay?',
    a: [
      'Revolut BillPay is automated accounting software that syncs with your existing tools to let you process, pay, and manage all of your business bills with less manual effort.',
      'It helps your team stay on top of the entire accounts payable process by automating admin-heavy tasks like extracting accounting and payment data, chasing approvals, and syncing financial records with your accounting software. Plus, you can do all this from one place, saving even more time and effort.',
    ],
  },
  {
    q: 'What are the benefits of using Revolut BillPay?',
    a: [
      'Revolut BillPay saves accountant and finance teams valuable time by reducing manual admin. The investment service Odin saved their team over 3 hours per week with this feature.',
      'Revolut BillPay also helps you reduce errors on data extraction, and ensures approval workflows are fully automated. What’s more, all your financial records are synced to your accounting software automatically, so you don’t need to update them yourself.',
    ],
  },
  {
    q: 'What is a purchase order and why use it?',
    a: [
      'A purchase order is an official document sent to a supplier that confirms what you’re buying, in what quantity, and at what price. Purchase orders help businesses control spend, streamline approvals, and create a clear audit trail. By defining details upfront, they reduce errors or disputes — leading to smoother operations and stronger supplier relationships.',
      'You can create, approve, and manage purchase orders in Revolut Business, giving you full control before any payment is made.',
    ],
  },
  {
    q: 'Why do I need to integrate and what software do you connect to?',
    a: [
      'Revolut BillPay connects with Xero, FreeAgent, NetSuite, and QuickBooks Online, and we’re always adding more integrations.',
      'When you connect, we sync your accounting info, chart of accounts, tax rates, and supplier details. We’ll also transfer bills awaiting payment, and any bill details you added via your Business account. Once the bill payments are made, those transactions sync automatically to your accounting software too.',
      'Currently, purchase orders aren’t integrated with external platforms. However, you can download them and send them to your suppliers directly.',
    ],
  },
  {
    q: 'How does Revolut Business eliminate data entry?',
    a: [
      'We use Optical Character Recognition (OCR) to extract supplier information, payment details, and accounting info from your bill — including important details like due dates and line items.',
      'Your Business account will also record the tax rates for each supplier, so you don’t need to check your records every time you upload a bill. Plus, our system can suggest categories based on your previous bills, allowing you to track which expenses are linked to different projects.',
    ],
  },
];

export default function SamplePageOne() {
  return (
    <main className="rv1">
      <a className="backbar" href="/samples">← References</a>

      {/* 1 ── hero: full-bleed video, copy left, two CTAs */}
      <section className="hero">
        <div className="heromedia"><BgVideo name={MEDIA.heroVideo} /></div>
        <div className="wrap heroin">
          <div className="herocopy">
            <div className="herotext">
              <p className="t-caption">Revolut BillPay and Purchase Orders</p>
              <h1 className="t-h1">Smarter spending. Total control.</h1>
              <div className="t-lede">
                <p>Manage company spend effortlessly with fully integrated purchasing, billing, and approvals.</p>
              </div>
            </div>
            <div className="herobtns">
              <a className="btn btn-solid" href="#">Pay bills</a>
              <a className="btn btn-outline" href="#">Speak to Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* 2 ── feature items, cards variant */}
      <section>
        <div className="feat feat-center is-bleed pad-b">
          <div className="copy cards-copy">
            <h2 className="t-h2">Sync your company spend</h2>
            <span className="lede t-lede">
              <p>
                Bring purchasing and payments together, all in one place — from spend requests
                and purchase orders to receipts and reconciliation.
              </p>
            </span>
            <span className="cta"><a className="btn btn-solid" href="#">Get started</a></span>
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

      {/* 3 ── feature items, media variant: looping video behind black copy */}
      <section className="mediaband">
        <div className="bandmedia"><BgVideo name={MEDIA.bandVideo} /></div>
        <div className="feat feat-center">
          <div className="copy copy-onlight">
            <h2 className="t-h2s">Pay suppliers in 150+ destinations with Revolut BillPay</h2>
            <span className="lede t-lede">
              <p>
                Set your supplier payments to autopilot, while staying in complete control with
                built-in scheduling and approval rules.
              </p>
            </span>
            <span className="cta"><a className="btn btn-solid" href="#">Get started</a></span>
          </div>
          <div className="mediacol is-spacer" />
        </div>
      </section>

      {/* 4 ── feature items, carousel variant: copy left, phones right */}
      <section>
        <div className="feat feat-split pad-b">
          <div className="copy copy-split">
            <h2 className="t-h2s">All your purchasing, fully integrated</h2>
            <span className="lede t-lede">
              <p>
                Manage purchase orders, approvals, and vendor details without leaving your
                Business account. Purchase records stay organised and automatically sync to your
                billing workflow.
              </p>
            </span>
            <span className="cta"><a className="btn btn-solid" href="#">Get started</a></span>
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

      {/* 5 ── feature items, media variant reversed: image left, copy right */}
      <section>
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
            <span className="cta"><a className="btn btn-solid" href="#">Get started</a></span>
          </div>

          <div className="mediacol">
            <div className="mediafit" style={{ aspectRatio: '0.75' }}>
              <img src={`/media/samples/${MEDIA.contained}.jpg`} alt="" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* 6 ── testimonial */}
      <section className="wrap">
        <div className="quote">
          <div className="quotein">
            <span className="avatar">
              <img src={`/media/samples/${MEDIA.avatar}.jpg`} alt="" loading="lazy" />
            </span>
            <span className="t-card">
              “Revolut BillPay has saved our business at least 3 hours per week. Being able to
              code bills, get approvals, and make payments quickly keeps our finance team and
              suppliers happy.”
            </span>
            <span className="attrib t-body">Lucy Bates, Financial Operations Lead • Join Odin</span>
          </div>
        </div>
      </section>

      {/* 7 ── FAQ */}
      <section className="wrap" style={{ paddingBlock: 'var(--s48)' }}>
        <div className="faq">
          <div className="faqhead">
            <p className="t-caption">Need more help?</p>
            <h2 className="t-h2">Revolut BillPay FAQs</h2>
          </div>
          <Faq items={FAQ} />
        </div>
      </section>

      {/* 8/9 ── footnotes */}
      <section className="wrap note">
        <p className="t-small">
          Revolut BillPay integrations and approval routes available to customers on Grow, Scale,
          and Enterprise plans.
        </p>
      </section>

      <section className="wrap note note-last">
        <p className="t-body"><a href="#">Revolut BillPay T&amp;Cs apply.</a></p>
      </section>
    </main>
  );
}
