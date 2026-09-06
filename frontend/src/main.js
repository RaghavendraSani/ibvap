/**
 * IBVAP Tactical Surveillance Platform — Application Bootstrap & Orchestrator
 * Modular coordination between LoadingScreen, LoginScreen, and Dashboard.
 */

import { LoadingScreen } from './loadingScreen.js';
import { LoginScreen } from './loginScreen.js';
import { Dashboard } from './dashboard.js';
import { AiConnector } from './aiConnector.js';

window.addEventListener('DOMContentLoaded', () => {
  console.log('[IBVAP] Bootstrapping Tactical Surveillance System...');

  const loginRoot = document.getElementById('login-screen-root');
  const dashboardRoot = document.getElementById('dashboard-root');

  // 1. Initialize Dashboard Component (Rendered & mounted underneath, initially hidden until login)
  const dashboard = new Dashboard({
    container: dashboardRoot,
    onLockTerminal: () => {
      console.log('[IBVAP] Officer locked terminal.');
      dashboard.hide();
      loginScreen.show();
      loginScreen.showStatus('Terminal locked', 'info');
    },
    onReplayIntro: () => {
      LoadingScreen.replay();
    }
  });

  // 2. Initialize Tactical AI Connector
  const ai = new AiConnector();
  ai.on('event', (incident) => {
    dashboard.handleAiEvent(incident);
  });
  ai.on('telemetry', (telemetry) => {
    dashboard.updateAnalytics(telemetry);
  });
  ai.connect();

  // 3. Initialize LoginScreen Component (Hardcoded credentials: G103-BHU : 12345678)
  const loginScreen = new LoginScreen({
    container: loginRoot,
    requiredId: 'G103-BHU',
    requiredKey: '12345678',
    onLoginSuccess: ({ serviceNo, post }) => {
      console.log(`[IBVAP] Officer ${serviceNo} authenticated at ${post}`);
      sessionStorage.setItem('ibvap-authenticated', 'true');
      dashboard.setDutyOfficer(serviceNo, post);
      dashboard.show();
    }
  });

  // Auto-restore authenticated session if previously logged in or hash is set
  if (location.hash === '#incidents') {
    loginRoot.style.display = 'none';
    dashboard.show();
    dashboard.switchView('incidents');
  } else if (location.hash === '#analytics') {
    loginRoot.style.display = 'none';
    dashboard.show();
    dashboard.switchView('analytics');
  } else if (sessionStorage.getItem('ibvap-authenticated') === 'true' || location.hash === '#command') {
    loginRoot.style.display = 'none';
    dashboard.show();
    dashboard.switchView('command');
  }

  // 3. Initialize & Mount Full-Screen Loading Screen Overlay
  const loader = new LoadingScreen({
    storageKey: 'ibvap-loading-seen',
    holdDurationMs: 3000,
    onComplete: () => {
      console.log('[IBVAP] Boot animation complete. Military Login Terminal revealed.');
    }
  });

  loader.mount(document.body);
});
