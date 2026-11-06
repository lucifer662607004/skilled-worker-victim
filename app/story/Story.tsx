"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BEATS, SECTIONS, type Beat, type ImageSet } from "./content";
import ShareButton from "./ShareButton";

/** Scroll distance per beat, in viewport heights. */
const UNIT = 1.25;
/** Extra scroll (in beats) that holds the final beat before the footer. */
const HOLD = 0.45;

const SECTION_START = SECTIONS.map((_, i) => SECTIONS.slice(0, i).reduce((n, s) => n + s.beats.length, 0));
const ACT_INDEX = BEATS.findIndex((b) => b.id === "act");
const nf = new Intl.NumberFormat("en-GB");

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function SceneImage({ image, priority }: { image: ImageSet; priority: boolean }) {
  const common = { alt: image.alt, sizes: "100vw", quality: 75 };
  const {
    props: { srcSet: wideSet },
  } = getImageProps({ ...common, ...image.wide });
  const {
    props: { srcSet: tallSet, ...rest },
  } = getImageProps({ ...common, ...image.tall });
  return (
    <picture>
      <source media="(min-aspect-ratio: 4/5)" srcSet={wideSet} />
      <source srcSet={tallSet} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
      <img {...rest} className="scene-img" fetchPriority={priority ? "high" : "auto"} />
    </picture>
  );
}

