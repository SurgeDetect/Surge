// SurgeLanding.jsx — Vite-deployable React component, default export SurgeLanding.
// Auto-transformed from canvas-mode source by canvas-to-deploy.js.

import { useState } from "react";
import { Activity, ArrowDown, BarChart3, Calculator, Download, Eye, Filter, Github, Layers, LineChart, ShieldCheck, Sliders, Target, TrendingUp, Users, Zap } from "lucide-react";

const GITHUB_URL = "https://github.com/SurgeDetect/Surge";
const X_URL = "https://x.com/SurgeOnSOLL";
const PUMPFUN_URL = "https://pump.fun/";

const GitHubMark = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .7a11.3 11.3 0 0 0-3.57 22.02c.57.1.78-.25.78-.55v-2.16c-3.18.69-3.85-1.35-3.85-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.73-1.54-2.54-.29-5.21-1.27-5.21-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.11 1.17A10.8 10.8 0 0 1 12 5.92c.96 0 1.92.13 2.82.38 2.16-1.48 3.12-1.17 3.12-1.17.62 1.58.23 2.74.11 3.03.73.8 1.18 1.82 1.18 3.07 0 4.39-2.68 5.35-5.23 5.64.41.36.78 1.06.78 2.14v3.16c0 .3.2.66.79.55A11.3 11.3 0 0 0 12 .7Z" />
  </svg>
);

const XMark = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

// Runtime icon dispatcher for dynamic <Icon name={...}> usages.
const _LUCIDE_MAP = { "Github": Github, "ArrowDown": ArrowDown, "Eye": Eye, "Activity": Activity, "Users": Users, "Filter": Filter, "Download": Download, "TrendingUp": TrendingUp, "Sliders": Sliders, "Calculator": Calculator, "ShieldCheck": ShieldCheck, "BarChart3": BarChart3, "Zap": Zap, "Layers": Layers, "LineChart": LineChart, "Target": Target };
function DynIcon({ name, ...rest }) {
  const Cmp = _LUCIDE_MAP[name];
  if (!Cmp) return null;
  return <Cmp {...rest} />;
}

const COLORS = {
  canvas: "#060b16",
  surface: "#0e1825",
  border: "#233648",
  primary: "#69b4ca",
  bright: "#bec7c6",
  hover: "#5092a7",
  body: "#e5eaeb",
  muted: "#a29d97",
  faint: "#607c85",
  fadedHeadline: "rgba(190,199,198,0.34)",
};

