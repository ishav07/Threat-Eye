import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  FileText,
  Download,
  Calendar,
  Activity,
  Eye,
  Lock,
  Unlock,
  Target,
  Clock
} from 'lucide-react';

interface SecurityReport {
  id: string;
  title: string;
  type: 'THREAT_ANALYSIS' | 'VULNERABILITY_SCAN' | 'COMPLIANCE' | 'INCIDENT';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  generatedDate: Date;
  description: string;
  findings: number;
  recommendations: number;
}

interface SecurityMetrics {
  threatsDetected: {
    total: number;
    blocked: number;
    mitigated: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
  };
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  compliance: {
    score: number;
    frameworks: { name: string; compliant: boolean; score: number }[];
  };
  incidents: {
    total: number;
    resolved: number;
    pending: number;
    avgResolutionTime: number;
  };
}

const mockReports: SecurityReport[] = [
  {
    id: '1',
    title: 'Weekly Threat Intelligence Summary',
    type: 'THREAT_ANALYSIS',
    status: 'COMPLETED',
    severity: 'HIGH',
    generatedDate: new Date(Date.now() - 86400000),
    description: 'Comprehensive analysis of detected threats and attack patterns',
    findings: 23,
    recommendations: 8
  },
  {
    id: '2',
    title: 'Vulnerability Assessment Report',
    type: 'VULNERABILITY_SCAN',
    status: 'COMPLETED',
    severity: 'MEDIUM',
    generatedDate: new Date(Date.now() - 172800000),
    description: 'System-wide vulnerability scan and risk assessment',
    findings: 12,
    recommendations: 15
  },
  {
    id: '3',
    title: 'SOC 2 Compliance Audit',
    type: 'COMPLIANCE',
    status: 'IN_PROGRESS',
    severity: 'CRITICAL',
    generatedDate: new Date(),
    description: 'Annual SOC 2 Type II compliance assessment',
    findings: 7,
    recommendations: 12
  },
  {
    id: '4',
    title: 'Supply Chain Attack Incident',
    type: 'INCIDENT',
    status: 'COMPLETED',
    severity: 'CRITICAL',
    generatedDate: new Date(Date.now() - 259200000),
    description: 'Post-incident analysis of detected supply chain attack',
    findings: 18,
    recommendations: 6
  }
];

const mockMetrics: SecurityMetrics = {
  threatsDetected: {
    total: 1247,
    blocked: 1183,
    mitigated: 64,
    trend: 'DOWN'
  },
  vulnerabilities: {
    critical: 3,
    high: 12,
    medium: 45,
    low: 128
  },
  compliance: {
    score: 87.5,
    frameworks: [
      { name: 'SOC 2', compliant: true, score: 92 },
      { name: 'ISO 27001', compliant: true, score: 85 },
      { name: 'NIST', compliant: false, score: 78 },
      { name: 'GDPR', compliant: true, score: 94 }
    ]
  },
  incidents: {
    total: 47,
    resolved: 43,
    pending: 4,
    avgResolutionTime: 2.3
  }
};

export default function SecurityReports() {
  const [reports, setReports] = useState<SecurityReport[]>(mockReports);
  const [metrics, setMetrics] = useState<SecurityMetrics>(mockMetrics);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('7d');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-threat-critical border-threat-critical bg-threat-critical/10';
      case 'HIGH': return 'text-threat-high border-threat-high bg-threat-high/10';
      case 'MEDIUM': return 'text-threat-medium border-threat-medium bg-threat-medium/10';
      case 'LOW': return 'text-threat-low border-threat-low bg-threat-low/10';
      default: return 'text-foreground border-border bg-background';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-success bg-success/10 border-success';
      case 'IN_PROGRESS': return 'text-cyber-blue bg-cyber-blue/10 border-cyber-blue';
      case 'SCHEDULED': return 'text-threat-medium bg-threat-medium/10 border-threat-medium';
      default: return 'text-foreground bg-background border-border';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'THREAT_ANALYSIS': return AlertTriangle;
      case 'VULNERABILITY_SCAN': return Target;
      case 'COMPLIANCE': return Shield;
      case 'INCIDENT': return Activity;
      default: return FileText;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP': return TrendingUp;
      case 'DOWN': return TrendingDown;
      default: return Activity;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'UP': return 'text-threat-high';
      case 'DOWN': return 'text-success';
      default: return 'text-cyber-blue';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Reports</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive security analytics and compliance reporting
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2">
            {['24h', '7d', '30d', '90d'].map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe}
              </Button>
            ))}
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <Card className="relative overflow-hidden border-border">
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/6963105/pexels-photo-6963105.jpeg)',
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(0,0,0,0.8)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Advanced Security Analytics
              </h2>
              <p className="text-muted-foreground">
                Generate comprehensive reports and track security metrics across your infrastructure
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Threats Detected</p>
                <p className="text-2xl font-bold text-foreground">{metrics.threatsDetected.total}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-threat-high" />
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(metrics.threatsDetected.trend) === TrendingUp ? (
                <TrendingUp className={`h-4 w-4 ${getTrendColor(metrics.threatsDetected.trend)}`} />
              ) : (
                <TrendingDown className={`h-4 w-4 ${getTrendColor(metrics.threatsDetected.trend)}`} />
              )}
              <span className="text-sm text-muted-foreground">
                {metrics.threatsDetected.blocked} blocked
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Critical Vulnerabilities</p>
                <p className="text-2xl font-bold text-threat-critical">{metrics.vulnerabilities.critical}</p>
              </div>
              <Target className="h-8 w-8 text-threat-critical" />
            </div>
            <div className="text-sm text-muted-foreground">
              {metrics.vulnerabilities.high} high, {metrics.vulnerabilities.medium} medium
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold text-success">{metrics.compliance.score}%</p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
            <Progress value={metrics.compliance.score} className="h-2" />
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Pending Incidents</p>
                <p className="text-2xl font-bold text-threat-medium">{metrics.incidents.pending}</p>
              </div>
              <Activity className="h-8 w-8 text-threat-medium" />
            </div>
            <div className="text-sm text-muted-foreground">
              Avg resolution: {metrics.incidents.avgResolutionTime}h
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Framework Status */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Framework Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.compliance.frameworks.map((framework) => (
              <Card key={framework.name} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{framework.name}</span>
                    {framework.compliant ? (
                      <Lock className="h-4 w-4 text-success" />
                    ) : (
                      <Unlock className="h-4 w-4 text-threat-high" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Progress value={framework.score} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Score</span>
                      <span className={framework.compliant ? 'text-success' : 'text-threat-high'}>
                        {framework.score}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vulnerability Breakdown */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Vulnerability Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-threat-critical mb-1">
                {metrics.vulnerabilities.critical}
              </div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-threat-high mb-1">
                {metrics.vulnerabilities.high}
              </div>
              <div className="text-sm text-muted-foreground">High</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-threat-medium mb-1">
                {metrics.vulnerabilities.medium}
              </div>
              <div className="text-sm text-muted-foreground">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-threat-low mb-1">
                {metrics.vulnerabilities.low}
              </div>
              <div className="text-sm text-muted-foreground">Low</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Security Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => {
              const TypeIcon = getTypeIcon(report.type);
              return (
                <Card key={report.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-5 w-5" />
                          <Badge variant="outline" className="text-xs">
                            {report.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{report.title}</h3>
                            <Badge variant="outline" className={getSeverityColor(report.severity)}>
                              {report.severity}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {report.generatedDate.toLocaleDateString()}
                            </div>
                            <div>
                              {report.findings} findings
                            </div>
                            <div>
                              {report.recommendations} recommendations
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
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
