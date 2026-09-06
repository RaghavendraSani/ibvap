/**
 * IBVAP Tactical Surveillance Platform — Live Feed View Component
 * Multi-camera tactical surveillance command interface.
 * Features:
 * - High-definition primary feed with real-time OSD HUD telemetry overlays
 * - Multi-camera carousel with instant live switching across all border posts
 * - Focus View vs Grid View multi-matrix surveillance modes
 * - Real-time camera metadata, elevation, sensor specs, and environmental conditions
 * - Fullscreen display expansion and copyable geolocation coordinates
 */

export class LiveFeedView {
  constructor(options = {}) {
    this.container = null;
    this.selectedCameraId = 'CAM-034';
    this.viewMode = 'focus'; // 'focus' | 'grid'
    this.selectedSector = 'All Sectors';
    this.selectedCameraFilter = 'All Cameras';
    this.clockInterval = null;

    // All available sector surveillance cameras
    this.cameras = [
      {
        id: 'CAM-034',
        name: 'CAM-034',
        location: 'Perimeter Fence - East',
        sector: 'Sector B-17',
        subtitle: 'Perimeter PTZ Camera',
        stream: '/assets/camera_feed_placeholder.png',
        thumb: '/assets/camera_feed_placeholder.png',
        coordinates: '19.3526° N, 77.6958° E',
        elevation: '312 m',
        cameraType: 'PTZ (360°)',
        resolution: '1920 × 1080 (Full HD)',
        frameRate: '25 FPS',
        uptime: '12 days 04 hrs',
        lastMaintenance: '22 Aug 2026',
        status: 'Online',
        activity: 'Normal Activity',
        temp: '24°C',
        humidity: '62%',
        windSpeed: '12 km/h',
        visibility: 'Good'
      },
      {
        id: 'CAM-021',
        name: 'CAM-021',
        location: 'Border Road',
        sector: 'Sector B-17',
        subtitle: 'Thermal Highway Cam',
        stream: '/assets/cam_border_road.jpg',
        thumb: '/assets/cam_border_road.jpg',
        coordinates: '19.3491° N, 77.6892° E',
        elevation: '298 m',
        cameraType: 'Fixed Bullet (120°)',
        resolution: '1920 × 1080 (Full HD)',
        frameRate: '30 FPS',
        uptime: '18 days 11 hrs',
        lastMaintenance: '15 Aug 2026',
        status: 'Online',
        activity: 'Vehicle Patrol Passing',
        temp: '24°C',
        humidity: '61%',
        windSpeed: '14 km/h',
        visibility: 'Good'
      },
      {
        id: 'CAM-012',
        name: 'CAM-012',
        location: 'Watch Tower 1',
        sector: 'Sector B-17',
        subtitle: 'Long-Range IR Optical',
        stream: '/assets/cam_watch_tower.jpg',
        thumb: '/assets/cam_watch_tower.jpg',
        coordinates: '19.3567° N, 77.7011° E',
        elevation: '345 m',
        cameraType: 'High-Mast Pan/Tilt',
        resolution: '2560 × 1440 (2K QHD)',
        frameRate: '25 FPS',
        uptime: '9 days 17 hrs',
        lastMaintenance: '29 Aug 2026',
        status: 'Online',
        activity: 'Guard Station Active',
        temp: '23°C',
        humidity: '64%',
        windSpeed: '16 km/h',
        visibility: 'Good'
      },
      {
        id: 'CAM-008',
        name: 'CAM-008',
        location: 'Riverbed Area',
        sector: 'Sector B-17',
        subtitle: 'Low-Light Gorge Sensor',
        stream: '/assets/cam_riverbed.jpg',
        thumb: '/assets/cam_riverbed.jpg',
        coordinates: '19.3412° N, 77.6745° E',
        elevation: '265 m',
        cameraType: 'Starlight Dual-Lens',
        resolution: '1920 × 1080 (Full HD)',
        frameRate: '20 FPS',
        uptime: '21 days 02 hrs',
        lastMaintenance: '10 Aug 2026',
        status: 'Online',
        activity: 'Normal Activity',
        temp: '25°C',
        humidity: '68%',
        windSpeed: '9 km/h',
        visibility: 'Clear'
      },
      {
        id: 'CAM-017',
        name: 'CAM-017',
        location: 'Access Trail',
        sector: 'Sector B-17',
        subtitle: 'Switchback Trail Cam',
        stream: '/assets/cam_access_trail.jpg',
        thumb: '/assets/cam_access_trail.jpg',
        coordinates: '19.3620° N, 77.7123° E',
        elevation: '328 m',
        cameraType: 'Infrared Trail Monitor',
        resolution: '1920 × 1080 (Full HD)',
        frameRate: '25 FPS',
        uptime: '14 days 09 hrs',
        lastMaintenance: '18 Aug 2026',
        status: 'Online',
        activity: 'Normal Activity',
        temp: '24°C',
        humidity: '60%',
        windSpeed: '11 km/h',
        visibility: 'Good'
      },
      {
        id: 'CAM-026',
        name: 'CAM-026',
        location: 'Outer Perimeter',
        sector: 'Sector B-17',
        subtitle: 'Perimeter Fog Optical',
        stream: '/assets/cam_outer_perimeter.jpg',
        thumb: '/assets/cam_outer_perimeter.jpg',
        coordinates: '19.3385° N, 77.6620° E',
        elevation: '305 m',
        cameraType: 'Thermal Bi-Spectrum',
        resolution: '1920 × 1080 (Full HD)',
        frameRate: '25 FPS',
        uptime: '11 days 22 hrs',
        lastMaintenance: '24 Aug 2026',
        status: 'Online',
        activity: 'Boundary Monitored',
        temp: '22°C',
        humidity: '72%',
        windSpeed: '13 km/h',
        visibility: 'Moderate'
      },
      {
        id: 'CAM-031',
        name: 'CAM-031',
        location: 'Check Post',
        sector: 'Sector B-17',
        subtitle: 'Security Barrier Optical',
        stream: '/assets/cam_check_post.jpg',
        thumb: '/assets/cam_check_post.jpg',
        coordinates: '19.3510° N, 77.6915° E',
        elevation: '310 m',
        cameraType: 'Multi-Sensor Checkpoint',
        resolution: '3840 × 2160 (4K UHD)',
        frameRate: '30 FPS',
        uptime: '31 days 06 hrs',
        lastMaintenance: '05 Aug 2026',
        status: 'Online',
        activity: 'Checkpoint Clear',
        temp: '24°C',
        humidity: '62%',
        windSpeed: '10 km/h',
        visibility: 'Good'
      }
    ];
  }

