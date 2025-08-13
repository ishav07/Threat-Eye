export interface NetworkActivity {
  id: string;
  timestamp: Date;
  sourceIp: string;
  destIp: string;
  domain: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'HTTP' | 'HTTPS';
  dataSize: number;
  isSuspicious: boolean;
}

export interface FileActivity {
  id: string;
  timestamp: Date;
  path: string;
  action: 'CREATE' | 'MODIFY' | 'DELETE' | 'ACCESS';
  size: number;
  checksum: string;
  isSystemFile: boolean;
  isSuspicious: boolean;
}

export interface ProcessActivity {
  id: string;
  timestamp: Date;
  processName: string;
  pid: number;
  parentPid: number;
  cpuUsage: number;
  memoryUsage: number;
  isHidden: boolean;
  isSuspicious: boolean;
}

export interface ThreatIndicator {
  type: 'IP' | 'DOMAIN' | 'PROCESS' | 'FILE_HASH';
  value: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}

export interface Anomaly {
  id: string;
  timestamp: Date;
  type: 'NETWORK' | 'FILE' | 'PROCESS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number;
  description: string;
  evidence: (NetworkActivity | FileActivity | ProcessActivity)[];
  isBlocked: boolean;
}

export interface UpdateSimulation {
  id: string;
  type: 'SAFE' | 'MALICIOUS';
  name: string;
  version: string;
  status: 'RUNNING' | 'COMPLETED' | 'BLOCKED';
  startTime: Date;
  endTime?: Date;
  riskScore: number;
  activities: {
    network: NetworkActivity[];
    files: FileActivity[];
    processes: ProcessActivity[];
  };
  anomalies: Anomaly[];
  actionsTriggered: ResponseAction[];
}

export interface ResponseAction {
  id: string;
  timestamp: Date;
  type: 'BLOCK_NETWORK' | 'KILL_PROCESS' | 'ROLLBACK_UPDATE' | 'QUARANTINE_FILE';
  target: string;
  success: boolean;
  description: string;
}

export interface SystemHealth {
  timestamp: Date;
  overallRisk: number;
  activeThreats: number;
  blockedConnections: number;
  quarantinedFiles: number;
  monitoredProcesses: number;
}
