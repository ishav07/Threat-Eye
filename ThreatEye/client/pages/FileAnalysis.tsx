import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Trash2,
  FileX,
  Zap,
  Target,
  Activity
} from 'lucide-react';
import { UploadedFile, FileAnalysisResult, ScanSession } from '@shared/fileAnalysis';
import { fileAnalysisEngine } from '@/lib/fileAnalysisEngine';

export default function FileAnalysis() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [analysisResults, setAnalysisResults] = useState<FileAnalysisResult[]>([]);
  const [currentSession, setCurrentSession] = useState<ScanSession | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
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
    });
  }, []);

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
  };

  const generateFileHash = async (buffer: ArrayBuffer): Promise<string> => {
    // Simple hash simulation for demo purposes
    const bytes = new Uint8Array(buffer);
    let hash = '';
    for (let i = 0; i < Math.min(bytes.length, 32); i++) {
      hash += bytes[i].toString(16).padStart(2, '0');
    }
    return hash.slice(0, 16);
  };

  const startAnalysis = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsScanning(true);
    setAnalysisResults([]);
    
    try {
      await fileAnalysisEngine.analyzeFiles(uploadedFiles);
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsScanning(false);
    }
  };

  const clearResults = () => {
    setUploadedFiles([]);
    setAnalysisResults([]);
    setCurrentSession(null);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-threat-critical';
      case 'HIGH': return 'text-threat-high';
      case 'MEDIUM': return 'text-threat-medium';
      case 'LOW': return 'text-threat-low';
      default: return 'text-foreground';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">File Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Upload files for comprehensive malware analysis and threat detection
          </p>
        </div>
        <div className="flex gap-3">
          {analysisResults.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearResults}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Results
            </Button>
          )}
          <Button 
            onClick={startAnalysis}
            disabled={uploadedFiles.length === 0 || isScanning}
            className="gap-2"
          >
            <Zap className="h-4 w-4" />
            {isScanning ? 'Analyzing...' : 'Start Analysis'}
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
                Advanced File Threat Analysis
              </h2>
              <p className="text-muted-foreground">
                Multi-layered scanning with behavioral analysis and threat intelligence
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* File Upload Area */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Files for Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Drop files here or click to browse</p>
              <p className="text-sm text-muted-foreground">
                Supports all file types • Max 100MB per file
              </p>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">Uploaded Files ({uploadedFiles.length})</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <Card key={file.id} className="border-border">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {file.uploadedAt.toLocaleTimeString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan Progress */}
      {currentSession && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Scan Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyber-blue">{currentSession.totalFiles}</div>
                  <div className="text-sm text-muted-foreground">Total Files</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{currentSession.completedFiles}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-threat-high">{currentSession.threatsFound}</div>
                  <div className="text-sm text-muted-foreground">Threats Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{currentSession.cleanFiles}</div>
                  <div className="text-sm text-muted-foreground">Clean Files</div>
                </div>
              </div>
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <div className="space-y-6">
          {analysisResults.map((result) => {
            const ThreatIcon = getThreatIcon(result.overallThreat);
            return (
              <Card key={result.id} className={`border ${getThreatColor(result.overallThreat)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ThreatIcon className="h-6 w-6" />
                      <div>
                        <span className="text-lg">{result.file.name}</span>
                        <Badge variant="outline" className={`ml-2 ${getThreatColor(result.overallThreat)}`}>
                          {result.overallThreat}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{result.riskScore}%</div>
                      <div className="text-sm text-muted-foreground">Risk Score</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Scan Progress */}
                  {result.status === 'SCANNING' && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Scanning Progress</span>
                        <span>{result.scanProgress}%</span>
                      </div>
                      <Progress value={result.scanProgress} className="h-2" />
                    </div>
                  )}

                  {/* File Properties */}
                  <div>
                    <h3 className="font-medium mb-3">File Properties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <span className="ml-2">{formatFileSize(result.file.size)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-2">{result.fileProperties.fileType}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Entropy:</span>
                        <span className="ml-2">{result.fileProperties.entropy.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hash:</span>
                        <span className="ml-2 font-mono">{result.file.hash}</span>
                      </div>
                    </div>
                  </div>

                  {/* Detections */}
                  {result.status === 'COMPLETED' && (
                    <div>
                      <h3 className="font-medium mb-3">Detections</h3>
                      <div className="space-y-3">
                        {[
                          ...result.detections.malwareSignatures,
                          ...result.detections.suspiciousPatterns,
                          ...result.detections.fileIntegrity,
                          ...result.detections.behaviorAnalysis
                        ].map((detection) => (
                          <Alert key={detection.id} className="border-border">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{detection.category}</span>
                                    <Badge variant="outline" className={getSeverityColor(detection.severity)}>
                                      {detection.severity}
                                    </Badge>
                                  </div>
                                  <p className="text-sm mt-1">{detection.description}</p>
                                </div>
                                <div className="text-right text-sm">
                                  <div className="font-medium">{detection.confidence}%</div>
                                  <div className="text-muted-foreground">Confidence</div>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                                <strong>Evidence:</strong> {detection.evidence}
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">Recommendations</h3>
                      <div className="space-y-2">
                        {result.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <span>{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
