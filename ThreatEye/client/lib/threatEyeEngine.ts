import { 
  NetworkActivity, 
  FileActivity, 
  ProcessActivity, 
  UpdateSimulation, 
  Anomaly, 
  ResponseAction, 
  ThreatIndicator,
  SystemHealth
} from '@shared/threateye';

class ThreatEyeEngine {
  private threatIntelligence: ThreatIndicator[] = [
    { type: 'IP', value: '185.220.101.47', severity: 'CRITICAL', description: 'Known C2 server' },
    { type: 'IP', value: '192.168.1.100', severity: 'HIGH', description: 'Suspicious internal IP' },
    { type: 'DOMAIN', value: 'malware-c2.evil.com', severity: 'CRITICAL', description: 'Malware command and control' },
    { type: 'DOMAIN', value: 'data-exfil.suspicious.net', severity: 'HIGH', description: 'Data exfiltration domain' },
    { type: 'PROCESS', value: 'cryptominer.exe', severity: 'HIGH', description: 'Cryptocurrency miner' },
    { type: 'PROCESS', value: 'backdoor.exe', severity: 'CRITICAL', description: 'Known backdoor process' },
    { type: 'FILE_HASH', value: 'a1b2c3d4e5f6', severity: 'CRITICAL', description: 'Malware hash signature' }
  ];

  private listeners: ((update: UpdateSimulation) => void)[] = [];
  private healthListeners: ((health: SystemHealth) => void)[] = [];

  constructor() {
    this.startHealthMonitoring();
  }

  onUpdateChange(callback: (update: UpdateSimulation) => void) {
    this.listeners.push(callback);
  }

  onHealthChange(callback: (health: SystemHealth) => void) {
    this.healthListeners.push(callback);
  }

  private notifyListeners(update: UpdateSimulation) {
    this.listeners.forEach(listener => listener(update));
  }

  private notifyHealthListeners(health: SystemHealth) {
    this.healthListeners.forEach(listener => listener(health));
  }

  async simulateSafeUpdate(name: string, version: string): Promise<UpdateSimulation> {
    const simulation: UpdateSimulation = {
      id: `safe_${Date.now()}`,
      type: 'SAFE',
      name,
      version,
      status: 'RUNNING',
      startTime: new Date(),
      riskScore: 0,
      activities: {
        network: [],
        files: [],
        processes: []
      },
      anomalies: [],
      actionsTriggered: []
    };

    this.notifyListeners(simulation);

    // Simulate normal update activities
    for (let i = 0; i < 10; i++) {
      await this.delay(200);
      
      // Normal network activity
      if (Math.random() > 0.3) {
        const networkActivity = this.generateSafeNetworkActivity();
        simulation.activities.network.push(networkActivity);
      }

      // Normal file changes
      if (Math.random() > 0.4) {
        const fileActivity = this.generateSafeFileActivity();
        simulation.activities.files.push(fileActivity);
      }

      // Normal process activity
      if (Math.random() > 0.6) {
        const processActivity = this.generateSafeProcessActivity();
        simulation.activities.processes.push(processActivity);
      }

      // Calculate risk score (should remain low)
      simulation.riskScore = this.calculateRiskScore(simulation);
      this.notifyListeners(simulation);
    }

    simulation.status = 'COMPLETED';
    simulation.endTime = new Date();
    this.notifyListeners(simulation);

    return simulation;
  }

