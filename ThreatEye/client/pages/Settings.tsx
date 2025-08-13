import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon,
  Shield,
  Bell,
  User,
  Network,
  Eye,
  Save,
  RefreshCw,
  AlertTriangle,
  Lock,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

interface SettingsConfig {
  general: {
    organizationName: string;
    adminEmail: string;
    alertPhoneNumber: string;
    timezone: string;
  };
  security: {
    autoBlockThreats: boolean;
    quarantineFiles: boolean;
    realTimeScanning: boolean;
    threatThreshold: number;
    sessionTimeout: number;
    twoFactorAuth: boolean;
  };
  monitoring: {
    networkMonitoring: boolean;
    fileMonitoring: boolean;
    processMonitoring: boolean;
    logRetentionDays: number;
    alertFrequency: string;
  };
  notifications: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    slackIntegration: boolean;
    criticalThreats: boolean;
    systemHealth: boolean;
    weeklyReports: boolean;
  };
}

const defaultSettings: SettingsConfig = {
  general: {
    organizationName: 'ThreatEye Security Corp',
    adminEmail: 'admin@threateye.com',
    alertPhoneNumber: '+1 (555) 123-4567',
    timezone: 'UTC-5 (EST)'
  },
  security: {
    autoBlockThreats: true,
    quarantineFiles: true,
    realTimeScanning: true,
    threatThreshold: 70,
    sessionTimeout: 30,
    twoFactorAuth: true
  },
  monitoring: {
    networkMonitoring: true,
    fileMonitoring: true,
    processMonitoring: true,
    logRetentionDays: 90,
    alertFrequency: 'immediate'
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    slackIntegration: true,
    criticalThreats: true,
    systemHealth: true,
    weeklyReports: true
  }
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsConfig>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSettings = (category: keyof SettingsConfig, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // In a real app, this would save to a backend
    console.log('Saving settings:', settings);
    setHasChanges(false);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure ThreatEye security policies and system preferences
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={resetSettings}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          <Button 
            onClick={saveSettings}
            disabled={!hasChanges}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <Card className="relative overflow-hidden border-border">
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/5475786/pexels-photo-5475786.jpeg)',
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(0,0,0,0.7)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                System Configuration
              </h2>
              <p className="text-muted-foreground">
                Customize ThreatEye to match your security requirements
              </p>
            </div>
          </div>
        </div>
      </Card>

      {hasChanges && (
        <Card className="border-threat-medium bg-threat-medium/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-threat-medium" />
              <span className="text-sm">You have unsaved changes. Remember to save your settings.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* General Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                value={settings.general.organizationName}
                onChange={(e) => updateSettings('general', 'organizationName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.general.adminEmail}
                onChange={(e) => updateSettings('general', 'adminEmail', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alertPhone">Alert Phone Number</Label>
              <Input
                id="alertPhone"
                value={settings.general.alertPhoneNumber}
                onChange={(e) => updateSettings('general', 'alertPhoneNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={settings.general.timezone}
                onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-block Threats</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically block detected threats
                  </p>
                </div>
                <Switch
                  checked={settings.security.autoBlockThreats}
                  onCheckedChange={(checked) => updateSettings('security', 'autoBlockThreats', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Quarantine Files</Label>
                  <p className="text-sm text-muted-foreground">
                    Isolate suspicious files automatically
                  </p>
                </div>
                <Switch
                  checked={settings.security.quarantineFiles}
                  onCheckedChange={(checked) => updateSettings('security', 'quarantineFiles', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Real-time Scanning</Label>
                  <p className="text-sm text-muted-foreground">
                    Continuous monitoring of system activities
                  </p>
                </div>
                <Switch
                  checked={settings.security.realTimeScanning}
                  onCheckedChange={(checked) => updateSettings('security', 'realTimeScanning', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin access
                  </p>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => updateSettings('security', 'twoFactorAuth', checked)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="threatThreshold">
                  Threat Detection Threshold ({settings.security.threatThreshold}%)
                </Label>
                <Input
                  id="threatThreshold"
                  type="range"
                  min="50"
                  max="100"
                  value={settings.security.threatThreshold}
                  onChange={(e) => updateSettings('security', 'threatThreshold', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Minimum risk score to trigger automatic response
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Monitoring Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Network Monitoring</Label>
                  <p className="text-sm text-muted-foreground">
                    Monitor all network connections
                  </p>
                </div>
                <Switch
                  checked={settings.monitoring.networkMonitoring}
                  onCheckedChange={(checked) => updateSettings('monitoring', 'networkMonitoring', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>File Monitoring</Label>
                  <p className="text-sm text-muted-foreground">
                    Track file system changes
                  </p>
                </div>
                <Switch
                  checked={settings.monitoring.fileMonitoring}
                  onCheckedChange={(checked) => updateSettings('monitoring', 'fileMonitoring', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Process Monitoring</Label>
                  <p className="text-sm text-muted-foreground">
                    Monitor running processes
                  </p>
                </div>
                <Switch
                  checked={settings.monitoring.processMonitoring}
                  onCheckedChange={(checked) => updateSettings('monitoring', 'processMonitoring', checked)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logRetention">Log Retention (days)</Label>
                <Input
                  id="logRetention"
                  type="number"
                  value={settings.monitoring.logRetentionDays}
                  onChange={(e) => updateSettings('monitoring', 'logRetentionDays', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alertFrequency">Alert Frequency</Label>
                <select
                  id="alertFrequency"
                  className="w-full p-2 border border-border rounded-md bg-background"
                  value={settings.monitoring.alertFrequency}
                  onChange={(e) => updateSettings('monitoring', 'alertFrequency', e.target.value)}
                >
                  <option value="immediate">Immediate</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Notification Channels</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <Label>Email Alerts</Label>
                </div>
                <Switch
                  checked={settings.notifications.emailAlerts}
                  onCheckedChange={(checked) => updateSettings('notifications', 'emailAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <Label>SMS Alerts</Label>
                </div>
                <Switch
                  checked={settings.notifications.smsAlerts}
                  onCheckedChange={(checked) => updateSettings('notifications', 'smsAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <Label>Slack Integration</Label>
                </div>
                <Switch
                  checked={settings.notifications.slackIntegration}
                  onCheckedChange={(checked) => updateSettings('notifications', 'slackIntegration', checked)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Alert Types</h3>
              <div className="flex items-center justify-between">
                <Label>Critical Threats</Label>
                <Switch
                  checked={settings.notifications.criticalThreats}
                  onCheckedChange={(checked) => updateSettings('notifications', 'criticalThreats', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>System Health</Label>
                <Switch
                  checked={settings.notifications.systemHealth}
                  onCheckedChange={(checked) => updateSettings('notifications', 'systemHealth', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Weekly Reports</Label>
                <Switch
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) => updateSettings('notifications', 'weeklyReports', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
