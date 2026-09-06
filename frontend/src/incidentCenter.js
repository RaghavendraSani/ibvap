/**
 * IBVAP Tactical Command — Incident / Alert Center Component
 * Matches the inspiration design with full military styling,
 * real-time AI security events, dynamic unread badge tracking,
 * and comprehensive incident inspection workflow.
 */

export class IncidentCenter {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('incidents-view-root');
    this.onUnreadChange = options.onUnreadChange || null;
    this.onNavigate = options.onNavigate || null;

    this.currentSector = options.currentSector || 'Sector B-17';
    this.currentCamera = options.currentCamera || 'CAM-034';

    this.activeFilterTab = 'all';
    this.searchQuery = '';
    this.selectedSector = options.selectedSector || 'current';
    this.selectedCamera = options.selectedCamera || 'all';
    this.selectedEventType = 'all';
    this.selectedDate = '2026-09-05';
    this.currentPage = 1;
    this.pageSize = 10;

    // Seed master incident records matching the inspiration UI
    this.incidents = [
      {
        id: 'inc-001',
        code: '#INC-2026-0915-0042',
        severity: 'CRITICAL',
        eventType: 'Unauthorized Intrusion',
        objectType: 'Person',
        classification: 'Unauthorized Intrusion',
        direction: 'Towards Border Fence',
        count: 1,
        location: 'Sector B-17',
        camera: 'CAM-034',
        detectedTime: '22:41:08',
        date: '5 Sep 2026',
        confidence: '96%',
        status: 'UNRESOLVED',
        isRead: false,
        coordinates: '19.3526° N, 77.6958° E',
        thumb: '/assets/incident_1.jpg',
        frames: [
          '/assets/incident_1.jpg',
          '/assets/incident_3.jpg',
          '/assets/incident_5.jpg'
        ],
        description: 'A person detected near the border fence at an unauthorized location during restricted hours.',
        recommendedAction: 'Verify the alert, assess threat level, and dispatch ground unit if required.'
      },
      {
        id: 'inc-002',
        code: '#INC-2026-0915-0039',
        severity: 'HIGH',
        eventType: 'Unknown Vehicle',
        objectType: 'Vehicle',
        classification: 'Unknown Vehicle',
        direction: 'North-West Access Road',
        count: 1,
        location: 'Sector C-04',
        camera: 'CAM-021',
        detectedTime: '22:39:31',
        date: '5 Sep 2026',
        confidence: '89%',
        status: 'UNRESOLVED',
        isRead: false,
        coordinates: '19.4102° N, 77.7214° E',
        thumb: '/assets/incident_2.jpg',
        frames: [
          '/assets/incident_2.jpg',
          '/assets/incident_4.jpg',
          '/assets/incident_1.jpg'
        ],
        description: 'Unidentified vehicle approaching outer perimeter barrier without registered transponder.',
        recommendedAction: 'Engage optical zoom, query ANPR database, and alert gate checkpoint.'
      },
      {
        id: 'inc-003',
        code: '#INC-2026-0915-0037',
        severity: 'HIGH',
        eventType: 'Restricted Zone Entry',
        objectType: 'Person',
        classification: 'Restricted Zone Entry',
        direction: 'Buffer Zone Alpha',
        count: 1,
        location: 'Sector B-17',
        camera: 'CAM-034',
        detectedTime: '22:37:12',
        date: '5 Sep 2026',
        confidence: '94%',
        status: 'UNRESOLVED',
        isRead: false,
        coordinates: '19.3580° N, 77.6990° E',
        thumb: '/assets/incident_3.jpg',
        frames: [
          '/assets/incident_3.jpg',
          '/assets/incident_1.jpg',
          '/assets/incident_5.jpg'
        ],
        description: 'Movement observed inside sterile boundary zone. Sensor tripwire confirmed breach.',
        recommendedAction: 'Activate warning illumination floodlights and direct patrol squad to coordinates.'
      },
      {
        id: 'inc-004',
        code: '#INC-2026-0915-0034',
        severity: 'MEDIUM',
        eventType: 'Watchlist Face Match',
        objectType: 'Person',
        classification: 'Facial Recognition Hit',
        direction: 'Transit Checkpoint 3',
        count: 1,
        location: 'Sector A-08',
        camera: 'CAM-012',
        detectedTime: '22:34:55',
        date: '5 Sep 2026',
        confidence: '91%',
        status: 'UNRESOLVED',
        isRead: false,
        coordinates: '19.2941° N, 77.6189° E',
        thumb: '/assets/incident_4.jpg',
        frames: [
          '/assets/incident_4.jpg',
          '/assets/incident_2.jpg',
          '/assets/incident_3.jpg'
        ],
        description: 'Facial telemetry matched Person of Interest with 91% biometrics match score.',
        recommendedAction: 'Hold for manual biometric verification at primary checkpoint.'
      },
      {
        id: 'inc-005',
        code: '#INC-2026-0915-0033',
        severity: 'MEDIUM',
        eventType: 'Unrecognized Number Plate',
        objectType: 'Vehicle',
        classification: 'ANPR Blacklist Alert',
        direction: 'North Perimeter Gate',
        count: 1,
        location: 'Sector C-04',
        camera: 'CAM-021',
        detectedTime: '22:33:18',
        date: '5 Sep 2026',
        confidence: '87%',
        status: 'RESOLVED',
        isRead: true,
        coordinates: '19.4120° N, 77.7230° E',
        thumb: '/assets/incident_5.jpg',
        frames: [
          '/assets/incident_5.jpg',
          '/assets/incident_2.jpg',
          '/assets/incident_4.jpg'
        ],
        description: 'License plate did not match authorized supply convoy schedule. Flagged for review.',
        recommendedAction: 'Verify paper manifest with dispatch logistics supervisor.'
      },
      {
        id: 'inc-006',
        code: '#INC-2026-0915-0028',
        severity: 'CRITICAL',
        eventType: 'Multiple Persons Detected',
        objectType: 'Group',
        classification: 'Group Crossing Attempt',
        direction: 'Riverbed Trench Line',
        count: 3,
        location: 'Sector D-03',
        camera: 'CAM-017',
        detectedTime: '22:28:44',
        date: '5 Sep 2026',
        confidence: '92%',
        status: 'UNRESOLVED',
        isRead: false,
        coordinates: '19.4892° N, 77.8012° E',
        thumb: '/assets/incident_1.jpg',
        frames: [
          '/assets/incident_1.jpg',
          '/assets/incident_3.jpg',
          '/assets/incident_5.jpg'
        ],
        description: 'Cluster of 3 individuals crawling along the dried riverbed trench toward fence pillar 14.',
        recommendedAction: 'Sound Sector D alert siren and scramble QRF Team Delta immediately.'
      },
      {
        id: 'inc-007',
        code: '#INC-2026-0915-0025',
        severity: 'MEDIUM',
        eventType: 'Vehicle in No-Go Zone',
        objectType: 'Vehicle',
        classification: 'Perimeter Infraction',
        direction: 'South Flank Ridge',
        count: 1,
        location: 'Sector A-12',
        camera: 'CAM-008',
        detectedTime: '22:25:11',
        date: '5 Sep 2026',
        confidence: '86%',
        status: 'RESOLVED',
        isRead: true,
        coordinates: '19.2612° N, 77.5901° E',
        thumb: '/assets/incident_2.jpg',
        frames: [
          '/assets/incident_2.jpg',
          '/assets/incident_4.jpg',
          '/assets/incident_5.jpg'
        ],
        description: 'Local agricultural tractor turned into restricted boundary road. Cleared after verification.',
        recommendedAction: 'Log incident in sector logbook and remind local farming liaison.'
      },
      {
        id: 'inc-008',
        code: '#INC-2026-0915-0021',
        severity: 'LOW',
        eventType: 'Camera Tampering Detected',
        objectType: 'Sensor',
        classification: 'Optical Occlusion',
        direction: 'Tower 9 Masthead',
        count: 0,
        location: 'Sector B-09',
        camera: 'CAM-026',
        detectedTime: '22:21:37',
        date: '5 Sep 2026',
        confidence: '78%',
        status: 'RESOLVED',
        isRead: true,
        coordinates: '19.3401° N, 77.6780° E',
        thumb: '/assets/incident_3.jpg',
        frames: [
          '/assets/incident_3.jpg',
          '/assets/incident_1.jpg',
          '/assets/incident_2.jpg'
        ],
        description: 'Lens vibration detected followed by sudden fogging. Auto-lens wiper engaged successfully.',
        recommendedAction: 'Schedule routine optical inspection at dawn.'
      },
      {
        id: 'inc-009',
        code: '#INC-2026-0915-0018',
        severity: 'HIGH',
        eventType: 'Suspicious Movement',
        objectType: 'Person',
        classification: 'Tactical Loitering',
        direction: 'Culvert Cul-de-sac',
        count: 1,
        location: 'Sector C-04',
        camera: 'CAM-019',
        detectedTime: '22:18:03',
        date: '5 Sep 2026',
        confidence: '90%',
        status: 'UNRESOLVED',
        isRead: false,
        coordinates: '19.4150° N, 77.7289° E',
        thumb: '/assets/incident_4.jpg',
        frames: [
          '/assets/incident_4.jpg',
          '/assets/incident_5.jpg',
          '/assets/incident_1.jpg'
        ],
        description: 'Stationary target concealed behind foliage observing patrol timing patterns.',
        recommendedAction: 'Dispatch stealth reconnaissance drone to inspect obscured coordinates.'
      },
      {
        id: 'inc-010',
        code: '#INC-2026-0915-0014',
        severity: 'MEDIUM',
        eventType: 'Vehicle Loitering',
        objectType: 'Vehicle',
        classification: 'Perimeter Loitering',
        direction: 'Eastern Highway Overpass',
        count: 1,
        location: 'Sector D-03',
        camera: 'CAM-017',
        detectedTime: '22:14:26',
        date: '5 Sep 2026',
        confidence: '84%',
        status: 'RESOLVED',
        isRead: true,
        coordinates: '19.4892° N, 77.8012° E',
        thumb: '/assets/incident_5.jpg',
        frames: [
          '/assets/incident_5.jpg',
          '/assets/incident_2.jpg',
          '/assets/incident_3.jpg'
        ],
        description: 'Vehicle parked on shoulder for 15 minutes. Driver cited tire change; escort completed.',
        recommendedAction: 'Clear incident and maintain highway camera sweep.'
      },
      {
        id: 'inc-011',
        code: '#INC-2026-0915-0031',
        severity: 'MEDIUM',
        eventType: 'Unauthorized Intrusion',
        objectType: 'Person',
        classification: 'Perimeter Motion Hit',
        direction: 'Fence Section 4B',
        count: 1,
        location: 'Sector B-17',
        camera: 'CAM-034',
        detectedTime: '22:31:04',
        date: '5 Sep 2026',
        confidence: '88%',
        status: 'UNRESOLVED',
        isRead: false,
        coordinates: '19.3540° N, 77.6970° E',
        thumb: '/assets/incident_4.jpg',
        frames: [
          '/assets/incident_4.jpg',
          '/assets/incident_1.jpg'
        ],
        description: 'Acoustic smart sensor detected fence movement and brief silhouette along border fence 4B.'
      },
      {
        id: 'inc-012',
        code: '#INC-2026-0915-0019',
        severity: 'LOW',
        eventType: 'Suspicious Movement',
        objectType: 'Animal',
        classification: 'Thermal Wildlife Signature',
        direction: 'Outer Scrub Zone',
        count: 2,
        location: 'Sector B-17',
        camera: 'CAM-034',
        detectedTime: '22:19:15',
        date: '5 Sep 2026',
        confidence: '94%',
        status: 'RESOLVED',
        isRead: true,
        coordinates: '19.3510° N, 77.6942° E',
        thumb: '/assets/incident_5.jpg',
        frames: [
          '/assets/incident_5.jpg',
          '/assets/incident_2.jpg'
        ],
        description: 'Thermal sensor detected heat signatures of feral cattle crossing outer perimeter scrub.'
      },
      {
        id: 'inc-013',
        code: '#INC-2026-0915-0012',
        severity: 'CRITICAL',
        eventType: 'Restricted Zone Entry',
        objectType: 'Sensor',
        classification: 'Tripwire Integrity Breach',
        direction: 'Pillar 12 to 13',
        count: 1,
        location: 'Sector B-17',
        camera: 'CAM-034',
        detectedTime: '22:12:02',
        date: '5 Sep 2026',
        confidence: '97%',
        status: 'RESOLVED',
        isRead: true,
        coordinates: '19.3533° N, 77.6961° E',
        thumb: '/assets/incident_1.jpg',
        frames: [
          '/assets/incident_1.jpg',
          '/assets/incident_3.jpg'
        ],
        description: 'Optical laser tripwire reported interrupted beam. Patrol investigated and verified vegetation displacement; re-aligned.'
      }
    ];

