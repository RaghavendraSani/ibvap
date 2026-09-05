/**
 * IBVAP Tactical Border Surveillance Command Platform — Dashboard Component
 * Exact pixel-faithful reproduction of the military intelligence command console.
 * 
 * Future-ready:
 * - Placeholder image ready for live webcam stream input (supports navigator.mediaDevices)
 * - Structured analytics & incident models ready for backend WebSocket / REST API ingestion
 */

export class Dashboard {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('dashboard-root');
    this.onLockTerminal = options.onLockTerminal || null;
    this.onReplayIntro = options.onReplayIntro || null;

    // Default placeholder data matching reference screenshot
    this.analytics = {
      activeCameras: '42 / 45',
      activeAlerts: '07',
      criticalAlerts: '02',
      personnelDetected: '18',
      vehiclesDetected: '06',
      threatLevel: 'ELEVATED',
      threatProgress: 48,
      sectorName: 'Sector B-17',
      cameraId: 'CAM-034',
      coordinates: '19.3526° N, 77.6958° E',
      officer: {
        name: 'Op. A. Sharma',
        unit: 'Control Room 1',
        serviceNo: 'G103-BHU'
      }
    };

    this.incidents = [
      {
        id: 1,
        thumb: '/assets/incident_1.jpg',
        badge: 'CRITICAL',
        badgeClass: 'badge-critical',
        title: 'Intrusion Detected',
        subtitle: 'Sector B-17 · Camera CAM-034',
        time: '22:41:08',
        status: 'Active',
        statusClass: 'status-active'
      },
      {
        id: 2,
        thumb: '/assets/incident_2.jpg',
        badge: 'HIGH',
        badgeClass: 'badge-high',
        title: 'Unknown Vehicle',
        subtitle: 'Sector C-04 · Camera CAM-021',
        time: '22:39:31',
        status: 'Active',
        statusClass: 'status-active'
      },
      {
        id: 3,
        thumb: '/assets/incident_3.jpg',
        badge: 'MEDIUM',
        badgeClass: 'badge-medium',
        title: 'Person Detected',
        subtitle: 'Sector A-12 · Camera CAM-008',
        time: '22:37:12',
        status: 'Resolved',
        statusClass: 'status-resolved'
      },
      {
        id: 4,
        thumb: '/assets/incident_4.jpg',
        badge: 'MEDIUM',
        badgeClass: 'badge-medium',
        title: 'ANPR Event',
        subtitle: 'Sector D-03 · Camera CAM-017',
        time: '22:34:55',
        status: 'Resolved',
        statusClass: 'status-resolved'
      },
      {
        id: 5,
        thumb: '/assets/incident_5.jpg',
        badge: 'LOW',
        badgeClass: 'badge-low',
        title: 'Perimeter Movement',
        subtitle: 'Sector B-09 · Camera CAM-026',
        time: '22:33:18',
        status: 'Resolved',
        statusClass: 'status-resolved'
      }
    ];

