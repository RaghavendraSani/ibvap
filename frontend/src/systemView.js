/**
 * IBVAP Tactical Surveillance Platform — System Settings View Component
 * Provides complete system configuration, alert thresholds,
 * system health diagnostics, and operator profile management.
 */

export class SystemView {
  constructor(options = {}) {
    this.container = null;
    this.onLogout = options.onLogout || null;

    // Sub-tab selection state: 'system-settings' | 'alert-config' | 'notifications' | 'user-settings'
    this.activeTab = 'system-settings';

    // AI Configuration State
    this.aiConfig = {
      aiProcessing: true,
      edgeProcessing: true,
      modelAutoUpdate: true,
      inferenceMode: 'Real-time',
      processingFps: '10 FPS',
      saveDetections: true,
      retentionPeriod: '30 Days'
    };

    // Alert Threshold Sliders State (Baseline defaults)
    this.defaultAlertThresholds = {
      intrusion: 85,
      person: 70,
      vehicle: 80,
      anpr: 75,
      face: 90
    };
    this.alertThresholds = { ...this.defaultAlertThresholds };

    // User Settings State
    this.userSettings = {
      operatorName: 'Op. A. Sharma',
      role: 'Control Room Operator',
      email: 'asharma@indianarmy.gov.in',
      emailNotifications: true,
      smsAlerts: false,
      inAppNotifications: true,
      sessionTimeout: '30 Minutes'
    };
  }

