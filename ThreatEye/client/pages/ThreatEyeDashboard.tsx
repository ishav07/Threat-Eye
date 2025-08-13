import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Eye, 
  Network, 
  FileText, 
  Cpu,
  TrendingUp,
  Lock,
  Unlock,
  Play,
  Square
} from 'lucide-react';
import { UpdateSimulation, SystemHealth, Anomaly } from '@shared/threateye';
import { threatEyeEngine } from '@/lib/threatEyeEngine';

export default function ThreatEyeDashboard() {
  const [currentSimulation, setCurrentSimulation] = useState<UpdateSimulation | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [simulations, setSimulations] = useState<UpdateSimulation[]>([]);

  useEffect(() => {
    threatEyeEngine.onUpdateChange((update) => {
      setCurrentSimulation(update);
      setIsRunning(update.status === 'RUNNING');
      
      // Update simulations list
      setSimulations(prev => {
        const existingIndex = prev.findIndex(s => s.id === update.id);
        if (existingIndex >= 0) {
          const newList = [...prev];
          newList[existingIndex] = update;
          return newList;
        } else {
          return [update, ...prev].slice(0, 10); // Keep last 10 simulations
        }
      });
    });

    threatEyeEngine.onHealthChange((health) => {
      setSystemHealth(health);
    });
  }, []);

  const runSafeUpdate = async () => {
    if (isRunning) return;
    setIsRunning(true);
    await threatEyeEngine.simulateSafeUpdate('SecurityPatch', '1.2.3');
    setIsRunning(false);
  };

  const runMaliciousUpdate = async () => {
    if (isRunning) return;
    setIsRunning(true);
    await threatEyeEngine.simulateMaliciousUpdate('TrojanUpdate', '2.0.1');
    setIsRunning(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-threat-critical';
      case 'HIGH': return 'text-threat-high';
      case 'MEDIUM': return 'text-threat-medium';
      case 'LOW': return 'text-threat-low';
      default: return 'text-foreground';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-threat-critical';
    if (score >= 60) return 'text-threat-high';
    if (score >= 40) return 'text-threat-medium';
    return 'text-threat-low';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">ThreatEye</h1>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            AI-Powered Supply Chain Protection
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Real-time cybersecurity monitoring and automated threat response system
        </p>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-success" />
              Safe Update Simulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Simulate a normal software update with typical network, file, and process activities.
            </p>
            <Button 
              onClick={runSafeUpdate} 
              disabled={isRunning}
              className="w-full bg-success hover:bg-success/90 text-success-foreground"
            >
              {isRunning ? 'Running...' : 'Run Safe Update'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-threat-critical" />
              Malicious Update Simulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Simulate a malicious software update containing supply chain attack vectors.
            </p>
            <Button 
              onClick={runMaliciousUpdate} 
              disabled={isRunning}
              variant="destructive"
              className="w-full"
            >
              {isRunning ? 'Running...' : 'Run Malicious Update'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Health Dashboard */}
      {systemHealth && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Risk</p>
                  <p className={`text-2xl font-bold ${getRiskScoreColor(systemHealth.overallRisk)}`}>
                    {systemHealth.overallRisk}%
                  </p>
                </div>
                <TrendingUp className={`h-8 w-8 ${getRiskScoreColor(systemHealth.overallRisk)}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Threats</p>
                  <p className="text-2xl font-bold text-threat-high">{systemHealth.activeThreats}</p>
                </div>
                <Eye className="h-8 w-8 text-threat-high" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Blocked Connections</p>
                  <p className="text-2xl font-bold text-success">{systemHealth.blockedConnections}</p>
                </div>
                <Lock className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monitored Processes</p>
                  <p className="text-2xl font-bold text-cyber-blue">{systemHealth.monitoredProcesses}</p>
                </div>
                <Activity className="h-8 w-8 text-cyber-blue" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Current Simulation */}
      {currentSimulation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Current Simulation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Update Name:</span>
                  <span className="font-medium">{currentSimulation.name} v{currentSimulation.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant={currentSimulation.type === 'MALICIOUS' ? 'destructive' : 'secondary'}>
                    {currentSimulation.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={
                    currentSimulation.status === 'BLOCKED' ? 'destructive' :
                    currentSimulation.status === 'COMPLETED' ? 'secondary' :
                    'default'
                  }>
                    {currentSimulation.status}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Risk Score:</span>
                    <span className={`font-bold ${getRiskScoreColor(currentSimulation.riskScore)}`}>
                      {currentSimulation.riskScore}%
                    </span>
                  </div>
                  <Progress 
                    value={currentSimulation.riskScore} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-cyber-blue" />
                    <span className="text-sm">Network Activities</span>
                  </div>
                  <span className="font-medium">{currentSimulation.activities.network.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cyber-purple" />
                    <span className="text-sm">File Operations</span>
                  </div>
                  <span className="font-medium">{currentSimulation.activities.files.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-threat-medium" />
                    <span className="text-sm">Process Activities</span>
                  </div>
                  <span className="font-medium">{currentSimulation.activities.processes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-threat-high" />
                    <span className="text-sm">Anomalies Detected</span>
                  </div>
                  <span className="font-medium text-threat-high">{currentSimulation.anomalies.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Anomalies and Actions */}
      {currentSimulation && (currentSimulation.anomalies.length > 0 || currentSimulation.actionsTriggered.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detected Anomalies */}
          {currentSimulation.anomalies.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-threat-high" />
                  Detected Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {currentSimulation.anomalies.map((anomaly) => (
                    <Alert key={anomaly.id} className="border-threat-high/20">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{anomaly.type} Anomaly</span>
                          <Badge variant="outline" className={getSeverityColor(anomaly.severity)}>
                            {anomaly.severity}
                          </Badge>
                        </div>
                        <p className="text-sm">{anomaly.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Score: {anomaly.score}/100
                        </p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Response Actions */}
          {currentSimulation.actionsTriggered.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-success" />
                  Auto-Response Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {currentSimulation.actionsTriggered.map((action) => (
                    <Alert key={action.id} className="border-success/20">
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{action.type.replace('_', ' ')}</span>
                          <Badge variant="outline" className={action.success ? 'text-success' : 'text-threat-high'}>
                            {action.success ? 'SUCCESS' : 'FAILED'}
                          </Badge>
                        </div>
                        <p className="text-sm">{action.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Target: {action.target}
                        </p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
