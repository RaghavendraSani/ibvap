/**
 * IBVAP Tactical Command — LoadingScreen Component
 * Full-screen military-grade boot sequence matching /public/loading.jpg
 *
 * Strict Color Palette:
 * - Background: #323435
 * - Primary accent: #938D64
 * - Deep fill / shadow: #000000
 * - Texture / crack lines: #1F2022
 *
 * 4-Stage Animation Timeline:
 * - Stage 1 (0.0s - 0.6s): Center split line expands to camera bounds [955, 1809]
 * - Stage 2 (0.6s - 1.6s): Camera silhouette stroke trace starting at rightmost lens hood
 * - Stage 3 (1.6s - 2.0s): Return marker travels back to horizontal center
 * - Stage 4 (2.0s - 2.6s): Split double-door reveal (translateX -100% / 100%)
 */

export class LoadingScreen {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'ibvap-loading-seen';
    this.onComplete = options.onComplete || null;
    this.forcePlay = options.forcePlay || false;
    this.holdDurationMs = options.holdDurationMs !== undefined ? options.holdDurationMs : 3000;
    this.overlayEl = null;
    this.hasCompleted = false;

    // Artwork & Camera bounding metrics in 2672 x 1536 coordinate space
    this.viewBoxW = 2672;
    this.viewBoxH = 1536;
    this.centerX = 1382;
    this.lineY = 740;
    this.cameraLeftBound = 955;
    this.cameraRightBound = 1809;

