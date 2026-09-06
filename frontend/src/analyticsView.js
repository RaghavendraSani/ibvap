/**
 * IBVAP Tactical Border Surveillance Command Platform — Analytics & Reports Component
 * Pixel-faithful reproduction of the tactical border analytics intelligence screen.
 * 
 * Features:
 * - Dynamic Time Range switching (Last 24h, Last 7d, Last 30d, Custom Range)
 * - Reactive KPI metrics with trend badges
 * - SVG Spline Chart with real-time interactive mouse hover tracking & crosshair
 * - Sortable Camera Performance table & View All Cameras search modal
 * - Client-side real CSV & JSON intelligence data exports (via Blob download)
 * - Tactical Security Briefing Report Preview modal with print / save PDF capability
 * - Interactive Sector & Threat category drill-down
 */

export class AnalyticsView {
  constructor(options = {}) {
    this.container = options.container || null;
    this.selectedTimeRange = 'Last 24 Hours';
    this.activeFilter = 'Intrusions';
    this.selectedReportType = 'Daily Security Report';
    
    // Sorting state for Camera Performance Table
    this.sortColumn = 'camera';
    this.sortDirection = 'asc'; // 'asc' | 'desc'
    this.selectedSectorFilter = null; // Filter applied by clicking sector bar
    
    // Custom range state
    this.customStartDate = '2026-08-20';
    this.customEndDate = '2026-09-06';

    // Comprehensive 12-camera surveillance registry (for View All Cameras modal & sorting)
    this.allCameras = [
      { id: 'CAM-034', sector: 'Sector B-17', location: 'Perimeter Fence - East', uptime: 99.8, detections: 248, alerts: 12, fp: 3, status: 'Online' },
      { id: 'CAM-021', sector: 'Sector B-17', location: 'Border Road', uptime: 99.5, detections: 186, alerts: 7, fp: 4, status: 'Online' },
      { id: 'CAM-017', sector: 'Sector B-17', location: 'Access Trail', uptime: 98.9, detections: 312, alerts: 18, fp: 6, status: 'Processing' },
      { id: 'CAM-008', sector: 'Sector B-17', location: 'Riverbed Area', uptime: 99.7, detections: 142, alerts: 4, fp: 2, status: 'Online' },
      { id: 'CAM-012', sector: 'Sector B-17', location: 'Watch Tower 1', uptime: 99.6, detections: 210, alerts: 9, fp: 1, status: 'Online' },
      { id: 'CAM-026', sector: 'Sector B-17', location: 'Outer Perimeter', uptime: 99.1, detections: 165, alerts: 8, fp: 5, status: 'Online' },
      { id: 'CAM-031', sector: 'Sector B-17', location: 'Check Post', uptime: 99.9, detections: 285, alerts: 14, fp: 2, status: 'Online' },
      { id: 'CAM-004', sector: 'Sector A-12', location: 'North Ridge Post', uptime: 99.4, detections: 198, alerts: 11, fp: 4, status: 'Online' },
      { id: 'CAM-015', sector: 'Sector A-12', location: 'Highway Checkpoint', uptime: 98.2, detections: 175, alerts: 16, fp: 7, status: 'Processing' },
      { id: 'CAM-022', sector: 'Sector C-04', location: 'Valley Pass Alpha', uptime: 99.7, detections: 220, alerts: 10, fp: 3, status: 'Online' },
      { id: 'CAM-029', sector: 'Sector C-04', location: 'Culvert Crossing', uptime: 99.3, detections: 154, alerts: 6, fp: 2, status: 'Online' },
      { id: 'CAM-038', sector: 'Sector D-09', location: 'Radar Outpost Bravo', uptime: 99.0, detections: 130, alerts: 5, fp: 1, status: 'Standby' }
    ];

    // Multi-timeframe datasets
    this.datasets = {
      'Last 24 Hours': {
        kpis: {
          totalEvents: { val: '1,284', trend: '↑ 12%', trendClass: 'trend-up-green' },
          intrusions: { val: '23', trend: '↑ 35%', trendClass: 'trend-up-red' },
          person: { val: '684', trend: '↑ 18%', trendClass: 'trend-up-green' },
          vehicle: { val: '392', trend: '↑ 9%', trendClass: 'trend-up-green' },
          anpr: { val: '214', trend: '↑ 22%', trendClass: 'trend-up-green' },
          face: { val: '17', trend: '↑ 6%', trendClass: 'trend-up-green' }
        },
        threats: {
          critical: { count: 42, pct: '3.3%', barWidth: '3.3%' },
          high: { count: 128, pct: '10.0%', barWidth: '10.0%' },
          medium: { count: 386, pct: '30.1%', barWidth: '30.1%' },
          low: { count: 728, pct: '56.6%', barWidth: '56.6%' }
        },
        sectors: {
          'Sector A': { count: 182, fillWidth: '36.9%' },
          'Sector B': { count: 493, fillWidth: '100%' },
          'Sector C': { count: 321, fillWidth: '65.1%' },
          'Sector D': { count: 288, fillWidth: '58.4%' }
        },
        topLocations: [
          { rank: 1, name: 'BOP Alpha', sector: 'Sector A', events: '47 events', delta: '↑ 28%' },
          { rank: 2, name: 'Sector B-17', sector: 'Sector B', events: '39 events', delta: '↑ 18%' },
          { rank: 3, name: 'Checkpost C-04', sector: 'Sector C', events: '31 events', delta: '↑ 7%' },
          { rank: 4, name: 'Border Road A-08', sector: 'Sector A', events: '24 events', delta: '↑ 9%' }
        ],
        cameras: [
          { id: 'CAM-034', uptime: '99.8%', detections: 248, alerts: 12, fp: 3, status: 'Online' },
          { id: 'CAM-021', uptime: '99.5%', detections: 186, alerts: 7, fp: 4, status: 'Online' },
          { id: 'CAM-017', uptime: '98.9%', detections: 312, alerts: 18, fp: 6, status: 'Processing' },
          { id: 'CAM-008', uptime: '99.7%', detections: 142, alerts: 4, fp: 2, status: 'Online' }
        ],
        trendDatasets: {
          Intrusions: {
            points: [
              { time: '00:00', val: 9 }, { time: '02:00', val: 14 }, { time: '04:00', val: 10 },
              { time: '06:00', val: 5 }, { time: '08:00', val: 18 }, { time: '10:00', val: 32, peak: true, range: '10:00 - 11:00' },
              { time: '12:00', val: 16 }, { time: '14:00', val: 12 }, { time: '16:00', val: 16 },
              { time: '18:00', val: 14 }, { time: '20:00', val: 21 }, { time: '22:00', val: 38 }, { time: '23:59', val: 10 }
            ],
            peakEventText: '32 events',
            peakRangeText: '10:00 - 11:00',
            peakPointIdx: 5
          },
          People: {
            points: [
              { time: '00:00', val: 12 }, { time: '02:00', val: 8 }, { time: '04:00', val: 6 },
              { time: '06:00', val: 19 }, { time: '08:00', val: 35 }, { time: '10:00', val: 46, peak: true, range: '10:00 - 11:00' },
              { time: '12:00', val: 28 }, { time: '14:00', val: 24 }, { time: '16:00', val: 30 },
              { time: '18:00', val: 42 }, { time: '20:00', val: 36 }, { time: '22:00', val: 22 }, { time: '23:59', val: 14 }
            ],
            peakEventText: '46 events',
            peakRangeText: '10:00 - 11:00',
            peakPointIdx: 5
          },
          Vehicles: {
            points: [
              { time: '00:00', val: 4 }, { time: '02:00', val: 3 }, { time: '04:00', val: 2 },
              { time: '06:00', val: 11 }, { time: '08:00', val: 27 }, { time: '10:00', val: 39, peak: true, range: '10:00 - 11:00' },
              { time: '12:00', val: 22 }, { time: '14:00', val: 19 }, { time: '16:00', val: 25 },
              { time: '18:00', val: 34 }, { time: '20:00', val: 20 }, { time: '22:00', val: 12 }, { time: '23:59', val: 6 }
            ],
            peakEventText: '39 events',
            peakRangeText: '10:00 - 11:00',
            peakPointIdx: 5
          },
          ANPR: {
            points: [
              { time: '00:00', val: 2 }, { time: '02:00', val: 1 }, { time: '04:00', val: 2 },
              { time: '06:00', val: 8 }, { time: '08:00', val: 19 }, { time: '10:00', val: 28, peak: true, range: '10:00 - 11:00' },
              { time: '12:00', val: 15 }, { time: '14:00', val: 13 }, { time: '16:00', val: 18 },
              { time: '18:00', val: 22 }, { time: '20:00', val: 14 }, { time: '22:00', val: 8 }, { time: '23:59', val: 4 }
            ],
            peakEventText: '28 events',
            peakRangeText: '10:00 - 11:00',
            peakPointIdx: 5
          },
          'Face Recognition': {
            points: [
              { time: '00:00', val: 0 }, { time: '02:00', val: 1 }, { time: '04:00', val: 0 },
              { time: '06:00', val: 2 }, { time: '08:00', val: 3 }, { time: '10:00', val: 5, peak: true, range: '10:00 - 11:00' },
              { time: '12:00', val: 2 }, { time: '14:00', val: 1 }, { time: '16:00', val: 2 },
              { time: '18:00', val: 4 }, { time: '20:00', val: 3 }, { time: '22:00', val: 2 }, { time: '23:59', val: 1 }
            ],
            peakEventText: '5 matches',
            peakRangeText: '10:00 - 11:00',
            peakPointIdx: 5
          },
          'Total Alerts': {
            points: [
              { time: '00:00', val: 15 }, { time: '02:00', val: 18 }, { time: '04:00', val: 12 },
              { time: '06:00', val: 24 }, { time: '08:00', val: 38 }, { time: '10:00', val: 48, peak: true, range: '10:00 - 11:00' },
              { time: '12:00', val: 31 }, { time: '14:00', val: 26 }, { time: '16:00', val: 32 },
              { time: '18:00', val: 45 }, { time: '20:00', val: 40 }, { time: '22:00', val: 44 }, { time: '23:59', val: 18 }
            ],
            peakEventText: '48 alerts',
            peakRangeText: '10:00 - 11:00',
            peakPointIdx: 5
          }
        }
      },
      'Last 7 Days': {
        kpis: {
          totalEvents: { val: '8,940', trend: '↑ 8%', trendClass: 'trend-up-green' },
          intrusions: { val: '164', trend: '↑ 22%', trendClass: 'trend-up-red' },
          person: { val: '4,792', trend: '↑ 14%', trendClass: 'trend-up-green' },
          vehicle: { val: '2,740', trend: '↑ 6%', trendClass: 'trend-up-green' },
          anpr: { val: '1,518', trend: '↑ 17%', trendClass: 'trend-up-green' },
          face: { val: '119', trend: '↑ 4%', trendClass: 'trend-up-green' }
        },
        threats: {
          critical: { count: 294, pct: '3.3%', barWidth: '3.3%' },
          high: { count: 894, pct: '10.0%', barWidth: '10.0%' },
          medium: { count: 2690, pct: '30.1%', barWidth: '30.1%' },
          low: { count: 5062, pct: '56.6%', barWidth: '56.6%' }
        },
        sectors: {
          'Sector A': { count: 1274, fillWidth: '36.9%' },
          'Sector B': { count: 3451, fillWidth: '100%' },
          'Sector C': { count: 2247, fillWidth: '65.1%' },
          'Sector D': { count: 1968, fillWidth: '57.0%' }
        },
        topLocations: [
          { rank: 1, name: 'BOP Alpha', sector: 'Sector A', events: '329 events', delta: '↑ 21%' },
          { rank: 2, name: 'Sector B-17', sector: 'Sector B', events: '273 events', delta: '↑ 15%' },
          { rank: 3, name: 'Checkpost C-04', sector: 'Sector C', events: '217 events', delta: '↑ 9%' },
          { rank: 4, name: 'Border Road A-08', sector: 'Sector A', events: '168 events', delta: '↑ 8%' }
        ],
        cameras: [
          { id: 'CAM-034', uptime: '99.7%', detections: 1736, alerts: 84, fp: 21, status: 'Online' },
          { id: 'CAM-021', uptime: '99.4%', detections: 1302, alerts: 49, fp: 28, status: 'Online' },
          { id: 'CAM-017', uptime: '98.8%', detections: 2184, alerts: 126, fp: 42, status: 'Processing' },
          { id: 'CAM-008', uptime: '99.6%', detections: 994, alerts: 28, fp: 14, status: 'Online' }
        ],
        trendDatasets: {
          Intrusions: {
            points: [
              { time: 'Mon', val: 18 }, { time: 'Tue', val: 22 }, { time: 'Wed', val: 19 },
              { time: 'Thu', val: 26 }, { time: 'Fri', val: 34, peak: true, range: 'Friday Peak' },
              { time: 'Sat', val: 27 }, { time: 'Sun', val: 18 }
            ],
            peakEventText: '34 events',
            peakRangeText: 'Friday Peak',
            peakPointIdx: 4
          },
          People: {
            points: [
              { time: 'Mon', val: 610 }, { time: 'Tue', val: 680 }, { time: 'Wed', val: 640 },
              { time: 'Thu', val: 720 }, { time: 'Fri', val: 810, peak: true, range: 'Friday Peak' },
              { time: 'Sat', val: 740 }, { time: 'Sun', val: 592 }
            ],
            peakEventText: '810 events',
            peakRangeText: 'Friday Peak',
            peakPointIdx: 4
          },
          Vehicles: {
            points: [
              { time: 'Mon', val: 340 }, { time: 'Tue', val: 380 }, { time: 'Wed', val: 360 },
              { time: 'Thu', val: 420 }, { time: 'Fri', val: 470, peak: true, range: 'Friday Peak' },
              { time: 'Sat', val: 410 }, { time: 'Sun', val: 360 }
            ],
            peakEventText: '470 events',
            peakRangeText: 'Friday Peak',
            peakPointIdx: 4
          },
          ANPR: {
            points: [
              { time: 'Mon', val: 190 }, { time: 'Tue', val: 210 }, { time: 'Wed', val: 200 },
              { time: 'Thu', val: 240 }, { time: 'Fri', val: 270, peak: true, range: 'Friday Peak' },
              { time: 'Sat', val: 230 }, { time: 'Sun', val: 178 }
            ],
            peakEventText: '270 events',
            peakRangeText: 'Friday Peak',
            peakPointIdx: 4
          },
          'Face Recognition': {
            points: [
              { time: 'Mon', val: 14 }, { time: 'Tue', val: 16 }, { time: 'Wed', val: 15 },
              { time: 'Thu', val: 19 }, { time: 'Fri', val: 24, peak: true, range: 'Friday Peak' },
              { time: 'Sat', val: 18 }, { time: 'Sun', val: 13 }
            ],
            peakEventText: '24 matches',
            peakRangeText: 'Friday Peak',
            peakPointIdx: 4
          },
          'Total Alerts': {
            points: [
              { time: 'Mon', val: 180 }, { time: 'Tue', val: 210 }, { time: 'Wed', val: 195 },
              { time: 'Thu', val: 245 }, { time: 'Fri', val: 290, peak: true, range: 'Friday Peak' },
              { time: 'Sat', val: 250 }, { time: 'Sun', val: 188 }
            ],
            peakEventText: '290 alerts',
            peakRangeText: 'Friday Peak',
            peakPointIdx: 4
          }
        }
      },
      'Last 30 Days': {
        kpis: {
          totalEvents: { val: '38,420', trend: '↑ 5%', trendClass: 'trend-up-green' },
          intrusions: { val: '712', trend: '↑ 15%', trendClass: 'trend-up-red' },
          person: { val: '20,580', trend: '↑ 11%', trendClass: 'trend-up-green' },
          vehicle: { val: '11,760', trend: '↑ 4%', trendClass: 'trend-up-green' },
          anpr: { val: '6,520', trend: '↑ 12%', trendClass: 'trend-up-green' },
          face: { val: '512', trend: '↑ 2%', trendClass: 'trend-up-green' }
        },
        threats: {
          critical: { count: 1268, pct: '3.3%', barWidth: '3.3%' },
          high: { count: 3842, pct: '10.0%', barWidth: '10.0%' },
          medium: { count: 11564, pct: '30.1%', barWidth: '30.1%' },
          low: { count: 21746, pct: '56.6%', barWidth: '56.6%' }
        },
        sectors: {
          'Sector A': { count: 5460, fillWidth: '36.9%' },
          'Sector B': { count: 14790, fillWidth: '100%' },
          'Sector C': { count: 9630, fillWidth: '65.1%' },
          'Sector D': { count: 8540, fillWidth: '57.7%' }
        },
        topLocations: [
          { rank: 1, name: 'BOP Alpha', sector: 'Sector A', events: '1,410 events', delta: '↑ 18%' },
          { rank: 2, name: 'Sector B-17', sector: 'Sector B', events: '1,170 events', delta: '↑ 12%' },
          { rank: 3, name: 'Checkpost C-04', sector: 'Sector C', events: '930 events', delta: '↑ 6%' },
          { rank: 4, name: 'Border Road A-08', sector: 'Sector A', events: '720 events', delta: '↑ 5%' }
        ],
        cameras: [
          { id: 'CAM-034', uptime: '99.6%', detections: 7440, alerts: 360, fp: 90, status: 'Online' },
          { id: 'CAM-021', uptime: '99.3%', detections: 5580, alerts: 210, fp: 120, status: 'Online' },
          { id: 'CAM-017', uptime: '98.6%', detections: 9360, alerts: 540, fp: 180, status: 'Processing' },
          { id: 'CAM-008', uptime: '99.5%', detections: 4260, alerts: 120, fp: 60, status: 'Online' }
        ],
        trendDatasets: {
          Intrusions: {
            points: [
              { time: 'Week 1', val: 165 }, { time: 'Week 2', val: 178 },
              { time: 'Week 3', val: 204, peak: true, range: 'Week 3 Peak' }, { time: 'Week 4', val: 165 }
            ],
            peakEventText: '204 events',
            peakRangeText: 'Week 3 Peak',
            peakPointIdx: 2
          },
          People: {
            points: [
              { time: 'Week 1', val: 4800 }, { time: 'Week 2', val: 5120 },
              { time: 'Week 3', val: 5680, peak: true, range: 'Week 3 Peak' }, { time: 'Week 4', val: 4980 }
            ],
            peakEventText: '5,680 events',
            peakRangeText: 'Week 3 Peak',
            peakPointIdx: 2
          },
          Vehicles: {
            points: [
              { time: 'Week 1', val: 2750 }, { time: 'Week 2', val: 2950 },
              { time: 'Week 3', val: 3250, peak: true, range: 'Week 3 Peak' }, { time: 'Week 4', val: 2810 }
            ],
            peakEventText: '3,250 events',
            peakRangeText: 'Week 3 Peak',
            peakPointIdx: 2
          },
          ANPR: {
            points: [
              { time: 'Week 1', val: 1520 }, { time: 'Week 2', val: 1640 },
              { time: 'Week 3', val: 1820, peak: true, range: 'Week 3 Peak' }, { time: 'Week 4', val: 1540 }
            ],
            peakEventText: '1,820 events',
            peakRangeText: 'Week 3 Peak',
            peakPointIdx: 2
          },
          'Face Recognition': {
            points: [
              { time: 'Week 1', val: 118 }, { time: 'Week 2', val: 129 },
              { time: 'Week 3', val: 148, peak: true, range: 'Week 3 Peak' }, { time: 'Week 4', val: 117 }
            ],
            peakEventText: '148 matches',
            peakRangeText: 'Week 3 Peak',
            peakPointIdx: 2
          },
          'Total Alerts': {
            points: [
              { time: 'Week 1', val: 1640 }, { time: 'Week 2', val: 1780 },
              { time: 'Week 3', val: 2010, peak: true, range: 'Week 3 Peak' }, { time: 'Week 4', val: 1620 }
            ],
            peakEventText: '2,010 alerts',
            peakRangeText: 'Week 3 Peak',
            peakPointIdx: 2
          }
        }
      }
    };

    // Link Custom Range to Last 30 Days default scaled dataset
    this.datasets['Custom Range'] = this.datasets['Last 30 Days'];
  }