  getActiveCamera() {
    return this.cameras.find(c => c.id === this.selectedCameraId) || this.cameras[0];
  }

  getFilteredCameras() {
    return this.cameras.filter(cam => {
      if (this.selectedSector !== 'All Sectors' && cam.sector !== this.selectedSector) return false;
      if (this.selectedCameraFilter !== 'All Cameras' && cam.id !== this.selectedCameraFilter) return false;
      return true;
    });
  }

  render() {
    const cam = this.getActiveCamera();
    const filteredCameras = this.getFilteredCameras();

    return `
      <div class="live-feed-container" id="live-feed-root">
        <!-- ===================================================================
             1. HEADER: TITLE & TOP CONTROLS TOOLBAR
             =================================================================== -->
        <div class="live-feed-header-row">
          <div class="live-title-group">
            <h1 class="live-feed-title">Live Feed</h1>
            <div class="live-feed-subtitle">Real-time surveillance across all border sectors</div>
          </div>

          <!-- Top Controls Toolbar -->
          <div class="live-header-controls">
            <!-- Sector Selector Dropdown -->
            <div class="custom-select-wrap select-toolbar">
              <select id="select-feed-sector" class="sys-select feed-select">
                <option value="All Sectors" ${this.selectedSector === 'All Sectors' ? 'selected' : ''}>All Sectors</option>
                <option value="Sector B-17" ${this.selectedSector === 'Sector B-17' ? 'selected' : ''}>Sector B-17</option>
                <option value="Sector C-04" ${this.selectedSector === 'Sector C-04' ? 'selected' : ''}>Sector C-04</option>
                <option value="Sector A-09" ${this.selectedSector === 'Sector A-09' ? 'selected' : ''}>Sector A-09</option>
                <option value="Sector D-12" ${this.selectedSector === 'Sector D-12' ? 'selected' : ''}>Sector D-12</option>
              </select>
              <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            <!-- Camera Selector Dropdown -->
            <div class="custom-select-wrap select-toolbar">
              <select id="select-feed-camera" class="sys-select feed-select">
                <option value="All Cameras" ${this.selectedCameraFilter === 'All Cameras' ? 'selected' : ''}>All Cameras</option>
                ${this.cameras.map(c => `
                  <option value="${c.id}" ${this.selectedCameraId === c.id ? 'selected' : ''}>${c.id} (${c.location})</option>
                `).join('')}
              </select>
              <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            <!-- View Mode Toggles -->
            <div class="view-mode-toggle-group">
              <button class="btn-view-mode ${this.viewMode === 'grid' ? 'active' : ''}" id="btn-mode-grid" title="Switch to Multi-Camera Grid Matrix">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Grid View</span>
              </button>

              <button class="btn-view-mode ${this.viewMode === 'focus' ? 'active' : ''}" id="btn-mode-focus" title="Switch to Single Camera Focus View">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
                <span>Focus View</span>
              </button>
            </div>

            <!-- Fullscreen Action -->
            <button class="btn-fullscreen-toggle" id="btn-feed-fullscreen" title="Toggle Surveillance Fullscreen">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- ===================================================================
             2. MAIN STAGE CONTENT (FOCUS VIEW VS GRID VIEW)
             =================================================================== -->
        ${this.viewMode === 'focus' ? this.renderFocusStage(cam) : this.renderGridStage(filteredCameras)}

        <!-- ===================================================================
             3. BOTTOM CAROUSEL: ALL CAMERA FEEDS (SECTOR B-17)
             =================================================================== -->
        <div class="bottom-cameras-gallery">
          <div class="gallery-header-row">
            <h2 class="gallery-title">All Camera Feeds (${cam.sector})</h2>
            <div class="gallery-controls">
              <button class="gallery-nav-btn" id="btn-carousel-left" title="Scroll Left">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button class="gallery-nav-btn" id="btn-carousel-right" title="Scroll Right">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <!-- Thumbnails Row -->
          <div class="gallery-thumbnails-strip" id="camera-thumbnails-strip">
            ${this.cameras.map(c => `
              <div class="cam-thumb-card ${c.id === this.selectedCameraId ? 'active-thumb' : ''}" data-cam-id="${c.id}">
                <div class="thumb-media-wrap">
                  <img src="${c.thumb}" alt="${c.name} Feed" class="thumb-img" onerror="this.onerror=null; this.src='/assets/camera_feed_placeholder.png'" />
                  <div class="thumb-live-badge">
                    <span class="pulse-dot-red"></span>
                    <span>LIVE</span>
                  </div>
                </div>
                <div class="thumb-info-bar">
                  <div class="thumb-id-row">
                    <span class="status-dot-green"></span>
                    <span class="thumb-name">${c.name}</span>
                  </div>
                  <div class="thumb-location">${c.location}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Toast Feedback Notification -->
        <div id="feed-toast" class="sys-toast-notification hidden"></div>
      </div>
    `;
  }

  renderFocusStage(cam) {
    return `
      <div class="focus-stage-layout">
        <!-- Main Surveillance Video Feed Monitor (Left) -->
        <div class="hero-feed-player" id="hero-feed-player">
          <div class="feed-media-container">
            <img 
              id="main-live-feed-img" 
              src="${cam.stream}" 
              alt="${cam.name} Live Surveillance Stream" 
              class="hero-stream-media"
              onerror="this.onerror=null; this.src='/assets/camera_feed_placeholder.png'" 
            />

            <!-- Top Left HUD OSD Pill -->
            <div class="osd-hud-top-left">
              <div class="hud-live-tag">
                <span class="pulse-dot-red"></span>
                <span>LIVE</span>
              </div>
              <div class="hud-meta-text">
                <div class="hud-cam-sector">${cam.name} &nbsp;|&nbsp; ${cam.sector}</div>
                <div class="hud-coordinates font-mono">${cam.coordinates}</div>
              </div>
            </div>

            <!-- Top Right HUD Timestamp -->
            <div class="osd-hud-top-right">
              <div class="hud-time-display font-mono" id="feed-clock-osd">05 Sep 2026 &nbsp; 22:41:30</div>
              <button class="btn-osd-expand" id="btn-player-expand" title="Expand Feed">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </button>
            </div>

            <!-- Bottom Left HUD Status Box -->
            <div class="osd-hud-bottom-left">
              <div class="hud-status-line-loc">${cam.location}</div>
              <div class="hud-status-line-act">${cam.activity}</div>
            </div>
          </div>
        </div>

        <!-- Right Inspection Sidebar (Right Column) -->
        <div class="live-inspection-sidebar">
          <!-- Card 1: Camera Information -->
          <div class="sys-card camera-info-card">
            <div class="sys-card-header">
              <h2 class="sys-card-title">Camera Information</h2>
              <div class="status-indicator-green">
                <span class="status-dot-green"></span>
                <span class="status-text-green">${cam.status}</span>
              </div>
            </div>

            <div class="sys-card-body">
              <!-- Camera Header Preview -->
              <div class="cam-preview-header">
                <div class="cam-hardware-thumb">
                  <img src="/assets/ptz_camera.jpg" alt="Surveillance PTZ Hardware" class="ptz-img" onerror="this.onerror=null; this.src='/assets/logo.jpg'" />
                </div>
                <div class="cam-preview-text">
                  <div class="cam-preview-id">${cam.name}</div>
                  <div class="cam-preview-sub">${cam.subtitle}</div>
                  <div class="cam-badges-row">
                    <span class="badge-sector">${cam.sector}</span>
                    <span class="badge-sub-loc">${cam.location}</span>
                  </div>
                </div>
              </div>

              <!-- Metadata Rows -->
              <div class="cam-meta-list">
                <div class="cam-meta-row">
                  <span class="meta-row-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span>Location</span>
                  </span>
                  <div class="meta-row-val-wrap">
                    <span class="meta-row-val font-mono">${cam.coordinates}</span>
                    <button class="btn-copy-coords" id="btn-copy-coords" title="Copy GPS Coordinates">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                  </div>
                </div>

                <div class="cam-meta-row">
                  <span class="meta-row-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    <span>Elevation</span>
                  </span>
                  <span class="meta-row-val font-mono">${cam.elevation}</span>
                </div>

                <div class="cam-meta-row">
                  <span class="meta-row-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    <span>Camera Type</span>
                  </span>
                  <span class="meta-row-val">${cam.cameraType}</span>
                </div>

                <div class="cam-meta-row">
                  <span class="meta-row-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    <span>Resolution</span>
                  </span>
                  <span class="meta-row-val font-mono">${cam.resolution}</span>
                </div>

                <div class="cam-meta-row">
                  <span class="meta-row-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    <span>Frame Rate</span>
                  </span>
                  <span class="meta-row-val font-mono">${cam.frameRate}</span>
                </div>

                <div class="cam-meta-row">
                  <span class="meta-row-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>Uptime</span>
                  </span>
                  <span class="meta-row-val font-mono">${cam.uptime}</span>
                </div>

                <div class="cam-meta-row">
                  <span class="meta-row-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                    <span>Last Maintenance</span>
                  </span>
                  <span class="meta-row-val font-mono">${cam.lastMaintenance}</span>
                </div>

                <div class="cam-meta-row">
                  <span class="meta-row-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>
                    <span>Status</span>
                  </span>
                  <div class="status-indicator-green">
                    <span class="status-dot-green"></span>
                    <span class="status-text-green">${cam.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2: Environmental Conditions -->
          <div class="sys-card environmental-card">
            <div class="sys-card-header">
              <h2 class="sys-card-title">Environmental Conditions</h2>
            </div>

            <div class="sys-card-body">
              <div class="weather-metrics-grid">
                <!-- Temperature -->
                <div class="weather-tile">
                  <div class="weather-tile-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>
                  </div>
                  <div class="weather-tile-val font-mono">${cam.temp}</div>
                  <div class="weather-tile-label">Temperature</div>
                </div>

                <!-- Humidity -->
                <div class="weather-tile">
                  <div class="weather-tile-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                  </div>
                  <div class="weather-tile-val font-mono">${cam.humidity}</div>
                  <div class="weather-tile-label">Humidity</div>
                </div>

                <!-- Wind Speed -->
                <div class="weather-tile">
                  <div class="weather-tile-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>
                  </div>
                  <div class="weather-tile-val font-mono">${cam.windSpeed}</div>
                  <div class="weather-tile-label">Wind Speed</div>
                </div>

                <!-- Visibility -->
                <div class="weather-tile">
                  <div class="weather-tile-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </div>
                  <div class="weather-tile-val text-green">${cam.visibility}</div>
                  <div class="weather-tile-label">Visibility</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderGridStage(cameras) {
    return `
      <div class="grid-stage-matrix">
        ${cameras.map(c => `
          <div class="grid-feed-cell ${c.id === this.selectedCameraId ? 'active-grid-cell' : ''}" data-cam-id="${c.id}">
            <div class="grid-cell-media">
              <img src="${c.stream}" alt="${c.name} Feed" class="grid-stream-img" onerror="this.onerror=null; this.src='/assets/camera_feed_placeholder.png'" />
              
              <!-- OSD Bar -->
              <div class="grid-osd-top">
                <div class="hud-live-tag tag-mini">
                  <span class="pulse-dot-red"></span>
                  <span>LIVE</span>
                </div>
                <div class="grid-osd-title">${c.name} · ${c.location}</div>
              </div>

              <!-- Bottom Click action -->
              <button class="grid-btn-focus" data-cam-id="${c.id}" title="Inspect Feed">
                Focus Camera
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  bindEvents(container) {
    this.container = container;
    if (!this.container) return;

    // 1. Bottom Gallery Thumbnail Click
    const thumbs = this.container.querySelectorAll('.cam-thumb-card');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const camId = thumb.getAttribute('data-cam-id');
        this.selectCamera(camId);
      });
    });

