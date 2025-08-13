import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Wifi,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Server,
  Eye,
  RefreshCw
} from 'lucide-react';

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
    processes: number;
  };
  memory: {
    usage: number;
    total: number;
    available: number;
    cached: number;
  };
  disk: {
    usage: number;
    total: number;
    free: number;
    readSpeed: number;
    writeSpeed: number;
  };
  network: {
    inbound: number;
    outbound: number;
    latency: number;
    packetLoss: number;
  };
  security: {
    firewallStatus: 'ACTIVE' | 'INACTIVE' | 'ERROR';
    antivirusStatus: 'ACTIVE' | 'INACTIVE' | 'ERROR';
    threatScannerStatus: 'ACTIVE' | 'INACTIVE' | 'ERROR';
    lastScan: Date;
  };
}

interface SystemAlert {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

const mockMetrics: SystemMetrics = {
  cpu: {
    usage: 45.2,
    cores: 8,
    temperature: 62,
    processes: 247
  },
  memory: {
    usage: 68.5,
    total: 32768,
    available: 10322,
    cached: 4096
  },
  disk: {
    usage: 72.3,
    total: 1000000,
    free: 277000,
    readSpeed: 125.6,
    writeSpeed: 89.3
  },
  network: {
    inbound: 15.7,
    outbound: 8.2,
    latency: 12,
    packetLoss: 0.1
  },
  security: {
    firewallStatus: 'ACTIVE',
    antivirusStatus: 'ACTIVE',
    threatScannerStatus: 'ACTIVE',
    lastScan: new Date(Date.now() - 1800000) // 30 minutes ago
  }
};

const mockAlerts: SystemAlert[] = [
  {
    id: '1',
    type: 'WARNING',
    message: 'High memory usage detected (>65%)',
    timestamp: new Date(Date.now() - 300000),
    resolved: false
  },
  {
    id: '2',
    type: 'INFO',
    message: 'System backup completed successfully',
    timestamp: new Date(Date.now() - 900000),
    resolved: true
  },
  {
    id: '3',
    type: 'CRITICAL',
    message: 'Suspicious process detected and quarantined',
    timestamp: new Date(Date.now() - 1200000),
    resolved: true
  },
  {
    id: '4',
    type: 'ERROR',
    message: 'Failed to connect to update server',
    timestamp: new Date(Date.now() - 1800000),
    resolved: false
  }
];

export default function SystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetrics>(mockMetrics);
  const [alerts, setAlerts] = useState<SystemAlert[]>(mockAlerts);
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-success bg-success/10 border-success';
      case 'INACTIVE': return 'text-threat-medium bg-threat-medium/10 border-threat-medium';
      case 'ERROR': return 'text-threat-critical bg-threat-critical/10 border-threat-critical';
      default: return 'text-foreground bg-background border-border';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'CRITICAL': return 'text-threat-critical border-threat-critical bg-threat-critical/10';
      case 'ERROR': return 'text-threat-high border-threat-high bg-threat-high/10';
      case 'WARNING': return 'text-threat-medium border-threat-medium bg-threat-medium/10';
      case 'INFO': return 'text-cyber-blue border-cyber-blue bg-cyber-blue/10';
      default: return 'text-foreground border-border bg-background';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL':
      case 'ERROR': return XCircle;
      case 'WARNING': return AlertTriangle;
      case 'INFO': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'text-threat-critical';
    if (usage >= 75) return 'text-threat-high';
    if (usage >= 60) return 'text-threat-medium';
    return 'text-success';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatSpeed = (mbps: number) => {
    return `${mbps.toFixed(1)} MB/s`;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Health</h1>
          <p className="text-muted-foreground mt-1">
            Monitor system performance and security status in real-time
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance Report
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <Card className="relative overflow-hidden border-border">
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg)',
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(0,0,0,0.7)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Comprehensive System Monitoring
              </h2>
              <p className="text-muted-foreground">
                Track performance metrics and security status across all system components
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Firewall</p>
                <Badge variant="outline" className={getStatusColor(metrics.security.firewallStatus)}>
                  {metrics.security.firewallStatus}
                </Badge>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Antivirus</p>
                <Badge variant="outline" className={getStatusColor(metrics.security.antivirusStatus)}>
                  {metrics.security.antivirusStatus}
                </Badge>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Threat Scanner</p>
                <Badge variant="outline" className={getStatusColor(metrics.security.threatScannerStatus)}>
                  {metrics.security.threatScannerStatus}
                </Badge>
              </div>
              <Eye className="h-8 w-8 text-cyber-blue" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Metrics */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              CPU Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>CPU Usage</span>
                  <span className={getUsageColor(metrics.cpu.usage)}>
                    {metrics.cpu.usage}%
                  </span>
                </div>
                <Progress value={metrics.cpu.usage} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Cores:</span>
                  <span className="ml-2 font-medium">{metrics.cpu.cores}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Temperature:</span>
                  <span className="ml-2 font-medium">{metrics.cpu.temperature}°C</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Processes:</span>
                  <span className="ml-2 font-medium">{metrics.cpu.processes}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory Metrics */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MemoryStick className="h-5 w-5" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Memory Usage</span>
                  <span className={getUsageColor(metrics.memory.usage)}>
                    {metrics.memory.usage}%
                  </span>
                </div>
                <Progress value={metrics.memory.usage} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <span className="ml-2 font-medium">{formatBytes(metrics.memory.total)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Available:</span>
                  <span className="ml-2 font-medium">{formatBytes(metrics.memory.available)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Cached:</span>
                  <span className="ml-2 font-medium">{formatBytes(metrics.memory.cached)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disk Metrics */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Disk Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Disk Usage</span>
                  <span className={getUsageColor(metrics.disk.usage)}>
                    {metrics.disk.usage}%
                  </span>
                </div>
                <Progress value={metrics.disk.usage} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <span className="ml-2 font-medium">{formatBytes(metrics.disk.total)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Free:</span>
                  <span className="ml-2 font-medium">{formatBytes(metrics.disk.free)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Read:</span>
                  <span className="ml-2 font-medium">{formatSpeed(metrics.disk.readSpeed)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Write:</span>
                  <span className="ml-2 font-medium">{formatSpeed(metrics.disk.writeSpeed)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Metrics */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Network Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-cyber-blue" />
                    <span className="text-sm">Inbound</span>
                  </div>
                  <div className="text-lg font-bold text-cyber-blue">
                    {formatSpeed(metrics.network.inbound)}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-cyber-purple" />
                    <span className="text-sm">Outbound</span>
                  </div>
                  <div className="text-lg font-bold text-cyber-purple">
                    {formatSpeed(metrics.network.outbound)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Latency:</span>
                  <span className="ml-2 font-medium">{metrics.network.latency}ms</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Packet Loss:</span>
                  <span className="ml-2 font-medium">{metrics.network.packetLoss}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              return (
                <Card key={alert.id} className={`border ${getAlertColor(alert.type)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <AlertIcon className="h-5 w-5 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={getAlertColor(alert.type)}>
                              {alert.type}
                            </Badge>
                            {alert.resolved && (
                              <Badge variant="outline" className="text-success border-success">
                                RESOLVED
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{alert.message}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {alert.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