    // Continuous SVG silhouette path starting strictly at rightmost lens hood rim (1809, 640)
    this.cameraPathD = `
      M 1809,640
      C 1809,640 1806,615 1785,602
      C 1785,602 1750,595 1700,588
      C 1630,580 1575,575 1575,575
      L 1152,602
      C 1152,602 1125,608 1105,650
      C 1105,650 1102,730 1100,785
      C 1100,785 1110,825 1138,836
      L 1296,860
      C 1296,860 1325,875 1335,905
      C 1335,905 1335,935 1332,975
      C 1332,975 1295,1015 1245,1042
      C 1200,1055 1160,1060 1132,1062
      C 1132,1062 1100,1030 1075,995
      C 1075,995 1040,990 995,990
      C 965,1025 955,1070 955,1070
      C 946,1115 955,1165 975,1198
      C 998,1228 1035,1240 1070,1230
      C 1100,1215 1120,1185 1128,1145
      C 1128,1145 1180,1140 1240,1130
      C 1295,1115 1345,1085 1375,1040
      C 1382,980 1385,935 1375,895
      C 1375,895 1362,878 1362,878
      L 1490,885
      L 1670,895
      C 1670,895 1710,892 1735,880
      C 1735,880 1748,860 1770,810
      C 1785,750 1795,710 1795,710
      C 1805,680 1809,660 1809,640 Z
    `.trim();
  }

  /**
   * Check if reduced motion is requested
   */
  shouldReduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Check if loading sequence has already been seen this session
   */
  hasSeenIntro() {
    if (this.forcePlay) return false;
    try {
      return sessionStorage.getItem(this.storageKey) === 'true';
    } catch (e) {
      return false;
    }
  }

  /**
   * Mount and play the loading sequence
   */
  mount(container = document.body) {
    // If already seen or reduced-motion requested, skip animation immediately
    if (this.hasSeenIntro() || this.shouldReduceMotion()) {
      console.log('[LoadingScreen] Intro skipped (session seen or prefers-reduced-motion)');
      if (this.onComplete) this.onComplete();
      return;
    }

    this.buildDOM(container);
    this.startSequence();
  }

  /**
   * Build the dual-panel split DOM structure
   */
  buildDOM(container) {
    // Remove existing if any
    const existing = document.getElementById('loading-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';

    // SVG Filter definition for distressed/weathered military lettering
    const filterDef = `
      <svg class="loading-filter-defs" width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="distress-weathered-filter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    `;

    // Inner panel graphic content (duplicated in left and right split panels for perfect split-door effect)
    const createPanelContent = (isRight = false) => `
      <div class="panel-inner ${isRight ? 'panel-inner-right' : 'panel-inner-left'}">
        <img class="loading-art-bg" src="/loading.jpg" alt="IBVAP Border Watch" />
        <div class="loading-artwork-frame">
          <div class="loading-header-text">INDIAN ARMY</div>
          <svg class="loading-svg-canvas" viewBox="0 0 ${this.viewBoxW} ${this.viewBoxH}" preserveAspectRatio="xMidYMid slice">
            <!-- Stage 1: Leftward expanding line -->
            <line class="anim-line stage1-left-line"
              x1="${this.centerX}" y1="${this.lineY}"
              x2="${this.cameraLeftBound}" y2="${this.lineY}"
            />
            <!-- Stage 1: Rightward expanding line -->
            <line class="anim-line stage1-right-line"
              x1="${this.centerX}" y1="${this.lineY}"
              x2="${this.cameraRightBound}" y2="${this.lineY}"
            />
            <!-- Stage 2: Camera Silhouette Outline starting at rightmost lens hood -->
            <path class="anim-camera-path"
              d="${this.cameraPathD}"
            />
            <!-- Stage 3: Return to center line -->
            <line class="anim-line stage3-return-line"
              x1="${this.cameraRightBound}" y1="${this.lineY}"
              x2="${this.centerX}" y2="${this.lineY}"
            />
          </svg>
          <div class="loading-footer-text">IBVAP</div>
        </div>
      </div>
    `;

    overlay.innerHTML = `
      ${filterDef}
      <div class="split-panel left-panel">
        ${createPanelContent(false)}
      </div>
      <div class="split-panel right-panel">
        ${createPanelContent(true)}
      </div>
    `;

    container.appendChild(overlay);
    this.overlayEl = overlay;
  }

  /**
   * Run the 4-stage choreographed animation
   */
  startSequence() {
    if (!this.overlayEl) return;

    const leftPanel = this.overlayEl.querySelector('.left-panel');
    const rightPanel = this.overlayEl.querySelector('.right-panel');
    const stage1LeftLines = this.overlayEl.querySelectorAll('.stage1-left-line');
    const stage1RightLines = this.overlayEl.querySelectorAll('.stage1-right-line');
    const cameraPaths = this.overlayEl.querySelectorAll('.anim-camera-path');
    const stage3Lines = this.overlayEl.querySelectorAll('.stage3-return-line');

    // Calculate exact SVG path length for stroke-dash animation
    let pathLength = 3400;
    if (cameraPaths.length > 0) {
      try {
        pathLength = cameraPaths[0].getTotalLength() || 3400;
      } catch (e) {
        pathLength = 3400;
      }
    }

    cameraPaths.forEach(path => {
      path.style.strokeDasharray = `${pathLength} ${pathLength}`;
      path.style.strokeDashoffset = `${pathLength}`;
    });

    const leftLineDist = Math.abs(this.centerX - this.cameraLeftBound);
    const rightLineDist = Math.abs(this.cameraRightBound - this.centerX);

    stage1LeftLines.forEach(l => {
      l.style.strokeDasharray = `${leftLineDist} ${leftLineDist}`;
      l.style.strokeDashoffset = `${leftLineDist}`;
    });

    stage1RightLines.forEach(l => {
      l.style.strokeDasharray = `${rightLineDist} ${rightLineDist}`;
      l.style.strokeDashoffset = `${rightLineDist}`;
    });

    stage3Lines.forEach(l => {
      l.style.strokeDasharray = `${rightLineDist} ${rightLineDist}`;
      l.style.strokeDashoffset = `${rightLineDist}`;
      l.style.opacity = '0';
    });

    // =========================================================================
    // STAGE 1: Center Split Line (0s -> ~0.6s)
    // cubic-bezier(0.4, 0, 0.2, 1)
    // =========================================================================
    requestAnimationFrame(() => {
      stage1LeftLines.forEach(l => {
        l.style.transition = 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        l.style.strokeDashoffset = '0';
      });
      stage1RightLines.forEach(l => {
        l.style.transition = 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        l.style.strokeDashoffset = '0';
      });
    });

    // =========================================================================
    // STAGE 2: Camera Outline Trace (~0.6s -> ~1.6s)
    // Begins at rightmost lens hood (1809, 640)
    // =========================================================================
    setTimeout(() => {
      cameraPaths.forEach(path => {
        path.style.transition = 'stroke-dashoffset 1.0s cubic-bezier(0.45, 0.05, 0.55, 0.95)';
        path.style.strokeDashoffset = '0';
      });
    }, 600);

    // =========================================================================
    // STAGE 3: Return to Center (~1.6s -> ~2.0s)
    // Line/marker retraces back from rightmost bound to horizontal center
    // =========================================================================
    setTimeout(() => {
      stage3Lines.forEach(l => {
        l.style.opacity = '1';
        l.style.transition = 'stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        l.style.strokeDashoffset = '0';
      });
    }, 1600);

    // =========================================================================
    // HOLD PERIOD: Remain there for 3 full seconds (2.0s -> 5.0s)
    // Lets the user admire the complete military artwork, weathered stencil
    // typography, and camera outline for 3 full seconds before revealing.
    // =========================================================================
    const holdDurationMs = this.holdDurationMs !== undefined ? this.holdDurationMs : 3000;
    const splitRevealStartMs = 2000 + holdDurationMs;

    // Optional: add a subtle completed glow during the 3-second hold
    setTimeout(() => {
      cameraPaths.forEach(path => {
        path.classList.add('completed-glow');
      });
    }, 2000);

    // =========================================================================
    // STAGE 4: Split Reveal (After 3s hold -> ~5.0s -> ~5.55s)
    // Left: translateX(-100%), Right: translateX(100%)
    // cubic-bezier(0.76, 0, 0.24, 1), 550ms
    // =========================================================================
    setTimeout(() => {
      if (this.overlayEl) {
        this.overlayEl.style.pointerEvents = 'none';
      }

      if (leftPanel && rightPanel) {
        leftPanel.style.transition = 'transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)';
        rightPanel.style.transition = 'transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)';
        leftPanel.style.transform = 'translateX(-100%)';
        rightPanel.style.transform = 'translateX(100%)';
      }

      // Complete and unmount cleanly from DOM
      setTimeout(() => {
        this.finish();
      }, 580);
    }, splitRevealStartMs);
  }

  /**
   * Finalize sequence, mark session flag, unmount overlay
   */
  finish() {
    if (this.hasCompleted) return;
    this.hasCompleted = true;

    try {
      sessionStorage.setItem(this.storageKey, 'true');
    } catch (e) {
      // safe storage fallback
    }

    if (this.overlayEl) {
      this.overlayEl.remove();
      this.overlayEl = null;
    }

    if (this.onComplete) {
      this.onComplete();
    }

    console.log('[LoadingScreen] Sequence complete. Dashboard operational.');
  }

  /**
   * Force replay the loading sequence (resets session key)
   */
  static replay() {
    try {
      sessionStorage.removeItem('ibvap-loading-seen');
    } catch (e) {}
    window.location.reload();
  }
}
