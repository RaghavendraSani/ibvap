/**
 * IBVAP Tactical AI Connector
 * Bridges Python AI Detection Pipeline (ObjectTracker, EventEngine, SceneState)
 * with the frontend Command Suite & Incident Center.
 */

export class AiConnector {
  constructor(options = {}) {
    this.wsUrl = options.wsUrl || 'ws://localhost:8000/ws';
    this.httpUrl = options.httpUrl || 'http://localhost:8000/api';
    this.listeners = {
      event: [],
      telemetry: [],
      cameraFrame: []
    };
    this.ws = null;
    this.isConnected = false;
    this.mockTimer = null;
    this.localMediaStream = null;
    this.isSimulationRunning = false;

    // Default pre-seeded AI events generator list
    this.eventTypes = [
      {
        type: 'Unauthorized Intrusion',
        severity: 'CRITICAL',
        objectType: 'Person',
        classification: 'Unauthorized Intrusion',
        direction: 'Towards Border Fence',
        count: 1,
        sector: 'Sector B-17',
        camera: 'CAM-034',
        coordinates: '19.3526° N, 77.6958° E',
        description: 'A person detected near the border fence at an unauthorized location during restricted hours.',
        recommendedAction: 'Verify the alert, assess threat level, and dispatch ground unit if required.'
      },
      {
        type: 'Unknown Vehicle',
        severity: 'HIGH',
        objectType: 'Vehicle',
        classification: 'Unknown Vehicle',
        direction: 'North-West Access Road',
        count: 1,
        sector: 'Sector C-04',
        camera: 'CAM-021',
        coordinates: '19.4102° N, 77.7214° E',
        description: 'Unidentified vehicle approaching outer perimeter barrier without registered transponder.',
        recommendedAction: 'Engage optical zoom, query ANPR database, and alert gate checkpoint.'
      },
      {
        type: 'Restricted Zone Entry',
        severity: 'HIGH',
        objectType: 'Person',
        classification: 'Restricted Zone Entry',
        direction: 'Buffer Zone Alpha',
        count: 2,
        sector: 'Sector B-17',
        camera: 'CAM-034',
        coordinates: '19.3580° N, 77.6990° E',
        description: 'Movement observed inside sterile boundary zone. Sensor tripwire confirmed breach.',
        recommendedAction: 'Activate warning illumination floodlights and direct patrol squad to coordinates.'
      },
      {
        type: 'Watchlist Face Match',
        severity: 'MEDIUM',
        objectType: 'Person',
        classification: 'Facial Recognition Hit',
        direction: 'Transit Checkpoint 3',
        count: 1,
        sector: 'Sector A-08',
        camera: 'CAM-012',
        coordinates: '19.2941° N, 77.6189° E',
        description: 'Facial telemetry matched Person of Interest with 91% biometrics match score.',
        recommendedAction: 'Hold for manual biometric verification at primary checkpoint.'
      },
      {
        type: 'Vehicle Loitering',
        severity: 'MEDIUM',
        objectType: 'Vehicle',
        classification: 'Loitering Alert',
        direction: 'Stationary on Perimeter Shoulder',
        count: 1,
        sector: 'Sector D-03',
        camera: 'CAM-017',
        coordinates: '19.4892° N, 77.8012° E',
        description: 'Vehicle stationary for over 10 minutes exceeding loitering threshold in sensitive corridor.',
        recommendedAction: 'Hail vehicle via perimeter loudspeaker and dispatch inspection patrol.'
      }
    ];
  }

  /**
   * Subscribe to AI events
   */
  on(channel, callback) {
    if (this.listeners[channel]) {
      this.listeners[channel].push(callback);
    }
    return () => {
      this.listeners[channel] = this.listeners[channel].filter(cb => cb !== callback);
    };
  }

  emit(channel, data) {
    if (this.listeners[channel]) {
      this.listeners[channel].forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[AiConnector] Error in listener for ${channel}:`, err);
        }
      });
    }
  }

  /**
   * Initialize connection with automated fallback
   */
  connect() {
    this.tryWebSocket();
    this.startSimulation();
  }

  tryWebSocket() {
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log('[AiConnector] Connected to AI Backend WebSocket');
        this.isConnected = true;
        this.stopSimulation();
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'security_event') {
            this.emit('event', payload.data);
          } else if (payload.type === 'telemetry') {
            this.emit('telemetry', payload.data);
          }
        } catch (e) {
          console.warn('[AiConnector] Error parsing WebSocket message:', e);
        }
      };

      this.ws.onerror = () => {
        this.isConnected = false;
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.startSimulation();
      };
    } catch {
      this.isConnected = false;
      this.startSimulation();
    }
  }

  /**
   * Generates periodic realistic AI detections when backend is in test/standalone mode
   */
  startSimulation() {
    if (this.isSimulationRunning) return;
    this.isSimulationRunning = true;

    // Emit live telemetry heartbeat every 3 seconds
    this.telemetryInterval = setInterval(() => {
      this.emit('telemetry', {
        activeCameras: '42 / 45',
        fps: (29.4 + (Math.random() * 1.5 - 0.75)).toFixed(1),
        objectsTracked: Math.floor(6 + Math.random() * 8),
        confidenceAverage: (0.92 + Math.random() * 0.05).toFixed(2)
      });
    }, 3000);
  }

  stopSimulation() {
    this.isSimulationRunning = false;
    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
      this.telemetryInterval = null;
    }
    if (this.mockTimer) {
      clearTimeout(this.mockTimer);
      this.mockTimer = null;
    }
  }

  /**
   * Trigger a synthetic AI incident on demand (for testing or operator dispatch)
   */
  triggerSimulatedIncident(customData = {}) {
    const template = this.eventTypes[Math.floor(Math.random() * this.eventTypes.length)];
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const incNumber = Math.floor(1000 + Math.random() * 9000);

    const incident = {
      id: `inc-${Date.now()}`,
      code: `#INC-2026-0915-${incNumber}`,
      severity: customData.severity || template.severity,
      title: customData.title || template.type,
      eventType: template.type,
      objectType: template.objectType,
      classification: template.classification,
      direction: template.direction,
      count: template.count,
      location: template.sector,
      camera: template.camera,
      coordinates: template.coordinates,
      date: dateStr,
      time: timeStr,
      confidence: `${Math.floor(86 + Math.random() * 12)}%`,
      status: 'UNRESOLVED',
      isRead: false,
      thumb: `/assets/incident_${Math.floor(1 + Math.random() * 5)}.jpg`,
      videoPlaceholder: '/assets/camera_feed_placeholder.png',
      description: template.description,
      recommendedAction: template.recommendedAction
    };

    this.emit('event', incident);
    return incident;
  }

  /**
   * Bind live browser webcam if requested by user
   */
  async startWebcam(videoElement) {
    if (!videoElement) return false;
    try {
      if (this.localMediaStream) {
        this.stopWebcam();
      }
      this.localMediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, frameRate: { ideal: 30 } },
        audio: false
      });
      videoElement.srcObject = this.localMediaStream;
      await videoElement.play();
      return true;
    } catch (err) {
      console.warn('[AiConnector] Unable to access camera hardware:', err.message);
      return false;
    }
  }

  stopWebcam(videoElement) {
    if (this.localMediaStream) {
      this.localMediaStream.getTracks().forEach(track => track.stop());
      this.localMediaStream = null;
    }
    if (videoElement) {
      videoElement.srcObject = null;
    }
  }
}
