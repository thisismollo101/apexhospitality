import './style.css';

export const metadata = { title: 'Placeholder kit' };

/**
 * Not a Revolut recreation — the inventory of stand-in assets the recreations
 * draw on, so a page never has to reach for an external URL to look finished.
 * Regenerate with scripts/make-sample-images.sh.
 */
const SHAPES = [
  { dir: '16x9', label: '16 : 9', px: '1600 × 900', use: 'heroes, wide feature blocks, video stills' },
  { dir: '4x3', label: '4 : 3', px: '1200 × 900', use: 'cards, grid tiles' },
  { dir: '1x1', label: '1 : 1', px: '900 × 900', use: 'square tiles, app screenshots' },
  { dir: '9x16', label: '9 : 16', px: '720 × 1280', use: 'phone frames, story rails' },
];

const N = 7;
const LOGOS = 6;

export default function Kit() {
  return (
    <main className="kit">
      <div className="in">
        <a className="back" href="/samples">← All references</a>
        <h1>Placeholder kit</h1>
        <p className="lede">
          Frames cut from the seven card clips, so a sample page shows real
          hospitality photography rather than grey boxes. Reference them directly
          as <code>/media/samples/&lt;shape&gt;/&lt;n&gt;.jpg</code> — indexes run
          1&nbsp;to&nbsp;{N} and the same index is the same scene in every shape.
        </p>

        {SHAPES.map((s) => (
          <section key={s.dir}>
            <h2>{s.label}</h2>
            <p className="path">
              <code>/media/samples/{s.dir}/1.jpg</code> … <code>{N}.jpg</code> · {s.px} · {s.use}
            </p>
            <div className={`row r${s.dir}`}>
              {Array.from({ length: N }, (_, i) => (
                <img
                  key={i}
                  src={`/media/samples/${s.dir}/${i + 1}.jpg`}
                  alt=""
                  width={1600}
                  height={900}
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2>Avatars</h2>
          <p className="path">
            <code>/media/samples/avatar/1.jpg</code> … <code>{N}.jpg</code> · 200 × 200 · testimonials, team rows
          </p>
          <div className="row ravatar">
            {Array.from({ length: N }, (_, i) => (
              <img key={i} src={`/media/samples/avatar/${i + 1}.jpg`} alt="" width={200} height={200} loading="lazy" />
            ))}
          </div>
        </section>

        <section>
          <h2>Logos</h2>
          <p className="path">
            <code>/media/samples/logo/1.svg</code> … <code>{LOGOS}.svg</code> · invented names, single
            colour · logo walls, &ldquo;trusted by&rdquo; strips. Drawn with{' '}
            <code>currentColor</code>, so inline them rather than using <code>&lt;img&gt;</code> if the
            wall needs to recolour.
          </p>
          <div className="row rlogo">
            {Array.from({ length: LOGOS }, (_, i) => (
              <img key={i} src={`/media/samples/logo/${i + 1}.svg`} alt="" height={40} loading="lazy" />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
