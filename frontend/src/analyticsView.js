/**
 * IBVAP Tactical Border Surveillance Command Platform — Analytics & Reports Component
 * Pixel-faithful reproduction of the tactical border analytics intelligence screen.
 */

export class AnalyticsView {
  constructor(options = {}) {
    this.container = options.container || null;
    this.activeFilter = 'Intrusions';
    this.selectedTimeRange = 'Last 24 Hours';
    this.selectedReportType = 'Daily Security Report';

    // Trend dataset for each filter tab
    this.trendDatasets = {
      Intrusions: {
        points: [
          { time: '00:00', val: 9 },
          { time: '02:00', val: 14 },
          { time: '04:00', val: 10 },
          { time: '06:00', val: 5 },
          { time: '08:00', val: 18 },
          { time: '10:00', val: 32, peak: true, range: '10:00 - 11:00' },
          { time: '12:00', val: 16 },
          { time: '14:00', val: 12 },
          { time: '16:00', val: 16 },
          { time: '18:00', val: 14 },
          { time: '20:00', val: 21 },
          { time: '22:00', val: 38 },
          { time: '23:59', val: 10 }
        ],
        peakEventText: '32 events',
        peakRangeText: '10:00 - 11:00',
        peakPointIdx: 5
      },
      People: {
        points: [
          { time: '00:00', val: 12 },
          { time: '02:00', val: 8 },
          { time: '04:00', val: 6 },
          { time: '06:00', val: 19 },
          { time: '08:00', val: 35 },
          { time: '10:00', val: 46, peak: true, range: '10:00 - 11:00' },
          { time: '12:00', val: 28 },
          { time: '14:00', val: 24 },
          { time: '16:00', val: 30 },
          { time: '18:00', val: 42 },
          { time: '20:00', val: 36 },
          { time: '22:00', val: 22 },
          { time: '23:59', val: 14 }
        ],
        peakEventText: '46 events',
        peakRangeText: '10:00 - 11:00',
        peakPointIdx: 5
      },
      Vehicles: {
        points: [
          { time: '00:00', val: 4 },
          { time: '02:00', val: 3 },
          { time: '04:00', val: 2 },
          { time: '06:00', val: 11 },
          { time: '08:00', val: 27 },
          { time: '10:00', val: 39, peak: true, range: '10:00 - 11:00' },
          { time: '12:00', val: 22 },
          { time: '14:00', val: 19 },
          { time: '16:00', val: 25 },
          { time: '18:00', val: 34 },
          { time: '20:00', val: 20 },
          { time: '22:00', val: 12 },
          { time: '23:59', val: 6 }
        ],
        peakEventText: '39 events',
        peakRangeText: '10:00 - 11:00',
        peakPointIdx: 5
      },
      ANPR: {
        points: [
          { time: '00:00', val: 2 },
          { time: '02:00', val: 1 },
          { time: '04:00', val: 2 },
          { time: '06:00', val: 8 },
          { time: '08:00', val: 19 },
          { time: '10:00', val: 28, peak: true, range: '10:00 - 11:00' },
          { time: '12:00', val: 15 },
          { time: '14:00', val: 13 },
          { time: '16:00', val: 18 },
          { time: '18:00', val: 22 },
          { time: '20:00', val: 14 },
          { time: '22:00', val: 8 },
          { time: '23:59', val: 4 }
        ],
        peakEventText: '28 events',
        peakRangeText: '10:00 - 11:00',
        peakPointIdx: 5
      },
      'Face Recognition': {
        points: [
          { time: '00:00', val: 0 },
          { time: '02:00', val: 1 },
          { time: '04:00', val: 0 },
          { time: '06:00', val: 2 },
          { time: '08:00', val: 3 },
          { time: '10:00', val: 5, peak: true, range: '10:00 - 11:00' },
          { time: '12:00', val: 2 },
          { time: '14:00', val: 1 },
          { time: '16:00', val: 2 },
          { time: '18:00', val: 4 },
          { time: '20:00', val: 3 },
          { time: '22:00', val: 2 },
          { time: '23:59', val: 1 }
        ],
        peakEventText: '5 matches',
        peakRangeText: '10:00 - 11:00',
        peakPointIdx: 5
      },
      'Total Alerts': {
        points: [
          { time: '00:00', val: 15 },
          { time: '02:00', val: 18 },
          { time: '04:00', val: 12 },
          { time: '06:00', val: 24 },
          { time: '08:00', val: 38 },
          { time: '10:00', val: 48, peak: true, range: '10:00 - 11:00' },
          { time: '12:00', val: 31 },
          { time: '14:00', val: 26 },
          { time: '16:00', val: 32 },
          { time: '18:00', val: 45 },
          { time: '20:00', val: 40 },
          { time: '22:00', val: 44 },
          { time: '23:59', val: 18 }
        ],
        peakEventText: '48 alerts',
        peakRangeText: '10:00 - 11:00',
        peakPointIdx: 5
      }
    };
  }