    this.clockInterval = null;
    this.webcamStream = null;
    this.isWebcamActive = false;

    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
    this.startClock();
  }

  render() {
    const threat = this.computeThreatStatus();
    this.analytics.threatLevel = threat.level;
    this.analytics.threatProgress = threat.progressPercent;

    this.container.innerHTML = `
      <div class="dash-layout">
        <!-- ===================================================================
             LEFT SIDEBAR NAVIGATION
             =================================================================== -->
        <aside class="dash-sidebar-nav">
          <div class="sidebar-header">
            <div class="sidebar-brand">
              <img src="/assets/logo.jpg" alt="IBVAP — Intelligent Border Video Analytics Platform" class="sidebar-brand-logo" onerror="this.onerror=null; this.src='logo.jpg'" />
            </div>
            <!-- Minimize / Maximize Toggle -->
            <button id="btn-sidebar-toggle" class="btn-sidebar-toggle" title="Toggle Sidebar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Navigation Menu Items -->
          <nav class="sidebar-nav-menu">
            <a href="#command" class="nav-item active" data-view="command">
              <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Command</span>
            </a>

            <a href="#live-feed" class="nav-item" data-view="live-feed">
              <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              <span>Live Feed</span>
            </a>

            <a href="#analytics" class="nav-item" data-view="analytics">
              <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              <span>Analytics & Reports</span>
            </a>

            <a href="#incidents" class="nav-item" data-view="incidents">
              <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Incidents</span>
              <span class="nav-badge">7</span>
            </a>

            <a href="#system" class="nav-item" data-view="system">
              <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span>System</span>
            </a>
          </nav>

          <!-- Bottom Area allowing background soldiers artwork to show through -->
          <div class="sidebar-bottom-spacer"></div>
        </aside>

        <!-- ===================================================================
             MAIN DASHBOARD CONTENT AREA
             =================================================================== -->
        <div class="dash-main-viewport">
          <!-- Top Horizontal Header -->
          <header class="dash-top-bar">
            <!-- Right Meta Controls -->
            <div class="top-meta-controls">
              <!-- Live Date & Clock -->
              <div id="dash-header-datetime" class="meta-datetime">
                Fri, 5 Sep 2026 &nbsp; 22:41:30
              </div>

              <!-- Notifications Bell -->
              <button class="meta-btn btn-notif" title="Notifications">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span class="notif-badge">3</span>
              </button>

              <!-- Officer Profile Pill & Dropdown Anchor -->
              <div class="officer-profile-wrap">
                <button id="btn-officer-profile" class="officer-profile-btn" title="Duty Officer Profile">
                  <div class="officer-avatar">AS</div>
                  <div class="officer-text">
                    <div id="dash-officer-name" class="officer-name">${this.analytics.officer.name}</div>
                    <div id="dash-officer-unit" class="officer-sub">${this.analytics.officer.unit}</div>
                  </div>
                  <svg class="caret-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                <!-- Profile Dropdown Menu -->
                <div id="officer-dropdown" class="officer-dropdown-menu hidden">
                  <div class="dropdown-header">
                    <div class="dropdown-badge">DUTY OPERATOR</div>
                    <div class="dropdown-id">${this.analytics.officer.serviceNo} · ${this.analytics.officer.unit}</div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <button id="btn-toggle-webcam" class="dropdown-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                    <span id="webcam-status-text">Switch to Live Webcam</span>
                  </button>
                  <button id="btn-replay-intro" class="dropdown-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="1 4 1 10 7 10"></polyline>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                    </svg>
                    <span>Replay Boot Sequence</span>
                  </button>
                  <button id="btn-lock-terminal" class="dropdown-item item-danger">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span>Lock Defense Terminal</span>
                  </button>
                </div>
              </div>

              <!-- Army / Nation Tag -->
              <div class="header-divider-v"></div>
              <div class="motto-tag">
                <span class="motto-army">INDIAN ARMY</span>
                <span class="motto-nation">NATION FIRST</span>
              </div>
            </div>
          </header>

          <!-- =================================================================
               TOP ANALYTICS / KPI METRICS ROW (6 INDIVIDUAL CARDS)
               ================================================================= -->
          <section class="dash-metrics-row">
            <!-- 1. Active Cameras -->
            <div class="kpi-card">
              <div class="kpi-icon-wrap icon-mint">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Active Cameras</div>
                <div class="kpi-value-row">
                  <span id="kpi-active-cameras" class="kpi-value">${this.analytics.activeCameras}</span>
                  <span class="kpi-trend trend-green">↑ 2%</span>
                </div>
              </div>
            </div>

            <!-- 2. Active Alerts -->
            <div class="kpi-card">
              <div class="kpi-icon-wrap icon-mint">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Active Alerts</div>
                <div class="kpi-value-row">
                  <span id="kpi-active-alerts" class="kpi-value">${this.analytics.activeAlerts}</span>
                  <span class="kpi-trend trend-red">↑ 40%</span>
                </div>
              </div>
            </div>

            <!-- 3. Critical Alerts -->
            <div class="kpi-card">
              <div class="kpi-icon-wrap icon-critical">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 2 22 22 22"></polygon>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Critical Alerts</div>
                <div class="kpi-value-row">
                  <span id="kpi-critical-alerts" class="kpi-value">${this.analytics.criticalAlerts}</span>
                  <span class="kpi-trend trend-red">↑ 100%</span>
                </div>
              </div>
            </div>

            <!-- 4. Personnel Detected -->
            <div class="kpi-card">
              <div class="kpi-icon-wrap icon-mint">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Personnel Detected</div>
                <div class="kpi-value-row">
                  <span id="kpi-personnel-detected" class="kpi-value">${this.analytics.personnelDetected}</span>
                  <span class="kpi-trend trend-green">↑ 12%</span>
                </div>
              </div>
            </div>

            <!-- 5. Vehicles Detected -->
            <div class="kpi-card">
              <div class="kpi-icon-wrap icon-mint">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="8" rx="2"></rect>
                  <path d="M5 11l2-5h10l2 5"></path>
                  <circle cx="7.5" cy="15.5" r="1.5"></circle>
                  <circle cx="16.5" cy="15.5" r="1.5"></circle>
                </svg>
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Vehicles Detected</div>
                <div class="kpi-value-row">
                  <span id="kpi-vehicles-detected" class="kpi-value">${this.analytics.vehiclesDetected}</span>
                  <span class="kpi-trend trend-green">↑ 20%</span>
                </div>
              </div>
            </div>
          </section>

          <!-- =================================================================
               MAIN WORKSPACE GRID: LIVE CAM VIEWPORT (LEFT) + RIGHT PANEL
               ================================================================= -->
          <div class="dash-grid-workspace">
            <!-- Left: Primary Live Camera Feed -->
            <section class="live-cam-panel" id="live-cam-panel">
              <!-- Visual Media (Placeholder Image or Future Live Webcam) -->
              <div class="cam-media-container">
                <img 
                  id="cam-placeholder-img" 
                  class="cam-media-element" 
                  src="/assets/camera_feed_placeholder.png" 
                  alt="Border Perimeter Surveillance Live Feed" 
                  onerror="this.onerror=null; this.src='/public/assets/camera_feed_placeholder.png'"
                />
                <video 
                  id="cam-webcam-video" 
                  class="cam-media-element hidden" 
                  autoplay 
                  playsinline 
                  muted
                ></video>

                <!-- WebCam Badge overlay when webcam is on -->
                <div id="webcam-live-indicator" class="webcam-badge hidden">HARDWARE WEBCAM ACTIVE</div>
              </div>

              <!-- Overlays Layer -->
              <div class="cam-overlay-layer">
                <!-- Top-Left Camera Telemetry -->
                <div class="cam-overlay-top-left">
                  <div class="cam-live-row">
                    <span class="live-pill">
                      <span class="live-pulse-dot"></span>
                      <span class="live-text">LIVE</span>
                    </span>
                    <span class="cam-id-tag">${this.analytics.cameraId} &nbsp;|&nbsp; ${this.analytics.sectorName}</span>
                  </div>
                  <div class="cam-coordinates">${this.analytics.coordinates}</div>
                </div>

                <!-- Top-Right Corner Controls -->
                <div class="cam-overlay-top-right">
                  <button id="btn-cam-fullscreen" class="btn-cam-overlay-tool" title="Expand Fullscreen">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <polyline points="9 21 3 21 3 15"></polyline>
                      <line x1="21" y1="3" x2="14" y2="10"></line>
                      <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                  </button>
                </div>

                <!-- Bottom-Left Border Perimeter Tag -->
                <div class="cam-overlay-bottom-left">
                  <div class="perimeter-badge-box">
                    <div class="perimeter-title">BORDER PERIMETER</div>
                    <div class="perimeter-sub">${this.analytics.sectorName}</div>
                  </div>
                </div>

                <!-- Bottom-Right Live Timestamp -->
                <div class="cam-overlay-bottom-right">
                  <div id="cam-bottom-timestamp" class="cam-bottom-timestamp">
                    05 Sep 2026 &nbsp; 22:41:08
                  </div>
                </div>
              </div>
            </section>

            <!-- Right Column: Intel Panels (Current Threat Level + Live Incident Feed) -->
            <aside class="dash-right-intel-column">
              <!-- Card 1: Current Threat Level -->
              <div class="threat-level-card">
                <div class="intel-card-header">
                  <div class="intel-title-wrap">
                    <span class="intel-card-title">CURRENT THREAT LEVEL</span>
                    <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                </div>

                <div class="threat-card-body">
                  <div class="threat-info-col">
                    <!-- Bold Level Title -->
                    <div id="threat-display-val" class="threat-display-val">${threat.level}</div>

                    <!-- Threat Meter / Segmented Progress Bar -->
                    <div class="threat-segmented-meter">
                      <div class="threat-meter-segment seg-filled"></div>
                      <div class="threat-meter-segment seg-filled"></div>
                      <div class="threat-meter-segment seg-filled"></div>
                      <div class="threat-meter-segment seg-filled"></div>
                      <div class="threat-meter-segment seg-filled"></div>
                      <div class="threat-meter-segment seg-filled"></div>
                      <div class="threat-meter-segment seg-filled"></div>
                      <div class="threat-meter-segment seg-empty"></div>
                      <div class="threat-meter-segment seg-empty"></div>
                      <div class="threat-meter-segment seg-empty"></div>
                    </div>

                    <!-- Description / Status -->
                    <div class="threat-status-desc">
                      <div id="threat-activity-text" class="threat-act-title">${threat.activityText} detected.</div>
                      <div class="threat-act-sub">Heightened monitoring in effect.</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Inset Divider Line Between Sections -->
              <div class="intel-panel-divider"></div>

              <!-- Section 2: Live Incident Feed -->
              <div class="incident-feed-card">
                <div class="intel-card-header">
                  <span class="intel-card-title">LIVE INCIDENT FEED</span>
                  <a href="#view-all-incidents" id="btn-view-all-incidents" class="intel-link">
                    View All &nbsp;→
                  </a>
                </div>

                <!-- Incident Items List separated by lines that don't touch edges -->
                <div class="incident-list-scroll">
                  ${this.incidents.map(item => `
                    <div class="incident-list-item" data-id="${item.id}">
                      <div class="incident-thumb-wrap">
                        <img src="${item.thumb}" alt="${item.title}" class="incident-thumb-img" />
                      </div>
                      <div class="incident-details">
                        <div class="incident-badge-row">
                          <span class="incident-badge ${item.badgeClass}">${item.badge}</span>
                          <span class="incident-title">${item.title}</span>
                        </div>
                        <div class="incident-sub">${item.subtitle}</div>
                      </div>
                      <div class="incident-meta">
                        <div class="incident-time">${item.time}</div>
                        <div class="incident-status ${item.statusClass}">
                          <span class="status-dot"></span>
                          <span>${item.status}</span>
                        </div>
                      </div>
                      <div class="incident-chevron">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // 1. Profile Dropdown toggle
    const profileBtn = this.container.querySelector('#btn-officer-profile');
    const dropdown = this.container.querySelector('#officer-dropdown');
    if (profileBtn && dropdown) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });

      document.addEventListener('click', () => {
        dropdown.classList.add('hidden');
      });
    }

    // 2. Lock Terminal
    const btnLock = this.container.querySelector('#btn-lock-terminal');
    if (btnLock) {
      btnLock.addEventListener('click', () => {
        if (dropdown) dropdown.classList.add('hidden');
        if (this.onLockTerminal) this.onLockTerminal();
      });
    }

    // 3. Replay Boot Sequence
    const btnReplay = this.container.querySelector('#btn-replay-intro');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        if (dropdown) dropdown.classList.add('hidden');
        if (this.onReplayIntro) this.onReplayIntro();
      });
    }

    // 4. Fullscreen Cam Viewport Toggle
    const btnFullscreen = this.container.querySelector('#btn-cam-fullscreen');
    const camPanel = this.container.querySelector('#live-cam-panel');
    if (btnFullscreen && camPanel) {
      btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          if (camPanel.requestFullscreen) {
            camPanel.requestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });
    }

    // 5. Future Webcam Toggle Button (hardware webcam test)
    const btnWebcam = this.container.querySelector('#btn-toggle-webcam');
    if (btnWebcam) {
      btnWebcam.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleWebcam();
      });
    }

    // 6. Navigation tabs active state toggle
    const navItems = this.container.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // 7. Sidebar Three Lines Minimize / Maximize Toggle
    const btnToggle = this.container.querySelector('#btn-sidebar-toggle');
    const sidebar = this.container.querySelector('.dash-sidebar-nav');

    if (btnToggle && sidebar) {
      btnToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('collapsed');
      });
    }

    // 8. Incident item status toggle (interactive demonstration: toggling critical incidents updates threat level)
    const incidentItems = this.container.querySelectorAll('.incident-list-item');
    incidentItems.forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.getAttribute('data-id'), 10);
        const inc = this.incidents.find(i => i.id === id);
        if (inc) {
          inc.status = inc.status === 'Active' ? 'Resolved' : 'Active';
          inc.statusClass = inc.status === 'Active' ? 'status-active' : 'status-resolved';
          
          const statusEl = el.querySelector('.incident-status');
          if (statusEl) {
            statusEl.className = `incident-status ${inc.statusClass}`;
            statusEl.innerHTML = `
              <span class="status-dot"></span>
              <span>${inc.status}</span>
            `;
          }

          const activeCriticals = this.incidents.filter(i => i.badge === 'CRITICAL' && i.status === 'Active').length;
          this.analytics.criticalAlerts = String(activeCriticals).padStart(2, '0');
          const kpiCritical = this.container.querySelector('#kpi-critical-alerts');
          if (kpiCritical) kpiCritical.textContent = this.analytics.criticalAlerts;

          this.refreshThreatLevelUI();
        }
      });
    });
  }

  /**
   * Start live system clock synchronized with user local time
   */
  startClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);

    const updateTime = () => {
      const now = new Date();
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const dayName = days[now.getDay()];
      const dayNum = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();

      const pad = (n) => String(n).padStart(2, '0');
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const headerStr = `${dayName}, ${dayNum} ${monthName} ${year} &nbsp; ${timeStr}`;
      const camStr = `${pad(dayNum)} ${monthName} ${year} &nbsp; ${timeStr}`;

      const headerEl = this.container.querySelector('#dash-header-datetime');
      if (headerEl) headerEl.innerHTML = headerStr;

      const camClockEl = this.container.querySelector('#cam-bottom-timestamp');
      if (camClockEl) camClockEl.innerHTML = camStr;
    };

    updateTime();
    this.clockInterval = setInterval(updateTime, 1000);
  }

  /**
   * Toggle Live Webcam Hardware Feed
   */
  async toggleWebcam() {
    const videoEl = this.container.querySelector('#cam-webcam-video');
    const imgEl = this.container.querySelector('#cam-placeholder-img');
    const statusText = this.container.querySelector('#webcam-status-text');
    const indicator = this.container.querySelector('#webcam-live-indicator');

    if (this.isWebcamActive) {
      // Turn off webcam
      if (this.webcamStream) {
        this.webcamStream.getTracks().forEach(track => track.stop());
        this.webcamStream = null;
      }
      this.isWebcamActive = false;
      if (videoEl) videoEl.classList.add('hidden');
      if (imgEl) imgEl.classList.remove('hidden');
      if (indicator) indicator.classList.add('hidden');
      if (statusText) statusText.textContent = 'Switch to Live Webcam';
      console.log('[Dashboard] Webcam feed disconnected. Restored placeholder feed.');
    } else {
      // Turn on webcam
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert('Webcam API is not supported in this browser environment.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } }
        });

        this.webcamStream = stream;
        this.isWebcamActive = true;

        if (videoEl) {
          videoEl.srcObject = stream;
          videoEl.classList.remove('hidden');
        }
        if (imgEl) imgEl.classList.add('hidden');
        if (indicator) indicator.classList.remove('hidden');
        if (statusText) statusText.textContent = 'Disconnect Webcam';
        console.log('[Dashboard] Live hardware webcam stream connected.');
      } catch (err) {
        console.warn('[Dashboard] Webcam permission denied or device not found:', err);
        alert('Could not connect to webcam: ' + err.message + '\nUsing placeholder feed.');
      }
    }
  }

  /**
   * Set Duty Officer Info from Login
   */
  setDutyOfficer(serviceNo, postName = 'Control Room 1') {
    this.analytics.officer.serviceNo = serviceNo.toUpperCase();
    if (serviceNo.toUpperCase() === 'G103-BHU') {
      this.analytics.officer.name = 'Op. A. Sharma';
      this.analytics.officer.unit = 'Control Room 1';
    } else {
      this.analytics.officer.name = `Op. ${serviceNo.toUpperCase()}`;
      this.analytics.officer.unit = postName;
    }

    const nameEl = this.container.querySelector('#dash-officer-name');
    const unitEl = this.container.querySelector('#dash-officer-unit');
    if (nameEl) nameEl.textContent = this.analytics.officer.name;
    if (unitEl) unitEl.textContent = this.analytics.officer.unit;
  }

  /**
   * API Method: Update Analytics metrics from backend
   */
  updateAnalytics(newData = {}) {
    Object.assign(this.analytics, newData);

    const update = (id, val) => {
      const el = this.container.querySelector(id);
      if (el && val !== undefined) el.textContent = val;
    };

    update('#kpi-active-cameras', this.analytics.activeCameras);
    update('#kpi-active-alerts', this.analytics.activeAlerts);
    update('#kpi-critical-alerts', this.analytics.criticalAlerts);
    update('#kpi-personnel-detected', this.analytics.personnelDetected);
    update('#kpi-vehicles-detected', this.analytics.vehiclesDetected);

    this.refreshThreatLevelUI();
  }

  /**
   * Determine Threat Level based on Critical Incidents count
   */
  computeThreatStatus() {
    let criticalCount = 0;
    if (this.incidents && Array.isArray(this.incidents)) {
      criticalCount = this.incidents.filter(
        inc => String(inc.badge).toUpperCase() === 'CRITICAL' && 
               String(inc.status).toLowerCase() === 'active'
      ).length;
    }
    
    if (this.analytics && this.analytics.criticalAlerts !== undefined) {
      const parsed = parseInt(this.analytics.criticalAlerts, 10);
      if (!isNaN(parsed)) {
        criticalCount = Math.max(criticalCount, parsed);
      }
    }

    const isElevated = criticalCount > 0;

    return {
      criticalCount,
      isElevated,
      level: isElevated ? 'ELEVATED' : 'LOW',
      activityText: isElevated ? 'Increased activity' : 'Normal activity',
      progressPercent: isElevated ? 70 : 20
    };
  }

  /**
   * Refresh Threat Level UI dynamically based on active critical incidents
   */
  refreshThreatLevelUI() {
    const threat = this.computeThreatStatus();
    this.analytics.threatLevel = threat.level;
    this.analytics.threatProgress = threat.progressPercent;

    const valEl = this.container.querySelector('#threat-display-val');
    if (valEl) {
      valEl.textContent = threat.level;
      valEl.style.color = threat.isElevated ? 'var(--army-green)' : 'var(--text-primary)';
    }

    const textEl = this.container.querySelector('#threat-activity-text');
    if (textEl) {
      textEl.textContent = `${threat.activityText} detected.`;
    }

    const segments = this.container.querySelectorAll('.threat-meter-segment');
    if (segments && segments.length) {
      const filledCount = threat.isElevated ? 7 : 2;
      segments.forEach((seg, idx) => {
        if (idx < filledCount) {
          seg.className = 'threat-meter-segment seg-filled';
        } else {
          seg.className = 'threat-meter-segment seg-empty';
        }
      });
    }
  }

  show() {
    if (this.container) {
      this.container.style.display = 'block';
    }
  }

  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  destroy() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach(t => t.stop());
    }
  }
}