  render() {
    return `
      <div class="system-view-container" id="system-view-root">
        <!-- ===================================================================
             1. HEADER: TITLE & SUBTITLE
             =================================================================== -->
        <div class="system-page-header">
          <h1 class="system-title">System Settings</h1>
          <div class="system-subtitle">Configure and manage your IBVAP platform</div>
        </div>

        <!-- ===================================================================
             2. TOP SUB-TABS NAVIGATION PILLS (4 ITEMS)
             =================================================================== -->
        <div class="system-subtabs-row">
          <button class="subtab-btn ${this.activeTab === 'system-settings' ? 'active' : ''}" data-tab="system-settings">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span>System Settings</span>
          </button>

          <button class="subtab-btn ${this.activeTab === 'alert-config' ? 'active' : ''}" data-tab="alert-config">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Alert Configuration</span>
          </button>

          <button class="subtab-btn ${this.activeTab === 'notifications' ? 'active' : ''}" data-tab="notifications">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span>Notification Preferences</span>
          </button>

          <button class="subtab-btn ${this.activeTab === 'user-settings' ? 'active' : ''}" data-tab="user-settings">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>User Settings</span>
          </button>
        </div>

        <!-- ===================================================================
             3. 5-CARD BALANCED GRID SYSTEM
             Row 1: System Information | AI Configuration | System Health (3 equal cols)
             Row 2: Alert Configuration (1 col, Left) | User Settings (2 cols, Right)
             =================================================================== -->
        <div class="system-cards-grid" id="system-cards-grid">
          <!-- ===============================================================
               CARD 1: SYSTEM INFORMATION
               =============================================================== -->
          <div class="sys-card ${this.shouldShowCard('system-info') ? '' : 'card-dimmed'}" id="card-system-info">
            <div class="sys-card-header">
              <div class="card-title-wrap">
                <div class="card-icon-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <h2 class="sys-card-title">System Information</h2>
              </div>
            </div>

            <div class="sys-card-body">
              <div class="sys-info-row">
                <span class="info-label">Platform Version</span>
                <span class="info-val font-mono">IBVAP v1.0.0</span>
              </div>
              <div class="sys-info-row">
                <span class="info-label">Build Number</span>
                <span class="info-val font-mono">2026.09.05.1</span>
              </div>
              <div class="sys-info-row">
                <span class="info-label">Uptime</span>
                <span class="info-val font-mono">12 days, 6 hours</span>
              </div>
              <div class="sys-info-row">
                <span class="info-label">Server Status</span>
                <span class="status-indicator-green">
                  <span class="status-dot-green"></span>
                  <span class="status-text-green">Operational</span>
                </span>
              </div>
              <div class="sys-info-row-stacked">
                <div class="stacked-label-row">
                  <span class="info-label">Storage Usage</span>
                  <span class="info-val font-mono">2.4 TB / 10 TB (24%)</span>
                </div>
                <div class="sys-progress-track">
                  <div class="sys-progress-fill" style="width: 24%;"></div>
                </div>
              </div>
              <div class="sys-info-row">
                <span class="info-label">Active Cameras</span>
                <span class="info-val font-mono">42 / 45</span>
              </div>
              <div class="sys-info-row">
                <span class="info-label">Last Updated</span>
                <span class="info-val font-mono">5 Sep 2026, 18:30:12</span>
              </div>
            </div>
          </div>

          <!-- ===============================================================
               CARD 2: AI CONFIGURATION
               =============================================================== -->
          <div class="sys-card ${this.shouldShowCard('ai-config') ? '' : 'card-dimmed'}" id="card-ai-config">
            <div class="sys-card-header">
              <div class="card-title-wrap">
                <div class="card-icon-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="1" x2="9" y2="4"></line>
                    <line x1="15" y1="1" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="23"></line>
                    <line x1="15" y1="20" x2="15" y2="23"></line>
                    <line x1="20" y1="9" x2="23" y2="9"></line>
                    <line x1="20" y1="14" x2="23" y2="14"></line>
                    <line x1="1" y1="9" x2="4" y2="9"></line>
                    <line x1="1" y1="14" x2="4" y2="14"></line>
                  </svg>
                </div>
                <h2 class="sys-card-title">AI Configuration</h2>
              </div>
            </div>

            <div class="sys-card-body">
              <!-- AI Processing Toggle -->
              <div class="sys-control-row">
                <span class="control-label">AI Processing</span>
                <div class="control-action-group">
                  <span class="toggle-status-text" id="status-ai-processing">${this.aiConfig.aiProcessing ? 'Enabled' : 'Disabled'}</span>
                  <label class="switch-pill">
                    <input type="checkbox" id="toggle-ai-processing" ${this.aiConfig.aiProcessing ? 'checked' : ''}>
                    <span class="slider-round"></span>
                  </label>
                </div>
              </div>

              <!-- Edge Processing Toggle -->
              <div class="sys-control-row">
                <span class="control-label">Edge Processing</span>
                <div class="control-action-group">
                  <span class="toggle-status-text" id="status-edge-processing">${this.aiConfig.edgeProcessing ? 'Enabled' : 'Disabled'}</span>
                  <label class="switch-pill">
                    <input type="checkbox" id="toggle-edge-processing" ${this.aiConfig.edgeProcessing ? 'checked' : ''}>
                    <span class="slider-round"></span>
                  </label>
                </div>
              </div>

              <!-- Model Auto-Update Toggle -->
              <div class="sys-control-row">
                <span class="control-label">Model Auto-Update</span>
                <div class="control-action-group">
                  <span class="toggle-status-text" id="status-auto-update">${this.aiConfig.modelAutoUpdate ? 'Enabled' : 'Disabled'}</span>
                  <label class="switch-pill">
                    <input type="checkbox" id="toggle-auto-update" ${this.aiConfig.modelAutoUpdate ? 'checked' : ''}>
                    <span class="slider-round"></span>
                  </label>
                </div>
              </div>

              <!-- Inference Mode Dropdown -->
              <div class="sys-control-row">
                <span class="control-label">Inference Mode</span>
                <div class="custom-select-wrap">
                  <select id="select-inference-mode" class="sys-select">
                    <option value="Real-time" ${this.aiConfig.inferenceMode === 'Real-time' ? 'selected' : ''}>Real-time</option>
                    <option value="Batch Processing" ${this.aiConfig.inferenceMode === 'Batch Processing' ? 'selected' : ''}>Batch Processing</option>
                    <option value="High Accuracy" ${this.aiConfig.inferenceMode === 'High Accuracy' ? 'selected' : ''}>High Accuracy</option>
                    <option value="Power-saving" ${this.aiConfig.inferenceMode === 'Power-saving' ? 'selected' : ''}>Power-saving</option>
                  </select>
                  <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              <!-- Processing Frame Rate Dropdown -->
              <div class="sys-control-row">
                <span class="control-label">Processing Frame Rate</span>
                <div class="custom-select-wrap">
                  <select id="select-frame-rate" class="sys-select">
                    <option value="5 FPS" ${this.aiConfig.processingFps === '5 FPS' ? 'selected' : ''}>5 FPS</option>
                    <option value="10 FPS" ${this.aiConfig.processingFps === '10 FPS' ? 'selected' : ''}>10 FPS</option>
                    <option value="15 FPS" ${this.aiConfig.processingFps === '15 FPS' ? 'selected' : ''}>15 FPS</option>
                    <option value="25 FPS" ${this.aiConfig.processingFps === '25 FPS' ? 'selected' : ''}>25 FPS</option>
                    <option value="30 FPS" ${this.aiConfig.processingFps === '30 FPS' ? 'selected' : ''}>30 FPS</option>
                  </select>
                  <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              <!-- Save Detections Toggle -->
              <div class="sys-control-row">
                <span class="control-label">Save Detections</span>
                <div class="control-action-group">
                  <span class="toggle-status-text" id="status-save-detections">${this.aiConfig.saveDetections ? 'Enabled' : 'Disabled'}</span>
                  <label class="switch-pill">
                    <input type="checkbox" id="toggle-save-detections" ${this.aiConfig.saveDetections ? 'checked' : ''}>
                    <span class="slider-round"></span>
                  </label>
                </div>
              </div>

              <!-- Retention Period Dropdown -->
              <div class="sys-control-row">
                <span class="control-label">Retention Period</span>
                <div class="custom-select-wrap">
                  <select id="select-retention-period" class="sys-select">
                    <option value="7 Days" ${this.aiConfig.retentionPeriod === '7 Days' ? 'selected' : ''}>7 Days</option>
                    <option value="15 Days" ${this.aiConfig.retentionPeriod === '15 Days' ? 'selected' : ''}>15 Days</option>
                    <option value="30 Days" ${this.aiConfig.retentionPeriod === '30 Days' ? 'selected' : ''}>30 Days</option>
                    <option value="60 Days" ${this.aiConfig.retentionPeriod === '60 Days' ? 'selected' : ''}>60 Days</option>
                    <option value="90 Days" ${this.aiConfig.retentionPeriod === '90 Days' ? 'selected' : ''}>90 Days</option>
                  </select>
                  <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- ===============================================================
               CARD 3: SYSTEM HEALTH
               =============================================================== -->
          <div class="sys-card ${this.shouldShowCard('system-health') ? '' : 'card-dimmed'}" id="card-system-health">
            <div class="sys-card-header">
              <div class="card-title-wrap">
                <div class="card-icon-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h2 class="sys-card-title">System Health</h2>
              </div>
            </div>

            <div class="sys-card-body">
              <!-- CPU Usage Bar -->
              <div class="health-metric-row">
                <span class="health-label">CPU Usage</span>
                <div class="health-bar-container">
                  <div class="health-bar-track">
                    <div class="health-bar-fill" style="width: 32%;"></div>
                  </div>
                  <span class="health-value font-mono">32%</span>
                </div>
              </div>

              <!-- Memory Usage Bar -->
              <div class="health-metric-row">
                <span class="health-label">Memory Usage</span>
                <div class="health-bar-container">
                  <div class="health-bar-track">
                    <div class="health-bar-fill" style="width: 46%;"></div>
                  </div>
                  <span class="health-value font-mono">46%</span>
                </div>
              </div>

              <!-- GPU Usage Bar -->
              <div class="health-metric-row">
                <span class="health-label">GPU Usage</span>
                <div class="health-bar-container">
                  <div class="health-bar-track">
                    <div class="health-bar-fill" style="width: 28%;"></div>
                  </div>
                  <span class="health-value font-mono">28%</span>
                </div>
              </div>

              <!-- Storage Usage Bar -->
              <div class="health-metric-row">
                <span class="health-label">Storage Usage</span>
                <div class="health-bar-container">
                  <div class="health-bar-track">
                    <div class="health-bar-fill" style="width: 24%;"></div>
                  </div>
                  <span class="health-value font-mono">24%</span>
                </div>
              </div>

              <!-- Network Status -->
              <div class="sys-info-row">
                <span class="info-label">Network Status</span>
                <span class="status-indicator-green">
                  <span class="status-dot-green"></span>
                  <span class="status-text-green">Connected</span>
                </span>
              </div>

              <!-- AI Services -->
              <div class="sys-info-row">
                <span class="info-label">AI Services</span>
                <span class="status-indicator-green">
                  <span class="status-dot-green"></span>
                  <span class="status-text-green">Healthy</span>
                </span>
              </div>

              <!-- Database -->
              <div class="sys-info-row">
                <span class="info-label">Database</span>
                <span class="status-indicator-green">
                  <span class="status-dot-green"></span>
                  <span class="status-text-green">Healthy</span>
                </span>
              </div>

              <!-- Last Health Check -->
              <div class="sys-info-row">
                <span class="info-label">Last Health Check</span>
                <span class="info-val font-mono">5 Sep 2026, 22:41:08</span>
              </div>
            </div>
          </div>

          <!-- ===============================================================
               CARD 4: ALERT CONFIGURATION (MOVED TO LEFT)
               =============================================================== -->
          <div class="sys-card ${this.shouldShowCard('alert-config') ? '' : 'card-dimmed'}" id="card-alert-config">
            <div class="sys-card-header">
              <div class="card-title-wrap">
                <div class="card-icon-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <h2 class="sys-card-title">Alert Configuration</h2>
              </div>
            </div>

            <div class="sys-card-body alert-sliders-body">
              <!-- Slider 1: Intrusion confidence threshold -->
              <div class="slider-field-row">
                <span class="slider-label">Intrusion confidence threshold</span>
                <div class="slider-interactive-wrap">
                  <input type="range" class="sys-range-slider" id="slider-intrusion" min="10" max="100" value="${this.alertThresholds.intrusion}">
                  <span class="slider-val font-mono" id="val-slider-intrusion">${this.alertThresholds.intrusion}%</span>
                </div>
              </div>

              <!-- Slider 2: Person detection threshold -->
              <div class="slider-field-row">
                <span class="slider-label">Person detection threshold</span>
                <div class="slider-interactive-wrap">
                  <input type="range" class="sys-range-slider" id="slider-person" min="10" max="100" value="${this.alertThresholds.person}">
                  <span class="slider-val font-mono" id="val-slider-person">${this.alertThresholds.person}%</span>
                </div>
              </div>

              <!-- Slider 3: Vehicle detection threshold -->
              <div class="slider-field-row">
                <span class="slider-label">Vehicle detection threshold</span>
                <div class="slider-interactive-wrap">
                  <input type="range" class="sys-range-slider" id="slider-vehicle" min="10" max="100" value="${this.alertThresholds.vehicle}">
                  <span class="slider-val font-mono" id="val-slider-vehicle">${this.alertThresholds.vehicle}%</span>
                </div>
              </div>

              <!-- Slider 4: ANPR confidence threshold -->
              <div class="slider-field-row">
                <span class="slider-label">ANPR confidence threshold</span>
                <div class="slider-interactive-wrap">
                  <input type="range" class="sys-range-slider" id="slider-anpr" min="10" max="100" value="${this.alertThresholds.anpr}">
                  <span class="slider-val font-mono" id="val-slider-anpr">${this.alertThresholds.anpr}%</span>
                </div>
              </div>

              <!-- Slider 5: Face match threshold -->
              <div class="slider-field-row">
                <span class="slider-label">Face match threshold</span>
                <div class="slider-interactive-wrap">
                  <input type="range" class="sys-range-slider" id="slider-face" min="10" max="100" value="${this.alertThresholds.face}">
                  <span class="slider-val font-mono" id="val-slider-face">${this.alertThresholds.face}%</span>
                </div>
              </div>

              <!-- Reset to Default Button -->
              <div class="reset-action-row">
                <button class="btn-reset-default" id="btn-reset-alerts" title="Reset all thresholds to default values">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                  <span>Reset to Default</span>
                </button>
              </div>
            </div>
          </div>

          <!-- ===============================================================
               CARD 5: USER SETTINGS (DOUBLED IN SIZE - SPANS 2 COLUMNS)
               =============================================================== -->
          <div class="sys-card card-span-2 ${this.shouldShowCard('user-settings') ? '' : 'card-dimmed'}" id="card-user-settings">
            <div class="sys-card-header">
              <div class="card-title-wrap">
                <div class="card-icon-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h2 class="sys-card-title">User Settings</h2>
              </div>
              <div class="user-badge-status">
                <span class="status-dot-green"></span>
                <span class="duty-badge-text">ON-DUTY OPERATOR · LEVEL 4 CLEARANCE</span>
              </div>
            </div>

            <div class="sys-card-body user-settings-body">
              <div class="user-settings-columns-grid">
                <!-- Column 1: Operator Profile & Identification -->
                <div class="user-settings-col">
                  <!-- Operator Name -->
                  <div class="user-field-group">
                    <label class="user-field-label">Operator Name</label>
                    <input type="text" class="sys-text-input" id="input-operator-name" value="${this.userSettings.operatorName}">
                  </div>

                  <!-- Role -->
                  <div class="user-field-group">
                    <label class="user-field-label">Role</label>
                    <div class="custom-select-wrap select-full">
                      <select id="select-user-role" class="sys-select">
                        <option value="Control Room Operator" ${this.userSettings.role === 'Control Room Operator' ? 'selected' : ''}>Control Room Operator</option>
                        <option value="Sector Surveillance Commander" ${this.userSettings.role === 'Sector Surveillance Commander' ? 'selected' : ''}>Sector Surveillance Commander</option>
                        <option value="Senior Intelligence Analyst" ${this.userSettings.role === 'Senior Intelligence Analyst' ? 'selected' : ''}>Senior Intelligence Analyst</option>
                        <option value="Defense Terminal Administrator" ${this.userSettings.role === 'Defense Terminal Administrator' ? 'selected' : ''}>Defense Terminal Administrator</option>
                      </select>
                      <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="user-field-group">
                    <label class="user-field-label">Email</label>
                    <input type="email" class="sys-text-input" id="input-operator-email" value="${this.userSettings.email}">
                  </div>
                </div>

                <!-- Column 2: Notification Preferences & Session Controls -->
                <div class="user-settings-col">
                  <!-- Notification Settings Checkboxes -->
                  <div class="user-field-group">
                    <label class="user-field-label">Notification Settings</label>
                    <div class="checkbox-options-grid">
                      <label class="sys-checkbox-wrap">
                        <input type="checkbox" id="chk-email-notif" ${this.userSettings.emailNotifications ? 'checked' : ''}>
                        <span class="custom-checkbox-box"></span>
                        <span class="chk-label-text">Email Notifications</span>
                      </label>

                      <label class="sys-checkbox-wrap">
                        <input type="checkbox" id="chk-sms-alerts" ${this.userSettings.smsAlerts ? 'checked' : ''}>
                        <span class="custom-checkbox-box"></span>
                        <span class="chk-label-text">SMS Alerts</span>
                      </label>

                      <label class="sys-checkbox-wrap">
                        <input type="checkbox" id="chk-inapp-notif" ${this.userSettings.inAppNotifications ? 'checked' : ''}>
                        <span class="custom-checkbox-box"></span>
                        <span class="chk-label-text">In-App Notifications</span>
                      </label>
                    </div>
                  </div>

                  <!-- Session Timeout -->
                  <div class="user-field-group">
                    <label class="user-field-label">Session Timeout</label>
                    <div class="custom-select-wrap select-full">
                      <select id="select-session-timeout" class="sys-select">
                        <option value="15 Minutes" ${this.userSettings.sessionTimeout === '15 Minutes' ? 'selected' : ''}>15 Minutes</option>
                        <option value="30 Minutes" ${this.userSettings.sessionTimeout === '30 Minutes' ? 'selected' : ''}>30 Minutes</option>
                        <option value="1 Hour" ${this.userSettings.sessionTimeout === '1 Hour' ? 'selected' : ''}>1 Hour</option>
                        <option value="4 Hours" ${this.userSettings.sessionTimeout === '4 Hours' ? 'selected' : ''}>4 Hours</option>
                        <option value="8 Hours" ${this.userSettings.sessionTimeout === '8 Hours' ? 'selected' : ''}>8 Hours</option>
                      </select>
                      <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>

                  <!-- Logout Button -->
                  <div class="user-logout-wrap">
                    <button class="btn-sys-logout" id="btn-user-logout" title="Lock & Exit Duty Terminal">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Toast Feedback Notification -->
        <div id="sys-toast" class="sys-toast-notification hidden"></div>
      </div>
    `;
  }