  render() {
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
          <div class="analytics-kpi-card">
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
                <span class="analytics-kpi-val">1,284</span>
                <span class="analytics-kpi-trend trend-up-green">↑ 12%</span>
              </div>
            </div>
          </div>

          <!-- 2. Intrusions -->
          <div class="analytics-kpi-card">
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
                <span class="analytics-kpi-val">23</span>
                <span class="analytics-kpi-trend trend-up-red">↑ 35%</span>
              </div>
            </div>
          </div>

          <!-- 3. Person Detections -->
          <div class="analytics-kpi-card">
            <div class="analytics-kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="analytics-kpi-body">
              <div class="analytics-kpi-label">Person Detections</div>
              <div class="analytics-kpi-num-row">
                <span class="analytics-kpi-val">684</span>
                <span class="analytics-kpi-trend trend-up-green">↑ 18%</span>
              </div>
            </div>
          </div>

          <!-- 4. Vehicle Detections -->
          <div class="analytics-kpi-card">
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
                <span class="analytics-kpi-val">392</span>
                <span class="analytics-kpi-trend trend-up-green">↑ 9%</span>
              </div>
            </div>
          </div>

          <!-- 5. ANPR Events -->
          <div class="analytics-kpi-card">
            <div class="analytics-kpi-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="3"></rect>
                <text x="12" y="14.5" font-family="'Inter', sans-serif" font-size="7" font-weight="bold" fill="currentColor" text-anchor="middle" stroke="none">ANPR</text>
              </svg>
            </div>
            <div class="analytics-kpi-body">
              <div class="analytics-kpi-label">ANPR Events</div>
              <div class="analytics-kpi-num-row">
                <span class="analytics-kpi-val">214</span>
                <span class="analytics-kpi-trend trend-up-green">↑ 22%</span>
              </div>
            </div>
          </div>

          <!-- 6. Face Matches -->
          <div class="analytics-kpi-card">
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
                <span class="analytics-kpi-val">17</span>
                <span class="analytics-kpi-trend trend-up-green">↑ 6%</span>
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
                <button class="info-circle-btn" title="Threat classification aggregated across monitored border sectors">
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
              <div class="threat-stacked-bar">
                <div class="bar-seg seg-critical" style="width: 3.3%;" title="Critical: 3.3%"></div>
                <div class="bar-seg seg-high" style="width: 10.0%;" title="High: 10.0%"></div>
                <div class="bar-seg seg-medium" style="width: 30.1%;" title="Medium: 30.1%"></div>
                <div class="bar-seg seg-low" style="width: 56.6%;" title="Low: 56.7%"></div>
              </div>

              <!-- Threat Stats Row (4 Columns) -->
              <div class="threat-stats-row">
                <!-- Critical -->
                <div class="threat-stat-col">
                  <div class="stat-label-wrap">
                    <span class="threat-bullet bullet-critical"></span>
                    <span>Critical</span>
                  </div>
                  <div class="threat-stat-numbers">
                    <span class="threat-stat-val">42</span>
                    <span class="threat-stat-pct">(3.3%)</span>
                  </div>
                </div>

                <!-- High -->
                <div class="threat-stat-col">
                  <div class="stat-label-wrap">
                    <span class="threat-bullet bullet-high"></span>
                    <span>High</span>
                  </div>
                  <div class="threat-stat-numbers">
                    <span class="threat-stat-val">128</span>
                    <span class="threat-stat-pct">(10.0%)</span>
                  </div>
                </div>

                <!-- Medium -->
                <div class="threat-stat-col">
                  <div class="stat-label-wrap">
                    <span class="threat-bullet bullet-medium"></span>
                    <span>Medium</span>
                  </div>
                  <div class="threat-stat-numbers">
                    <span class="threat-stat-val">386</span>
                    <span class="threat-stat-pct">(30.1%)</span>
                  </div>
                </div>

                <!-- Low -->
                <div class="threat-stat-col">
                  <div class="stat-label-wrap">
                    <span class="threat-bullet bullet-low"></span>
                    <span>Low</span>
                  </div>
                  <div class="threat-stat-numbers">
                    <span class="threat-stat-val">728</span>
                    <span class="threat-stat-pct">(56.7%)</span>
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
                <button class="info-circle-btn" title="Total validated alerts broken down by tactical border sectors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Horizontal Sector Progress Bars -->
            <div class="sector-bars-list">
              <!-- Sector A -->
              <div class="sector-bar-item">
                <span class="sector-name">Sector A</span>
                <div class="sector-bar-track">
                  <div class="sector-bar-fill" style="width: 36.9%;"></div>
                </div>
                <span class="sector-count">182</span>
              </div>

              <!-- Sector B -->
              <div class="sector-bar-item">
                <span class="sector-name">Sector B</span>
                <div class="sector-bar-track">
                  <div class="sector-bar-fill" style="width: 100%;"></div>
                </div>
                <span class="sector-count">493</span>
              </div>

              <!-- Sector C -->
              <div class="sector-bar-item">
                <span class="sector-name">Sector C</span>
                <div class="sector-bar-track">
                  <div class="sector-bar-fill" style="width: 65.1%;"></div>
                </div>
                <span class="sector-count">321</span>
              </div>

              <!-- Sector D -->
              <div class="sector-bar-item">
                <span class="sector-name">Sector D</span>
                <div class="sector-bar-track">
                  <div class="sector-bar-fill" style="width: 58.4%;"></div>
                </div>
                <span class="sector-count">288</span>
              </div>
            </div>
          </div>

          <!-- Right: Camera Performance -->
          <div class="analytics-card camera-perf-card">
            <div class="analytics-card-header">
              <div class="card-title-wrap">
                <span class="analytics-card-title">CAMERA PERFORMANCE</span>
                <button class="info-circle-btn" title="Hardware availability, detection counts, and AI inference latency">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </button>
              </div>

              <a href="#view-all-cameras" class="card-header-link" id="btn-view-all-cameras">View All &nbsp;→</a>
            </div>

            <!-- Table -->
            <table class="camera-perf-table">
              <thead>
                <tr>
                  <th>Camera</th>
                  <th>Uptime</th>
                  <th>Detections</th>
                  <th>Alerts</th>
                  <th>False Positives</th>
                  <th>AI Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="cell-camera">CAM-034</td>
                  <td>99.8%</td>
                  <td>248</td>
                  <td>12</td>
                  <td>3</td>
                  <td>
                    <span class="ai-status-badge status-online">
                      <span class="status-dot"></span>
                      <span>Online</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="cell-camera">CAM-021</td>
                  <td>99.5%</td>
                  <td>186</td>
                  <td>7</td>
                  <td>4</td>
                  <td>
                    <span class="ai-status-badge status-online">
                      <span class="status-dot"></span>
                      <span>Online</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="cell-camera">CAM-017</td>
                  <td>98.9%</td>
                  <td>312</td>
                  <td>18</td>
                  <td>6</td>
                  <td>
                    <span class="ai-status-badge status-processing">
                      <span class="status-dot"></span>
                      <span>Processing</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="cell-camera">CAM-008</td>
                  <td>99.7%</td>
                  <td>142</td>
                  <td>4</td>
                  <td>2</td>
                  <td>
                    <span class="ai-status-badge status-online">
                      <span class="status-dot"></span>
                      <span>Online</span>
                    </span>
                  </td>
                </tr>
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
                <button class="info-circle-btn" title="Border sectors with highest frequency of anomalous triggers">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div class="top-locations-list">
              <!-- Location 1 -->
              <div class="top-loc-item">
                <span class="loc-rank-badge">1</span>
                <span class="loc-name">BOP Alpha</span>
                <span class="loc-events">47 events</span>
                <span class="loc-delta">↑ 28%</span>
              </div>

              <!-- Location 2 -->
              <div class="top-loc-item">
                <span class="loc-rank-badge">2</span>
                <span class="loc-name">Sector B-17</span>
                <span class="loc-events">39 events</span>
                <span class="loc-delta">↑ 18%</span>
              </div>

              <!-- Location 3 -->
              <div class="top-loc-item">
                <span class="loc-rank-badge">3</span>
                <span class="loc-name">Checkpost C-04</span>
                <span class="loc-events">31 events</span>
                <span class="loc-delta">↑ 7%</span>
              </div>

              <!-- Location 4 -->
              <div class="top-loc-item">
                <span class="loc-rank-badge">4</span>
                <span class="loc-name">Border Road A-08</span>
                <span class="loc-events">24 events</span>
                <span class="loc-delta">↑ 9%</span>
              </div>
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
      </div>
    `;
  }

  /**
   * Helper to compute smooth SVG spline curve through coordinates
   */
  renderSplineChart(filterKey) {
    const dataset = this.trendDatasets[filterKey] || this.trendDatasets['Intrusions'];
    const pts = dataset.points;

    // SVG coordinate space: 700 width, 180 height
    const width = 700;
    const height = 180;
    const padLeft = 45;
    const padRight = 20;
    const padTop = 24;
    const padBottom = 26;

    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;

    // Max Y scale is 50
    const maxY = 50;

    // Map data points to SVG coordinates
    const coords = pts.map((p, i) => {
      const x = padLeft + (i / (pts.length - 1)) * plotWidth;
      const y = padTop + plotHeight - (p.val / maxY) * plotHeight;
      return { x, y, val: p.val, time: p.time, peak: p.peak, range: p.range };
    });

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

    // Gradient area path closed to bottom
    const areaD = `${pathD} L ${coords[coords.length - 1].x},${padTop + plotHeight} L ${coords[0].x},${padTop + plotHeight} Z`;

    // Peak element coordinates (index 5, ~10:00)
    const peakCoord = coords[dataset.peakPointIdx] || coords[5];

    // Horizontal Y grid levels
    const yLevels = [0, 10, 20, 30, 40, 50];

    return `
      <svg class="trend-chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
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
        ${coords.slice(0, 12).map((c) => {
          return `
            <text x="${c.x}" y="${height - 6}" text-anchor="middle" font-size="9.5" font-weight="500" fill="#758777">
              ${c.time}
            </text>
          `;
        }).join('')}

        <!-- Peak Vertical Dashed Indicator Line -->
        <line 
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

        <!-- Small Data Points on vertices -->
        ${coords.slice(0, 12).map((c, i) => {
          if (i === dataset.peakPointIdx) return '';
          return `
            <circle cx="${c.x}" cy="${c.y}" r="3" fill="#FFFFFF" stroke="#256434" stroke-width="2" class="chart-point" />
          `;
        }).join('')}

        <!-- Prominent Peak Marker Dot at 10:00 -->
        <circle cx="${peakCoord.x}" cy="${peakCoord.y}" r="6" fill="#1E4324" />
        <circle cx="${peakCoord.x}" cy="${peakCoord.y}" r="3" fill="#FFFFFF" />
      </svg>

      <!-- HTML Tooltip Callout Box directly above peak -->
      <div class="chart-tooltip-badge" style="left: ${(peakCoord.x / width) * 100}%; top: ${Math.max(10, peakCoord.y - 48)}px;">
        <div class="tooltip-events">${dataset.peakEventText}</div>
        <div class="tooltip-hours">${dataset.peakRangeText}</div>
      </div>
    `;
  }

  /**
   * Bind event handlers for dropdowns, tabs, export, and reports
   */
  bindEvents(container) {
    this.container = container;

    // 1. Time Filter Dropdown Toggle
    const timeWrap = container.querySelector('#time-filter-dropdown-wrap');
    const timeBtn = container.querySelector('#btn-time-filter');
    const timeItems = container.querySelectorAll('#time-filter-menu .dropdown-menu-item');
    const timeText = container.querySelector('#selected-time-range-text');

    if (timeBtn && timeWrap) {
      timeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        timeWrap.classList.toggle('open');
        // Close report dropdown if open
        const reportWrap = container.querySelector('#report-type-dropdown-wrap');
        if (reportWrap) reportWrap.classList.remove('open');
      });
    }

    timeItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = item.getAttribute('data-val');
        this.selectedTimeRange = val;
        if (timeText) timeText.textContent = val;
        timeItems.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        timeWrap.classList.remove('open');
        this.showToast(`Time filter updated: ${val}`);
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
        }
      });
    });

    // 5. Export Button Click
    const btnExport = container.querySelector('#btn-export-analytics');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        btnExport.style.opacity = '0.7';
        this.showToast(`Exporting Analytics (${this.selectedTimeRange}). PDF & CSV prepared.`);
        setTimeout(() => {
          btnExport.style.opacity = '1';
        }, 1000);
      });
    }

    // 6. Generate Report Button Click
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
          this.showToast(`Generated: ${this.selectedReportType}. Downloading PDF...`);
        }, 1200);
      });
    }
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