    this.selectedIncidentId = this.incidents[0].id;
    this.selectedItems = new Set();
    this.isDetailDrawerOpen = true;

    this.init();
  }

  setCurrentFeed(sector, camera) {
    if (sector) this.currentSector = sector;
    if (camera) this.currentCamera = camera;
    if (this.selectedSector === 'current') {
      this.render();
    }
  }

  selectIncident(id) {
    const inc = this.incidents.find(i => i.id === id || String(i.id) === String(id));
    if (inc) {
      this.selectedIncidentId = inc.id;
      this.isDetailDrawerOpen = true;
      this.markWatched(inc.id);
      if (this.selectedSector === 'current' && inc.location !== this.currentSector) {
        this.selectedSector = 'all';
      }
      this.render();
    }
  }

  init() {
    this.notifyUnread();
  }

  getUnreadCount() {
    return this.incidents.filter(inc => !inc.isRead && inc.status === 'UNRESOLVED').length;
  }

  notifyUnread() {
    const count = this.getUnreadCount();
    if (this.onUnreadChange) {
      this.onUnreadChange(count);
    }
  }

  /**
   * Called when AI engine emits a new security event
   */
  addAiIncident(eventData) {
    const newInc = {
      id: eventData.id || `inc-${Date.now()}`,
      code: eventData.code || `#INC-2026-0915-${Math.floor(1000 + Math.random() * 9000)}`,
      severity: (eventData.severity || 'CRITICAL').toUpperCase(),
      eventType: eventData.title || eventData.eventType || 'Unauthorized Intrusion',
      objectType: eventData.objectType || 'Person',
      classification: eventData.classification || 'AI Perimeter Breach',
      direction: eventData.direction || 'Towards Border Fence',
      count: eventData.count || 1,
      location: eventData.location || 'Sector B-17',
      camera: eventData.camera || 'CAM-034',
      detectedTime: eventData.time || new Date().toTimeString().split(' ')[0],
      date: eventData.date || '5 Sep 2026',
      confidence: eventData.confidence || '96%',
      status: 'UNRESOLVED',
      isRead: false,
      coordinates: eventData.coordinates || '19.3526° N, 77.6958° E',
      thumb: eventData.thumb || '/assets/incident_1.jpg',
      frames: eventData.frames || [
        '/assets/incident_1.jpg',
        '/assets/incident_3.jpg',
        '/assets/incident_5.jpg'
      ],
      description: eventData.description || 'Automated AI sensor detected unauthorized movement at boundary.',
      recommendedAction: eventData.recommendedAction || 'Verify the alert, assess threat level, and dispatch unit.'
    };

    this.incidents.unshift(newInc);
    this.selectedIncidentId = newInc.id;
    this.notifyUnread();

    if (this.container && this.container.style.display !== 'none') {
      this.render();
    }
  }

  getSelectedIncident(filtered = null) {
    const list = (filtered && filtered.length > 0) ? filtered : this.incidents;
    return list.find(i => i.id === this.selectedIncidentId) || list[0] || null;
  }

  markWatched(id) {
    const inc = this.incidents.find(i => i.id === id);
    if (inc && !inc.isRead) {
      inc.isRead = true;
      this.notifyUnread();
    }
  }

  acknowledgeIncident(id) {
    const inc = this.incidents.find(i => i.id === id);
    if (inc) {
      inc.isRead = true;
      this.notifyUnread();
      this.render();
    }
  }

  resolveIncident(id) {
    const inc = this.incidents.find(i => i.id === id);
    if (inc) {
      inc.status = 'RESOLVED';
      inc.isRead = true;
      this.notifyUnread();
      this.render();
    }
  }

  dismissIncident(id) {
    this.resolveIncident(id);
  }

  getFilteredIncidents() {
    return this.incidents.filter(item => {
      // Tab filter
      if (this.activeFilterTab === 'critical' && item.severity !== 'CRITICAL') return false;
      if (this.activeFilterTab === 'high' && item.severity !== 'HIGH') return false;
      if (this.activeFilterTab === 'medium' && item.severity !== 'MEDIUM') return false;
      if (this.activeFilterTab === 'low' && item.severity !== 'LOW') return false;
      if (this.activeFilterTab === 'unresolved' && item.status !== 'UNRESOLVED') return false;
      if (this.activeFilterTab === 'resolved' && item.status !== 'RESOLVED') return false;

      // Search query
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const match = item.eventType.toLowerCase().includes(q) ||
                      item.code.toLowerCase().includes(q) ||
                      item.location.toLowerCase().includes(q) ||
                      item.camera.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Sector filter: 'current' filters strictly to the current camera feed's sector
      if (this.selectedSector === 'current') {
        if (item.location !== this.currentSector) return false;
      } else if (this.selectedSector !== 'all' && item.location !== this.selectedSector) {
        return false;
      }

      // Camera filter
      if (this.selectedCamera === 'current') {
        if (item.camera !== this.currentCamera) return false;
      } else if (this.selectedCamera !== 'all' && item.camera !== this.selectedCamera) {
        return false;
      }

      // Event Type filter
      if (this.selectedEventType !== 'all' && item.eventType !== this.selectedEventType) return false;

      return true;
    });
  }

  /**
   * Helper to render event type icons
   */
  getEventIconSvg(type) {
    switch (type) {
      case 'Unauthorized Intrusion':
      case 'Suspicious Movement':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
      case 'Unknown Vehicle':
      case 'Vehicle Loitering':
      case 'Vehicle in No-Go Zone':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="8" rx="2"></rect><path d="M5 11l2-5h10l2 5"></path><circle cx="7.5" cy="15.5" r="1.5"></circle><circle cx="16.5" cy="15.5" r="1.5"></circle></svg>`;
      case 'Restricted Zone Entry':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>`;
      case 'Watchlist Face Match':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path><circle cx="12" cy="3" r="3"></circle></svg>`;
      case 'Unrecognized Number Plate':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="6" y1="12" x2="18" y2="12"></line></svg>`;
      case 'Multiple Persons Detected':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;
      case 'Camera Tampering Detected':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;
      default:
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>`;
    }
  }

  render() {
    if (!this.container) return;

    const filtered = this.getFilteredIncidents();
    const selected = this.getSelectedIncident(filtered);
    if (selected && selected.id !== this.selectedIncidentId) {
      this.selectedIncidentId = selected.id;
    }

    // Incidents for active sector to compute counter cards & filter tab counts
    const sectorIncidents = this.selectedSector === 'current'
      ? this.incidents.filter(i => i.location === this.currentSector)
      : this.selectedSector === 'all'
        ? this.incidents
        : this.incidents.filter(i => i.location === this.selectedSector);

    // Calculate dynamic counts
    const countCriticalUnresolved = sectorIncidents.filter(i => i.severity === 'CRITICAL' && i.status === 'UNRESOLVED').length;
    const countHighUnresolved = sectorIncidents.filter(i => i.severity === 'HIGH' && i.status === 'UNRESOLVED').length;
    const countMedUnresolved = sectorIncidents.filter(i => i.severity === 'MEDIUM' && i.status === 'UNRESOLVED').length;
    const countLowUnresolved = sectorIncidents.filter(i => i.severity === 'LOW' && i.status === 'UNRESOLVED').length;

    const countAll = sectorIncidents.length;
    const countCrit = sectorIncidents.filter(i => i.severity === 'CRITICAL').length;
    const countHigh = sectorIncidents.filter(i => i.severity === 'HIGH').length;
    const countMed = sectorIncidents.filter(i => i.severity === 'MEDIUM').length;
    const countLow = sectorIncidents.filter(i => i.severity === 'LOW').length;
    const countUnres = sectorIncidents.filter(i => i.status === 'UNRESOLVED').length;
    const countRes = sectorIncidents.filter(i => i.status === 'RESOLVED').length;

    this.container.innerHTML = `
      <div class="incident-center-layout">
        <!-- ===================================================================
             TOP HEADER & STAT CARDS ROW
             =================================================================== -->
        <header class="inc-page-header">
          <div class="inc-title-block">
            <h1 class="inc-main-title">Incidents Centre</h1>
          </div>

          <!-- 4 Unresolved Counter Cards (Sharp Edges) -->
          <div class="inc-stats-row">
            <!-- 1. Critical -->
            <div class="inc-stat-card stat-critical">
              <div class="inc-stat-icon-wrap icon-crit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
                </svg>
              </div>
              <div class="inc-stat-info">
                <span class="inc-stat-num">${String(countCriticalUnresolved).padStart(2, '0')}</span>
                <span class="inc-stat-label">Critical (Unresolved)</span>
              </div>
            </div>

            <!-- 2. High -->
            <div class="inc-stat-card stat-high">
              <div class="inc-stat-icon-wrap icon-hi">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="9"/>
                </svg>
              </div>
              <div class="inc-stat-info">
                <span class="inc-stat-num">${String(countHighUnresolved).padStart(2, '0')}</span>
                <span class="inc-stat-label">High (Unresolved)</span>
              </div>
            </div>

            <!-- 3. Medium -->
            <div class="inc-stat-card stat-medium">
              <div class="inc-stat-icon-wrap icon-med">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="9"/>
                </svg>
              </div>
              <div class="inc-stat-info">
                <span class="inc-stat-num">${String(countMedUnresolved).padStart(2, '0')}</span>
                <span class="inc-stat-label">Medium (Unresolved)</span>
              </div>
            </div>

            <!-- 4. Low -->
            <div class="inc-stat-card stat-low">
              <div class="inc-stat-icon-wrap icon-lo">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="9"/>
                </svg>
              </div>
              <div class="inc-stat-info">
                <span class="inc-stat-num">${String(countLowUnresolved).padStart(2, '0')}</span>
                <span class="inc-stat-label">Low (Unresolved)</span>
              </div>
            </div>
          </div>
        </header>

        <!-- ===================================================================
             FILTER TABS & SEARCH / DROPDOWN CONTROLS ROW
             =================================================================== -->
        <div class="inc-controls-bar">
          <!-- Left: Filter Pills -->
          <div class="inc-filter-tabs">
            <button class="filter-tab ${this.activeFilterTab === 'all' ? 'active' : ''}" data-tab="all">
              All (${countAll})
            </button>
            <button class="filter-tab ${this.activeFilterTab === 'critical' ? 'active' : ''}" data-tab="critical">
              Critical (${countCrit})
            </button>
            <button class="filter-tab ${this.activeFilterTab === 'high' ? 'active' : ''}" data-tab="high">
              High (${countHigh})
            </button>
            <button class="filter-tab ${this.activeFilterTab === 'medium' ? 'active' : ''}" data-tab="medium">
              Medium (${countMed})
            </button>
            <button class="filter-tab ${this.activeFilterTab === 'low' ? 'active' : ''}" data-tab="low">
              Low (${countLow})
            </button>
            <button class="filter-tab ${this.activeFilterTab === 'unresolved' ? 'active' : ''}" data-tab="unresolved">
              Unresolved (${countUnres})
            </button>
            <button class="filter-tab ${this.activeFilterTab === 'resolved' ? 'active' : ''}" data-tab="resolved">
              Resolved (${countRes})
            </button>
          </div>

          <!-- Right: Search & Dropdown Filters -->
          <div class="inc-filter-dropdowns">
            <!-- Search Input -->
            <div class="inc-search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                id="inc-search-input" 
                class="inc-search-input" 
                placeholder="Search incidents..." 
                value="${this.searchQuery}"
              />
            </div>

            <!-- Date Picker Button -->
            <div class="inc-dropdown-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>5 Sep 2026</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>

            <!-- Sector Select -->
            <select id="inc-filter-sector" class="inc-select-ctrl" title="Filter by Sector">
              <option value="current" ${this.selectedSector === 'current' ? 'selected' : ''}>Current Sector (${this.currentSector})</option>
              <option value="all" ${this.selectedSector === 'all' ? 'selected' : ''}>All Sectors</option>
              <option value="Sector B-17" ${this.selectedSector === 'Sector B-17' ? 'selected' : ''}>Sector B-17</option>
              <option value="Sector C-04" ${this.selectedSector === 'Sector C-04' ? 'selected' : ''}>Sector C-04</option>
              <option value="Sector A-08" ${this.selectedSector === 'Sector A-08' ? 'selected' : ''}>Sector A-08</option>
              <option value="Sector D-03" ${this.selectedSector === 'Sector D-03' ? 'selected' : ''}>Sector D-03</option>
              <option value="Sector A-12" ${this.selectedSector === 'Sector A-12' ? 'selected' : ''}>Sector A-12</option>
              <option value="Sector B-09" ${this.selectedSector === 'Sector B-09' ? 'selected' : ''}>Sector B-09</option>
            </select>

            <!-- Camera Select -->
            <select id="inc-filter-camera" class="inc-select-ctrl" title="Filter by Camera">
              <option value="all" ${this.selectedCamera === 'all' ? 'selected' : ''}>All Cameras</option>
              <option value="current" ${this.selectedCamera === 'current' ? 'selected' : ''}>Current Camera (${this.currentCamera})</option>
              <option value="CAM-034" ${this.selectedCamera === 'CAM-034' ? 'selected' : ''}>CAM-034</option>
              <option value="CAM-021" ${this.selectedCamera === 'CAM-021' ? 'selected' : ''}>CAM-021</option>
              <option value="CAM-012" ${this.selectedCamera === 'CAM-012' ? 'selected' : ''}>CAM-012</option>
              <option value="CAM-017" ${this.selectedCamera === 'CAM-017' ? 'selected' : ''}>CAM-017</option>
              <option value="CAM-026" ${this.selectedCamera === 'CAM-026' ? 'selected' : ''}>CAM-026</option>
              <option value="CAM-019" ${this.selectedCamera === 'CAM-019' ? 'selected' : ''}>CAM-019</option>
            </select>

            <!-- Event Type Select -->
            <select id="inc-filter-type" class="inc-select-ctrl">
              <option value="all">All Event Types</option>
              <option value="Unauthorized Intrusion" ${this.selectedEventType === 'Unauthorized Intrusion' ? 'selected' : ''}>Unauthorized Intrusion</option>
              <option value="Unknown Vehicle" ${this.selectedEventType === 'Unknown Vehicle' ? 'selected' : ''}>Unknown Vehicle</option>
              <option value="Restricted Zone Entry" ${this.selectedEventType === 'Restricted Zone Entry' ? 'selected' : ''}>Restricted Zone Entry</option>
              <option value="Watchlist Face Match" ${this.selectedEventType === 'Watchlist Face Match' ? 'selected' : ''}>Watchlist Face Match</option>
              <option value="Unrecognized Number Plate" ${this.selectedEventType === 'Unrecognized Number Plate' ? 'selected' : ''}>Unrecognized Number Plate</option>
              <option value="Multiple Persons Detected" ${this.selectedEventType === 'Multiple Persons Detected' ? 'selected' : ''}>Multiple Persons Detected</option>
            </select>
          </div>
        </div>

        <!-- ===================================================================
             MAIN SPLIT WORKSPACE: INCIDENTS TABLE (LEFT) + DETAIL PANEL (RIGHT)
             =================================================================== -->
        <div class="inc-main-split-grid ${(this.isDetailDrawerOpen && selected) ? '' : 'drawer-closed'}">
          <!-- Left: Master Incidents Table Card -->
          <div class="inc-table-container">
            <div class="inc-table-scroll">
              <table class="inc-master-table">
                <thead>
                  <tr>
                    <th class="th-cb"><input type="checkbox" id="cb-select-all-inc" /></th>
                    <th>Severity</th>
                    <th>Event Type</th>
                    <th>Location</th>
                    <th>Camera</th>
                    <th>Detected Time</th>
                    <th>Confidence</th>
                    <th>Status</th>
                    <th class="th-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${filtered.length === 0 ? `
                    <tr>
                      <td colspan="9" class="td-empty-state">No matching incidents found.</td>
                    </tr>
                  ` : filtered.map(item => `
                    <tr class="inc-table-row ${item.id === this.selectedIncidentId ? 'selected-row' : ''} ${!item.isRead ? 'unread-row' : ''}" data-id="${item.id}">
                      <td class="td-cb" onclick="event.stopPropagation()">
                        <input type="checkbox" class="inc-row-cb" data-id="${item.id}" ${this.selectedItems.has(item.id) ? 'checked' : ''} />
                      </td>
                      <td class="td-sev">
                        <span class="badge-sev badge-${item.severity.toLowerCase()}">${item.severity}</span>
                      </td>
                      <td class="td-event">
                        <div class="event-name-wrap">
                          <span class="event-icon">${this.getEventIconSvg(item.eventType)}</span>
                          <span class="event-name">${item.eventType}</span>
                        </div>
                      </td>
                      <td class="td-loc">${item.location}</td>
                      <td class="td-cam">${item.camera}</td>
                      <td class="td-time font-mono">${item.detectedTime}</td>
                      <td class="td-conf">${item.confidence}</td>
                      <td class="td-status">
                        <span class="status-pill status-${item.status.toLowerCase()}">${item.status}</span>
                      </td>
                      <td class="td-actions" onclick="event.stopPropagation()">
                        <button class="btn-row-action" title="Incident Options">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Table Pagination Footer -->
            <footer class="inc-table-footer">
              <div class="footer-count-text">
                Showing 1 - ${filtered.length} of ${filtered.length} incidents
              </div>

              <div class="footer-pager-controls">
                <button class="btn-pager-arrow" disabled>‹</button>
                <button class="btn-pager-num active">1</button>
                <button class="btn-pager-num">2</button>
                <button class="btn-pager-num">3</button>
                <button class="btn-pager-num">4</button>
                <button class="btn-pager-num">5</button>
                <span class="pager-dots">...</span>
                <button class="btn-pager-num">8</button>
                <button class="btn-pager-arrow">›</button>
              </div>

              <div class="footer-page-size">
                <select class="inc-select-ctrl sm-select">
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </footer>
          </div>

          <!-- Right: Detailed Incident Drawer Panel -->
          ${(this.isDetailDrawerOpen && selected) ? `
            <aside class="inc-detail-drawer" id="inc-detail-drawer">
              <!-- Detail Header -->
              <div class="drawer-header">
                <div class="drawer-header-left">
                  <span class="badge-sev badge-${selected.severity.toLowerCase()}">${selected.severity}</span>
                  <span class="inc-code-tag">${selected.code}</span>
                </div>
                <div class="drawer-header-right">
                  <span class="drawer-status-dot ${selected.status === 'UNRESOLVED' ? 'dot-active' : 'dot-resolved'}"></span>
                  <span class="drawer-status-text">${selected.status === 'UNRESOLVED' ? 'Unresolved' : 'Resolved'}</span>
                  <button id="btn-close-detail" class="btn-drawer-close" title="Close Panel">✕</button>
                </div>
              </div>

              <div class="drawer-scroll-body">
                <!-- Title & Meta -->
                <div class="drawer-title-block">
                  <h2 class="drawer-incident-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>${selected.eventType}</span>
                  </h2>
                  <div class="drawer-meta-line font-mono">
                    <span>${selected.location}</span>
                    <span class="meta-sep">|</span>
                    <span>Camera ${selected.camera}</span>
                    <span class="meta-sep">|</span>
                    <span>${selected.date}</span>
                    <span class="meta-sep">|</span>
                    <span>${selected.detectedTime}</span>
                  </div>
                </div>

                <!-- Video & Thumbnails Reel -->
                <div class="drawer-media-grid">
                  <!-- Main Live Snapshot / Video Viewport -->
                  <div class="drawer-main-media">
                    <img src="${selected.thumb}" alt="${selected.eventType}" class="drawer-video-frame" />
                    
                    <!-- Bounding Box Annotation -->
                    <div class="ai-bounding-box-overlay">
                      <div class="ai-bbox-label">${selected.objectType} ${selected.confidence}</div>
                    </div>

                    <!-- Telemetry Overlays -->
                    <div class="drawer-cam-tag-top">
                      <span class="live-pill">
                        <span class="live-pulse-dot"></span>
                        <span class="live-text">LIVE</span>
                      </span>
                    </div>

                    <div class="drawer-cam-tag-bottom font-mono">
                      <span>${selected.camera} &nbsp; ${selected.location}</span>
                      <span>${selected.date} &nbsp; ${selected.detectedTime}</span>
                    </div>
                  </div>

                  <!-- 3 Vertical Timeline Angles -->
                  <div class="drawer-thumbnails-reel">
                    ${selected.frames.map((f, idx) => `
                      <div class="reel-thumb-item ${idx === 0 ? 'active-reel' : ''}">
                        <img src="${f}" alt="Angle ${idx + 1}" />
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- AI Analysis Card -->
                <div class="drawer-info-card ai-analysis-card">
                  <div class="card-head-row">
                    <div class="card-head-title">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                      </svg>
                      <span>AI Analysis</span>
                    </div>
                    <span class="ai-conf-pill">${selected.confidence} Confidence</span>
                  </div>

                  <div class="ai-grid-metrics">
                    <div class="metric-pair">
                      <div class="metric-key">Object Type</div>
                      <div class="metric-val">${selected.objectType}</div>
                    </div>
                    <div class="metric-pair">
                      <div class="metric-key">Classification</div>
                      <div class="metric-val">${selected.classification}</div>
                    </div>
                    <div class="metric-pair">
                      <div class="metric-key">Direction</div>
                      <div class="metric-val">${selected.direction}</div>
                    </div>
                    <div class="metric-pair">
                      <div class="metric-key">No. of Persons</div>
                      <div class="metric-val">${selected.count}</div>
                    </div>
                  </div>

                  <div class="metric-desc-block">
                    <div class="metric-key">Description</div>
                    <div class="metric-desc-text">${selected.description}</div>
                  </div>
                </div>

                <!-- Location Card -->
                <div class="drawer-info-card location-card">
                  <div class="card-head-title">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>Location</span>
                  </div>

                  <div class="location-body-row">
                    <div class="loc-text-col">
                      <div class="loc-sector-name">${selected.location}</div>
                      <div class="loc-coords font-mono">${selected.coordinates}</div>
                    </div>

                    <div class="loc-map-thumb-wrap">
                      <img src="/assets/incident_3.jpg" alt="Radar Map" class="loc-map-preview" />
                      <div class="radar-ping"></div>
                      <a href="#map" class="btn-view-map">View in Map &nbsp;→</a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Execution Buttons Bar -->
              <footer class="drawer-footer-actions">
                <button id="btn-investigate" class="btn-action-primary" title="Launch Optical Investigation">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <span>Investigate</span>
                </button>

                <button id="btn-acknowledge" class="btn-action-outline btn-ack" title="Acknowledge Alert">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Acknowledge</span>
                </button>

                <button id="btn-resolve" class="btn-action-outline btn-res" title="Mark Incident as Resolved / Dismiss">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                    <line x1="4" y1="22" x2="4" y2="15"></line>
                  </svg>
                  <span>${selected.status === 'RESOLVED' ? 'Dismissed' : 'Resolve'}</span>
                </button>
              </footer>
            </aside>
          ` : ''}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Tab switching
    this.container.querySelectorAll('.filter-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeFilterTab = e.currentTarget.dataset.tab;
        this.render();
      });
    });

    // Search input
    const searchInput = this.container.querySelector('#inc-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }

    // Dropdown filters
    const sectorSelect = this.container.querySelector('#inc-filter-sector');
    if (sectorSelect) {
      sectorSelect.addEventListener('change', (e) => {
        this.selectedSector = e.target.value;
        this.render();
      });
    }

    const cameraSelect = this.container.querySelector('#inc-filter-camera');
    if (cameraSelect) {
      cameraSelect.addEventListener('change', (e) => {
        this.selectedCamera = e.target.value;
        this.render();
      });
    }

    const typeSelect = this.container.querySelector('#inc-filter-type');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        this.selectedEventType = e.target.value;
        this.render();
      });
    }

    // Row selection & mark watched
    this.container.querySelectorAll('.inc-table-row').forEach(row => {
      row.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.selectedIncidentId = id;
        this.isDetailDrawerOpen = true;
        this.markWatched(id);
        this.render();
      });
    });

    // Row action buttons (inspect / options)
    this.container.querySelectorAll('.btn-row-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const row = btn.closest('.inc-table-row');
        if (row) {
          const id = row.dataset.id;
          this.selectedIncidentId = id;
          this.isDetailDrawerOpen = true;
          this.markWatched(id);
          this.render();
        }
      });
    });

    // Checkbox select all
    const selectAllCb = this.container.querySelector('#cb-select-all-inc');
    if (selectAllCb) {
      selectAllCb.addEventListener('change', (e) => {
        const checked = e.target.checked;
        this.getFilteredIncidents().forEach(i => {
          if (checked) this.selectedItems.add(i.id);
          else this.selectedItems.delete(i.id);
        });
        this.render();
      });
    }

    // Row checkboxes
    this.container.querySelectorAll('.inc-row-cb').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) this.selectedItems.add(id);
        else this.selectedItems.delete(id);
      });
    });

    // Drawer Action: Close
    const btnClose = this.container.querySelector('#btn-close-detail');
    if (btnClose) {
      btnClose.addEventListener('click', (e) => {
        e.stopPropagation();
        this.isDetailDrawerOpen = false;
        this.render();
      });
    }

    // Drawer Action: Acknowledge
    const btnAck = this.container.querySelector('#btn-acknowledge');
    if (btnAck) {
      btnAck.addEventListener('click', () => {
        this.acknowledgeIncident(this.selectedIncidentId);
      });
    }

    // Drawer Action: Resolve / Dismiss
    const btnRes = this.container.querySelector('#btn-resolve');
    if (btnRes) {
      btnRes.addEventListener('click', () => {
        this.resolveIncident(this.selectedIncidentId);
      });
    }

    // Drawer Action: Investigate
    const btnInvestigate = this.container.querySelector('#btn-investigate');
    if (btnInvestigate) {
      btnInvestigate.addEventListener('click', () => {
        if (this.onNavigate) {
          this.onNavigate('command');
        }
      });
    }
  }

  show() {
    if (this.container) {
      this.container.style.display = 'block';
      this.render();
    }
  }

  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }
}