  shouldShowCard(cardCategory) {
    if (this.activeTab === 'system-settings') return true;
    if (this.activeTab === 'alert-config' && cardCategory === 'alert-config') return true;
    if (this.activeTab === 'notifications' && (cardCategory === 'user-settings' || cardCategory === 'alert-config')) return true;
    if (this.activeTab === 'user-settings' && cardCategory === 'user-settings') return true;
    return false;
  }

  bindEvents(container) {
    this.container = container;
    if (!this.container) return;

    // 1. Sub-Tabs Switching
    const subtabs = this.container.querySelectorAll('.subtab-btn');
    subtabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.activeTab = tab;
        subtabs.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tab));

        // Update cards dimmed/highlighted state according to tab
        const cards = this.container.querySelectorAll('.sys-card');
        cards.forEach(card => {
          const cardId = card.id;
          let isMatch = (tab === 'system-settings');
          if (tab === 'alert-config' && cardId === 'card-alert-config') isMatch = true;
          if (tab === 'notifications' && (cardId === 'card-user-settings' || cardId === 'card-alert-config')) isMatch = true;
          if (tab === 'user-settings' && cardId === 'card-user-settings') isMatch = true;

          card.classList.toggle('card-dimmed', !isMatch);
          if (isMatch && tab !== 'system-settings') {
            card.classList.add('card-highlight');
            setTimeout(() => card.classList.remove('card-highlight'), 1000);
          }
        });

        this.showToast(`View switched to: ${btn.querySelector('span').textContent}`);
      });
    });

    // 2. AI Configuration Toggles
    this.bindToggle('toggle-ai-processing', 'status-ai-processing', (val) => {
      this.aiConfig.aiProcessing = val;
      this.showToast(`AI Processing ${val ? 'Enabled' : 'Disabled'}`);
    });
    this.bindToggle('toggle-edge-processing', 'status-edge-processing', (val) => {
      this.aiConfig.edgeProcessing = val;
      this.showToast(`Edge Processing ${val ? 'Enabled' : 'Disabled'}`);
    });
    this.bindToggle('toggle-auto-update', 'status-auto-update', (val) => {
      this.aiConfig.modelAutoUpdate = val;
      this.showToast(`Model Auto-Update ${val ? 'Enabled' : 'Disabled'}`);
    });
    this.bindToggle('toggle-save-detections', 'status-save-detections', (val) => {
      this.aiConfig.saveDetections = val;
      this.showToast(`Save Detections ${val ? 'Enabled' : 'Disabled'}`);
    });

    // 3. AI Configuration Selects
    this.bindSelect('select-inference-mode', (val) => {
      this.aiConfig.inferenceMode = val;
      this.showToast(`Inference Mode updated: ${val}`);
    });
    this.bindSelect('select-frame-rate', (val) => {
      this.aiConfig.processingFps = val;
      this.showToast(`Frame Rate updated: ${val}`);
    });
    this.bindSelect('select-retention-period', (val) => {
      this.aiConfig.retentionPeriod = val;
      this.showToast(`Retention Period updated: ${val}`);
    });

    // 4. Alert Threshold Sliders with Real-Time Percentage Display
    this.bindSlider('slider-intrusion', 'val-slider-intrusion', (val) => {
      this.alertThresholds.intrusion = val;
    });
    this.bindSlider('slider-person', 'val-slider-person', (val) => {
      this.alertThresholds.person = val;
    });
    this.bindSlider('slider-vehicle', 'val-slider-vehicle', (val) => {
      this.alertThresholds.vehicle = val;
    });
    this.bindSlider('slider-anpr', 'val-slider-anpr', (val) => {
      this.alertThresholds.anpr = val;
    });
    this.bindSlider('slider-face', 'val-slider-face', (val) => {
      this.alertThresholds.face = val;
    });

    // 5. Reset to Default Button
    const btnReset = this.container.querySelector('#btn-reset-alerts');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.alertThresholds = { ...this.defaultAlertThresholds };
        this.updateSliderUI('slider-intrusion', 'val-slider-intrusion', this.alertThresholds.intrusion);
        this.updateSliderUI('slider-person', 'val-slider-person', this.alertThresholds.person);
        this.updateSliderUI('slider-vehicle', 'val-slider-vehicle', this.alertThresholds.vehicle);
        this.updateSliderUI('slider-anpr', 'val-slider-anpr', this.alertThresholds.anpr);
        this.updateSliderUI('slider-face', 'val-slider-face', this.alertThresholds.face);
        this.showToast('Alert thresholds restored to baseline defaults.');
      });
    }

    // 6. User Settings Controls
    this.bindSelect('select-user-role', (val) => {
      this.userSettings.role = val;
      this.showToast(`Role updated: ${val}`);
    });
    this.bindSelect('select-session-timeout', (val) => {
      this.userSettings.sessionTimeout = val;
      this.showToast(`Session timeout set to: ${val}`);
    });

    const opName = this.container.querySelector('#input-operator-name');
    if (opName) {
      opName.addEventListener('change', (e) => {
        this.userSettings.operatorName = e.target.value.trim();
        this.showToast(`Operator name saved: ${this.userSettings.operatorName}`);
      });
    }

    const opEmail = this.container.querySelector('#input-operator-email');
    if (opEmail) {
      opEmail.addEventListener('change', (e) => {
        this.userSettings.email = e.target.value.trim();
        this.showToast(`Operator email saved: ${this.userSettings.email}`);
      });
    }

    const chkEmail = this.container.querySelector('#chk-email-notif');
    if (chkEmail) {
      chkEmail.addEventListener('change', (e) => {
        this.userSettings.emailNotifications = e.target.checked;
        this.showToast(`Email alerts ${e.target.checked ? 'activated' : 'muted'}`);
      });
    }

    const chkSms = this.container.querySelector('#chk-sms-alerts');
    if (chkSms) {
      chkSms.addEventListener('change', (e) => {
        this.userSettings.smsAlerts = e.target.checked;
        this.showToast(`SMS alerts ${e.target.checked ? 'activated' : 'muted'}`);
      });
    }

    const chkInApp = this.container.querySelector('#chk-inapp-notif');
    if (chkInApp) {
      chkInApp.addEventListener('change', (e) => {
        this.userSettings.inAppNotifications = e.target.checked;
        this.showToast(`In-app alerts ${e.target.checked ? 'activated' : 'muted'}`);
      });
    }

    // 7. Logout Button Action
    const btnLogout = this.container.querySelector('#btn-user-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof this.onLogout === 'function') {
          this.onLogout();
        }
      });
    }
  }

  bindToggle(toggleId, statusTextId, callback) {
    const el = this.container.querySelector(`#${toggleId}`);
    const statusText = this.container.querySelector(`#${statusTextId}`);
    if (el) {
      el.addEventListener('change', (e) => {
        const checked = e.target.checked;
        if (statusText) {
          statusText.textContent = checked ? 'Enabled' : 'Disabled';
          statusText.classList.toggle('text-muted', !checked);
        }
        if (callback) callback(checked);
      });
    }
  }

  bindSelect(selectId, callback) {
    const el = this.container.querySelector(`#${selectId}`);
    if (el) {
      el.addEventListener('change', (e) => {
        if (callback) callback(e.target.value);
      });
    }
  }

  bindSlider(sliderId, valueSpanId, callback) {
    const slider = this.container.querySelector(`#${sliderId}`);
    const span = this.container.querySelector(`#${valueSpanId}`);
    if (slider && span) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        span.textContent = `${val}%`;
        if (callback) callback(val);
      });
    }
  }

  updateSliderUI(sliderId, valueSpanId, val) {
    const slider = this.container.querySelector(`#${sliderId}`);
    const span = this.container.querySelector(`#${valueSpanId}`);
    if (slider) slider.value = val;
    if (span) span.textContent = `${val}%`;
  }

  showToast(message) {
    const toast = this.container ? this.container.querySelector('#sys-toast') : null;
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('active');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2800);
  }
}