  async simulateMaliciousUpdate(name: string, version: string): Promise<UpdateSimulation> {
    const simulation: UpdateSimulation = {
      id: `malicious_${Date.now()}`,
      type: 'MALICIOUS',
      name,
      version,
      status: 'RUNNING',
      startTime: new Date(),
      riskScore: 0,
      activities: {
        network: [],
        files: [],
        processes: []
      },
      anomalies: [],
      actionsTriggered: []
    };

    this.notifyListeners(simulation);

    // Simulate malicious update activities
    for (let i = 0; i < 15; i++) {
      await this.delay(300);
      
      // Mix of normal and suspicious activities
      if (Math.random() > 0.2) {
        const networkActivity = i > 5 && Math.random() > 0.4 
          ? this.generateMaliciousNetworkActivity()
          : this.generateSafeNetworkActivity();
        simulation.activities.network.push(networkActivity);
      }

      if (Math.random() > 0.3) {
        const fileActivity = i > 3 && Math.random() > 0.5
          ? this.generateMaliciousFileActivity()
          : this.generateSafeFileActivity();
        simulation.activities.files.push(fileActivity);
      }

      if (Math.random() > 0.5) {
        const processActivity = i > 7 && Math.random() > 0.6
          ? this.generateMaliciousProcessActivity()
          : this.generateSafeProcessActivity();
        simulation.activities.processes.push(processActivity);
      }

      // Calculate risk score and detect anomalies
      simulation.riskScore = this.calculateRiskScore(simulation);
      const newAnomalies = this.detectAnomalies(simulation);
      simulation.anomalies.push(...newAnomalies);

      // Trigger auto-response if risk is high
      if (simulation.riskScore > 70 && simulation.status === 'RUNNING') {
        const actions = this.triggerAutoResponse(simulation);
        simulation.actionsTriggered.push(...actions);
        simulation.status = 'BLOCKED';
      }

      this.notifyListeners(simulation);

      if (simulation.status === 'BLOCKED') {
        break;
      }
    }

    if (simulation.status === 'RUNNING') {
      simulation.status = 'COMPLETED';
    }
    simulation.endTime = new Date();
    this.notifyListeners(simulation);

    return simulation;
  }

  private generateSafeNetworkActivity(): NetworkActivity {
    const safeIPs = ['8.8.8.8', '1.1.1.1', '208.67.222.222', '76.76.76.76'];
    const safeDomains = ['google.com', 'microsoft.com', 'apple.com', 'ubuntu.com'];
    
    return {
      id: `net_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      sourceIp: '192.168.1.10',
      destIp: safeIPs[Math.floor(Math.random() * safeIPs.length)],
      domain: safeDomains[Math.floor(Math.random() * safeDomains.length)],
      port: [80, 443, 53][Math.floor(Math.random() * 3)],
      protocol: ['HTTP', 'HTTPS'][Math.floor(Math.random() * 2)] as 'HTTP' | 'HTTPS',
      dataSize: Math.floor(Math.random() * 10000) + 1000,
      isSuspicious: false
    };
  }

  private generateMaliciousNetworkActivity(): NetworkActivity {
    const maliciousIPs = ['185.220.101.47', '192.168.1.100', '45.33.32.156'];
    const maliciousDomains = ['malware-c2.evil.com', 'data-exfil.suspicious.net', 'botnet.dark.net'];
    
    return {
      id: `net_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      sourceIp: '192.168.1.10',
      destIp: maliciousIPs[Math.floor(Math.random() * maliciousIPs.length)],
      domain: maliciousDomains[Math.floor(Math.random() * maliciousDomains.length)],
      port: Math.floor(Math.random() * 65535) + 1,
      protocol: ['TCP', 'UDP'][Math.floor(Math.random() * 2)] as 'TCP' | 'UDP',
      dataSize: Math.floor(Math.random() * 100000) + 50000,
      isSuspicious: true
    };
  }