    // 2. View Mode Toggles
    const btnFocus = this.container.querySelector('#btn-mode-focus');
    const btnGrid = this.container.querySelector('#btn-mode-grid');

    if (btnFocus) {
      btnFocus.addEventListener('click', () => {
        if (this.viewMode !== 'focus') {
          this.viewMode = 'focus';
          this.reRenderStage();
          this.showToast('Switched to Focus View');
        }
      });
    }

    if (btnGrid) {
      btnGrid.addEventListener('click', () => {
        if (this.viewMode !== 'grid') {
          this.viewMode = 'grid';
          this.reRenderStage();
          this.showToast('Switched to Grid Matrix View');
        }
      });
    }

    // 3. Grid Cell Click / Focus
    const gridCells = this.container.querySelectorAll('.grid-feed-cell, .grid-btn-focus');
    gridCells.forEach(el => {
      el.addEventListener('click', (e) => {
        const camId = el.getAttribute('data-cam-id');
        if (camId) {
          this.selectedCameraId = camId;
          this.viewMode = 'focus';
          this.reRenderStage();
          this.showToast(`Focused on: ${camId}`);
        }
      });
    });

    // 4. Sector Selector Dropdown
    const selectSector = this.container.querySelector('#select-feed-sector');
    if (selectSector) {
      selectSector.addEventListener('change', (e) => {
        this.selectedSector = e.target.value;
        this.reRenderStage();
        this.showToast(`Sector filter: ${this.selectedSector}`);
      });
    }