function BeatContent({ beat, index, statRef }: { beat: Beat; index: number; statRef: (k: string, el: HTMLElement | null) => void }) {
  const titleClass =
    beat.titleTone === "amber" ? "text-amber" : beat.titleTone === "coral" ? "text-coral" : "text-white";
  const maxTax = beat.compare ? Math.max(...beat.compare.rows.map((r) => r.tax)) : 1;
  return (
    <div className={beat.hero ? "beat-card beat-card--hero" : "beat-card"}>
      {beat.kicker && <p className="kicker">{beat.kicker}</p>}
      {beat.label && <p className="beat-label">{beat.label}</p>}
      {beat.title &&
        (beat.hero ? (
          <h1 className={`hero-title ${titleClass}`}>{beat.title}</h1>
        ) : (
          <h2 className={`beat-title ${titleClass}`}>{beat.title}</h2>
        ))}
      {beat.bigText && (
        <p className={`big-text ${beat.bigText.tone === "amber" ? "text-amber" : "text-coral"}`}>{beat.bigText.text}</p>
      )}
      {beat.stats && (
        <div className="stats">
          {beat.stats.map((s, j) => (
            <div key={j} className="stat">
              <span className={`stat-value ${s.tone === "coral" ? "text-coral" : s.tone === "white" ? "text-white" : "text-amber"}`}>
                {s.prefix}
                <span ref={(el) => statRef(`${index}-${j}`, el)}>{nf.format(s.value)}</span>
                {s.suffix}
              </span>
              {s.label && <span className="stat-label">{s.label}</span>}
            </div>
          ))}
        </div>
      )}
      {beat.lead && <p className={beat.hero ? "hero-lead" : "beat-lead"}>{beat.lead}</p>}
      {beat.quote && (
        <blockquote className="beat-quote">
          <p>&ldquo;{beat.quote.text}&rdquo;</p>
          <cite>{beat.quote.cite}</cite>
        </blockquote>
      )}
      {beat.body && <p className="beat-body">{beat.body}</p>}
      {beat.compare && (
        <div className="compare">
          {beat.compare.rows.map((r) => (
            <div key={r.who} className="compare-row">
              <div className="compare-head">
                <span>{r.who}</span>
                <span className={r.tone === "amber" ? "text-amber" : "text-coral"}>{r.wait}</span>
              </div>
              <div className="compare-track">
                <div
                  className={`compare-bar ${r.tone === "amber" ? "bg-amber" : "bg-coral"}`}
                  style={{ "--w": `${(r.tax / maxTax) * 100}%` } as CSSProperties}
                >
                  <span>~£{nf.format(r.tax)} a year</span>
                </div>
              </div>
            </div>
          ))}
          <p className="compare-note">{beat.compare.note}</p>
        </div>
      )}
      {beat.asks && (
        <ol className="asks">
          {beat.asks.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ol>
      )}
      {beat.cta && (
        <div className="cta-row">
          <a className="btn btn-primary" href="https://www.writetothem.com/" target="_blank" rel="noopener noreferrer">
            Write to your MP
          </a>
          <ShareButton />
        </div>
      )}
      {beat.source && <p className="beat-source">Source: {beat.source}</p>}
      {beat.hero && (
        <p className="scroll-cue" aria-hidden="true">
          Scroll to see why <span className="scroll-cue-arrow">↓</span>
        </p>
      )}
    </div>
  );
}

export default function Story() {
  const trackRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const beatRefs = useRef<(HTMLElement | null)[]>([]);
  const statRefs = useRef(new Map<string, HTMLElement>());
  const shadeRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState<ReadonlySet<number>>(() => new Set([0, 1]));

  const scrollToBeat = (k: number, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    if (!track) return;
    const unit = (track.offsetHeight - window.innerHeight) / (BEATS.length - 1 + HOLD);
    window.scrollTo({ top: track.offsetTop + k * unit, behavior });
  };

  useEffect(() => {
    const mqTall = window.matchMedia("(max-aspect-ratio: 4/5)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let lastActive = -1;
    let lastSection = -1;

    const update = () => {
      raf = 0;
      const track = trackRef.current;
      if (!track) return;
      const vh = window.innerHeight;
      const unit = (track.offsetHeight - vh) / (BEATS.length - 1 + HOLD);
      const u = -track.getBoundingClientRect().top / unit;
      const tallMode = mqTall.matches;
      const reduce = mqReduce.matches;

      SECTIONS.forEach((s, i) => {
        const el = layerRefs.current[i];
        if (!el) return;
        const k0 = SECTION_START[i];
        const k1 = k0 + s.beats.length - 1;
        const enter = i === 0 ? 1 : clamp01((u - (k0 - 0.8)) / 0.55);
        const nextEnter = i + 1 < SECTIONS.length ? clamp01((u - (SECTION_START[i + 1] - 0.8)) / 0.55) : 0;
        const local = clamp01((u - (k0 - 0.8)) / (k1 + 0.5 - (k0 - 0.8)));
        const [c0, c1] = tallMode ? s.camera.tall : s.camera.wide;
        const t = reduce ? 0 : easeInOut(local);
        el.style.setProperty("--e", (reduce ? enter : easeInOut(enter)).toFixed(4));
        el.style.setProperty("--cs", lerp(c0[0], c1[0], t).toFixed(4));
        el.style.setProperty("--cx", `${lerp(c0[1], c1[1], t).toFixed(3)}%`);
        el.style.setProperty("--cy", `${lerp(c0[2], c1[2], t).toFixed(3)}%`);
        el.style.visibility = enter > 0 && nextEnter < 1 ? "visible" : "hidden";
      });

      let right = 0;
      BEATS.forEach((b, k) => {
        const el = beatRefs.current[k];
        if (!el) return;
        const d = u - k;
        const fadeIn = k === 0 ? 1 : smooth(-0.5, -0.22, d);
        const fadeOut = k === BEATS.length - 1 ? 1 : 1 - smooth(0.22, 0.5, d);
        const o = fadeIn * fadeOut;
        const p = reduce ? 1 : smooth(-0.45, -0.05, d);
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${(reduce ? 0 : -d * 70).toFixed(1)}px, 0)`;
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
        el.style.setProperty("--p", p.toFixed(3));
        if (b.align === "right") right += o;
        b.stats?.forEach((s, j) => {
          const n = statRefs.current.get(`${k}-${j}`);
          if (!n) return;
          const v = p >= 1 ? s.value : Math.round((s.value * p) / 1000) * 1000;
          n.textContent = nf.format(v);
        });
      });

      shadeRef.current?.style.setProperty("--r", clamp01(right).toFixed(3));
      barRef.current?.style.setProperty("--progress", clamp01(u / (BEATS.length - 1)).toFixed(4));
      railRef.current?.classList.toggle("is-hidden", track.getBoundingClientRect().bottom < vh * 0.6);

      const a = Math.max(0, Math.min(BEATS.length - 1, Math.round(u)));
      if (a !== lastActive) {
        lastActive = a;
        setActive(a);
      }
      const sec = BEATS[a].section;
      if (sec !== lastSection) {
        lastSection = sec;
        setMounted((prev) => {
          const want = [sec - 1, sec, sec + 1, sec + 2].filter((x) => x >= 0 && x < SECTIONS.length);
          if (want.every((x) => prev.has(x))) return prev;
          return new Set([...prev, ...want]);
        });
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    const hash = window.location.hash.slice(1);
    const hashIndex = BEATS.findIndex((b) => b.id === hash);
    if (hashIndex > 0) scrollToBeat(hashIndex, "instant");

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mqTall.addEventListener("change", onScroll);
    mqReduce.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mqTall.removeEventListener("change", onScroll);
      mqReduce.removeEventListener("change", onScroll);
    };
  }, []);

  const statRef = (key: string, el: HTMLElement | null) => {
    if (el) statRefs.current.set(key, el);
    else statRefs.current.delete(key);
  };

  return (
    <>
      <header className="site-header">
        <div ref={barRef} className="progress" aria-hidden="true" />
        <a
          href="#top"
          className="wordmark"
          onClick={(e) => {
            e.preventDefault();
            scrollToBeat(0);
          }}
        >
          <span className="wordmark-dot" aria-hidden="true" />
          Keep the Promise
        </a>
        <a
          href="#act"
          className="btn btn-primary btn-small"
          onClick={(e) => {
            e.preventDefault();
            scrollToBeat(ACT_INDEX);
          }}
        >
          Write to your MP
        </a>
      </header>

      <nav ref={railRef} className="rail" aria-label="Story progress">
        <ol>
          {BEATS.map((b, k) => (
            <li key={b.id}>
              <button
                type="button"
                className={k === active ? "rail-dot is-active" : "rail-dot"}
                aria-label={b.rail}
                aria-current={k === active ? "step" : undefined}
                onClick={() => scrollToBeat(k)}
              >
                <span className="rail-label">{b.rail}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div
        ref={trackRef}
        className="track"
        style={{ height: `calc(100svh + ${((BEATS.length - 1 + HOLD) * UNIT * 100).toFixed(1)}svh)` }}
      >
        <div className="stage">
          {SECTIONS.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              className="layer"
              data-t={s.transition}
              style={{ zIndex: i + 1, visibility: i === 0 ? "visible" : "hidden", "--e": i === 0 ? 1 : 0 } as CSSProperties}
            >
              <div className="cam">{mounted.has(i) && <SceneImage image={s.image} priority={i === 0} />}</div>
            </div>
          ))}
          <div ref={shadeRef} className="shade" aria-hidden="true" />
          <div className="beats">
            {BEATS.map((b, k) => (
              <section
                key={b.id}
                id={`beat-${b.id}`}
                aria-label={b.rail}
                ref={(el) => {
                  beatRefs.current[k] = el;
                }}
                className={b.align === "right" ? "beat beat--right" : "beat"}
                style={{ opacity: k === 0 ? 1 : 0, pointerEvents: k === 0 ? "auto" : "none" }}
                onFocus={() => {
                  if (k !== active) scrollToBeat(k);
                }}
              >
                <BeatContent beat={b} index={k} statRef={statRef} />
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