const Eyebrow = ({ children, large = false, color }) => {
  if (large) {
    return (
      <div
        style={{
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.14em",
          color: color || COLORS.primary,
          marginBottom: 16,
          textTransform: "uppercase",
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      id="top"
      style={{
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        fontSize: 11,
        fontWeight: 400,
        letterSpacing: "0.12em",
        color: color || COLORS.faint,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
};

const DecisionBadge = ({ kind }) => {
  const styles = {
    PROMOTE: {
      background: COLORS.bright,
      color: COLORS.canvas,
      border: `1px solid ${COLORS.bright}`,
    },
    WATCH: {
      background: "rgba(105,180,202,0.15)",
      color: COLORS.primary,
      border: `1px solid ${COLORS.primary}`,
    },
    SCAN: {
      background: "transparent",
      color: COLORS.bright,
      border: `1px solid ${COLORS.bright}`,
    },
    REJECT: {
      background: COLORS.border,
      color: COLORS.muted,
      border: "1px solid transparent",
    },
  };
  return (
    <span
      style={{
        ...styles[kind],
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        fontSize: 11,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding: "4px 8px",
        borderRadius: 6,
        display: "inline-block",
        fontWeight: 500,
      }}
    >
      {kind}
    </span>
  );
};

const ScoreBar = ({ value, top = false }) => (
  <div
    style={{
      width: "100%",
      height: 6,
      background: "rgba(105,180,202,0.09)",
      borderRadius: 3,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${value}%`,
        height: "100%",
        background: top ? COLORS.bright : COLORS.primary,
        borderRadius: 3,
      }}
    />
  </div>
);

const StatusPill = ({ children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
      fontSize: 11,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: COLORS.muted,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 999,
      padding: "6px 12px",
    }}
  >
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: 999,
        background: COLORS.primary,
      }}
    />
    {children}
  </span>
);

const PrimaryCTA = ({ children, href = "#board" }) => {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-block",
        background: hover ? COLORS.hover : COLORS.primary,
        color: COLORS.canvas,
        padding: "12px 22px",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
        textDecoration: "none",
        transition: "background 0.15s ease",
      }}
    >
      {children}
    </a>
  );
};

const GhostLink = ({ children, href = "#" }) => {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        fontSize: 12,
        letterSpacing: "0.06em",
        color: hover ? "#fff" : COLORS.muted,
        textDecoration: "none",
        transition: "color 0.15s ease",
      }}
    >
      {children}
    </a>
  );
};

const Card = ({ children }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "linear-gradient(145deg, rgba(23,39,49,0.62), rgba(14,24,37,0.96) 44%)",
        border: `1px solid ${hover ? "rgba(105,180,202,0.52)" : COLORS.border}`,
        borderRadius: 12,
        padding: 24,
        transition: "border-color 0.18s ease",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
};

const NumberedCard = ({ num, icon, title, body }) => (
  <Card>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 28,
      }}
    >
      <div
        style={{
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          fontSize: 11,
          letterSpacing: "0.14em",
          color: COLORS.primary,
          fontWeight: 500,
        }}
      >
        {num}
      </div>
      <DynIcon name={icon} size={20} color={COLORS.muted}/>
    </div>
    <div
      style={{
        color: "#fff",
        fontSize: 18,
        fontWeight: 500,
        marginBottom: 10,
        letterSpacing: "-0.01em",
      }}
    >
      {title}
    </div>
    <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6 }}>
      {body}
    </div>
  </Card>
);

const HeroPanelRow = ({ token, sub, score, scoreTop, breadth, breadthLow, decision }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "140px 1fr 100px 100px 110px",
      alignItems: "center",
      gap: 16,
      padding: "14px 0",
      borderBottom: `1px solid ${COLORS.border}`,
    }}
    className="hero-row"
  >
    <div>
      <div
        style={{
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          color: "#fff",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {token}
      </div>
      <div
        style={{
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          color: COLORS.faint,
          fontSize: 11,
          marginTop: 2,
        }}
      >
        {sub}
      </div>
    </div>
    <ScoreBar value={score} top={scoreTop} />
    <div
      style={{
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        color: "#fff",
        fontSize: 14,
        textAlign: "right",
      }}
    >
      {score}
    </div>
    <div
      style={{
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        color: breadthLow ? COLORS.bright : COLORS.body,
        fontSize: 12,
        textAlign: "right",
      }}
    >
      {breadth}
    </div>
    <div style={{ textAlign: "right" }}>
      <DecisionBadge kind={decision} />
    </div>
  </div>
);

const BoardRow = ({ token, sub, score, scoreTop, breadth, breadthLow, venues, venuesLow, decision }) => (
  <div
    className="board-row"
    style={{
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 0.8fr 0.8fr 0.9fr",
      alignItems: "center",
      gap: 16,
      padding: "16px 0",
      borderBottom: `1px solid ${COLORS.border}`,
    }}
  >
    <div>
      <div
        style={{
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          color: "#fff",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {token}
      </div>
      <div
        style={{
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          color: COLORS.faint,
          fontSize: 11,
          marginTop: 2,
        }}
      >
        {sub}
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1 }}>
        <ScoreBar value={score} top={scoreTop} />
      </div>
      <div
        style={{
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          color: "#fff",
          fontSize: 13,
          width: 24,
          textAlign: "right",
        }}
      >
        {score}
      </div>
    </div>
    <div
      style={{
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        color: breadthLow ? COLORS.bright : COLORS.body,
        fontSize: 12,
      }}
    >
      {breadth}
    </div>
    <div
      style={{
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        color: venuesLow ? COLORS.bright : COLORS.body,
        fontSize: 12,
      }}
    >
      {venues}
    </div>
    <div>
      <DecisionBadge kind={decision} />
    </div>
  </div>
);

const SurgeLanding = () => {
  const [navHover, setNavHover] = useState(null);

  const navItems = [
    { label: "BOARD", href: "#board" },
    { label: "DOCTRINE", href: "#doctrine" },
    { label: "LOOP", href: "#loop" },
    { label: "GATES", href: "#gates" },
    { label: "LAUNCH", href: "#launch" },
  ];

  const doctrine = [
    {
      num: "01",
      icon: "Eye",
      title: "Real, not optical.",
      body:
        "A spike from one wallet on one venue is not a breakout. Surge weights breadth and venue spread before anything ranks.",
    },
    {
      num: "02",
      icon: "Activity",
      title: "Depth-aware.",
      body:
        "Volume that doesn't refill the book is not durable. The refill score is part of every verdict, not a footnote.",
    },
    {
      num: "03",
      icon: "Users",
      title: "Independence-aware.",
      body:
        "Correlated wallets and amplification networks are detected and stripped from the buyer-breadth count.",
    },
    {
      num: "04",
      icon: "Filter",
      title: "Quiet by design.",
      body:
        "Most days the board is short. The engine is built to filter false positives, not to fill a feed.",
    },
  ];

  const loop = [
    {
      num: "01",
      icon: "Download",
      title: "Ingest",
      body: "Pulls every relevant DEX swap on Solana from the live transaction stream.",
    },
    {
      num: "02",
      icon: "TrendingUp",
      title: "Detect",
      body:
        "Identifies tokens whose recent volume exceeds the configured spike threshold.",
    },
    {
      num: "03",
      icon: "Sliders",
      title: "Decompose",
      body:
        "Computes the five components: spike ratio, buyer breadth, liquidity growth, refill quality, and venue concentration penalty.",
    },
    {
      num: "04",
      icon: "Calculator",
      title: "Score",
      body:
        "Folds the components into a composite surge score, weighted by the model's parameters.",
    },
    {
      num: "05",
      icon: "ShieldCheck",
      title: "Filter",
      body:
        "Runs each candidate against the four rejection gates. Failures are demoted to scan or rejected outright.",
    },
    {
      num: "06",
      icon: "BarChart3",
      title: "Rank",
      body:
        "Sorts surviving tokens by composite score. The top of the board is what's most likely to actually continue.",
    },
  ];

  const gatesList = [
    {
      n: "1",
      title: "Breadth floor.",
      body:
        "If fewer than the minimum number of distinct wallets are participating, the candidate is suppressed regardless of score.",
    },
    {
      n: "2",
      title: "Liquidity delta.",
      body:
        "Tokens whose liquidity is shrinking under the spike — instead of growing — fail this gate. The book has to support what's happening.",
    },
    {
      n: "3",
      title: "Refill ratio.",
      body:
        "After the initial burst, depth must rebuild within the threshold window. Spikes that leave the book empty fail.",
    },
    {
      n: "4",
      title: "Venue dominance.",
      body:
        "If one DEX accounts for more than the maximum allowed share, the move is treated as concentrated, not real.",
    },
  ];

  const components = [
    {
      w: "34%",
      title: "Spike ratio.",
      body:
        "How much current volume exceeds the recent baseline. Largest single weight, but never the only one.",
    },
    {
      w: "24%",
      title: "Buyer breadth.",
      body:
        "How many distinct wallets are participating. Concentrated buying scores lower than spread buying.",
    },
    {
      w: "22%",
      title: "Liquidity growth.",
      body:
        "Whether the book is deepening into the move. Building books reinforce the score; thinning books undercut it.",
    },
    {
      w: "20%",
      title: "Refill quality.",
      body:
        "How quickly depth rebuilds after the initial burst. Books that don't refill are demoted.",
    },
    {
      w: "18%",
      title: "Venue concentration.",
      body:
        "Penalty for moves driven by a single DEX. Concentrated venues subtract from the composite.",
    },
  ];

  const principles = [
    {
      num: "01",
      icon: "Zap",
      title: "Minute cadence",
      body:
        "Re-ranks every minute. Fast enough to catch real moves, slow enough to filter single-tick noise.",
    },
    {
      num: "02",
      icon: "Layers",
      title: "Composite scoring",
      body:
        "Five weighted components, not one. Single-metric scanners are fragile — this one isn't.",
    },
    {
      num: "03",
      icon: "LineChart",
      title: "Depth-gated alerts",
      body:
        "Every score clears the depth and refill check before ranking. The book has to support the spike.",
    },
    {
      num: "04",
      icon: "Target",
      title: "Quality discipline",
      body:
        "False positives are filtered before they ever reach the board. Quiet output is the design, not a bug.",
    },
  ];

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at 50% -10%, rgba(105,180,202,0.13), transparent 32%), radial-gradient(circle at 88% 42%, rgba(50,114,140,0.07), transparent 30%), #060b16",
        color: COLORS.body,
        minHeight: "100vh",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* TOP NAV */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(6,11,22,0.86)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div
          className="launch-nav-inner"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href="#top"
             style={{
               color: "#fff",
               fontSize: 18,
               fontWeight: 600,
               letterSpacing: "-0.02em",
               textDecoration: "none",
               display: "flex",
               alignItems: "center",
               gap: 9,
             }}
           >
             <img
               src="/surge-mark.webp"
               alt=""
               aria-hidden="true"
               width="28"
               height="28"
               style={{ borderRadius: "50%", objectFit: "cover" }}
             />
             Surge
           </a>
          <div
            className="nav-section-links"
            style={{ alignItems: "center", gap: 28 }}
          >
            {navItems.map((it) => (
              <a
                key={it.label}
                href={it.href}
                onMouseEnter={() => setNavHover(it.label)}
                onMouseLeave={() => setNavHover(null)}
                style={{
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: navHover === it.label ? "#fff" : COLORS.faint,
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
              >
                {it.label}
              </a>
            ))}
          </div>
          <div className="launch-controls" style={{ alignItems: "center", gap: 8 }}>
            <span
              data-testid="contract-status"
              className="contract-status"
              style={{
                height: 30,
                padding: "0 10px",
                border: `1px solid ${COLORS.primary}`,
                borderRadius: 999,
                background: "rgba(105,180,202,0.1)",
                color: COLORS.primary,
                fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
              }}
            >
              <span aria-hidden="true" style={{ width: 5, height: 5, marginRight: 6, borderRadius: "50%", background: COLORS.primary }} />
              CA:PENDING
            </span>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Surge on GitHub"
              className="launch-icon"
              style={{ color: COLORS.faint }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.faint)}
            >
              <GitHubMark />
            </a>
            <a
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Surge on X"
              className="launch-icon"
              style={{ color: COLORS.faint }}
            >
              <XMark />
            </a>
            <a
              href="#board"
              className="launch-app"
              style={{ background: COLORS.primary, color: COLORS.canvas }}
              onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.bright)}
              onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.primary)}
            >Launch App</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="hero-section"
        style={{ padding: "128px 24px 96px", textAlign: "center" }}
      >
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 36,
            }}
          >
            <StatusPill>Live breakout filter</StatusPill>
            <StatusPill>5-component score</StatusPill>
            <StatusPill>60-second cadence</StatusPill>
          </div>

          <h1
            className="hero-headline"
            style={{
              fontSize: 64,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              fontWeight: 500,
              margin: 0,
              color: "#fff",
            }}
          >
            Most spikes
            <br />
            <span style={{ color: COLORS.fadedHeadline }}>
              die before the candle prints.
            </span>
          </h1>

          <p
            style={{
              maxWidth: 640,
              margin: "28px auto 0",
              color: COLORS.muted,
              fontSize: 18,
              lineHeight: 1.6,
            }}
          >
            Surge filters every breakout on Solana through real participation —
            buyer breadth, liquidity growth, refill quality, venue
            concentration. The board only ranks the moves that survive the
            first burst.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
              marginTop: 36,
              flexWrap: "wrap",
            }}
          >
            <PrimaryCTA href="#board">Open the board</PrimaryCTA>
            <GhostLink href="#doctrine">Read the doctrine →</GhostLink>
          </div>

          {/* HERO PANEL */}
          <div
            style={{
              position: "relative",
              maxWidth: 1024,
              margin: "40px auto 0",
            }}
          >
            <div
              style={{
                position: "relative",
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: 32,
                overflow: "hidden",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "radial-gradient(ellipse 60% 50% at center top, rgba(105,180,202,0.11), transparent 65%)",
                }}
              />
              <div style={{ position: "relative" }}>
                <Eyebrow>What you told Surge</Eyebrow>
                <div
                  style={{
                    marginTop: 14,
                    paddingLeft: 18,
                    borderLeft: `3px solid ${COLORS.bright}`,
                    color: "#fff",
                    fontStyle: "italic",
                    fontSize: 22,
                    lineHeight: 1.5,
                    letterSpacing: "-0.01em",
                  }}
                >
                  "Find tokens with real momentum — not optical bursts. Skip
                  the ones with one venue or one wallet. Only show me what
                  survives depth and slippage."
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "24px 0",
                  }}
                >
                  <ArrowDown size={22} color={COLORS.primary}/>
                </div>

                <Eyebrow>Surge ranked · 14:32:05</Eyebrow>

                <div style={{ marginTop: 8 }}>
                  <HeroPanelRow
                    token="WIF"
                    sub="Top 50 · 24h"
                    score={84}
                    scoreTop
                    breadth="47 wallets"
                    decision="PROMOTE"
                  />
                  <HeroPanelRow
                    token="BONK"
                    sub="Top 100 · 24h"
                    score={67}
                    breadth="31 wallets"
                    decision="WATCH"
                  />
                  <HeroPanelRow
                    token="JUP"
                    sub="Top 30 · 24h"
                    score={41}
                    breadth="14 wallets"
                    breadthLow
                    decision="SCAN"
                  />
                  <HeroPanelRow
                    token="MEW"
                    sub="Top 150 · 24h"
                    score={12}
                    breadth="3 wallets"
                    breadthLow
                    decision="REJECT"
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 18,
                fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                fontSize: 11,
                letterSpacing: "0.12em",
                color: COLORS.faint,
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              Every score clears four rejection gates before it ranks.
            </div>
          </div>
        </div>
      </section>

      {/* LIVE BOARD */}
      <section id="board" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <Eyebrow large>01 · LIVE BOARD</Eyebrow>
          <h2
            className="section-headline"
            style={{
              fontSize: 48,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              margin: 0,
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            Every minute,{" "}
            <span style={{ color: COLORS.fadedHeadline }}>
              the board re-ranks.
            </span>
          </h2>
          <p
            style={{
              maxWidth: 640,
              marginTop: 20,
              color: COLORS.muted,
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            A live snapshot of every token Surge is scoring: spike ratio, buyer
            breadth, liquidity growth, venue concentration, and the engine's
            current verdict. These are the same metrics that drive the alerts.
          </p>

          <div
            style={{
              marginTop: 40,
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: COLORS.muted,
                  textTransform: "uppercase",
                }}
              >
                TRACKED 248{" "}
                <span style={{ color: COLORS.faint }}>·</span> ACTIVE 9{" "}
                <span style={{ color: COLORS.faint }}>·</span> REJECTED 239
              </div>
              <div
                style={{
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: COLORS.faint,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 999,
                  padding: "4px 10px",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: COLORS.primary,
                  }}
                />
                Updated 00:48 ago
              </div>
            </div>

            <div
              className="board-header"
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 0.8fr 0.8fr 0.9fr",
                alignItems: "center",
                gap: 16,
                paddingBottom: 12,
                borderBottom: `1px solid ${COLORS.border}`,
                fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                fontSize: 11,
                letterSpacing: "0.14em",
                color: COLORS.faint,
                textTransform: "uppercase",
              }}
            >
              <div>Token</div>
              <div>Surge score</div>
              <div>Breadth</div>
              <div>Venues</div>
              <div>Decision</div>
            </div>

            <BoardRow
              token="WIF"
              sub="Top 50 · 24h vol"
              score={84}
              scoreTop
              breadth="47 wallets"
              venues="5 venues"
              decision="PROMOTE"
            />
            <BoardRow
              token="BONK"
              sub="Top 100 · 24h vol"
              score={67}
              breadth="31 wallets"
              venues="4 venues"
              decision="WATCH"
            />
            <BoardRow
              token="JUP"
              sub="Top 30 · 24h vol"
              score={41}
              breadth="14 wallets"
              breadthLow
              venues="3 venues"
              decision="SCAN"
            />
            <BoardRow
              token="MEW"
              sub="Top 150 · 24h vol"
              score={12}
              breadth="3 wallets"
              breadthLow
              venues="1 venue"
              venuesLow
              decision="REJECT"
            />
            <BoardRow
              token="JTO"
              sub="Top 80 · 24h vol"
              score={56}
              breadth="22 wallets"
              venues="4 venues"
              decision="WATCH"
            />
          </div>
        </div>
      </section>

      {/* DOCTRINE */}
      <section id="doctrine" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <Eyebrow large>02 · DOCTRINE</Eyebrow>
          <h2
            className="section-headline"
            style={{
              fontSize: 48,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              margin: 0,
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            Four rules. Always.
          </h2>

          <div
            className="grid-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 20,
              marginTop: 40,
            }}
          >
            {doctrine.map((c) => (
              <NumberedCard key={c.num} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* LOOP */}
      <section id="loop" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <Eyebrow large>03 · LOOP</Eyebrow>
          <h2
            className="section-headline"
            style={{
              fontSize: 48,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              margin: 0,
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            Six steps every cycle.{" "}
            <span style={{ color: COLORS.fadedHeadline }}>
              Same order, every time.
            </span>
          </h2>
          <p
            style={{
              maxWidth: 640,
              marginTop: 20,
              color: COLORS.muted,
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            The cycle runs every minute against every Solana token above the
            volume threshold. Skip a step and the score loses its discipline.
          </p>

          <div
            className="grid-3-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 20,
              marginTop: 40,
            }}
          >
            {loop.map((c) => (
              <NumberedCard key={c.num} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* GATES */}
      <section id="gates" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <Eyebrow large>04 · GATES</Eyebrow>
          <h2
            className="section-headline"
            style={{
              fontSize: 48,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              margin: 0,
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            Four gates between thought and rank.{" "}
            <span style={{ color: COLORS.fadedHeadline }}>
              Plus the math behind the score.
            </span>
          </h2>

          <div
            className="grid-2"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
              marginTop: 40,
            }}
          >
            <div
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 32,
              }}
            >
              <Eyebrow>Rejection gates · in order</Eyebrow>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 24 }}>
                {gatesList.map((g) => (
                  <div
                    key={g.n}
                    style={{ display: "flex", gap: 16 }}
                  >
                    <div
                      style={{
                        fontFamily:
                          "ui-monospace, 'SF Mono', Menlo, monospace",
                        color: COLORS.primary,
                        fontSize: 14,
                        fontWeight: 500,
                        minWidth: 18,
                      }}
                    >
                      {g.n}
                    </div>
                    <div>
                      <div
                        style={{
                          color: "#fff",
                          fontSize: 16,
                          fontWeight: 500,
                          marginBottom: 6,
                        }}
                      >
                        {g.title}
                      </div>
                      <div
                        style={{
                          color: COLORS.muted,
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        {g.body}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 32,
              }}
            >
              <Eyebrow>Score · five components</Eyebrow>
              <div style={{ marginTop: 8 }}>
                {components.map((c, i) => (
                  <div
                    key={c.w}
                    style={{
                      padding: "20px 0",
                      borderBottom:
                        i === components.length - 1
                          ? "none"
                          : `1px solid rgba(35,54,72,0.58)`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 12,
                        marginBottom: 6,
                      }}
                    >
                      <div
                        style={{
                          fontFamily:
                            "ui-monospace, 'SF Mono', Menlo, monospace",
                          color: COLORS.primary,
                          fontSize: 14,
                          fontWeight: 500,
                          minWidth: 44,
                        }}
                      >
                        {c.w}
                      </div>
                      <div
                        style={{
                          color: "#fff",
                          fontSize: 16,
                          fontWeight: 500,
                        }}
                      >
                        {c.title}
                      </div>
                    </div>
                    <div
                      style={{
                        color: COLORS.muted,
                        fontSize: 14,
                        lineHeight: 1.6,
                        paddingLeft: 56,
                      }}
                    >
                      {c.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <Eyebrow large>05 · PRINCIPLES</Eyebrow>
          <h2
            className="section-headline"
            style={{
              fontSize: 48,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              margin: 0,
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            What separates Surge{" "}
            <span style={{ color: COLORS.fadedHeadline }}>
              from a volume scanner.
            </span>
          </h2>

          <div
            className="grid-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 20,
              marginTop: 40,
            }}
          >
            {principles.map((c) => (
              <NumberedCard key={c.num} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* LAUNCH */}
      <section id="launch" style={{ padding: "96px 24px" }}>
        <div
          style={{
            maxWidth: 768,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Eyebrow large>06 · LAUNCH</Eyebrow>
          </div>
          <h2
            className="section-headline"
            style={{
              fontSize: 48,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              margin: 0,
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            Surge launches on Pump.fun.
          </h2>

          <div
            style={{
              marginTop: 48,
              display: "flex",
              flexDirection: "column",
              gap: 24,
              textAlign: "left",
            }}
          >
            {[
              {
                tag: "LIVE",
                body:
                  "The engine reads the same swap stream the page describes — every minute, every supported token.",
              },
              {
                tag: "OPEN",
                body:
                  "The board is public. Rankings are public. The proof is the surface, not a pitch.",
              },
              {
                tag: "OWNED",
                body:
                  "Coin holders fund the engine and steer the watchlist. The product and the launch are one thing.",
              },
            ].map((row) => (
              <div
                key={row.tag}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr",
                  gap: 24,
                  paddingBottom: 20,
                  borderBottom: `1px solid ${COLORS.border}`,
                  alignItems: "baseline",
                }}
              >
                <div
                  style={{
                    fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                    color: COLORS.primary,
                    fontSize: 13,
                    letterSpacing: "0.16em",
                    fontWeight: 500,
                  }}
                >
                  {row.tag}
                </div>
                <div
                  style={{
                    color: COLORS.body,
                    fontSize: 16,
                    lineHeight: 1.6,
                  }}
                >
                  {row.body}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40 }}>
            <PrimaryCTA href="#board">Open the board</PrimaryCTA>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section style={{ padding: "96px 24px" }}>
        <div
          style={{ maxWidth: 768, margin: "0 auto", textAlign: "center" }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Eyebrow>Optical is not real</Eyebrow>
          </div>
          <h3
            style={{
              marginTop: 16,
              fontSize: 36,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              color: "#fff",
              lineHeight: 1.15,
            }}
          >
            A spike that doesn't survive the first minute was never a
            breakout.
          </h3>
          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 24,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <GhostLink href="#doctrine">Read the doctrine →</GhostLink>
            <GhostLink href="#board">Open the board →</GhostLink>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: COLORS.canvas,
          borderTop: `1px solid ${COLORS.border}`,
          padding: "48px 24px",
        }}
      >
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div
            className="footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
            }}
          >
            <div>
              <Eyebrow>Site</Eyebrow>
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {["Doctrine", "Loop", "Gates", "Launch"].map((l) => (
                  <a
                    key={l}
                    href={`#${l.toLowerCase()}`}
                    style={{
                      color: COLORS.muted,
                      textDecoration: "none",
                      fontSize: 14,
                      width: "fit-content",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#fff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = COLORS.muted)
                    }
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <Eyebrow>Project</Eyebrow>
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[
                  { label: "GitHub", href: GITHUB_URL },
                  { label: "Twitter", href: X_URL },
                  { label: "Pump.fun", href: PUMPFUN_URL },
                  { label: "Whitepaper", href: GITHUB_URL },
                ].map((item) => item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: COLORS.muted, textDecoration: "none", fontSize: 14, width: "fit-content" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.muted)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span key={item.label} style={{ color: COLORS.faint, fontSize: 14, width: "fit-content" }}>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 48,
              fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              color: COLORS.faint,
              textTransform: "uppercase",
            }}
          >
            Surge · Solana breakout filter · MIT licensed · 2026
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SurgeLanding;