  getActiveData() {
    return this.datasets[this.selectedTimeRange] || this.datasets['Last 24 Hours'];
  }

  render() {
    const data = this.getActiveData();

    return `
      <div class="analytics-view-container" id="analytics-view-root">
        <!-- ===================================================================
             1. HEADER: TITLE & TOP CONTROLS
             =================================================================== -->
        <div class="analytics-page-header">
          <div class="analytics-title-group">
            <h1 class="analytics-title">Analytics & Reports</h1>
            <div class="analytics-subtitle">Turning Surveillance Data into Actionable Insights</div>
          </div>

          <div class="analytics-header-controls">
            <!-- Time Filter Dropdown -->
            <div class="custom-dropdown-wrap" id="time-filter-dropdown-wrap">
              <button class="dropdown-trigger-btn" id="btn-time-filter" type="button" aria-haspopup="true" aria-expanded="false">
                <svg class="icon-calendar" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span id="selected-time-range-text">${this.selectedTimeRange}</span>
                <svg class="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div class="dropdown-menu-list" id="time-filter-menu">
                <button class="dropdown-menu-item ${this.selectedTimeRange === 'Last 24 Hours' ? 'selected' : ''}" data-val="Last 24 Hours">
                  <span>Last 24 Hours</span>
                </button>
                <button class="dropdown-menu-item ${this.selectedTimeRange === 'Last 7 Days' ? 'selected' : ''}" data-val="Last 7 Days">
                  <span>Last 7 Days</span>
                </button>
                <button class="dropdown-menu-item ${this.selectedTimeRange === 'Last 30 Days' ? 'selected' : ''}" data-val="Last 30 Days">
                  <span>Last 30 Days</span>
                </button>
                <button class="dropdown-menu-item ${this.selectedTimeRange === 'Custom Range' ? 'selected' : ''}" data-val="Custom Range">
                  <span>Custom Range</span>
                </button>
              </div>
            </div>

            <!-- Export Button -->
            <button class="btn-analytics-export" id="btn-export-analytics" type="button" title="Export current surveillance data report">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Export</span>
            </button>
          </div>
        </div>

        <!-- ===================================================================
             2. KPI SUMMARY METRICS ROW (6 CARDS)
             =================================================================== -->
        <div class="analytics-kpi-grid">
          <!-- 1. Total Events -->
          <div class="analytics-kpi-card" data-kpi="Total Events">
            <div class="analytics-kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <line x1="9" y1="12" x2="15" y2="12"></line>
                <line x1="9" y1="16" x2="13" y2="16"></line>
              </svg>
            </div>
            <div class="analytics-kpi-body">
              <div class="analytics-kpi-label">Total Events</div>
              <div class="analytics-kpi-num-row">
                <span class="analytics-kpi-val" id="kpi-total-events">${data.kpis.totalEvents.val}</span>
                <span class="analytics-kpi-trend ${data.kpis.totalEvents.trendClass}" id="trend-total-events">${data.kpis.totalEvents.trend}</span>
              </div>
            </div>
          </div>

          <!-- 2. Intrusions -->
          <div class="analytics-kpi-card" data-kpi="Intrusions">
            <div class="analytics-kpi-icon icon-alert-red">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 2 22 22 22"></polygon>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div class="analytics-kpi-body">
              <div class="analytics-kpi-label">Intrusions</div>
              <div class="analytics-kpi-num-row">
                <span class="analytics-kpi-val" id="kpi-intrusions">${data.kpis.intrusions.val}</span>
                <span class="analytics-kpi-trend ${data.kpis.intrusions.trendClass}" id="trend-intrusions">${data.kpis.intrusions.trend}</span>
              </div>
            </div>
          </div>

          <!-- 3. Person Detections -->
          <div class="analytics-kpi-card" data-kpi="Person Detections">
            <div class="analytics-kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="analytics-kpi-body">
              <div class="analytics-kpi-label">Person Detections</div>
              <div class="analytics-kpi-num-row">
                <span class="analytics-kpi-val" id="kpi-person-detections">${data.kpis.person.val}</span>
                <span class="analytics-kpi-trend ${data.kpis.person.trendClass}" id="trend-person-detections">${data.kpis.person.trend}</span>
              </div>
            </div>
          </div>

          <!-- 4. Vehicle Detections -->
          <div class="analytics-kpi-card" data-kpi="Vehicle Detections">
            <div class="analytics-kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="8" rx="2"></rect>
                <path d="M5 11l2-5h10l2 5"></path>
                <circle cx="7.5" cy="15.5" r="1.5"></circle>
                <circle cx="16.5" cy="15.5" r="1.5"></circle>
              </svg>
            </div>
            <div class="analytics-kpi-body">
              <div class="analytics-kpi-label">Vehicle Detections</div>
              <div class="analytics-kpi-num-row">
                <span class="analytics-kpi-val" id="kpi-vehicle-detections">${data.kpis.vehicle.val}</span>
                <span class="analytics-kpi-trend ${data.kpis.vehicle.trendClass}" id="trend-vehicle-detections">${data.kpis.vehicle.trend}</span>
              </div>
            </div>
          </div>

          <!-- 5. ANPR Events -->
          <div class="analytics-kpi-card" data-kpi="ANPR Events">
            <div class="analytics-kpi-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="3"></rect>
                <text x="12" y="14.5" font-family="'Inter', sans-serif" font-size="7" font-weight="bold" fill="currentColor" text-anchor="middle" stroke="none">ANPR</text>
              </svg>
            </div>
            <div class="analytics-kpi-body">
              <div class="analytics-kpi-label">ANPR Events</div>
              <div class="analytics-kpi-num-row">
                <span class="analytics-kpi-val" id="kpi-anpr-events">${data.kpis.anpr.val}</span>
                <span class="analytics-kpi-trend ${data.kpis.anpr.trendClass}" id="trend-anpr-events">${data.kpis.anpr.trend}</span>
              </div>
            </div>
          </div>

          <!-- 6. Face Matches -->
          <div class="analytics-kpi-card" data-kpi="Face Matches">
            <div class="analytics-kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                <circle cx="12" cy="11" r="3"></circle>
                <path d="M8 17a4 4 0 0 1 8 0"></path>
              </svg>
            </div>
            <div class="analytics-kpi-body">
              <div class="analytics-kpi-label">Face Matches</div>
              <div class="analytics-kpi-num-row">
                <span class="analytics-kpi-val" id="kpi-face-matches">${data.kpis.face.val}</span>
                <span class="analytics-kpi-trend ${data.kpis.face.trendClass}" id="trend-face-matches">${data.kpis.face.trend}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             3. MIDDLE ROW: DETECTION TRENDS (65%) + THREAT DISTRIBUTION (35%)
             =================================================================== -->
        <div class="analytics-row-mid">
          <!-- Left: Detection Trends Chart -->
          <div class="analytics-card trend-card">
            <div class="analytics-card-header">
              <div class="card-title-wrap">
                <span class="analytics-card-title">DETECTION TRENDS</span>
              </div>

              <!-- Filter Tabs -->
              <div class="trend-filter-tabs" id="trend-tabs-bar">
                <button class="trend-filter-btn ${this.activeFilter === 'Intrusions' ? 'active' : ''}" data-tab="Intrusions">Intrusions</button>
                <button class="trend-filter-btn ${this.activeFilter === 'People' ? 'active' : ''}" data-tab="People">People</button>
                <button class="trend-filter-btn ${this.activeFilter === 'Vehicles' ? 'active' : ''}" data-tab="Vehicles">Vehicles</button>
                <button class="trend-filter-btn ${this.activeFilter === 'ANPR' ? 'active' : ''}" data-tab="ANPR">ANPR</button>
                <button class="trend-filter-btn ${this.activeFilter === 'Face Recognition' ? 'active' : ''}" data-tab="Face Recognition">Face Recognition</button>
                <button class="trend-filter-btn ${this.activeFilter === 'Total Alerts' ? 'active' : ''}" data-tab="Total Alerts">Total Alerts</button>
              </div>
            </div>

            <!-- SVG Chart Viewport -->
            <div class="trend-chart-container" id="trend-chart-box">
              ${this.renderSplineChart(this.activeFilter)}
            </div>
          </div>

          <!-- Right: Threat Distribution -->
          <div class="analytics-card threat-dist-card">
            <div class="analytics-card-header">
              <div class="card-title-wrap">
                <span class="analytics-card-title">THREAT DISTRIBUTION</span>
                <button class="info-circle-btn" id="btn-info-threats" title="Threat classification aggregated across monitored border sectors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div class="threat-dist-content">
              <!-- Segmented Stacked Progress Bar -->
              <div class="threat-stacked-bar" id="threat-stacked-bar">
                <div class="bar-seg seg-critical" style="width: ${data.threats.critical.barWidth};" title="Critical: ${data.threats.critical.pct}"></div>
                <div class="bar-seg seg-high" style="width: ${data.threats.high.barWidth};" title="High: ${data.threats.high.pct}"></div>
                <div class="bar-seg seg-medium" style="width: ${data.threats.medium.barWidth};" title="Medium: ${data.threats.medium.pct}"></div>
                <div class="bar-seg seg-low" style="width: ${data.threats.low.barWidth};" title="Low: ${data.threats.low.pct}"></div>
              </div>

              <!-- Threat Stats Row (4 Columns) -->
              <div class="threat-stats-row">
                <!-- Critical -->
                <div class="threat-stat-col" data-level="Critical">
                  <div class="stat-label-wrap">
                    <span class="threat-bullet bullet-critical"></span>
                    <span>Critical</span>
                  </div>
                  <div class="threat-stat-numbers">
                    <span class="threat-stat-val" id="threat-val-crit">${data.threats.critical.count}</span>
                    <span class="threat-stat-pct" id="threat-pct-crit">(${data.threats.critical.pct})</span>
                  </div>
                </div>

                <!-- High -->
                <div class="threat-stat-col" data-level="High">
                  <div class="stat-label-wrap">
                    <span class="threat-bullet bullet-high"></span>
                    <span>High</span>
                  </div>
                  <div class="threat-stat-numbers">
                    <span class="threat-stat-val" id="threat-val-high">${data.threats.high.count}</span>
                    <span class="threat-stat-pct" id="threat-pct-high">(${data.threats.high.pct})</span>
                  </div>
                </div>

                <!-- Medium -->
                <div class="threat-stat-col" data-level="Medium">
                  <div class="stat-label-wrap">
                    <span class="threat-bullet bullet-medium"></span>
                    <span>Medium</span>
                  </div>
                  <div class="threat-stat-numbers">
                    <span class="threat-stat-val" id="threat-val-med">${data.threats.medium.count}</span>
                    <span class="threat-stat-pct" id="threat-pct-med">(${data.threats.medium.pct})</span>
                  </div>
                </div>

                <!-- Low -->
                <div class="threat-stat-col" data-level="Low">
                  <div class="stat-label-wrap">
                    <span class="threat-bullet bullet-low"></span>
                    <span>Low</span>
                  </div>
                  <div class="threat-stat-numbers">
                    <span class="threat-stat-val" id="threat-val-low">${data.threats.low.count}</span>
                    <span class="threat-stat-pct" id="threat-pct-low">(${data.threats.low.pct})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             4. LOWER MIDDLE ROW: EVENTS BY SECTOR (45%) + CAMERA PERFORMANCE (55%)
             =================================================================== -->
        <div class="analytics-row-lower">
          <!-- Left: Events by Sector -->
          <div class="analytics-card sector-events-card">
            <div class="analytics-card-header">
              <div class="card-title-wrap">
                <span class="analytics-card-title">EVENTS BY SECTOR</span>
                <button class="info-circle-btn" id="btn-info-sectors" title="Total validated alerts broken down by tactical border sectors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Horizontal Sector Progress Bars -->
            <div class="sector-bars-list" id="sector-bars-list">
              <!-- Sector A -->
              <div class="sector-bar-item ${this.selectedSectorFilter === 'Sector A' ? 'selected-sector' : ''}" data-sector="Sector A">
                <span class="sector-name">Sector A</span>
                <div class="sector-bar-track">
                  <div class="sector-bar-fill" style="width: ${data.sectors['Sector A'].fillWidth};"></div>
                </div>
                <span class="sector-count">${data.sectors['Sector A'].count}</span>
              </div>

              <!-- Sector B -->
              <div class="sector-bar-item ${this.selectedSectorFilter === 'Sector B' ? 'selected-sector' : ''}" data-sector="Sector B">
                <span class="sector-name">Sector B</span>
                <div class="sector-bar-track">
                  <div class="sector-bar-fill" style="width: ${data.sectors['Sector B'].fillWidth};"></div>
                </div>
                <span class="sector-count">${data.sectors['Sector B'].count}</span>
              </div>

              <!-- Sector C -->
              <div class="sector-bar-item ${this.selectedSectorFilter === 'Sector C' ? 'selected-sector' : ''}" data-sector="Sector C">
                <span class="sector-name">Sector C</span>
                <div class="sector-bar-track">
                  <div class="sector-bar-fill" style="width: ${data.sectors['Sector C'].fillWidth};"></div>
                </div>
                <span class="sector-count">${data.sectors['Sector C'].count}</span>
              </div>

              <!-- Sector D -->
              <div class="sector-bar-item ${this.selectedSectorFilter === 'Sector D' ? 'selected-sector' : ''}" data-sector="Sector D">
                <span class="sector-name">Sector D</span>
                <div class="sector-bar-track">
                  <div class="sector-bar-fill" style="width: ${data.sectors['Sector D'].fillWidth};"></div>
                </div>
                <span class="sector-count">${data.sectors['Sector D'].count}</span>
              </div>
            </div>
          </div>

          <!-- Right: Camera Performance -->
          <div class="analytics-card camera-perf-card">
            <div class="analytics-card-header">
              <div class="card-title-wrap">
                <span class="analytics-card-title">CAMERA PERFORMANCE</span>
                <button class="info-circle-btn" id="btn-info-cameras" title="Hardware availability, detection counts, and processing status">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </button>
              </div>

              <a href="#view-all-cameras" class="card-header-link" id="btn-view-all-cameras">View All &nbsp;→</a>
            </div>

            <!-- Sortable Table -->
            <table class="camera-perf-table" id="camera-perf-table">
              <thead>
                <tr>
                  <th class="sortable-th" data-col="camera">Camera <span class="th-sort-indicator ${this.sortColumn === 'camera' ? 'active' : ''}">${this.sortDirection === 'asc' ? '▲' : '▼'}</span></th>
                  <th class="sortable-th" data-col="uptime">Uptime <span class="th-sort-indicator ${this.sortColumn === 'uptime' ? 'active' : ''}">${this.sortDirection === 'asc' ? '▲' : '▼'}</span></th>
                  <th class="sortable-th" data-col="detections">Detections <span class="th-sort-indicator ${this.sortColumn === 'detections' ? 'active' : ''}">${this.sortDirection === 'asc' ? '▲' : '▼'}</span></th>
                  <th class="sortable-th" data-col="alerts">Alerts <span class="th-sort-indicator ${this.sortColumn === 'alerts' ? 'active' : ''}">${this.sortDirection === 'asc' ? '▲' : '▼'}</span></th>
                  <th class="sortable-th" data-col="fp">False Positives <span class="th-sort-indicator ${this.sortColumn === 'fp' ? 'active' : ''}">${this.sortDirection === 'asc' ? '▲' : '▼'}</span></th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="camera-perf-tbody">
                ${this.renderCameraRows(data.cameras)}
              </tbody>
            </table>
          </div>
        </div>

        <!-- ===================================================================
             5. BOTTOM ROW: TOP ALERT LOCATIONS (38%) + GENERATE REPORT (62%)
             =================================================================== -->
        <div class="analytics-row-bottom">
          <!-- Left: Top Alert Locations -->
          <div class="analytics-card top-locations-card">
            <div class="analytics-card-header">
              <div class="card-title-wrap">
                <span class="analytics-card-title">TOP ALERT LOCATIONS</span>
                <button class="info-circle-btn" id="btn-info-locations" title="Border sectors with highest frequency of anomalous triggers">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div class="top-locations-list" id="top-locations-list">
              ${data.topLocations.map(loc => `
                <div class="top-loc-item" data-sector="${loc.sector}" data-loc="${loc.name}">
                  <span class="loc-rank-badge">${loc.rank}</span>
                  <span class="loc-name">${loc.name}</span>
                  <span class="loc-events">${loc.events}</span>
                  <span class="loc-delta">${loc.delta}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: Generate Report Card -->
          <div class="analytics-card generate-report-card">
            <div class="report-header-row">
              <div class="report-title-badge-group">
                <div class="report-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div class="report-text-col">
                  <h3 class="report-card-heading">GENERATE REPORT</h3>
                  <div class="report-card-sub">Create detailed reports for briefing and analysis</div>
                </div>
              </div>

              <!-- Report Action Controls (Dropdown + Submit) -->
              <div class="report-actions-col">
                <div class="custom-dropdown-wrap" id="report-type-dropdown-wrap">
                  <button class="report-type-select-btn" id="btn-report-type-select" type="button" aria-haspopup="true" aria-expanded="false">
                    <span id="selected-report-type-text">${this.selectedReportType}</span>
                    <svg class="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  <div class="dropdown-menu-list" id="report-type-menu">
                    <button class="dropdown-menu-item ${this.selectedReportType === 'Daily Security Report' ? 'selected' : ''}" data-report="Daily Security Report">
                      <span>Daily Security Report</span>
                    </button>
                    <button class="dropdown-menu-item ${this.selectedReportType === 'Incident Report' ? 'selected' : ''}" data-report="Incident Report">
                      <span>Incident Report</span>
                    </button>
                    <button class="dropdown-menu-item ${this.selectedReportType === 'Sector Activity Report' ? 'selected' : ''}" data-report="Sector Activity Report">
                      <span>Sector Activity Report</span>
                    </button>
                    <button class="dropdown-menu-item ${this.selectedReportType === 'Camera Health Report' ? 'selected' : ''}" data-report="Camera Health Report">
                      <span>Camera Health Report</span>
                    </button>
                  </div>
                </div>

                <button class="btn-submit-generate" id="btn-generate-report-submit" type="button">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                  <span>Generate Report</span>
                </button>
              </div>
            </div>

            <!-- Light Mint Alert Callout Notice -->
            <div class="report-notice-callout">
              <svg class="report-notice-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div class="report-notice-text">
                Reports include event summaries, threat analysis, sector-wise breakdown and actionable insights.
              </div>
            </div>

            <!-- Bottom Right Mountain Artwork & Vigilance Motto Watermark -->
            <div class="report-watermark-wrap">
              <svg class="report-watermark-svg" viewBox="0 0 100 45" fill="none" stroke="currentColor" stroke-width="1.2">
                <path d="M5 40 L30 15 L45 30 L65 8 L85 35 L95 40 Z" fill="rgba(30, 67, 36, 0.04)" stroke="#A3B4A5"></path>
                <path d="M25 40 L45 22 L60 35 L75 18 L90 40 Z" fill="rgba(30, 67, 36, 0.02)" stroke="#B7C6B9"></path>
              </svg>
              <div class="report-motto-block">
                <span>VIGILANCE</span>
                <span>INTELLIGENCE</span>
                <span>SECURITY</span>
                <span>TOGETHER</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Container for dynamically mounted modals -->
        <div id="analytics-modal-container"></div>
      </div>
    `;
  }

  renderCameraRows(cameras) {
    // Sort cameras based on current sort settings
    const sorted = [...cameras].sort((a, b) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      if (this.sortColumn === 'uptime') {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      } else if (this.sortColumn === 'camera') {
        valA = a.id;
        valB = b.id;
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted.map(c => `
      <tr class="camera-perf-row" data-cam="${c.id}">
        <td class="cell-camera">${c.id}</td>
        <td>${c.uptime}</td>
        <td>${c.detections}</td>
        <td>${c.alerts}</td>
        <td>${c.fp}</td>
        <td>
          <span class="ai-status-badge ${c.status === 'Online' ? 'status-online' : 'status-processing'}">
            <span class="status-dot"></span>
            <span>${c.status}</span>
          </span>
        </td>
      </tr>
    `).join('');
  }

  /**
   * Compute smooth SVG spline curve through coordinates
   */
  renderSplineChart(filterKey) {
    const data = this.getActiveData();
    const dataset = data.trendDatasets[filterKey] || data.trendDatasets['Intrusions'];
    const pts = dataset.points;

    const width = 700;
    const height = 180;
    const padLeft = 45;
    const padRight = 20;
    const padTop = 24;
    const padBottom = 26;

    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;

    // Dynamically calculate maxY based on dataset
    const maxVal = Math.max(...pts.map(p => p.val), 10);
    const maxY = maxVal > 1000 ? Math.ceil(maxVal / 500) * 500 : (maxVal > 100 ? Math.ceil(maxVal / 50) * 50 : 50);

    // Map data points to SVG coordinates
    const coords = pts.map((p, i) => {
      const x = padLeft + (i / Math.max(1, pts.length - 1)) * plotWidth;
      const y = padTop + plotHeight - (p.val / maxY) * plotHeight;
      return { x, y, val: p.val, time: p.time, peak: p.peak, range: p.range };
    });

    // Save coords for hover crosshair calculations
    this.currentChartCoords = coords;
    this.currentChartWidth = width;

    // Generate smooth bezier curve path
    let pathD = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = i > 0 ? coords[i - 1] : coords[i];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = i < coords.length - 2 ? coords[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      pathD += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }

    const areaD = `${pathD} L ${coords[coords.length - 1].x},${padTop + plotHeight} L ${coords[0].x},${padTop + plotHeight} Z`;
    const peakCoord = coords[dataset.peakPointIdx] || coords[Math.floor(coords.length / 2)];

    // Grid levels
    const yLevels = [0, Math.round(maxY * 0.2), Math.round(maxY * 0.4), Math.round(maxY * 0.6), Math.round(maxY * 0.8), maxY];

    return `
      <svg class="trend-chart-svg" id="trend-chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="curveFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#286236" stop-opacity="0.22" />
            <stop offset="100%" stop-color="#286236" stop-opacity="0.01" />
          </linearGradient>
        </defs>

        <!-- Y Axis Grid Lines & Numeric Labels -->
        <text x="14" y="${padTop - 8}" font-size="10" font-weight="600" fill="#697A6B">Events</text>
        ${yLevels.map(lvl => {
          const yPos = padTop + plotHeight - (lvl / maxY) * plotHeight;
          return `
            <g class="chart-y-level">
              <text x="32" y="${yPos + 3}" text-anchor="end" font-size="10" font-weight="500" fill="#7D8F80">${lvl}</text>
              <line x1="${padLeft}" y1="${yPos}" x2="${width - padRight}" y2="${yPos}" stroke="#EDF2EC" stroke-width="1" stroke-dasharray="${lvl === 0 ? 'none' : '3,3'}" />
            </g>
          `;
        }).join('')}

        <!-- X Axis Labels -->
        ${coords.map((c) => `
          <text x="${c.x}" y="${height - 6}" text-anchor="middle" font-size="9.5" font-weight="500" fill="#758777">
            ${c.time}
          </text>
        `).join('')}

        <!-- Peak Vertical Dashed Indicator Line -->
        <line 
          id="chart-peak-line"
          x1="${peakCoord.x}" 
          y1="${peakCoord.y}" 
          x2="${peakCoord.x}" 
          y2="${padTop + plotHeight}" 
          stroke="#1E4324" 
          stroke-width="1.2" 
          stroke-dasharray="3,3" 
          opacity="0.8"
        />

        <!-- Gradient Fill Underneath -->
        <path d="${areaD}" fill="url(#curveFillGrad)" />

        <!-- Spline Line -->
        <path d="${pathD}" fill="none" stroke="#256434" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Static Data Points on vertices -->
        ${coords.map((c, i) => {
          if (i === dataset.peakPointIdx) return '';
          return `
            <circle cx="${c.x}" cy="${c.y}" r="3" fill="#FFFFFF" stroke="#256434" stroke-width="2" class="chart-point" data-idx="${i}" />
          `;
        }).join('')}

        <!-- Prominent Peak Marker Dot -->
        <circle id="chart-peak-dot-outer" cx="${peakCoord.x}" cy="${peakCoord.y}" r="6" fill="#1E4324" />
        <circle id="chart-peak-dot-inner" cx="${peakCoord.x}" cy="${peakCoord.y}" r="3" fill="#FFFFFF" />

        <!-- Interactive Crosshair (Hidden until hover) -->
        <line id="chart-crosshair" class="chart-crosshair-line" x1="0" y1="${padTop}" x2="0" y2="${padTop + plotHeight}" style="display: none;" />
        <circle id="chart-hover-indicator" class="chart-hover-ring" cx="0" cy="0" r="5" style="display: none;" />
      </svg>

      <!-- Floating Tooltip Callout Box -->
      <div class="chart-tooltip-badge" id="chart-tooltip-badge" style="left: ${(peakCoord.x / width) * 100}%; top: ${Math.max(10, peakCoord.y - 48)}px;">
        <div class="tooltip-events" id="tooltip-text-events">${dataset.peakEventText}</div>
        <div class="tooltip-hours" id="tooltip-text-hours">${dataset.peakRangeText}</div>
      </div>
    `;
  }

  /**
   * Bind event handlers for dropdowns, tabs, export, sorting, and modals
   */
  bindEvents(container) {
    this.container = container;
    if (!this.container) return;

    // 1. Time Filter Dropdown Toggle
    const timeWrap = container.querySelector('#time-filter-dropdown-wrap');
    const timeBtn = container.querySelector('#btn-time-filter');
    const timeItems = container.querySelectorAll('#time-filter-menu .dropdown-menu-item');
    const timeText = container.querySelector('#selected-time-range-text');

    if (timeBtn && timeWrap) {
      timeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        timeWrap.classList.toggle('open');
        const reportWrap = container.querySelector('#report-type-dropdown-wrap');
        if (reportWrap) reportWrap.classList.remove('open');
      });
    }

    timeItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = item.getAttribute('data-val');
        if (val === 'Custom Range') {
          timeWrap.classList.remove('open');
          this.openCustomDateModal();
          return;
        }

        this.selectedTimeRange = val;
        if (timeText) timeText.textContent = val;
        timeItems.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        timeWrap.classList.remove('open');
        
        // Re-render dashboard components reactively
        this.applyTimeFilter();
        this.showToast(`Analytics filtered: ${val}`);
      });
    });

    // 2. Report Type Dropdown Toggle
    const reportWrap = container.querySelector('#report-type-dropdown-wrap');
    const reportBtn = container.querySelector('#btn-report-type-select');
    const reportItems = container.querySelectorAll('#report-type-menu .dropdown-menu-item');
    const reportText = container.querySelector('#selected-report-type-text');

    if (reportBtn && reportWrap) {
      reportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        reportWrap.classList.toggle('open');
        if (timeWrap) timeWrap.classList.remove('open');
      });
    }

    reportItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const rep = item.getAttribute('data-report');
        this.selectedReportType = rep;
        if (reportText) reportText.textContent = rep;
        reportItems.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        reportWrap.classList.remove('open');
      });
    });

    // 3. Document click to close open dropdowns
    document.addEventListener('click', () => {
      if (timeWrap) timeWrap.classList.remove('open');
      if (reportWrap) reportWrap.classList.remove('open');
    });

    // 4. Detection Trends Filter Tabs
    const tabBtns = container.querySelectorAll('.trend-filter-btn');
    const chartBox = container.querySelector('#trend-chart-box');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab === this.activeFilter) return;

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = tab;

        if (chartBox) {
          chartBox.innerHTML = this.renderSplineChart(tab);
          this.bindChartHoverEvents();
        }
      });
    });

    // 5. Chart Hover Crosshair Binding
    this.bindChartHoverEvents();

    // 6. Table Header Sorting
    const sortHeaders = container.querySelectorAll('.camera-perf-table th.sortable-th');
    sortHeaders.forEach(th => {
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-col');
        if (this.sortColumn === col) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = col;
          this.sortDirection = 'asc';
        }
        this.refreshCameraTable();
      });
    });

    // 7. View All Cameras Modal Trigger
    const btnViewAll = container.querySelector('#btn-view-all-cameras');
    if (btnViewAll) {
      btnViewAll.addEventListener('click', (e) => {
        e.preventDefault();
        this.openViewAllCamerasModal();
      });
    }

    // 8. Header Export Button Click
    const btnExport = container.querySelector('#btn-export-analytics');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        this.openExportModal();
      });
    }

    // 9. Generate Report Button Click
    const btnGenerate = container.querySelector('#btn-generate-report-submit');
    if (btnGenerate) {
      btnGenerate.addEventListener('click', () => {
        const origHtml = btnGenerate.innerHTML;
        btnGenerate.innerHTML = `
          <svg class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          </svg>
          <span>Compiling...</span>
        `;
        btnGenerate.disabled = true;

        setTimeout(() => {
          btnGenerate.innerHTML = origHtml;
          btnGenerate.disabled = false;
          this.openReportPreviewModal();
        }, 800);
      });
    }

    // 10. Interactive Sector Bars Click Drill-down
    const sectorItems = container.querySelectorAll('.sector-bar-item');
    sectorItems.forEach(item => {
      item.addEventListener('click', () => {
        const sector = item.getAttribute('data-sector');
        if (this.selectedSectorFilter === sector) {
          this.selectedSectorFilter = null;
          item.classList.remove('selected-sector');
          this.showToast('Cleared sector filter');
        } else {
          sectorItems.forEach(s => s.classList.remove('selected-sector'));
          item.classList.add('selected-sector');
          this.selectedSectorFilter = sector;
          this.showToast(`Filtered by ${sector}. Matching alert locations highlighted.`);
        }
        this.highlightSectorLocations(this.selectedSectorFilter);
      });
    });

    // 11. Threat Stats Column Click Drill-down
    const threatCols = container.querySelectorAll('.threat-stat-col');
    threatCols.forEach(col => {
      col.addEventListener('click', () => {
        const lvl = col.getAttribute('data-level');
        this.showToast(`Threat Level: ${lvl}. All active sensors reporting nominal telemetry.`);
      });
    });

    // 12. Top Alert Locations Click
    const locItems = container.querySelectorAll('.top-loc-item');
    locItems.forEach(item => {
      item.addEventListener('click', () => {
        const loc = item.getAttribute('data-loc');
        const sec = item.getAttribute('data-sector');
        this.showToast(`Surveillance Point: ${loc} (${sec}) · Coordinates verified.`);
      });
    });
  }

  /**
   * Bind dynamic mousemove over SVG chart for crosshair & tracking tooltip
   */
  bindChartHoverEvents() {
    const chartBox = this.container ? this.container.querySelector('#trend-chart-box') : null;
    const svg = this.container ? this.container.querySelector('#trend-chart-svg') : null;
    if (!chartBox || !svg) return;

    const crosshair = svg.querySelector('#chart-crosshair');
    const hoverDot = svg.querySelector('#chart-hover-indicator');
    const tooltip = chartBox.querySelector('#chart-tooltip-badge');
    const tipEvents = chartBox.querySelector('#tooltip-text-events');
    const tipHours = chartBox.querySelector('#tooltip-text-hours');

    chartBox.addEventListener('mousemove', (e) => {
      if (!this.currentChartCoords || this.currentChartCoords.length === 0) return;

      const rect = chartBox.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const svgX = (mouseX / rect.width) * this.currentChartWidth;

      // Find nearest data coordinate
      let closest = this.currentChartCoords[0];
      let minDiff = Math.abs(svgX - closest.x);

      for (let i = 1; i < this.currentChartCoords.length; i++) {
        const diff = Math.abs(svgX - this.currentChartCoords[i].x);
        if (diff < minDiff) {
          minDiff = diff;
          closest = this.currentChartCoords[i];
        }
      }

      if (crosshair && hoverDot && tooltip) {
        crosshair.style.display = 'block';
        crosshair.setAttribute('x1', closest.x);
        crosshair.setAttribute('x2', closest.x);

        hoverDot.style.display = 'block';
        hoverDot.setAttribute('cx', closest.x);
        hoverDot.setAttribute('cy', closest.y);

        tooltip.style.left = `${(closest.x / this.currentChartWidth) * 100}%`;
        tooltip.style.top = `${Math.max(10, closest.y - 48)}px`;

        if (tipEvents) tipEvents.textContent = `${closest.val} events`;
        if (tipHours) tipHours.textContent = closest.range ? closest.range : closest.time;
      }
    });

    chartBox.addEventListener('mouseleave', () => {
      if (crosshair) crosshair.style.display = 'none';
      if (hoverDot) hoverDot.style.display = 'none';
    });
  }

  /**
   * Apply selected time filter reactively across all KPI cards, threats, sectors, and charts
   */
  applyTimeFilter() {
    const data = this.getActiveData();

    // 1. Update KPI Values
    const kpiTotal = this.container.querySelector('#kpi-total-events');
    const trendTotal = this.container.querySelector('#trend-total-events');
    if (kpiTotal) kpiTotal.textContent = data.kpis.totalEvents.val;
    if (trendTotal) {
      trendTotal.textContent = data.kpis.totalEvents.trend;
      trendTotal.className = `analytics-kpi-trend ${data.kpis.totalEvents.trendClass}`;
    }

    const kpiIntr = this.container.querySelector('#kpi-intrusions');
    const trendIntr = this.container.querySelector('#trend-intrusions');
    if (kpiIntr) kpiIntr.textContent = data.kpis.intrusions.val;
    if (trendIntr) {
      trendIntr.textContent = data.kpis.intrusions.trend;
      trendIntr.className = `analytics-kpi-trend ${data.kpis.intrusions.trendClass}`;
    }

    const kpiPerson = this.container.querySelector('#kpi-person-detections');
    const trendPerson = this.container.querySelector('#trend-person-detections');
    if (kpiPerson) kpiPerson.textContent = data.kpis.person.val;
    if (trendPerson) {
      trendPerson.textContent = data.kpis.person.trend;
      trendPerson.className = `analytics-kpi-trend ${data.kpis.person.trendClass}`;
    }

    const kpiVeh = this.container.querySelector('#kpi-vehicle-detections');
    const trendVeh = this.container.querySelector('#trend-vehicle-detections');
    if (kpiVeh) kpiVeh.textContent = data.kpis.vehicle.val;
    if (trendVeh) {
      trendVeh.textContent = data.kpis.vehicle.trend;
      trendVeh.className = `analytics-kpi-trend ${data.kpis.vehicle.trendClass}`;
    }

    const kpiAnpr = this.container.querySelector('#kpi-anpr-events');
    const trendAnpr = this.container.querySelector('#trend-anpr-events');
    if (kpiAnpr) kpiAnpr.textContent = data.kpis.anpr.val;
    if (trendAnpr) {
      trendAnpr.textContent = data.kpis.anpr.trend;
      trendAnpr.className = `analytics-kpi-trend ${data.kpis.anpr.trendClass}`;
    }

    const kpiFace = this.container.querySelector('#kpi-face-matches');
    const trendFace = this.container.querySelector('#trend-face-matches');
    if (kpiFace) kpiFace.textContent = data.kpis.face.val;
    if (trendFace) {
      trendFace.textContent = data.kpis.face.trend;
      trendFace.className = `analytics-kpi-trend ${data.kpis.face.trendClass}`;
    }

    // 2. Update Threat Distribution
    const critVal = this.container.querySelector('#threat-val-crit');
    const critPct = this.container.querySelector('#threat-pct-crit');
    if (critVal) critVal.textContent = data.threats.critical.count;
    if (critPct) critPct.textContent = `(${data.threats.critical.pct})`;

    const highVal = this.container.querySelector('#threat-val-high');
    const highPct = this.container.querySelector('#threat-pct-high');
    if (highVal) highVal.textContent = data.threats.high.count;
    if (highPct) highPct.textContent = `(${data.threats.high.pct})`;

    const medVal = this.container.querySelector('#threat-val-med');
    const medPct = this.container.querySelector('#threat-pct-med');
    if (medVal) medVal.textContent = data.threats.medium.count;
    if (medPct) medPct.textContent = `(${data.threats.medium.pct})`;

    const lowVal = this.container.querySelector('#threat-val-low');
    const lowPct = this.container.querySelector('#threat-pct-low');
    if (lowVal) lowVal.textContent = data.threats.low.count;
    if (lowPct) lowPct.textContent = `(${data.threats.low.pct})`;

    // 3. Update Chart
    const chartBox = this.container.querySelector('#trend-chart-box');
    if (chartBox) {
      chartBox.innerHTML = this.renderSplineChart(this.activeFilter);
      this.bindChartHoverEvents();
    }

    // 4. Update Sectors
    const sectorList = this.container.querySelector('#sector-bars-list');
    if (sectorList) {
      sectorList.innerHTML = Object.entries(data.sectors).map(([secName, secData]) => `
        <div class="sector-bar-item ${this.selectedSectorFilter === secName ? 'selected-sector' : ''}" data-sector="${secName}">
          <span class="sector-name">${secName}</span>
          <div class="sector-bar-track">
            <div class="sector-bar-fill" style="width: ${secData.fillWidth};"></div>
          </div>
          <span class="sector-count">${secData.count}</span>
        </div>
      `).join('');

      // Rebind sector click listeners
      sectorList.querySelectorAll('.sector-bar-item').forEach(item => {
        item.addEventListener('click', () => {
          const sec = item.getAttribute('data-sector');
          this.selectedSectorFilter = this.selectedSectorFilter === sec ? null : sec;
          sectorList.querySelectorAll('.sector-bar-item').forEach(s => s.classList.toggle('selected-sector', s.getAttribute('data-sector') === this.selectedSectorFilter));
          this.highlightSectorLocations(this.selectedSectorFilter);
        });
      });
    }

    // 5. Update Camera Table
    this.refreshCameraTable();

    // 6. Update Top Locations
    const locList = this.container.querySelector('#top-locations-list');
    if (locList) {
      locList.innerHTML = data.topLocations.map(loc => `
        <div class="top-loc-item" data-sector="${loc.sector}" data-loc="${loc.name}">
          <span class="loc-rank-badge">${loc.rank}</span>
          <span class="loc-name">${loc.name}</span>
          <span class="loc-events">${loc.events}</span>
          <span class="loc-delta">${loc.delta}</span>
        </div>
      `).join('');
    }
  }

  refreshCameraTable() {
    const data = this.getActiveData();
    const tbody = this.container.querySelector('#camera-perf-tbody');
    if (tbody) {
      tbody.innerHTML = this.renderCameraRows(data.cameras);
    }

    // Update th active sort indicator
    const ths = this.container.querySelectorAll('.camera-perf-table th.sortable-th');
    ths.forEach(th => {
      const col = th.getAttribute('data-col');
      const ind = th.querySelector('.th-sort-indicator');
      if (ind) {
        if (col === this.sortColumn) {
          ind.className = 'th-sort-indicator active';
          ind.textContent = this.sortDirection === 'asc' ? '▲' : '▼';
        } else {
          ind.className = 'th-sort-indicator';
        }
      }
    });
  }

  highlightSectorLocations(sector) {
    const locItems = this.container.querySelectorAll('.top-loc-item');
    locItems.forEach(item => {
      if (!sector) {
        item.classList.remove('highlighted-loc');
      } else {
        const itemSector = item.getAttribute('data-sector');
        item.classList.toggle('highlighted-loc', itemSector === sector);
      }
    });
  }

  // =========================================================================
  // MODALS IMPLEMENTATION (WITHOUT AI DATA)
  // =========================================================================

  /**
   * View All Cameras Modal with search, sector filtering, and sort
   */
  openViewAllCamerasModal() {
    const mount = this.container.querySelector('#analytics-modal-container') || document.body;
    
    let filteredCams = [...this.allCameras];
    let activeSearch = '';
    let activeSector = 'All Sectors';
    let activeStatus = 'All';

    const renderModalContent = () => `
      <div class="analytics-modal-backdrop" id="modal-backdrop-cameras">
        <div class="analytics-modal-card modal-lg">
          <div class="modal-header-tactical">
            <div class="modal-header-left">
              <div class="modal-header-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
              </div>
              <div>
                <h3 class="modal-header-title">ALL MONITORED SURVEILLANCE CAMERAS</h3>
                <p class="modal-header-subtitle">Live hardware diagnostic registry across all operational sectors</p>
              </div>
            </div>
            <button class="btn-modal-close" id="btn-close-modal" title="Close Modal">&times;</button>
          </div>

          <div class="modal-body-scrollable">
            <!-- Filter Toolbar -->
            <div class="all-cam-toolbar">
              <div class="search-input-wrap">
                <svg class="search-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" id="cam-search-input" class="modal-search-input" placeholder="Search by Camera ID or Location..." value="${activeSearch}" />
              </div>

              <div class="filter-selects-row">
                <select id="modal-sector-filter" class="modal-select">
                  <option value="All Sectors" ${activeSector === 'All Sectors' ? 'selected' : ''}>All Sectors</option>
                  <option value="Sector B-17" ${activeSector === 'Sector B-17' ? 'selected' : ''}>Sector B-17</option>
                  <option value="Sector A-12" ${activeSector === 'Sector A-12' ? 'selected' : ''}>Sector A-12</option>
                  <option value="Sector C-04" ${activeSector === 'Sector C-04' ? 'selected' : ''}>Sector C-04</option>
                  <option value="Sector D-09" ${activeSector === 'Sector D-09' ? 'selected' : ''}>Sector D-09</option>
                </select>

                <select id="modal-status-filter" class="modal-select">
                  <option value="All" ${activeStatus === 'All' ? 'selected' : ''}>All Statuses</option>
                  <option value="Online" ${activeStatus === 'Online' ? 'selected' : ''}>Online Only</option>
                  <option value="Processing" ${activeStatus === 'Processing' ? 'selected' : ''}>Processing</option>
                  <option value="Standby" ${activeStatus === 'Standby' ? 'selected' : ''}>Standby</option>
                </select>
              </div>
            </div>

            <!-- Full Cameras Table -->
            <div class="modal-table-wrap">
              <table class="all-cam-table">
                <thead>
                  <tr>
                    <th>Camera ID</th>
                    <th>Sector</th>
                    <th>Location</th>
                    <th>Uptime</th>
                    <th>Detections</th>
                    <th>Alerts</th>
                    <th>False Positives</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="all-cam-tbody">
                  ${this.renderAllCamRows(filteredCams)}
                </tbody>
              </table>
            </div>
          </div>

          <div class="modal-footer-actions">
            <button class="btn-modal-secondary" id="btn-export-cam-table">Export CSV</button>
            <button class="btn-modal-primary" id="btn-done-modal">Done</button>
          </div>
        </div>
      </div>
    `;

    mount.innerHTML = renderModalContent();

    const backdrop = mount.querySelector('#modal-backdrop-cameras');
    const searchInput = mount.querySelector('#cam-search-input');
    const sectorFilter = mount.querySelector('#modal-sector-filter');
    const statusFilter = mount.querySelector('#modal-status-filter');
    const tbody = mount.querySelector('#all-cam-tbody');
    const btnClose = mount.querySelector('#btn-close-modal');
    const btnDone = mount.querySelector('#btn-done-modal');
    const btnExportCsv = mount.querySelector('#btn-export-cam-table');

    const updateFilterResults = () => {
      filteredCams = this.allCameras.filter(c => {
        const matchesSearch = c.id.toLowerCase().includes(activeSearch.toLowerCase()) || c.location.toLowerCase().includes(activeSearch.toLowerCase());
        const matchesSector = activeSector === 'All Sectors' || c.sector === activeSector;
        const matchesStatus = activeStatus === 'All' || c.status === activeStatus;
        return matchesSearch && matchesSector && matchesStatus;
      });
      tbody.innerHTML = this.renderAllCamRows(filteredCams);
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        activeSearch = e.target.value;
        updateFilterResults();
      });
    }

    if (sectorFilter) {
      sectorFilter.addEventListener('change', (e) => {
        activeSector = e.target.value;
        updateFilterResults();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        activeStatus = e.target.value;
        updateFilterResults();
      });
    }

    const closeModal = () => {
      mount.innerHTML = '';
    };

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnDone) btnDone.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        this.downloadCSV(filteredCams, 'IBVAP_Cameras_Registry.csv');
      });
    }
  }

  renderAllCamRows(cams) {
    if (cams.length === 0) {
      return `<tr><td colspan="8" style="text-align: center; padding: 24px; color: #8C9F8F;">No cameras found matching current filters.</td></tr>`;
    }

    return cams.map(c => `
      <tr>
        <td class="cam-name-cell">${c.id}</td>
        <td>${c.sector}</td>
        <td class="cam-loc-cell">${c.location}</td>
        <td>${c.uptime}%</td>
        <td>${c.detections}</td>
        <td>${c.alerts}</td>
        <td>${c.fp}</td>
        <td>
          <span class="ai-status-badge ${c.status === 'Online' ? 'status-online' : (c.status === 'Processing' ? 'status-processing' : '')}">
            <span class="status-dot"></span>
            <span>${c.status}</span>
          </span>
        </td>
      </tr>
    `).join('');
  }

  /**
   * Export Intelligence Data Modal (Real Client-Side CSV / JSON download)
   */
  openExportModal() {
    const mount = this.container.querySelector('#analytics-modal-container') || document.body;
    let selectedFormat = 'csv'; // 'csv' | 'json'
    let selectedScope = 'current'; // 'current' | 'all'

    mount.innerHTML = `
      <div class="analytics-modal-backdrop" id="modal-backdrop-export">
        <div class="analytics-modal-card">
          <div class="modal-header-tactical">
            <div class="modal-header-left">
              <div class="modal-header-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <div>
                <h3 class="modal-header-title">EXPORT SURVEILLANCE INTELLIGENCE</h3>
                <p class="modal-header-subtitle">Generate downloadable analytics data payload</p>
              </div>
            </div>
            <button class="btn-modal-close" id="btn-close-export">&times;</button>
          </div>

          <div class="modal-body-scrollable">
            <div class="export-options-grid">
              <div class="export-type-card ${selectedFormat === 'csv' ? 'selected' : ''}" data-fmt="csv">
                <div class="export-card-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="8" y1="13" x2="16" y2="13"></line>
                    <line x1="8" y1="17" x2="16" y2="17"></line>
                  </svg>
                </div>
                <div>
                  <div class="export-card-title">CSV Spreadsheet</div>
                  <div class="export-card-desc">Structured tables for Excel, tactical spreadsheets, and audits.</div>
                </div>
              </div>

              <div class="export-type-card ${selectedFormat === 'json' ? 'selected' : ''}" data-fmt="json">
                <div class="export-card-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <div>
                  <div class="export-card-title">JSON Telemetry</div>
                  <div class="export-card-desc">Machine-readable data payload for command ingestion.</div>
                </div>
              </div>
            </div>

            <div class="export-scope-box">
              <div class="export-scope-title">EXPORT SCOPE</div>
              <div class="export-radio-row">
                <label class="export-radio-label">
                  <input type="radio" name="export-scope" value="current" checked />
                  <span>Current View (${this.selectedTimeRange})</span>
                </label>
                <label class="export-radio-label">
                  <input type="radio" name="export-scope" value="all" />
                  <span>All Monitored Cameras & Sectors</span>
                </label>
              </div>
            </div>
          </div>

          <div class="modal-footer-actions">
            <button class="btn-modal-secondary" id="btn-cancel-export">Cancel</button>
            <button class="btn-modal-primary" id="btn-confirm-export">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download Export</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const backdrop = mount.querySelector('#modal-backdrop-export');
    const cards = mount.querySelectorAll('.export-type-card');
    const btnClose = mount.querySelector('#btn-close-export');
    const btnCancel = mount.querySelector('#btn-cancel-export');
    const btnConfirm = mount.querySelector('#btn-confirm-export');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedFormat = card.getAttribute('data-fmt');
      });
    });

    const closeModal = () => { mount.innerHTML = ''; };

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        const scopeRadio = mount.querySelector('input[name="export-scope"]:checked');
        selectedScope = scopeRadio ? scopeRadio.value : 'current';

        const data = this.getActiveData();
        const dateStr = new Date().toISOString().slice(0, 10);

        if (selectedFormat === 'csv') {
          let csv = 'METRIC,VALUE,TREND\n';
          csv += `Total Events,${data.kpis.totalEvents.val},${data.kpis.totalEvents.trend}\n`;
          csv += `Intrusions,${data.kpis.intrusions.val},${data.kpis.intrusions.trend}\n`;
          csv += `Person Detections,${data.kpis.person.val},${data.kpis.person.trend}\n`;
          csv += `Vehicle Detections,${data.kpis.vehicle.val},${data.kpis.vehicle.trend}\n`;
          csv += `ANPR Events,${data.kpis.anpr.val},${data.kpis.anpr.trend}\n`;
          csv += `Face Matches,${data.kpis.face.val},${data.kpis.face.trend}\n\n`;

          csv += 'SECTOR,EVENT_COUNT\n';
          Object.entries(data.sectors).forEach(([sec, d]) => {
            csv += `${sec},${d.count}\n`;
          });
          csv += '\n';

          csv += 'CAMERA,UPTIME,DETECTIONS,ALERTS,FALSE_POSITIVES,STATUS\n';
          const camList = selectedScope === 'all' ? this.allCameras : data.cameras;
          camList.forEach(c => {
            csv += `${c.id},${c.uptime},${c.detections},${c.alerts},${c.fp},${c.status}\n`;
          });

          this.triggerDownload(csv, `IBVAP_Surveillance_Report_${dateStr}.csv`, 'text/csv;charset=utf-8;');
        } else {
          const exportObj = {
            system: 'IBVAP Intelligent Border Surveillance Platform',
            exportedAt: new Date().toISOString(),
            timeRange: this.selectedTimeRange,
            kpis: data.kpis,
            threats: data.threats,
            sectors: data.sectors,
            topLocations: data.topLocations,
            cameras: selectedScope === 'all' ? this.allCameras : data.cameras
          };
          this.triggerDownload(JSON.stringify(exportObj, null, 2), `IBVAP_Surveillance_Data_${dateStr}.json`, 'application/json');
        }

        closeModal();
        this.showToast(`Export complete: Downloaded ${selectedFormat.toUpperCase()} file`);
      });
    }
  }

  /**
   * Tactical Security Briefing Report Preview & Print Modal
   */
  openReportPreviewModal() {
    const mount = this.container.querySelector('#analytics-modal-container') || document.body;
    const data = this.getActiveData();
    const now = new Date();
    const dateFormatted = `${now.getDate()} Sep ${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} IST`;
    const refNo = `IBVAP-TAC-RPT-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-0084`;

    mount.innerHTML = `
      <div class="analytics-modal-backdrop" id="modal-backdrop-report">
        <div class="analytics-modal-card modal-report">
          <div class="modal-header-tactical">
            <div class="modal-header-left">
              <div class="modal-header-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div>
                <h3 class="modal-header-title">TACTICAL SECURITY BRIEFING REPORT</h3>
                <p class="modal-header-subtitle">Official Defense Surveillance Intelligence Summary</p>
              </div>
            </div>
            <button class="btn-modal-close" id="btn-close-report">&times;</button>
          </div>

          <div class="modal-body-scrollable">
            <!-- Printable Tactical Document -->
            <div class="defense-briefing-doc" id="printable-briefing-doc">
              <div class="briefing-flag-bar">
                <div class="flag-orange"></div>
                <div class="flag-white"></div>
                <div class="flag-green"></div>
              </div>

              <div class="briefing-doc-header">
                <div class="briefing-header-content">
                  <div>
                    <h2 class="briefing-org-title">INTELLIGENT BORDER VIDEO ANALYTICS PLATFORM</h2>
                    <div class="briefing-org-sub">Tactical Border Command & Surveillance Intelligence Division</div>
                  </div>
                  <div class="briefing-stamp-box">
                    <span class="stamp-classification">RESTRICTED // DEFENSE USE ONLY</span>
                    <span class="stamp-ref-no">${refNo}</span>
                  </div>
                </div>
              </div>

              <div class="briefing-meta-grid">
                <div class="briefing-meta-item">
                  <div class="meta-lbl">Report Title</div>
                  <div class="meta-val">${this.selectedReportType}</div>
                </div>
                <div class="briefing-meta-item">
                  <div class="meta-lbl">Duty Officer</div>
                  <div class="meta-val">Op. A. Sharma (G103-BHU)</div>
                </div>
                <div class="briefing-meta-item">
                  <div class="meta-lbl">Operational Unit</div>
                  <div class="meta-val">Control Room 1 · Sector B-17</div>
                </div>
                <div class="briefing-meta-item">
                  <div class="meta-lbl">Time Window</div>
                  <div class="meta-val">${this.selectedTimeRange}</div>
                </div>
              </div>

              <!-- Section 1: Executive KPI Metrics -->
              <div class="briefing-section-title">1. Operational Telemetry Summary</div>
              <table class="briefing-kpi-summary-table">
                <thead>
                  <tr>
                    <th>Total Monitored Events</th>
                    <th>Validated Intrusions</th>
                    <th>Person Detections</th>
                    <th>Vehicle Crossings</th>
                    <th>ANPR Triggers</th>
                    <th>Biometric Matches</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>${data.kpis.totalEvents.val}</strong> (${data.kpis.totalEvents.trend})</td>
                    <td style="color: #C62828;"><strong>${data.kpis.intrusions.val}</strong> (${data.kpis.intrusions.trend})</td>
                    <td>${data.kpis.person.val}</td>
                    <td>${data.kpis.vehicle.val}</td>
                    <td>${data.kpis.anpr.val}</td>
                    <td>${data.kpis.face.val}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Section 2: Sector Activity Breakdown -->
              <div class="briefing-section-title">2. Sector Vulnerability & Incident Breakdown</div>
              <table class="briefing-kpi-summary-table">
                <thead>
                  <tr>
                    <th>Sector Identification</th>
                    <th>Incident Count</th>
                    <th>Relative Load</th>
                    <th>Primary Top Alert Location</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(data.sectors).map(([sec, d], i) => `
                    <tr>
                      <td><strong>${sec}</strong></td>
                      <td>${d.count}</td>
                      <td>${d.fillWidth}</td>
                      <td>${data.topLocations[i] ? data.topLocations[i].name : 'Boundary Outpost'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <!-- Section 3: Hardware Availability -->
              <div class="briefing-section-title">3. Sensor Status & Hardware Health</div>
              <table class="briefing-kpi-summary-table">
                <thead>
                  <tr>
                    <th>Camera Device</th>
                    <th>Operational Uptime</th>
                    <th>Total Detections</th>
                    <th>Triggered Alerts</th>
                    <th>False Positive Rate</th>
                    <th>Current State</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.cameras.map(c => `
                    <tr>
                      <td><strong>${c.id}</strong></td>
                      <td>${c.uptime}</td>
                      <td>${c.detections}</td>
                      <td>${c.alerts}</td>
                      <td>${c.fp}</td>
                      <td>${c.status}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <!-- Section 4: Operational Sign-off -->
              <div class="briefing-sign-off-row">
                <div class="sign-off-box">
                  <div class="sign-off-title">OPERATOR IN CHARGE</div>
                  <div style="font-weight: 700; font-size: 0.8rem; margin-top: 14px;">Op. A. Sharma</div>
                  <div class="sign-off-line"></div>
                </div>
                <div class="sign-off-box" style="text-align: right; align-items: flex-end;">
                  <div class="sign-off-title">COMMANDING OFFICER VALIDATION</div>
                  <div style="font-weight: 700; font-size: 0.8rem; margin-top: 14px;">Verified Electronic Signature</div>
                  <div class="sign-off-line"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer-actions">
            <button class="btn-modal-secondary" id="btn-download-txt-report">Download Text</button>
            <button class="btn-modal-primary" id="btn-print-report">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const backdrop = mount.querySelector('#modal-backdrop-report');
    const btnClose = mount.querySelector('#btn-close-report');
    const btnPrint = mount.querySelector('#btn-print-report');
    const btnDownloadTxt = mount.querySelector('#btn-download-txt-report');

    const closeModal = () => { mount.innerHTML = ''; };

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    if (btnDownloadTxt) {
      btnDownloadTxt.addEventListener('click', () => {
        const textContent = `
================================================================================
INTELLIGENT BORDER VIDEO ANALYTICS PLATFORM (IBVAP)
TACTICAL SECURITY BRIEFING REPORT // RESTRICTED DEFENSE USE ONLY
Reference: ${refNo}
Generated: ${dateFormatted}
Officer: Op. A. Sharma (G103-BHU) | Post: Control Room 1
Report: ${this.selectedReportType} | Scope: ${this.selectedTimeRange}
================================================================================

1. TELEMETRY SUMMARY:
- Total Events:       ${data.kpis.totalEvents.val} (${data.kpis.totalEvents.trend})
- Intrusions:         ${data.kpis.intrusions.val} (${data.kpis.intrusions.trend})
- Person Detections:  ${data.kpis.person.val}
- Vehicle Detections: ${data.kpis.vehicle.val}
- ANPR Events:        ${data.kpis.anpr.val}
- Face Matches:       ${data.kpis.face.val}

2. SECTORS:
${Object.entries(data.sectors).map(([sec, d]) => `- ${sec}: ${d.count} events`).join('\n')}

3. THREAT DISTRIBUTION:
- Critical: ${data.threats.critical.count} (${data.threats.critical.pct})
- High:     ${data.threats.high.count} (${data.threats.high.pct})
- Medium:   ${data.threats.medium.count} (${data.threats.medium.pct})
- Low:      ${data.threats.low.count} (${data.threats.low.pct})

4. CAMERAS:
${data.cameras.map(c => `- ${c.id}: Uptime ${c.uptime} | Det: ${c.detections} | Alerts: ${c.alerts} | Status: ${c.status}`).join('\n')}

================================================================================
END OF REPORT // AUTH: COMMANDING OFFICER VALIDATION
================================================================================
        `.trim();

        this.triggerDownload(textContent, `IBVAP_Briefing_${refNo}.txt`, 'text/plain;charset=utf-8;');
        this.showToast('Briefing report text file downloaded');
      });
    }
  }

  /**
   * Custom Date Range Selector Modal
   */
  openCustomDateModal() {
    const mount = this.container.querySelector('#analytics-modal-container') || document.body;

    mount.innerHTML = `
      <div class="analytics-modal-backdrop" id="modal-backdrop-custom-date">
        <div class="analytics-modal-card">
          <div class="modal-header-tactical">
            <div class="modal-header-left">
              <div class="modal-header-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div>
                <h3 class="modal-header-title">CUSTOM ANALYSIS TIME WINDOW</h3>
                <p class="modal-header-subtitle">Select date range for deep surveillance telemetry</p>
              </div>
            </div>
            <button class="btn-modal-close" id="btn-close-date">&times;</button>
          </div>

          <div class="modal-body-scrollable">
            <div class="custom-date-grid">
              <div class="date-field-group">
                <label class="date-field-label">Start Date</label>
                <input type="date" id="input-custom-start" class="date-input-styled" value="${this.customStartDate}" />
              </div>
              <div class="date-field-group">
                <label class="date-field-label">End Date</label>
                <input type="date" id="input-custom-end" class="date-input-styled" value="${this.customEndDate}" />
              </div>
            </div>

            <div class="export-scope-box">
              <div class="export-scope-title">ANALYSIS RESOLUTION</div>
              <div class="export-radio-row">
                <label class="export-radio-label">
                  <input type="radio" name="custom-res" value="hourly" checked />
                  <span>Standard Interval (Automated)</span>
                </label>
                <label class="export-radio-label">
                  <input type="radio" name="custom-res" value="daily" />
                  <span>Aggregated Daily Logs</span>
                </label>
              </div>
            </div>
          </div>

          <div class="modal-footer-actions">
            <button class="btn-modal-secondary" id="btn-cancel-date">Cancel</button>
            <button class="btn-modal-primary" id="btn-apply-date">Apply Range</button>
          </div>
        </div>
      </div>
    `;

    const backdrop = mount.querySelector('#modal-backdrop-custom-date');
    const btnClose = mount.querySelector('#btn-close-date');
    const btnCancel = mount.querySelector('#btn-cancel-date');
    const btnApply = mount.querySelector('#btn-apply-date');
    const inputStart = mount.querySelector('#input-custom-start');
    const inputEnd = mount.querySelector('#input-custom-end');

    const closeModal = () => { mount.innerHTML = ''; };

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    if (btnApply) {
      btnApply.addEventListener('click', () => {
        this.customStartDate = inputStart ? inputStart.value : '2026-08-20';
        this.customEndDate = inputEnd ? inputEnd.value : '2026-09-06';
        this.selectedTimeRange = `Custom: ${this.customStartDate} to ${this.customEndDate}`;
        
        const timeText = this.container.querySelector('#selected-time-range-text');
        if (timeText) timeText.textContent = this.selectedTimeRange;

        this.applyTimeFilter();
        closeModal();
        this.showToast(`Custom range applied: ${this.customStartDate} to ${this.customEndDate}`);
      });
    }
  }

  /**
   * Helper to download CSV or JSON via Blob
   */
  triggerDownload(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }

  downloadCSV(dataArray, filename) {
    if (!dataArray || dataArray.length === 0) return;
    const headers = Object.keys(dataArray[0]).join(',');
    const rows = dataArray.map(obj => Object.values(obj).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    this.triggerDownload(csv, filename, 'text/csv;charset=utf-8;');
  }

  showToast(message) {
    const existing = document.querySelector('.analytics-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'analytics-toast';
    toast.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.25s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}
