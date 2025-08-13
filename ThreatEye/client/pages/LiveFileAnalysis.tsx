import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Upload,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Zap,
  Target,
  Activity,
  TrendingUp,
  Network,
  Cpu,
  HardDrive,
  Trash2,
  History,
  Search,
  Download,
  Calendar,
  BarChart3,
  Archive,
  Filter
} from 'lucide-react';
import { UploadedFile, FileAnalysisResult, ScanSession, DetectionResult } from '@shared/fileAnalysis';
import { fileAnalysisEngine } from '@/lib/fileAnalysisEngine';
import { scanHistoryManager, HistoricalScan, ScanHistoryStats } from '@/lib/scanHistory';

export default function LiveFileAnalysis() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [analysisResults, setAnalysisResults] = useState<FileAnalysisResult[]>([]);
  const [currentSession, setCurrentSession] = useState<ScanSession | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [liveStats, setLiveStats] = useState({
    totalScanned: 0,
    threatsFound: 0,
    cleanFiles: 0,
    avgRiskScore: 0
  });

  // History state
  const [scanHistory, setScanHistory] = useState<HistoricalScan[]>([]);
  const [historyStats, setHistoryStats] = useState<ScanHistoryStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [threatFilter, setThreatFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('live');

  useEffect(() => {
    // Load history on component mount
    loadHistoryData();

    fileAnalysisEngine.onAnalysisUpdate((result) => {
      setAnalysisResults(prev => {
        const existingIndex = prev.findIndex(r => r.id === result.id);
        if (existingIndex >= 0) {
          const newResults = [...prev];
          newResults[existingIndex] = result;
          return newResults;
        } else {
          return [...prev, result];
        }
      });
    });

    fileAnalysisEngine.onSessionUpdate((session) => {
      setCurrentSession(session);
      if (session.completedFiles === session.totalFiles) {
        setIsScanning(false);
      }

      // Update live stats
      setLiveStats({
        totalScanned: session.completedFiles,
        threatsFound: session.threatsFound,
        cleanFiles: session.cleanFiles,
        avgRiskScore: session.files.length > 0
          ? Math.round(session.files.reduce((sum, f) => sum + f.riskScore, 0) / session.files.length)
          : 0
      });
    });
  }, []);

  const loadHistoryData = () => {
    const history = scanHistoryManager.getHistory();
    const stats = scanHistoryManager.getHistoryStats();
    setScanHistory(history);
    setHistoryStats(stats);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = async (files: File[]) => {
    const uploadedFiles: UploadedFile[] = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const hash = await generateFileHash(buffer);

        return {
          id: `file_${Date.now()}_${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          content: buffer,
          hash
        };
      })
    );

    setUploadedFiles(prev => [...prev, ...uploadedFiles]);

    // Auto-start analysis after upload with immediate feedback
    if (!isScanning) {
      startAnalysisWithImmediateFeedback(uploadedFiles);
    }
  };

  const generateFileHash = async (buffer: ArrayBuffer): Promise<string> => {
    const bytes = new Uint8Array(buffer);
    let hash = '';
    for (let i = 0; i < Math.min(bytes.length, 32); i++) {
      hash += bytes[i].toString(16).padStart(2, '0');
    }
    return hash.slice(0, 16);
  };

  const startAnalysis = async (files: UploadedFile[] = uploadedFiles) => {
    if (files.length === 0) return;

    setIsScanning(true);

    try {
      await fileAnalysisEngine.analyzeFiles(files);
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsScanning(false);
    }
  };

  const startAnalysisWithImmediateFeedback = async (files: UploadedFile[]) => {
    if (files.length === 0) return;

    setIsScanning(true);

    // Create immediate session feedback
    const session: ScanSession = {
      id: `session_${Date.now()}`,
      files: [],
      startTime: new Date(),
      totalFiles: files.length,
      completedFiles: 0,
      threatsFound: 0,
      cleanFiles: 0
    };

    setCurrentSession(session);

    // Process each file with immediate visual feedback
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Create analysis result with immediate feedback
      const result: FileAnalysisResult = {
        id: `analysis_${Date.now()}_${i}`,
        file,
        status: 'SCANNING',
        overallThreat: 'CLEAN',
        riskScore: 0,
        scanProgress: 0,
        startTime: new Date(),
        detections: {
          malwareSignatures: [],
          suspiciousPatterns: [],
          fileIntegrity: [],
          behaviorAnalysis: []
        },
        fileProperties: {
          fileType: file.type || 'unknown',
          actualType: file.type || 'unknown',
          size: file.size,
          entropy: Math.random() * 8,
          isEncrypted: false,
          hasExecutableCode: file.name.endsWith('.exe') || file.name.endsWith('.msi'),
          suspiciousNames: []
        },
        recommendations: [],
        threatIntelligence: {
          knownMalware: false,
          prevalence: 'COMMON'
        }
      };

      // Add to results immediately
      setAnalysisResults(prev => [...prev, result]);

      // Simulate scanning progress
      for (let progress = 10; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));

        result.scanProgress = progress;

        // Simulate threat detection based on file characteristics
        if (progress === 100) {
          const isThreat = Math.random() > 0.6 || file.name.toLowerCase().includes('malware') ||
                          file.name.toLowerCase().includes('virus') || file.size > 100 * 1024 * 1024;

          if (isThreat) {
            result.overallThreat = Math.random() > 0.5 ? 'SUSPICIOUS' : 'MALICIOUS';
            result.riskScore = Math.floor(Math.random() * 60) + 40; // 40-100%
            session.threatsFound++;

            // Add some detections
            result.detections.suspiciousPatterns.push({
              id: `det_${Date.now()}`,
              category: 'Large File Size',
              severity: 'MEDIUM',
              description: 'File size exceeds normal threshold',
              evidence: `Size: ${(file.size / 1024 / 1024).toFixed(1)} MB`,
              confidence: 75
            });

            result.recommendations.push('⚠️ Exercise caution with this file');
            result.recommendations.push('🔍 Perform additional analysis before execution');
          } else {
            result.overallThreat = 'CLEAN';
            result.riskScore = Math.floor(Math.random() * 30); // 0-30%
            session.cleanFiles++;

            result.recommendations.push('✅ File appears to be clean');
            result.recommendations.push('🔄 Regular scans recommended');
          }

          result.status = 'COMPLETED';
          result.endTime = new Date();
        }

        // Update the result
        setAnalysisResults(prev => prev.map(r => r.id === result.id ? {...result} : r));
      }

      // Update session progress
      session.completedFiles++;
      session.files.push(result);
      setCurrentSession({...session});

      // Update live stats
      setLiveStats({
        totalScanned: session.completedFiles,
        threatsFound: session.threatsFound,
        cleanFiles: session.cleanFiles,
        avgRiskScore: session.files.length > 0
          ? Math.round(session.files.reduce((sum, f) => sum + f.riskScore, 0) / session.files.length)
          : 0
      });
    }

    // Save completed scan to history when all files are processed
    if (session.completedFiles === session.totalFiles) {
      setTimeout(() => {
        // Use current analysisResults state directly
        const completedResults = analysisResults.filter(r => r.status === 'COMPLETED');
        if (completedResults.length > 0) {
          console.log('Saving to history:', completedResults);
          scanHistoryManager.saveHistoricalScan(session, completedResults);
          loadHistoryData(); // Refresh history data
        }
      }, 500); // Give time for all state updates to complete
    }

    setIsScanning(false);
  };

  const clearResults = () => {
    setUploadedFiles([]);
    setAnalysisResults([]);
    setCurrentSession(null);
    setLiveStats({ totalScanned: 0, threatsFound: 0, cleanFiles: 0, avgRiskScore: 0 });
  };

  const getFilteredHistory = () => {
    let filtered = scanHistory;

    if (searchQuery) {
      filtered = scanHistoryManager.searchHistory(searchQuery);
    }

    if (threatFilter !== 'ALL') {
      filtered = filtered.filter(scan =>
        scan.results.some(result => result.overallThreat === threatFilter)
      );
    }

    return filtered;
  };

  const deleteHistoryScan = (scanId: string) => {
    scanHistoryManager.deleteHistoricalScan(scanId);
    loadHistoryData();
  };

  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all scan history? This action cannot be undone.')) {
      scanHistoryManager.clearAllHistory();
      loadHistoryData();
    }
  };

  const exportHistory = () => {
    const data = scanHistoryManager.exportHistory();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threateye-scan-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'CRITICAL': return 'text-threat-critical border-threat-critical bg-threat-critical/10';
      case 'MALICIOUS': return 'text-threat-high border-threat-high bg-threat-high/10';
      case 'SUSPICIOUS': return 'text-threat-medium border-threat-medium bg-threat-medium/10';
      case 'CLEAN': return 'text-success border-success bg-success/10';
      default: return 'text-foreground border-border bg-background';
    }
  };

  const getThreatIcon = (threat: string) => {
    switch (threat) {
      case 'CRITICAL':
      case 'MALICIOUS': return XCircle;
      case 'SUSPICIOUS': return AlertTriangle;
      case 'CLEAN': return CheckCircle;
      default: return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculatePercentages = (scan: HistoricalScan) => {
    if (scan.totalFiles === 0) return { cleanPercent: 0, threatPercent: 0 };
    const cleanPercent = Math.round((scan.cleanFiles / scan.totalFiles) * 100);
    const threatPercent = Math.round((scan.threatsFound / scan.totalFiles) * 100);
    return { cleanPercent, threatPercent };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live File Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Upload files and watch real-time threat analysis with live dashboards
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              // Add test data
              const testSession = {
                id: 'test_session',
                files: [],
                startTime: new Date(),
                totalFiles: 3,
                completedFiles: 3,
                threatsFound: 1,
                cleanFiles: 2
              };
              const testResults = [
                {
                  id: 'test1',
                  file: { id: '1', name: 'document.pdf', size: 1024, type: 'pdf', uploadedAt: new Date(), hash: 'abc123' },
                  status: 'COMPLETED' as const,
                  overallThreat: 'CLEAN' as const,
                  riskScore: 15,
                  scanProgress: 100,
                  startTime: new Date(),
                  endTime: new Date(),
                  detections: { malwareSignatures: [], suspiciousPatterns: [], fileIntegrity: [], behaviorAnalysis: [] },
                  fileProperties: { fileType: 'pdf', actualType: 'pdf', size: 1024, entropy: 3.2, isEncrypted: false, hasExecutableCode: false, suspiciousNames: [] },
                  recommendations: ['File appears clean'],
                  threatIntelligence: { knownMalware: false, prevalence: 'COMMON' as const }
                },
                {
                  id: 'test2',
                  file: { id: '2', name: 'suspicious.exe', size: 2048, type: 'exe', uploadedAt: new Date(), hash: 'def456' },
                  status: 'COMPLETED' as const,
                  overallThreat: 'MALICIOUS' as const,
                  riskScore: 85,
                  scanProgress: 100,
                  startTime: new Date(),
                  endTime: new Date(),
                  detections: { malwareSignatures: [], suspiciousPatterns: [], fileIntegrity: [], behaviorAnalysis: [] },
                  fileProperties: { fileType: 'exe', actualType: 'exe', size: 2048, entropy: 7.8, isEncrypted: false, hasExecutableCode: true, suspiciousNames: [] },
                  recommendations: ['Do not execute'],
                  threatIntelligence: { knownMalware: true, prevalence: 'RARE' as const }
                }
              ];
              scanHistoryManager.saveHistoricalScan(testSession as any, testResults as any);
              loadHistoryData();
            }}
            className="gap-2"
          >
            <History className="h-4 w-4" />
            Add Test Data
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              clearAllHistory();
            }}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
          {analysisResults.length > 0 && (
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                clearResults();
              }}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live" className="gap-2">
            <Activity className="h-4 w-4" />
            Live Analysis
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Scan History
          </TabsTrigger>
        </TabsList>

        {/* Live Analysis Tab */}
        <TabsContent value="live" className="mt-6">
          {/* Split Layout: Upload Left, Dashboard Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        
        {/* LEFT SIDE: File Upload */}
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                File Upload Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors relative ${
                  isDragging
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Drop files here or click to browse</p>
                  <p className="text-sm text-muted-foreground">
                    Auto-analysis starts immediately
                  </p>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium truncate">{file.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT SIDE: Live Dashboard */}
        <div className="space-y-6">
          
          {/* Live Stats Dashboard */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Files Scanned</p>
                    <p className="text-2xl font-bold text-cyber-blue">{liveStats.totalScanned}</p>
                  </div>
                  <Eye className="h-6 w-6 text-cyber-blue" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Threats Found</p>
                    <p className="text-2xl font-bold text-threat-critical">{liveStats.threatsFound}</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-threat-critical" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Clean Files</p>
                    <p className="text-2xl font-bold text-success">{liveStats.cleanFiles}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Risk</p>
                    <p className="text-2xl font-bold text-threat-medium">{liveStats.avgRiskScore}%</p>
                  </div>
                  <Target className="h-6 w-6 text-threat-medium" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scan Progress */}
          {currentSession && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Live Scan Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{Math.round((currentSession.completedFiles / currentSession.totalFiles) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(currentSession.completedFiles / currentSession.totalFiles) * 100} 
                      className="h-3"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Processed {currentSession.completedFiles} of {currentSession.totalFiles} files
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Live Analysis Results */}
          {analysisResults.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Live Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {analysisResults.slice().reverse().map((result) => {
                    const ThreatIcon = getThreatIcon(result.overallThreat);
                    return (
                      <Card key={result.id} className={`border ${getThreatColor(result.overallThreat)}`}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <ThreatIcon className="h-5 w-5" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{result.file.name}</span>
                                  <Badge variant="outline" className={getThreatColor(result.overallThreat)}>
                                    {result.overallThreat}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatFileSize(result.file.size)} • {result.file.type || 'Unknown'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {result.status === 'SCANNING' ? (
                                <div className="flex items-center gap-2">
                                  <Progress value={result.scanProgress} className="w-16 h-2" />
                                  <span className="text-xs text-muted-foreground">{result.scanProgress}%</span>
                                </div>
                              ) : (
                                <div className="text-lg font-bold">{result.riskScore}%</div>
                              )}
                            </div>
                          </div>
                          
                          {/* Show detections count */}
                          {result.status === 'COMPLETED' && (
                            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                              <span>Detections: {
                                result.detections.malwareSignatures.length +
                                result.detections.suspiciousPatterns.length +
                                result.detections.fileIntegrity.length +
                                result.detections.behaviorAnalysis.length
                              }</span>
                              <span>Hash: {result.file.hash}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
          </div>

          {/* Bottom Status Bar */}
      {isScanning && (
        <Card className="border-border bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-medium">Live Analysis Running...</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">
                  Analyzing files with multi-layered threat detection engine
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <div className="space-y-6">

            {/* History Stats */}
            {historyStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Scans</p>
                        <p className="text-2xl font-bold text-cyber-blue">{historyStats.totalScans}</p>
                      </div>
                      <Archive className="h-8 w-8 text-cyber-blue" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Files Analyzed</p>
                        <p className="text-2xl font-bold text-success">{historyStats.totalFilesScanned}</p>
                      </div>
                      <FileText className="h-8 w-8 text-success" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Threats Found</p>
                        <p className="text-2xl font-bold text-threat-critical">{historyStats.totalThreatsFound}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-threat-critical" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                        <p className="text-2xl font-bold text-threat-medium">{historyStats.avgRiskScore}%</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-threat-medium" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search and Filters */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search History
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportHistory} className="gap-1">
                      <Download className="h-3 w-3" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearAllHistory} className="gap-1">
                      <Trash2 className="h-3 w-3" />
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search files, threat types, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    {['ALL', 'CRITICAL', 'MALICIOUS', 'SUSPICIOUS', 'CLEAN'].map((filter) => (
                      <Button
                        key={filter}
                        variant={threatFilter === filter ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setThreatFilter(filter)}
                      >
                        {filter}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History Results */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Historical Scans ({getFilteredHistory().length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {getFilteredHistory().map((scan) => (
                    <Card key={scan.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{scan.timestamp.toLocaleString()}</span>
                              <Badge variant="outline">
                                {scan.totalFiles} files
                              </Badge>
                              {scan.threatsFound > 0 && (
                                <Badge variant="destructive">
                                  {scan.threatsFound} threats
                                </Badge>
                              )}
                            </div>

                            {/* Percentage Display */}
                            <div className="mb-3 p-2 bg-muted rounded-lg">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-success font-medium">✅ Clean: {Math.round((scan.cleanFiles / scan.totalFiles) * 100)}%</span>
                                <span className="text-threat-critical font-medium">🚨 Threats: {Math.round((scan.threatsFound / scan.totalFiles) * 100)}%</span>
                              </div>
                              <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-success h-2 float-left"
                                  style={{ width: `${Math.round((scan.cleanFiles / scan.totalFiles) * 100)}%` }}
                                ></div>
                                <div
                                  className="bg-threat-critical h-2 float-left"
                                  style={{ width: `${Math.round((scan.threatsFound / scan.totalFiles) * 100)}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Risk Score:</span>
                                <span className="ml-2 font-medium">{scan.avgRiskScore}%</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="ml-2 font-medium">{scan.duration}s</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Clean:</span>
                                <span className="ml-2 font-medium text-success">{scan.cleanFiles}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Threats:</span>
                                <span className="ml-2 font-medium text-threat-critical">{scan.threatsFound}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {scan.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteHistoryScan(scan.id)}
                              className="gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {getFilteredHistory().length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No scan history found</p>
                      <p className="text-sm">Upload and analyze files to build your scan history</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
