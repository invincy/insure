"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NextImage from "next/image";
import GalaxyBackground from "../../../components/hero/GalaxyBackground";
import GoldenPath from "../../../components/hero/GoldenPath";
import PathAndFamily from "../../../components/hero/PathAndFamily";
import GirlFigure from "../../../components/hero/GirlFigure";
import CoinBadge from "../../../components/hero/CoinBadge";
import GoalsFanOut from "../../../components/hero/GoalsModal";
import { plan733Assets } from "../../../config/plan733Assets";
import { getPremium, BROCHURE_SUM_ASSURED } from '../../../data/brochurePremiums';
import { estimateMaturity, calculateInstallments } from '../../../utils/bonus';
import { DEFAULT_BONUS_CONFIG } from '../../../config/bonusConfig';
import GoalContext from "../../../components/GoalContext";
import TermRider from "../../../components/TermRider";
import GridOverlay from '../../../components/debug/GridOverlay';

const Plan733Page = () => {
  const [animationStage, setAnimationStage] = useState(0);
  const mainRef = useRef<HTMLElement | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [showGoals, setShowGoals] = useState(false);
  const [showPlanContext, setShowPlanContext] = useState(false);
  const [showQuickContainer, setShowQuickContainer] = useState(false);
  const [showSelectionPrompt, setShowSelectionPrompt] = useState(false);
  const [selectionPromptLeft, setSelectionPromptLeft] = useState<number | null>(null);
  const [quickContainerPos, setQuickContainerPos] = useState<{ left: number; top: number; width?: number } | null>(null);
  const router = useRouter();
  const [showBenefitPage, setShowBenefitPage] = useState(false);
  const [showTermRider, setShowTermRider] = useState(false);
  const [planSelection, setPlanSelection] = useState<any | null>(null);
  const [whatIfStage, setWhatIfStage] = useState(0); // legacy - kept for compatibility but disabled
  // showMaturityPreview replaces the What‑If staged animation on this page.
  const [showMaturityPreview, setShowMaturityPreview] = useState(false);
  const [transitioningToWhatIf, setTransitioningToWhatIf] = useState(false);
  const [showWhatIfCoin, setShowWhatIfCoin] = useState(false);
  // showGirlDuringFade becomes true halfway through the family's slow fade so
  // the girl can start her own fade-in while the family is still fading out.
  const [showGirlDuringFade, setShowGirlDuringFade] = useState(false);

  // Post-What‑If story state
  const [showWhatIfCaption, setShowWhatIfCaption] = useState(false);
  const [showGlossyBubble, setShowGlossyBubble] = useState(false);
  const [showPremiumCeasesPill, setShowPremiumCeasesPill] = useState(false);
  const [showTenPercentPill, setShowTenPercentPill] = useState(false);
  const [pathColored, setPathColored] = useState(false);
  const [overrideCoinColor, setOverrideCoinColor] = useState(false);
  const postWhatIfCtrlRef = useRef<AbortController | null>(null);

  // --- Main Animation Sequence ---
  useEffect(() => {
    setAnimationStage(1);
    const pathTimer = setTimeout(() => setAnimationStage(2), 500);
    const coinTimer = setTimeout(() => setAnimationStage(3), 1000);
    return () => {
      clearTimeout(pathTimer);
      clearTimeout(coinTimer);
    };
  }, []);

  const handleCoinClick = () => {
    if (showPlanContext || showBenefitPage) return;
    // original behaviour: open goals fan-out so user selects age/term in PlanContext
    setShowGoals(true);
  };

  const handleGoalSelection = (goalId: string) => {
    // store the selection but do not open PlanContext immediately — wait for capture animation
    setSelectedGoal(goalId);
    setShowGoals(false);
  };

  // when the short selection prompt is shown, compute the coin's center X so the prompt
  // can be horizontally aligned with the coin (center line). Recompute on resize.
  useEffect(() => {
    if (!showSelectionPrompt) return;
    const compute = () => {
      try {
        // Anchor the short selection prompt to the viewport centerline so it
        // visually lines up with the hero composition even when the goal coin
        // is animated or rendered elsewhere (e.g. on the golden path).
        const centerX = Math.round((window.innerWidth || document.documentElement.clientWidth) / 2);
        setSelectionPromptLeft(centerX);
        return;
      } catch (e) {
        /* noop */
      }
      setSelectionPromptLeft(null);
    };
    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('scroll', compute, { passive: true });
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute);
    };
  }, [showSelectionPrompt]);

  const handlePlanContextProceed = (payload: any) => {
    console.log("[DEBUG] Proceeding from PlanContext with payload:", payload);
    setPlanSelection(payload);
    try {
      sessionStorage.setItem("planSelection", JSON.stringify(payload));
    } catch (e) {
      // ignore storage errors
    }
  setShowPlanContext(false);
  // show the maturity/premium preview directly (disable staged What‑If flow)
  setShowMaturityPreview(true);
  };

  // Quick container selections (term/age) when the compact quick panel is used
  const [quickTerm, setQuickTerm] = useState<number | null>(null);
  const [quickAge, setQuickAge] = useState<number | null>(null);

  const handleQuickOpen = () => {
    if (!quickAge || !quickTerm) return;
    // lookup brochure annual premium
    const annualPremium = getPremium(quickAge, quickTerm);
    // build maturity estimate using official sum assured and default bonus assumptions
    let maturityDetail = null;
    try {
      if (annualPremium !== null) {
        const ppt = quickTerm - 3;
        maturityDetail = estimateMaturity({ sumAssured: BROCHURE_SUM_ASSURED, term: quickTerm, ppt, bonus: DEFAULT_BONUS_CONFIG });
      }
    } catch (e) {
      maturityDetail = null;
    }

    const payload: any = {
      term: quickTerm,
      age: quickAge,
      annualPremium: annualPremium ?? 0,
      estimatedMaturity: maturityDetail ?? { totalMaturity: 0 }
    };

    try {
      sessionStorage.setItem("planSelection", JSON.stringify(payload));
    } catch (e) {
      /* noop */
    }
    setPlanSelection(payload);
    setShowPlanContext(false);
    setShowQuickContainer(false);
    // show maturity/premium preview directly
    setShowMaturityPreview(true);
  };

  // show premium then maturity sequencing for the preview pills
  const [showPremiumPill, setShowPremiumPill] = useState(false);
  const [showMaturityPill, setShowMaturityPill] = useState(false);
  const [showLargePremium, setShowLargePremium] = useState(false);
  const [showColoredCoin, setShowColoredCoin] = useState(false);

  useEffect(() => {
    let coinTimer: number | null = null;
    let cleanupTimer: number | null = null;
    if (showMaturityPreview) {
      // show the premium pill immediately in its compact (final) size and slide it up
      setShowPremiumPill(true);
      // ensure we use the compact pill style (no grow-then-shrink morph)
      setShowLargePremium(false);
      // hide any previously revealed colored coin
      setShowColoredCoin(false);
      setShowMaturityPill(false);
      // after ~1.5s reveal the colored coin and the maturity pill
      coinTimer = window.setTimeout(() => {
        setShowColoredCoin(true);
        setShowMaturityPill(true);
      }, 1500);
    } else {
      setShowPremiumPill(false);
      setShowLargePremium(false);
      setShowMaturityPill(false);
      setShowColoredCoin(false);
    }
    // Cleanup timers on unmount or when preview toggles
    return () => {
      if (coinTimer) window.clearTimeout(coinTimer);
      if (cleanupTimer) window.clearTimeout(cleanupTimer);
    };
  }, [showMaturityPreview]);

  // When maturity pill is shown (preview), ensure the persistent goal coin is colorized.
  useEffect(() => {
    if (showMaturityPill) {
      setOverrideCoinColor(true);
    }
  }, [showMaturityPill]);

  const handleWhatIfClick = () => {
    if (whatIfStage < 3) {
      setWhatIfStage((prev) => prev + 1);
    }
  };  const handleTermRiderClose = () => {
      console.log("[DEBUG] Term Rider closed. Resetting state.");
      setShowTermRider(false);
      setShowBenefitPage(false);
      setSelectedGoal(null);
      // Reset benefitStage if it's still in use elsewhere, otherwise remove.
      // setBenefitStage(0);
  };

  // Handler to proceed from maturity preview to simplified What-If: animate pills out,
  // slide PathAndFamily down and GirlFigure up, and show the what-if coin + caption.
  const handleProceedToWhatIf = () => {
    // Reset any prior mid-fade state for the girl and schedule her fixed 2s appearance
    setShowGirlDuringFade(false);
    const girlDelayMs = 2000; // girl appears 2s after the user clicks the glossy arrow
    window.setTimeout(() => {
      setShowGirlDuringFade(true);
      console.log('[whatif] scheduled: showGirlDuringFade -> true (2s after start)');
    }, girlDelayMs);

    // Timing configuration (ms)

  const START_DELAY_MS = 1200; // when pills/desaturation start
  const PILL_FADE_MS = 1000; // pill fade duration
  const FAMILY_FADE_MS = 2500; // 2.5s total; faster but gentle family fade

    // Start pill transitions and desaturation at START_DELAY_MS
    // Immediately mark the scene as transitioning so the persistent goal coin
    // visually begins desaturating without waiting for START_DELAY_MS. Also
    // ensure any previous override is cleared so the desaturation can take effect.
    setOverrideCoinColor(false);
    setTransitioningToWhatIf(true);
    setShowColoredCoin(false);

    // Force an immediate inline style change on the coin element so the
    // browser starts the CSS filter transition right away (React updates
    // may be batched; direct DOM mutation guarantees the visual starts).
    try {
      const coinEl = document.getElementById('lakshya-coin') as HTMLElement | null;
      if (coinEl) {
        // ensure the transition is present and then set the filter to start the fade
        coinEl.style.transition = 'filter 900ms ease-out, -webkit-filter 900ms ease-out, opacity 220ms ease';
        coinEl.style.webkitFilter = 'grayscale(1) contrast(0.95) brightness(0.9)';
        coinEl.style.filter = 'grayscale(1) contrast(0.95) brightness(0.9)';
      }
    } catch (e) {
      /* noop - best effort */
    }

    // Additional timed actions (pills/desaturation visuals) still use START_DELAY_MS
    // for when other animations should begin.
    window.setTimeout(() => {
      // (noop here) reserved for future staged actions that rely on START_DELAY_MS
    }, START_DELAY_MS);

    // Start caption / stage 1 shortly after visual start (keep near START_DELAY_MS)
    window.setTimeout(() => {
      setWhatIfStage(1);
      setShowWhatIfCaption(true);
    }, START_DELAY_MS);

    // Start family fade after the pills animation completes (START_DELAY_MS + PILL_FADE_MS)
    const familyStartMs = START_DELAY_MS + PILL_FADE_MS;
    window.setTimeout(() => {
      setWhatIfStage(2);

      // after FAMILY_FADE_MS complete, reveal final state (stage 3) and the what-if coin
      window.setTimeout(() => {
        setWhatIfStage(3);
        setShowPremiumPill(false);
        setShowMaturityPill(false);
        setTransitioningToWhatIf(false);
        setShowWhatIfCoin(true);
        console.log('[whatif] visual sequence complete (stage 3)');
      }, FAMILY_FADE_MS);
    }, familyStartMs);
  };

  // helper to wait with abort
  const waitMs = (ms: number, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new Error('aborted'));
    const t = window.setTimeout(() => resolve(), ms);
    const onAbort = () => { clearTimeout(t); reject(new Error('aborted')); };
    signal?.addEventListener?.('abort', onAbort, { once: true } as any);
  });

  // Sequence after What‑If: triggered by glossy arrow on What‑If page
  const handleProceedToPostWhatIf = async () => {
    try { postWhatIfCtrlRef.current?.abort(); } catch(e) { /* noop */ }
    const ctrl = new AbortController();
    postWhatIfCtrlRef.current = ctrl;
    const { signal } = ctrl;

    try {
      // remove the earlier What‑If caption box, keep the girl visible
      setShowWhatIfCaption(false);

      // reset story flags
      setShowGlossyBubble(false);
      setShowPremiumCeasesPill(false);
      setShowTenPercentPill(false);
      setPathColored(false);
      setOverrideCoinColor(false);

      // 0s: show Gujarati bubble
      setShowGlossyBubble(true);
      await waitMs(1000, signal);

      // +1s: show Premium Ceases pill
      setShowPremiumCeasesPill(true);
      await waitMs(1000, signal);

      // +1s: show 10% SA pill and colorize path
      setShowTenPercentPill(true);
      setPathColored(true);
      await waitMs(1000, signal);

      // +1s: re-show maturity pill (reuse existing pill)
      setShowMaturityPill(true);
      await waitMs(400, signal);

      // finally: colorize goal coin
      setOverrideCoinColor(true);
    } catch(e) {
      // aborted or error
    } finally {
      postWhatIfCtrlRef.current = null;
    }
  };

  // Blur active element when What‑If starts so nothing remains focusable underneath
  useEffect(() => {
    if (whatIfStage === 1) {
      try {
        const active = document.activeElement as HTMLElement | null;
        if (active && typeof active.blur === "function") active.blur();
      } catch (e) {
        /* noop */
      }
    }
  }, [whatIfStage]);

  // Abort any running post-What‑If sequence on unmount
  useEffect(() => {
    return () => {
      try { postWhatIfCtrlRef.current?.abort(); } catch(e) { /* noop */ }
    };
  }, []);

  // Cleanup inline coin styles when we explicitly override coin color (recolor)
  useEffect(() => {
    try {
      const el = document.getElementById('lakshya-coin') as HTMLElement | null;
      if (!el) return;
      if (overrideCoinColor) {
        // remove any inline filter so React/props control the appearance again
        el.style.filter = '';
        el.style.webkitFilter = '';
        // keep transition present for future fades
        // (no further action needed)
      }
    } catch (e) {
      /* noop */
    }
  }, [overrideCoinColor]);

  // Starfield removed: no canvas/stars drawn on this page per request

  // Ensure pixel-perfect alignment: compute coin size and center in pixels so
  // the coin top aligns to 25% (A2) and bottom to 50% (B2) even on mobile
  // browsers where 1vh can vary due to address bars. We set CSS vars on the
  // main element so child components read the exact pixel values.
  useEffect(() => {
    const setCoinVars = () => {
      try {
        const h = window.innerHeight || document.documentElement.clientHeight || 800;
  // Increase coin size by 1.35x relative to the 25vh baseline as requested
  const coinSizePx = Math.round(h * 0.25 * 1.35); // 25vh * 1.35
  // nudge the center slightly downward so the coin moves a few pixels toward B2
  // increased per request: move additional 15px from previous (prev 12px -> now 27px)
  const coinNudge = 27; // px total nudge
    const centerPx = Math.round(h * 0.375) + coinNudge; // midpoint between 25% and 50% plus nudge
        const el = mainRef.current || document.documentElement;
        el.style.setProperty('--coin-size', `${coinSizePx}px`);
          el.style.setProperty('--coin-center', `${centerPx}px`);
          // --coin-top should be the pixel Y where the coin's top edge sits.
          // centerPx is the desired vertical center line; subtract half the coin diameter
          // so the top coordinate places the coin exactly centered on the grid.
          const coinTopPx = Math.round(centerPx - coinSizePx / 2);
          el.style.setProperty('--coin-top', `${coinTopPx}px`);
        // compute C2 grid position (approx 75% viewport height) so we can anchor premium pill there
        const c2Px = Math.round(h * 0.75);
        el.style.setProperty('--c2-top', `${c2Px}px`);
  // Align the girl's feet to a baseline near the bottom of the viewport
  // We compute a bottom offset (pixels from viewport bottom) so the parent's
  // positioned container can anchor the girl's feet reliably regardless of
  // image intrinsic height. This is easier to tune for pixel-perfect grid
  // alignment than trying to predict image height.
  // Default baseline is ~6% of viewport height from the bottom; adjust
  // GIRL_FEET_BASE_PCT for fine tuning.
  // place the girl's feet near the very bottom to align with grid C1 — use a small
  // fixed pixel offset so alignment is stable across viewports.
  const girlBottomPx = Math.round(h * 0.06); // px from viewport bottom to align with C1 row
  el.style.setProperty('--girl-bottom', `${girlBottomPx}px`);
  // compute a pixel left for the first vertical column (1/6th of viewport width)
  const w = window.innerWidth || document.documentElement.clientWidth || 360;
  // position the girl near the C1 column. Moving right to ~22% of viewport width.
  const girlLeftPx = Math.round(w * 0.22);
  el.style.setProperty('--girl-left', `${girlLeftPx}px`);
  // allow the girl to be scaled independently (scale origin is bottom so feet stay anchored)
  el.style.setProperty('--girl-scale', `1.25`);
        // Also set the same variables on the document root so sibling overlays (fixed positioned)
        // can read them via CSS var() even when they are not descendants of `main`.
        try {
          const root = document.documentElement;
          root.style.setProperty('--coin-size', `${coinSizePx}px`);
          root.style.setProperty('--coin-center', `${centerPx}px`);
          root.style.setProperty('--coin-top', `${coinTopPx}px`);
          root.style.setProperty('--c2-top', `${c2Px}px`);
          root.style.setProperty('--girl-bottom', `${girlBottomPx}px`);
          root.style.setProperty('--girl-left', `${girlLeftPx}px`);
          root.style.setProperty('--girl-scale', `1.25`);
        } catch (e) {
          /* noop - if root isn't available this is best-effort */
        }
        // Debugging: log computed values and coin rect if present
        // eslint-disable-next-line no-console
        console.log('[coin-vars] coinSizePx=', coinSizePx, 'centerPx=', centerPx);
        try {
          const coinEl = document.getElementById('lakshya-coin');
          if (coinEl) {
            const r = coinEl.getBoundingClientRect();
            // eslint-disable-next-line no-console
            console.log('[coin-vars] coin rect', r);
          }
        } catch (e) {
          /* noop */
        }
      } catch (e) {
        /* noop */
      }
    };
    setCoinVars();
    window.addEventListener('resize', setCoinVars);
    window.addEventListener('orientationchange', setCoinVars);
    return () => {
      window.removeEventListener('resize', setCoinVars);
      window.removeEventListener('orientationchange', setCoinVars);
    };
  }, []);

  return (
  <>
  <main ref={mainRef} className="min-h-[100svh] relative overflow-x-hidden text-white pt-16 p-safe" style={{
          // layered radial gradients give a geometric matte-universe feel while keeping depth
          background: `radial-gradient(800px 400px at 10% 12%, rgba(88,101,242,0.10), transparent 18%),
                       radial-gradient(900px 420px at 78% 82%, rgba(139,92,246,0.06), transparent 22%),
                       linear-gradient(180deg, #07102a 0%, #0f1a3a 60%, #08142f 100%)`,
      position: 'relative',
      // responsive positioning variables for hero elements
  // position the coin so its top is at A2 (25%) and bottom at B2 (50%) -> center = 37.5%, size = 25vh
  '--coin-center': '37.5%',
  '--coin-top': '37.5%',
  '--coin-size': '25vh',
    '--caption-top': 'clamp(46vh, 50vh, 54vh)',
  // coin size set to an exact pixel diameter to avoid multiplier confusion
  '--coin-scale': '1.5',
  // scene-level grayscale is applied to a dedicated filtered layer below so
  // select characters can remain colored in an overlay. (Filter removed from main.)
    } as React.CSSProperties}>
  {/* coin center variable used to align coin center to grid B2 (50% viewport) */}
      {/* Matte universe background layer */}
      <div className="absolute inset-0 z-0" style={{
        background: 'radial-gradient(ellipse at 50% 20%, rgba(88, 101, 242, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
        backgroundBlendMode: 'screen'
      }} />
  {/* Debug grid overlay (toggle with window.__GRID_DEBUG = true or Shift+G) */}
  <GridOverlay />
      {/* Subtle grain texture overlay for matte feel */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat',
        pointerEvents: 'none'
      }} />
      {/* Geometry overlay will be rendered after the gradient component so it sits above the background */}

      {/* Starfield removed — no canvas/stars on this page */}
      <GalaxyBackground />

      {/* Geometry / neural-circuit overlay — subtle, non-interactive; placed after GalaxyBackground so it sits above the gradient */}
  {/* Geometry overlay should sit above the background but behind the coin and artwork */}
  <svg aria-hidden className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{opacity: 0.28}}>
        <defs>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* circuit-like lines */}
        <g stroke="#8fcfff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.98">
          <path d="M1200 40 L1000 40 L880 140 L760 140 L640 60 L520 60" />
          <path d="M200 120 L360 120 L420 200 L560 200 L680 120 L820 120" />
          <path d="M300 600 L420 520 L540 520 L660 600 L820 520 L980 520" />
          <path d="M1100 300 L980 300 L860 220 L740 220 L620 300 L500 300" />
          <path d="M140 220 L220 220 L300 160 L380 160 L460 220 L560 220" />
          {/* additional denser geometry */}
          <path d="M960 80 L880 120 L820 100 L760 140" opacity="0.9" />
          <path d="M640 180 L720 160 L780 200 L860 180" opacity="0.9" />
          <path d="M420 420 L480 380 L560 400 L640 360 L720 400" opacity="0.85" />
          <path d="M1000 520 L920 480 L840 520 L760 480 L680 520" opacity="0.85" />
          <path d="M240 360 L320 320 L400 360 L480 320" opacity="0.9" />
        </g>

        {/* connecting nodes with a warm highlight (more nodes) */}
        <g filter="url(#softGlow)">
          <circle cx="880" cy="140" r="4.5" fill="#ffd98a" />
          <circle cx="420" cy="200" r="4.5" fill="#ffd98a" />
          <circle cx="660" cy="600" r="4.5" fill="#ffd98a" />
          <circle cx="760" cy="140" r="3.5" fill="#ffd98a" />
          <circle cx="520" cy="60" r="3.5" fill="#ffd98a" />
          <circle cx="320" cy="340" r="3.5" fill="#ffd98a" />
          <circle cx="980" cy="520" r="3.5" fill="#ffd98a" />
          <circle cx="720" cy="200" r="3" fill="#ffd98a" />
          <circle cx="460" cy="420" r="3" fill="#ffd98a" />
        </g>
      </svg>

      {/* Warm rim glow placeholder (moved later to sit behind golden path and family) */}

      <motion.div
        className="absolute top-24 left-6 md:left-12 z-[16] text-left max-w-[700px] pr-6"
        initial={{ opacity: 0 }}
        animate={animationStage >= 3 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight max-w-full break-words">
          તમારું લક્ષ્ય, તમારી તારીખ.
          <br />
          <span className="text-yellow-400">જવાબદારી LIC ની.</span>
        </h1>
      </motion.div>

      {/* PathAndFamily moved to a top-level colored overlay so it can remain colored during What‑If. */}

      <div className="absolute inset-0 pointer-events-none z-[2]" style={{ filter: (!pathColored && (transitioningToWhatIf || showWhatIfCoin)) ? 'grayscale(1) contrast(0.95) brightness(0.9)' : undefined }}>
        <GoldenPath animationStage={animationStage} />
      </div>

      {/* Lone girl moved to a top-level colored overlay so she stays colored during What‑If. */}

      {/* Persistent goal coin anchored to the golden path.
          This single CoinBadge stays mounted and positioned on the path regardless of
          preview/selector/what‑if flows. It will not be removed or re-rendered elsewhere.
          The coin only visually desaturates when What‑If begins (transitioningToWhatIf)
          or when the what‑if coin is active.
      */}
      <CoinBadge
        onClick={!selectedGoal ? handleCoinClick : undefined}
        animationStage={selectedGoal ? 3 : animationStage}
        selectedGoal={selectedGoal}
        elevated={!!selectedGoal}
        gray={(transitioningToWhatIf || showWhatIfCoin) && !overrideCoinColor}
      />

      {showGoals && (
        <GoalsFanOut
          onClose={() => setShowGoals(false)}
          onGoalSelect={handleGoalSelection}
          onCaptured={(goalId) => {
            // Immediately show a short selection prompt (no hold). The prompt explains the selection
            // and has a "Get premium" action which opens the full Term/Age selector.
            setSelectedGoal(goalId);
            setShowGoals(false);
            // seat the coin first, then after a short delay show the short selection prompt
            // so the user sees "your goal is now LOCKED" before proceeding to Get premium.
            // show the short selection prompt immediately (reduced delay by ~1s)
            setTimeout(() => {
              setShowSelectionPrompt(true);
            }, 0);
          }}
        />
      )}

      {showQuickContainer && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          // use computed quickContainerPos when available so the box doesn't overlap the coin
          className={quickContainerPos ? "fixed z-[80]" : "fixed z-[80] left-1/2 -translate-x-1/2"}
          style={(
            quickContainerPos
              ? ({ left: quickContainerPos.left + 'px', top: quickContainerPos.top + 'px', width: quickContainerPos.width + 'px' } as React.CSSProperties)
              : ({ top: 'calc(var(--coin-top) + 48px)', width: 'min(92vw, 640px)' } as React.CSSProperties)
          )}
        >
          <div className="rounded-2xl px-4 py-5" style={{
            background: 'linear-gradient(180deg, rgba(255,243,205,0.18), rgba(255,235,150,0.12))',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,224,110,0.18)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.45)'
          }}>
            <div className="flex justify-center mb-3">
              <div className="px-5 py-2 rounded-full bg-yellow-400 text-white font-bold">Select</div>
            </div>

            {/* Term label + chips */}
            <div className="mb-3">
              <div className="text-white/90 mb-2 text-lg font-semibold">Term</div>
              <div className="flex gap-3 overflow-x-auto whitespace-nowrap">
                <button onClick={() => setQuickTerm(18)} className={`px-3 py-2 rounded-lg font-semibold inline-block ${quickTerm === 18 ? 'bg-yellow-500 text-black' : 'bg-yellow-300/90 text-black'}`}>18 Y</button>
                <button onClick={() => setQuickTerm(20)} className={`px-3 py-2 rounded-lg font-semibold inline-block ${quickTerm === 20 ? 'bg-yellow-500 text-black' : 'bg-yellow-300/90 text-black'}`}>20 Y</button>
                <button onClick={() => setQuickTerm(25)} className={`px-3 py-2 rounded-lg font-semibold inline-block ${quickTerm === 25 ? 'bg-yellow-500 text-black' : 'bg-yellow-300/90 text-black'}`}>25 Y</button>
              </div>
            </div>

            {/* Age label + chips */}
            <div className="mb-3">
              <div className="text-white/90 mb-2 text-lg font-semibold">Age</div>
              <div className="flex gap-3 overflow-x-auto whitespace-nowrap">
                <button onClick={() => setQuickAge(20)} className={`px-3 py-2 rounded-lg font-semibold inline-block ${quickAge === 20 ? 'bg-yellow-500 text-black' : 'bg-yellow-300/90 text-black'}`}>20 Y</button>
                <button onClick={() => setQuickAge(30)} className={`px-3 py-2 rounded-lg font-semibold inline-block ${quickAge === 30 ? 'bg-yellow-500 text-black' : 'bg-yellow-300/90 text-black'}`}>30 Y</button>
                <button onClick={() => setQuickAge(40)} className={`px-3 py-2 rounded-lg font-semibold inline-block ${quickAge === 40 ? 'bg-yellow-500 text-black' : 'bg-yellow-300/90 text-black'}`}>40 Y</button>
                <button onClick={() => setQuickAge(50)} className={`px-3 py-2 rounded-lg font-semibold inline-block ${quickAge === 50 ? 'bg-yellow-500 text-black' : 'bg-yellow-300/90 text-black'}`}>50 Y</button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setShowQuickContainer(false)}
                className="px-4 py-2 rounded-md bg-white/20 text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // proceed directly to What-If / maturity view using quick selections
                  handleQuickOpen();
                }}
                className="px-4 py-2 rounded-md bg-yellow-500 text-black font-semibold"
                disabled={!quickTerm || !quickAge}
              >
                Open
              </button>
            </div>
          </div>
          </motion.div>
      )}

      {/* Short translucent prompt shown immediately after capture; user can choose to open the full selector */}
      {showSelectionPrompt && (
        // anchor the short selection prompt to the C2 grid line so it sits on the 'C' row
  <div className="fixed left-1/2 z-[80] pointer-events-none -translate-x-1/2" style={{ top: 'calc(var(--c2-top) - var(--prompt-c2-offset, 64px))' } as React.CSSProperties}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="pointer-events-auto"
          >
            <div className="rounded-2xl px-6 py-6 w-[88vw] max-w-[420px] text-center" style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.64), rgba(0,0,0,0.36))',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 14px 36px rgba(0,0,0,0.6)'
            }}>
              <div className="text-white text-xl font-extrabold mb-2">Your goal is now LOCKED</div>
                <div className="text-white/90 text-sm mb-4">તમે નક્કી કરેલું લક્ષ્ય હવે LIC ની ખાતરી સાથે સુરક્ષિત છે.<br/>આગળ વધીને તમારા માટે યોગ્ય પ્રીમિયમ જુઓ.</div>
              <div className="flex justify-center gap-3">
                <button onClick={() => setShowSelectionPrompt(false)} className="px-4 py-2 rounded-md bg-white/10 text-white">Close</button>
                <button onClick={() => { setShowSelectionPrompt(false); setShowQuickContainer(true); }} className="px-4 py-2 rounded-md bg-yellow-500 text-black font-semibold">Get premium</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
        {/* compute quick container position when it's shown so it doesn't overlap the coin */}
        {showQuickContainer && typeof window !== 'undefined' && (
          (() => {
            try {
              const coinEl = document.getElementById('lakshya-coin');
              if (coinEl) {
                  const r = coinEl.getBoundingClientRect();
                  // To satisfy a symmetric visual composition, center the translucent block horizontally
                  // while keeping it constrained inside the viewport with comfortable margins.
                  // We also nudge it slightly lower than the coin so it doesn't visually collide.
                    // clamp the prompt inside the viewport so it never overflows horizontally/vertically
                    const margin = 16; // px margin from viewport edges
                    let computedWidth = Math.min(640, Math.max(280, Math.round(window.innerWidth - margin * 2)));
                    // make extra sure width fits within available viewport
                    computedWidth = Math.min(computedWidth, Math.round(window.innerWidth - margin * 2));
                    let left = Math.round((window.innerWidth - computedWidth) / 2);
                    // clamp left so the box stays inside the viewport
                    left = Math.max(margin, Math.min(left, Math.round(window.innerWidth - computedWidth - margin)));
                    const width = computedWidth;
                    // nudge it slightly lower than the coin but clamp to visible area
                    const rawTop = Math.round(r.top + r.height * 0.18);
                    const top = Math.max(margin, Math.min(rawTop, Math.round(window.innerHeight - 160)));
                // set only if changed
                if (
                  !quickContainerPos ||
                  quickContainerPos.left !== left ||
                  quickContainerPos.top !== top ||
                  quickContainerPos.width !== width
                ) {
                  setQuickContainerPos({ left, top, width });
                }
              }
            } catch (e) {
              /* noop */
            }
            return null;
          })()
        )}
 

      {showPlanContext && (
         <div className="fixed inset-0 z-50 bg-black/50 flex flex-col justify-end">
            <GoalContext
                goalId={selectedGoal || ''}
                language="en"
          onProceed={handlePlanContextProceed}
          onCancel={() => setShowPlanContext(false)}
          defaultExpanded={true}
            />
         </div>
      )}

      {/* This section is being simplified. The staged display is removed. */}
      {showBenefitPage && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* The content here can be simplified or removed as per the new flow */}
        </motion.div>
      )}

  {/* Maturity / premium preview (What‑If sequence removed) */}
          {planSelection && showMaturityPreview && (
        <>

          {/* What‑If caption: appear when the What‑If sequence begins (during the family's 3s fade).
              The caption slides up and is slightly translucent. */}
          {whatIfStage >= 1 && showWhatIfCaption && (
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={whatIfStage >= 1 ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="fixed z-[60] -translate-x-1/2"
              // Align the bubble's vertical center to the '2' line (33.33%) and keep it below the B-line.
              style={{ left: '33.33%', top: 'calc(var(--coin-top) + var(--coin-size) * 0.8)', transform: 'translateX(-50%)' } as React.CSSProperties}
            >
              <div
                className="px-6 py-4 text-left"
                style={{
                  background: 'rgba(215,180,60,0.96)',
                  fontFamily: 'Georgia, serif',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
                  borderRadius: '22px',
                  minWidth: 'min(88vw, 320px)',
                  maxWidth: 'min(88vw, 340px)'
                }}
              >
                <div className="text-[21px] font-bold" style={{ color: '#1b4fa3', lineHeight: 1.15 }}>What happens</div>
                <div className="text-[21px] font-bold" style={{ color: '#1b4fa3', lineHeight: 1.15 }}>if parent dies...?</div>
                <div className="text-[19px] font-extrabold mt-2" style={{ color: '#d32f2f', lineHeight: 1.1 }}>શું સપનું અધૂરું રહી જશે?</div>
              </div>
            </motion.div>
          )}

          {/* Post-What‑If Gujarati assurance bubble */}
          {showGlossyBubble && showWhatIfCoin && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="fixed z-[62] -translate-x-1/2"
              // place the LIC guarantee pill near the bottom, just above the glossy arrow CTA
              // shifted left by 100px from center per request
              style={{ left: '50%', bottom: 'calc(3rem + 72px)', transform: 'translateX(calc(-50% - 100px))' } as React.CSSProperties}
            >
              <div className="px-5 py-4 rounded-2xl font-semibold text-[15px] leading-snug" style={{
                background: 'linear-gradient(180deg, rgba(255,240,190,0.95), rgba(255,228,140,0.92))',
                color: '#1b3d82',
                boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.4)',
                minWidth: 'min(86vw, 340px)'
              }}>
                ના. કારણ કે આ હવે LIC ની ગેરંટી છે.
              </div>
            </motion.div>
          )}

          {/* Premium Ceases pill */}
          {showPremiumCeasesPill && showWhatIfCoin && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="fixed z-[63]"
              // center Premium Ceases horizontally and stack above the LIC guarantee pill
              style={{ left: '50%', transform: 'translateX(-50%)', bottom: 'calc(3rem + 112px)' } as React.CSSProperties}
            >
              <div className="px-4 py-3 rounded-xl text-sm font-semibold shadow-lg" style={{
                background: 'linear-gradient(180deg, rgba(24,54,110,0.9), rgba(18,42,88,0.92))',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.12)'
              }}>
                Premium Ceases
              </div>
            </motion.div>
          )}

          {/* 10% Sum Assured Every Year pill */}
          {showTenPercentPill && showWhatIfCoin && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="fixed z-[63]"
              // center 10% SA horizontally and stack above Premium Ceases
              style={{ left: '50%', transform: 'translateX(-50%)', bottom: 'calc(3rem + 156px)' } as React.CSSProperties}
            >
              <div className="px-4 py-3 rounded-xl text-sm font-semibold shadow-lg" style={{
                background: 'linear-gradient(180deg, rgba(30,66,140,0.92), rgba(22,52,112,0.95))',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.14)'
              }}>
                10% Sum Assured Every Year
              </div>
            </motion.div>
          )}

          {/* Preview pills: show premium at the C2 grid and maturity after the 1s sequencing */}
          {planSelection && (
            <>
              {/* Premium pill: keep mounted during transition so we can animate it out */}
              {(showPremiumPill || transitioningToWhatIf) && (
                <motion.div
                  // slide up from below when the pill appears
                  initial={{ opacity: 0, y: 24 }}
                  animate={transitioningToWhatIf ? { opacity: 0, y: -18 } : { opacity: 1, y: 0 }}
                  transition={{ duration: transitioningToWhatIf ? 1.0 : 0.32, delay: 0.0, ease: "easeInOut" }}
                  // center at 50% then nudge left by 100px so it sits over C2 as designed
                  className="fixed z-[30] -translate-x-1/2"
                  style={{ left: 'calc(50% - 100px)', top: 'calc(var(--c2-top) - 125px)' } as React.CSSProperties}
                >
                  {/* Compact premium pill that slides up into place (no grow/shrink morph) */}
                  <div
                    className={`shadow-md border rounded-lg px-3 py-2`}
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), rgba(30,64,175,0.78)',
                      backdropFilter: 'blur(6px)',
                      borderColor: 'rgba(255,255,255,0.08)',
                      minWidth: 'min(240px, 86vw)',
                      transition: 'transform 260ms ease, opacity 220ms ease',
                      boxShadow: '0 10px 28px rgba(2,6,23,0.56)'
                    } as React.CSSProperties}
                  >
                    <div className="text-center">
                      {/* First line: label and amount on the same row (compact pill) */}
                      <div className={`flex items-baseline justify-center gap-3 text-sm`}>
                        <div className="text-white font-semibold">Annual premium</div>
                        <div className={`text-base font-bold text-white`}>₹{(planSelection.annualPremium ?? 0).toLocaleString('en-IN')}/-</div>
                      </div>

                      {/* Second line: monthly installment */}
                      {typeof planSelection.annualPremium === 'number' && planSelection.annualPremium > 0 && (
                        (() => {
                          try {
                            const inst = calculateInstallments(planSelection.annualPremium || 0);
                            return (
                              <div className={`text-xs text-white/90 mt-2`}>Monthly: ₹{inst.monthly.toLocaleString('en-IN')}</div>
                            );
                          } catch (e) {
                            return null;
                          }
                        })()
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Maturity pill: keep mounted during transition so we can animate it out */}
              {(showMaturityPill || transitioningToWhatIf) && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={transitioningToWhatIf ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
                  transition={{ duration: transitioningToWhatIf ? 1.0 : 0.38, delay: 0.02, ease: "easeInOut" }}
                  // place the maturity pill near B2, slightly right over the coin (small downward nudge)
                  className="fixed z-[60]"
                  style={{ left: 'calc(50% + 24px)', top: 'calc(var(--coin-top) + 12px)' } as React.CSSProperties}
                >
                  <div
                    className="rounded-xl px-1 py-2 border-2 shadow-xl"
                    style={{
                      background: 'linear-gradient(180deg, rgba(10,18,56,0.92), rgba(14,30,74,0.96))',
                      borderColor: 'rgba(252,211,77,0.95)',
                      // shrink width further so pill closely fits the text on narrow viewports
                      minWidth: 'min(150px, 70vw)',
                      maxWidth: '86vw'
                    } as React.CSSProperties}
                  >
                    <div className="text-center">
                      <div className="text-sm text-white/95 font-semibold">Maturity Benefit</div>
                      <div className="text-2xl font-extrabold text-yellow-300 mt-1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        ₹{planSelection.estimatedMaturity?.totalMaturity?.toLocaleString('en-IN') || 'N/A'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* Completion text removed per request */}

          {/* Glossy arrow button (primary CTA) - show when preview is active */}
          {planSelection && showMaturityPreview && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              onClick={() => { showWhatIfCoin ? handleProceedToPostWhatIf() : handleProceedToWhatIf(); }}
              className="fixed left-1/2 bottom-12 z-[20] -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
              style={{
                background: "linear-gradient(135deg, rgba(255,215,0,0.95) 0%, rgba(218,165,32,0.95) 100%)",
                boxShadow: "0 0 20px rgba(255,215,0,0.6), 0 4px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.4)",
                border: "2px solid rgba(255,223,0,0.9)"
              }}
              aria-label="Proceed to What-If"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}

          {/* What‑If coin + prompt + red glossy arrow (appears when What‑If starts) */}
          {showWhatIfCoin && (
            <>
              {/* what-if coin (same size & position as hero coin) */}
              <div className="fixed left-1/2 -translate-x-1/2 z-[50]" style={{ top: 'var(--coin-top)' } as React.CSSProperties}>
                <div className="relative rounded-full overflow-hidden" style={{ width: 'var(--coin-size)', height: 'var(--coin-size)' } as React.CSSProperties}>
                  <NextImage
                    src={
                      selectedGoal === 'career'
                        ? plan733Assets.career
                        : selectedGoal === 'marriage'
                        ? plan733Assets.marriage
                        : selectedGoal === 'study'
                        ? plan733Assets.study
                        : plan733Assets.goals
                    }
                    alt="What-if coin"
                    fill
                    className="object-cover"
                    // make the what-if coin appear subdued / gray to indicate a hypothetical state
                    style={{ objectFit: 'cover', filter: 'grayscale(1) contrast(0.95) brightness(0.92)' } as React.CSSProperties}
                    quality={90}
                  />
                </div>
              </div>

              {/* caption under the what-if coin is rendered earlier when What‑If starts; keep coin-only content here. */}
            </>
          )}
        </>
      )}

      {showTermRider && planSelection && (
          <TermRider
              planSelection={planSelection}
              onClose={handleTermRiderClose}
          />
      )}
    </main>

    {/* Colored overlay: render family and girl outside the grayscaled scene so they stay colored during What‑If */}
    <div className="fixed inset-0 pointer-events-none z-[4]">
    <motion.div
  // Single controller for dad & daughter during What‑If fade-out only
  // Fade out in-place (no vertical slide) — opacity drops quickly to 50% then holds
  // at 50% until ~2s into the timeline, then fades to 0 by 2.5s for a gentle exit.
  initial={{ y: 0, opacity: 1 }}
  animate={whatIfStage >= 2 ? { y: 0, opacity: [1, 0.5, 0.5, 0] } : { y: 0, opacity: 1 }}
  // Hold at 50% until ~2s then fade to 0 by 2.5s
  transition={whatIfStage >= 2 ? { duration: 2.5, ease: 'linear', opacity: { times: [0, 0.02, 0.8, 1] } } : { duration: 1.0, ease: 'easeInOut' }}
    style={{ pointerEvents: 'none' }}
  onAnimationStart={() => { if (whatIfStage >= 2) { try { console.log('[whatif] family outgoing start (2.5s)'); } catch(e){} } }}
  onAnimationComplete={() => { if (whatIfStage >= 2) { try { console.log('[whatif] family outgoing complete'); } catch(e){} } }}
  >
    <PathAndFamily animationStage={animationStage} parentControlled />
  </motion.div>

      {/* Render the girl only when NOT in the What-If stage so she doesn't appear in the What-If composition */}
      {(showGirlDuringFade || whatIfStage >= 3) && (
        <motion.div
          className="absolute z-[4] pointer-events-none"
          // anchor the girl directly to the C1 column using bottom positioning so there is no hidden offset
          initial={{ opacity: 0 }}
          animate={(showGirlDuringFade || whatIfStage >= 3) ? { opacity: 1 } : { opacity: 0 }}
          transition={(showGirlDuringFade || whatIfStage >= 3) ? { duration: 1.6, ease: 'easeOut', delay: 0 } : { duration: 1.6, ease: 'easeOut' }}
          // place the girl's left edge exactly at the computed grid column (vertical line 1)
          // then move 10px further left (net: -35px from original) and 50px up
          style={{ left: 'calc(var(--girl-left) - 35px)', bottom: 'calc(var(--girl-bottom, 0px) + 50px)' } as React.CSSProperties}
        >
          <div style={{ transform: 'scale(var(--girl-scale, 1))', transformOrigin: 'center bottom' }}>
            <GirlFigure noAnimation parentControlled />
          </div>
        </motion.div>
      )}
    </div>
  </>
  );
};

export default Plan733Page;