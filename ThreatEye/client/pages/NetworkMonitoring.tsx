import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Network,
  Activity,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Wifi,
  Server,
  Globe,
  Lock,
  Unlock,
  Eye,
  Clock,
  MapPin
} from 'lucide-react';

interface NetworkConnection {
  id: string;
  sourceIp: string;
  destIp: string;
  destPort: number;
  protocol: string;
  status: 'ACTIVE' | 'BLOCKED' | 'ALLOWED';
  dataTransferred: number;
  duration: number;
  threat: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  timestamp: Date;
}

interface TrafficStats {
  totalConnections: number;
  activeConnections: number;
  blockedConnections: number;
  totalBandwidth: number;
  inboundTraffic: number;
  outboundTraffic: number;
  topProtocols: { protocol: string; percentage: number }[];
  topDestinations: { ip: string; count: number }[];
}

const mockConnections: NetworkConnection[] = [
  {
    id: '1',
    sourceIp: '192.168.1.10',
    destIp: '185.220.101.47',
    destPort: 443,
    protocol: 'HTTPS',
    status: 'BLOCKED',
    dataTransferred: 0,
    duration: 0,
    threat: 'CRITICAL',
    location: 'Russia',
    timestamp: new Date()
  },
  {
    id: '2',
    sourceIp: '192.168.1.15',
    destIp: '8.8.8.8',
    destPort: 53,
    protocol: 'DNS',
    status: 'ACTIVE',
    dataTransferred: 1024,
    duration: 5,
    threat: 'NONE',
    location: 'United States',
    timestamp: new Date(Date.now() - 30000)
  },
  {
    id: '3',
    sourceIp: '192.168.1.20',
    destIp: '192.168.1.100',
    destPort: 22,
    protocol: 'SSH',
    status: 'BLOCKED',
    dataTransferred: 2048,
    duration: 15,
    threat: 'HIGH',
    location: 'Internal',
    timestamp: new Date(Date.now() - 60000)
  },
  {
    id: '4',
    sourceIp: '192.168.1.25',
    destIp: '1.1.1.1',
    destPort: 443,
    protocol: 'HTTPS',
    status: 'ACTIVE',
    dataTransferred: 15360,
    duration: 120,
    threat: 'NONE',
    location: 'United States',
    timestamp: new Date(Date.now() - 120000)
  }
];

const mockStats: TrafficStats = {
  totalConnections: 1247,
  activeConnections: 89,
  blockedConnections: 23,
  totalBandwidth: 85.2,
  inboundTraffic: 45.7,
  outboundTraffic: 39.5,
  topProtocols: [
    { protocol: 'HTTPS', percentage: 65 },
    { protocol: 'HTTP', percentage: 20 },
    { protocol: 'DNS', percentage: 8 },
    { protocol: 'SSH', percentage: 4 },
    { protocol: 'Other', percentage: 3 }
  ],
  topDestinations: [
    { ip: '8.8.8.8', count: 145 },
    { ip: '1.1.1.1', count: 89 },
    { ip: '208.67.222.222', count: 67 },
    { ip: '76.76.76.76', count: 34 }
  ]
};

export default function NetworkMonitoring() {
  const [connections, setConnections] = useState<NetworkConnection[]>(mockConnections);
  const [stats, setStats] = useState<TrafficStats>(mockStats);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filteredConnections = connections.filter(conn => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'THREATS') return conn.threat !== 'NONE';
    if (selectedFilter === 'BLOCKED') return conn.status === 'BLOCKED';
    if (selectedFilter === 'ACTIVE') return conn.status === 'ACTIVE';
    return true;
  });

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'CRITICAL': return 'text-threat-critical';
      case 'HIGH': return 'text-threat-high';
      case 'MEDIUM': return 'text-threat-medium';
      case 'LOW': return 'text-threat-low';
      default: return 'text-success';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BLOCKED': return 'text-threat-critical bg-threat-critical/10 border-threat-critical';
      case 'ACTIVE': return 'text-success bg-success/10 border-success';
      case 'ALLOWED': return 'text-cyber-blue bg-cyber-blue/10 border-cyber-blue';
      default: return 'text-foreground bg-background border-border';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Network Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Real-time network traffic analysis and threat detection
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            View Logs
          </Button>
          <Button className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Traffic Report
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <Card className="relative overflow-hidden border-border">
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/19317897/pexels-photo-19317897.jpeg)',
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(0,0,0,0.6)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Advanced Network Monitoring
              </h2>
              <p className="text-muted-foreground">
                Monitor all network connections in real-time with intelligent threat detection
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Traffic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Connections</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalConnections}</p>
              </div>
              <Network className="h-8 w-8 text-cyber-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Connections</p>
                <p className="text-2xl font-bold text-success">{stats.activeConnections}</p>
              </div>
              <Activity className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blocked Connections</p>
                <p className="text-2xl font-bold text-threat-critical">{stats.blockedConnections}</p>
              </div>
              <Shield className="h-8 w-8 text-threat-critical" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bandwidth Usage</p>
                <p className="text-2xl font-bold text-cyber-purple">{stats.totalBandwidth}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-cyber-purple" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Traffic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Inbound Traffic</span>
                  <span>{stats.inboundTraffic}%</span>
                </div>
                <Progress value={stats.inboundTraffic} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Outbound Traffic</span>
                  <span>{stats.outboundTraffic}%</span>
                </div>
                <Progress value={stats.outboundTraffic} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Top Protocols
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topProtocols.map((protocol) => (
                <div key={protocol.protocol} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{protocol.protocol}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20">
                      <Progress value={protocol.percentage} className="h-2" />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {protocol.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Filters */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Connection Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {['ALL', 'ACTIVE', 'BLOCKED', 'THREATS'].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Connections */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Network Connections ({filteredConnections.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredConnections.map((connection) => (
              <Card key={connection.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {connection.status === 'BLOCKED' ? (
                          <Lock className="h-5 w-5 text-threat-critical" />
                        ) : (
                          <Unlock className="h-5 w-5 text-success" />
                        )}
                        <Badge variant="outline" className={getStatusColor(connection.status)}>
                          {connection.status}
                        </Badge>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {connection.sourceIp} → {connection.destIp}:{connection.destPort}
                          </code>
                          <Badge variant="secondary" className="text-xs">
                            {connection.protocol}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {formatBytes(connection.dataTransferred)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(connection.duration)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {connection.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">Threat Level</span>
                        <Badge 
                          variant="outline" 
                          className={connection.threat === 'NONE' ? 'text-success' : getThreatColor(connection.threat)}
                        >
                          {connection.threat}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {connection.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