    // 5. Camera Selector Dropdown
    const selectCamera = this.container.querySelector('#select-feed-camera');
    if (selectCamera) {
      selectCamera.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val !== 'All Cameras') {
          this.selectCamera(val);
        } else {
          this.selectedCameraFilter = 'All Cameras';
          this.reRenderStage();
        }
      });
    }

    // 6. Fullscreen Buttons
    const btnFullscreen = this.container.querySelector('#btn-feed-fullscreen');
    const btnPlayerExpand = this.container.querySelector('#btn-player-expand');

    const toggleFull = () => {
      const stage = this.container.querySelector('#hero-feed-player') || this.container;
      if (!document.fullscreenElement) {
        if (stage.requestFullscreen) stage.requestFullscreen();
        else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    };

    if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFull);
    if (btnPlayerExpand) btnPlayerExpand.addEventListener('click', toggleFull);

    // 7. Carousel Left/Right Scroll Buttons
    const btnLeft = this.container.querySelector('#btn-carousel-left');
    const btnRight = this.container.querySelector('#btn-carousel-right');
    const strip = this.container.querySelector('#camera-thumbnails-strip');

    if (btnLeft && strip) {
      btnLeft.addEventListener('click', () => {
        strip.scrollBy({ left: -240, behavior: 'smooth' });
      });
    }

    if (btnRight && strip) {
      btnRight.addEventListener('click', () => {
        strip.scrollBy({ left: 240, behavior: 'smooth' });
      });
    }

    // 8. Copy GPS Coordinates Button
    const btnCopy = this.container.querySelector('#btn-copy-coords');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        const cam = this.getActiveCamera();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(cam.coordinates);
          this.showToast(`Copied coordinates: ${cam.coordinates}`);
        }
      });
    }

    // 9. Synchronized OSD Clock
    this.startOSDClock();
  }

  selectCamera(camId) {
    this.selectedCameraId = camId;
    this.selectedCameraFilter = camId;
    this.reRenderStage();
    this.showToast(`Switched to: ${camId} (${this.getActiveCamera().location})`);
  }

  reRenderStage() {
    if (!this.container) return;
    this.container.innerHTML = this.render();
    this.bindEvents(this.container);
  }

  startOSDClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);

    const updateTime = () => {
      const clockEl = this.container ? this.container.querySelector('#feed-clock-osd') : null;
      if (!clockEl) return;

      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateStr = `${pad(now.getDate())} ${months[now.getMonth()]} ${now.getFullYear()}`;
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      clockEl.innerHTML = `${dateStr} &nbsp; ${timeStr}`;
    };

    updateTime();
    this.clockInterval = setInterval(updateTime, 1000);
  }

  showToast(message) {
    const toast = this.container ? this.container.querySelector('#feed-toast') : null;
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('active');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2500);
  }
}
