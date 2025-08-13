import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle,
  Shield,
  Globe,
  Server,
  FileX,
  Eye,
  Search,
  Download,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';

interface ThreatIndicator {
  id: string;
  type: 'IP' | 'DOMAIN' | 'HASH' | 'URL';
  value: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  firstSeen: Date;
  lastSeen: Date;
  source: string;
  description: string;
  tags: string[];
  location?: string;
}

const mockThreatData: ThreatIndicator[] = [
  {
    id: '1',
    type: 'IP',
    value: '185.220.101.47',
    severity: 'CRITICAL',
    confidence: 95,
    firstSeen: new Date('2024-01-15'),
    lastSeen: new Date('2024-01-20'),
    source: 'ThreatFeed Pro',
    description: 'Known C2 server hosting multiple malware families',
    tags: ['c2', 'malware', 'botnet'],
    location: 'Russia'
  },
  {
    id: '2',
    type: 'DOMAIN',
    value: 'malware-c2.evil.com',
    severity: 'CRITICAL',
    confidence: 98,
    firstSeen: new Date('2024-01-10'),
    lastSeen: new Date('2024-01-20'),
    source: 'DomainWatch',
    description: 'Command and control domain for banking trojan',
    tags: ['banking-trojan', 'c2', 'financial'],
    location: 'Unknown'
  },
  {
    id: '3',
    type: 'HASH',
    value: 'a1b2c3d4e5f67890abcdef1234567890',
    severity: 'HIGH',
    confidence: 92,
    firstSeen: new Date('2024-01-18'),
    lastSeen: new Date('2024-01-19'),
    source: 'VirusTotal',
    description: 'Ransomware payload detected in supply chain attack',
    tags: ['ransomware', 'supply-chain', 'encryption'],
    location: 'Global'
  },
  {
    id: '4',
    type: 'IP',
    value: '192.168.1.100',
    severity: 'MEDIUM',
    confidence: 78,
    firstSeen: new Date('2024-01-19'),
    lastSeen: new Date('2024-01-20'),
    source: 'Internal Detection',
    description: 'Suspicious internal host communicating with external C2',
    tags: ['internal', 'lateral-movement', 'suspicious'],
    location: 'Internal Network'
  },
  {
    id: '5',
    type: 'URL',
    value: 'https://phishing-site.fake.com/login',
    severity: 'HIGH',
    confidence: 88,
    firstSeen: new Date('2024-01-17'),
    lastSeen: new Date('2024-01-20'),
    source: 'PhishTank',
    description: 'Credential harvesting site targeting enterprise users',
    tags: ['phishing', 'credentials', 'social-engineering'],
    location: 'Germany'
  }
];

export default function ThreatIntelligence() {
  const [threats, setThreats] = useState<ThreatIndicator[]>(mockThreatData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const filteredThreats = threats.filter(threat => {
    const matchesSearch = threat.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'ALL' || threat.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-threat-critical border-threat-critical bg-threat-critical/10';
      case 'HIGH': return 'text-threat-high border-threat-high bg-threat-high/10';
      case 'MEDIUM': return 'text-threat-medium border-threat-medium bg-threat-medium/10';
      case 'LOW': return 'text-threat-low border-threat-low bg-threat-low/10';
      default: return 'text-foreground border-border bg-background';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IP': return Server;
      case 'DOMAIN': return Globe;
      case 'HASH': return FileX;
      case 'URL': return Globe;
      default: return AlertTriangle;
    }
  };

  const getThreatStats = () => {
    const stats = {
      total: threats.length,
      critical: threats.filter(t => t.severity === 'CRITICAL').length,
      high: threats.filter(t => t.severity === 'HIGH').length,
      medium: threats.filter(t => t.severity === 'MEDIUM').length,
      low: threats.filter(t => t.severity === 'LOW').length,
    };
    return stats;
  };

  const stats = getThreatStats();

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Threat Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and analyze threat indicators from multiple intelligence sources
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export IOCs
          </Button>
          <Button className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <Card className="relative overflow-hidden border-border">
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg)',
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(0,0,0,0.7)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Advanced Threat Intelligence Platform
              </h2>
              <p className="text-muted-foreground">
                Real-time threat indicators from global intelligence feeds
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total IOCs</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Eye className="h-8 w-8 text-cyber-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-threat-critical">{stats.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-threat-critical" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High</p>
                <p className="text-2xl font-bold text-threat-high">{stats.high}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-threat-high" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medium</p>
                <p className="text-2xl font-bold text-threat-medium">{stats.medium}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-threat-medium" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low</p>
                <p className="text-2xl font-bold text-threat-low">{stats.low}</p>
              </div>
              <Shield className="h-8 w-8 text-threat-low" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by IOC value, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((severity) => (
                <Button
                  key={severity}
                  variant={selectedSeverity === severity ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSeverity(severity)}
                >
                  {severity}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threat Indicators Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Threat Indicators ({filteredThreats.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredThreats.map((threat) => {
              const TypeIcon = getTypeIcon(threat.type);
              return (
                <Card key={threat.id} className={`border ${getSeverityColor(threat.severity)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-5 w-5" />
                          <Badge variant="outline" className="text-xs">
                            {threat.type}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                              {threat.value}
                            </code>
                            <Badge variant="outline" className={getSeverityColor(threat.severity)}>
                              {threat.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {threat.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {threat.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              First seen: {threat.firstSeen.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last seen: {threat.lastSeen.toLocaleDateString()}
                            </div>
                            {threat.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {threat.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Confidence</div>
                        <div className="text-lg font-bold text-primary">{threat.confidence}%</div>
                        <div className="text-xs text-muted-foreground">{threat.source}</div>
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