  private generateSafeFileActivity(): FileActivity {
    const safePaths = ['/tmp/update.log', '/var/cache/app/data.tmp', '/home/user/document.txt'];
    const actions = ['CREATE', 'MODIFY', 'ACCESS'] as const;
    
    return {
      id: `file_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      path: safePaths[Math.floor(Math.random() * safePaths.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      size: Math.floor(Math.random() * 10000) + 100,
      checksum: Math.random().toString(36).substr(2, 12),
      isSystemFile: false,
      isSuspicious: false
    };
  }

  private generateMaliciousFileActivity(): FileActivity {
    const maliciousPaths = ['/System/Library/backdoor.so', '/usr/bin/cryptominer', '/.hidden/payload.exe'];
    const actions = ['CREATE', 'MODIFY'] as const;
    
    return {
      id: `file_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      path: maliciousPaths[Math.floor(Math.random() * maliciousPaths.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      size: Math.floor(Math.random() * 100000) + 10000,
      checksum: 'a1b2c3d4e5f6',
      isSystemFile: true,
      isSuspicious: true
    };
  }

  private generateSafeProcessActivity(): ProcessActivity {
    const safeProcesses = ['chrome.exe', 'firefox.exe', 'notepad.exe', 'explorer.exe'];
    
    return {
      id: `proc_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      processName: safeProcesses[Math.floor(Math.random() * safeProcesses.length)],
      pid: Math.floor(Math.random() * 10000) + 1000,
      parentPid: Math.floor(Math.random() * 1000) + 1,
      cpuUsage: Math.random() * 20,
      memoryUsage: Math.random() * 500 + 50,
      isHidden: false,
      isSuspicious: false
    };
  }

  private generateMaliciousProcessActivity(): ProcessActivity {
    const maliciousProcesses = ['cryptominer.exe', 'backdoor.exe', 'keylogger.exe'];
    
    return {
      id: `proc_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      processName: maliciousProcesses[Math.floor(Math.random() * maliciousProcesses.length)],
      pid: Math.floor(Math.random() * 10000) + 1000,
      parentPid: Math.floor(Math.random() * 1000) + 1,
      cpuUsage: Math.random() * 80 + 20,
      memoryUsage: Math.random() * 2000 + 500,
      isHidden: true,
      isSuspicious: true
    };
  }

  private calculateRiskScore(simulation: UpdateSimulation): number {
    let score = 0;
    let totalActivities = 0;

    // Check network activities
    simulation.activities.network.forEach(activity => {
      totalActivities++;
      if (activity.isSuspicious) score += 25;
      
      // Check against threat intelligence
      const threatMatch = this.threatIntelligence.find(t => 
        (t.type === 'IP' && t.value === activity.destIp) ||
        (t.type === 'DOMAIN' && t.value === activity.domain)
      );
      if (threatMatch) {
        score += threatMatch.severity === 'CRITICAL' ? 30 : 20;
      }
    });

    // Check file activities
    simulation.activities.files.forEach(activity => {
      totalActivities++;
      if (activity.isSuspicious) score += 20;
      
      const threatMatch = this.threatIntelligence.find(t => 
        t.type === 'FILE_HASH' && t.value === activity.checksum
      );
      if (threatMatch) {
        score += threatMatch.severity === 'CRITICAL' ? 25 : 15;
      }
    });

    // Check process activities
    simulation.activities.processes.forEach(activity => {
      totalActivities++;
      if (activity.isSuspicious) score += 15;
      if (activity.isHidden) score += 10;
      
      const threatMatch = this.threatIntelligence.find(t => 
        t.type === 'PROCESS' && t.value === activity.processName
      );
      if (threatMatch) {
        score += threatMatch.severity === 'CRITICAL' ? 35 : 25;
      }
    });

    // AI anomaly detection simulation (simple heuristic)
    const suspiciousRatio = (
      simulation.activities.network.filter(a => a.isSuspicious).length +
      simulation.activities.files.filter(a => a.isSuspicious).length +
      simulation.activities.processes.filter(a => a.isSuspicious).length
    ) / Math.max(totalActivities, 1);

    if (suspiciousRatio > 0.3) score += 20;
    if (suspiciousRatio > 0.5) score += 30;

    return Math.min(Math.round(score), 100);
  }

  private detectAnomalies(simulation: UpdateSimulation): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const currentTime = new Date();

    // Network anomalies
    const suspiciousNetworkActivities = simulation.activities.network.filter(a => a.isSuspicious);
    if (suspiciousNetworkActivities.length > 0) {
      anomalies.push({
        id: `anomaly_${Date.now()}_network`,
        timestamp: currentTime,
        type: 'NETWORK',
        severity: suspiciousNetworkActivities.length > 2 ? 'HIGH' : 'MEDIUM',
        score: Math.min(suspiciousNetworkActivities.length * 25, 100),
        description: `Detected ${suspiciousNetworkActivities.length} suspicious network connections`,
        evidence: suspiciousNetworkActivities,
        isBlocked: false
      });
    }

    // File anomalies
    const suspiciousFileActivities = simulation.activities.files.filter(a => a.isSuspicious);
    if (suspiciousFileActivities.length > 0) {
      anomalies.push({
        id: `anomaly_${Date.now()}_file`,
        timestamp: currentTime,
        type: 'FILE',
        severity: suspiciousFileActivities.some(f => f.isSystemFile) ? 'CRITICAL' : 'HIGH',
        score: Math.min(suspiciousFileActivities.length * 30, 100),
        description: `Detected ${suspiciousFileActivities.length} suspicious file operations`,
        evidence: suspiciousFileActivities,
        isBlocked: false
      });
    }

    // Process anomalies
    const suspiciousProcessActivities = simulation.activities.processes.filter(a => a.isSuspicious);
    if (suspiciousProcessActivities.length > 0) {
      anomalies.push({
        id: `anomaly_${Date.now()}_process`,
        timestamp: currentTime,
        type: 'PROCESS',
        severity: suspiciousProcessActivities.some(p => p.isHidden) ? 'CRITICAL' : 'HIGH',
        score: Math.min(suspiciousProcessActivities.length * 35, 100),
        description: `Detected ${suspiciousProcessActivities.length} suspicious processes`,
        evidence: suspiciousProcessActivities,
        isBlocked: false
      });
    }

    return anomalies;
  }

  private triggerAutoResponse(simulation: UpdateSimulation): ResponseAction[] {
    const actions: ResponseAction[] = [];
    const currentTime = new Date();

    // Block suspicious network connections
    const suspiciousConnections = simulation.activities.network.filter(a => a.isSuspicious);
    suspiciousConnections.forEach(connection => {
      actions.push({
        id: `action_${Date.now()}_${Math.random()}`,
        timestamp: currentTime,
        type: 'BLOCK_NETWORK',
        target: `${connection.destIp}:${connection.port}`,
        success: true,
        description: `Blocked suspicious connection to ${connection.destIp}`
      });
    });

    // Kill malicious processes
    const maliciousProcesses = simulation.activities.processes.filter(a => a.isSuspicious);
    maliciousProcesses.forEach(process => {
      actions.push({
        id: `action_${Date.now()}_${Math.random()}`,
        timestamp: currentTime,
        type: 'KILL_PROCESS',
        target: `${process.processName} (PID: ${process.pid})`,
        success: true,
        description: `Terminated malicious process ${process.processName}`
      });
    });

    // Rollback update if critical threat detected
    if (simulation.riskScore > 80) {
      actions.push({
        id: `action_${Date.now()}_${Math.random()}`,
        timestamp: currentTime,
        type: 'ROLLBACK_UPDATE',
        target: `${simulation.name} v${simulation.version}`,
        success: true,
        description: `Rolled back malicious update ${simulation.name}`
      });
    }

    return actions;
  }

  private startHealthMonitoring() {
    setInterval(() => {
      const health: SystemHealth = {
        timestamp: new Date(),
        overallRisk: Math.floor(Math.random() * 30) + 10,
        activeThreats: Math.floor(Math.random() * 5),
        blockedConnections: Math.floor(Math.random() * 20) + 5,
        quarantinedFiles: Math.floor(Math.random() * 10) + 2,
        monitoredProcesses: Math.floor(Math.random() * 50) + 100
      };
      this.notifyHealthListeners(health);
    }, 2000);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const threatEyeEngine = new ThreatEyeEngine();
