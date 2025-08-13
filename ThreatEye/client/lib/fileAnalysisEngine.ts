import { 
  UploadedFile, 
  FileAnalysisResult, 
  DetectionResult, 
  ScanSession 
} from '@shared/fileAnalysis';

class FileAnalysisEngine {
  private listeners: ((result: FileAnalysisResult) => void)[] = [];
  private sessionListeners: ((session: ScanSession) => void)[] = [];
  private activeSessions: Map<string, ScanSession> = new Map();

  // Known malicious file patterns
  private maliciousPatterns = [
    'backdoor', 'trojan', 'virus', 'malware', 'keylogger', 'ransomware',
    'cryptominer', 'rootkit', 'spyware', 'adware', 'exploit'
  ];

  private suspiciousExtensions = [
    '.exe', '.scr', '.bat', '.cmd', '.com', '.pif', '.vbs', '.js', 
    '.jar', '.zip', '.rar', '.7z'
  ];

  private maliciousHashes = [
    'a1b2c3d4e5f6789',
    'malware123456789',
    'trojan987654321',
    'backdoor111111111'
  ];

  onAnalysisUpdate(callback: (result: FileAnalysisResult) => void) {
    this.listeners.push(callback);
  }

  onSessionUpdate(callback: (session: ScanSession) => void) {
    this.sessionListeners.push(callback);
  }

  private notifyListeners(result: FileAnalysisResult) {
    this.listeners.forEach(listener => listener(result));
  }

  private notifySessionListeners(session: ScanSession) {
    this.sessionListeners.forEach(listener => listener(session));
  }

  async analyzeFiles(files: UploadedFile[]): Promise<string> {
    const sessionId = `session_${Date.now()}`;
    const session: ScanSession = {
      id: sessionId,
      files: [],
      startTime: new Date(),
      totalFiles: files.length,
      completedFiles: 0,
      threatsFound: 0,
      cleanFiles: 0
    };

    this.activeSessions.set(sessionId, session);
    this.notifySessionListeners(session);

    // Analyze each file
    for (const file of files) {
      const result = await this.analyzeFile(file);
      session.files.push(result);
      
      if (result.overallThreat !== 'CLEAN') {
        session.threatsFound++;
      } else {
        session.cleanFiles++;
      }
      
      session.completedFiles++;
      this.notifySessionListeners(session);
    }

    return sessionId;
  }

  async analyzeFile(file: UploadedFile): Promise<FileAnalysisResult> {
    const result: FileAnalysisResult = {
      id: `analysis_${Date.now()}_${Math.random()}`,
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
        actualType: this.detectFileType(file.name),
        size: file.size,
        entropy: Math.random() * 8,
        isEncrypted: false,
        hasExecutableCode: false,
        suspiciousNames: []
      },
      recommendations: [],
      threatIntelligence: {
        knownMalware: false,
        prevalence: 'COMMON'
      }
    };

    this.notifyListeners(result);

    // Simulate scanning progress
    for (let progress = 10; progress <= 100; progress += 20) {
      await this.delay(300);
      result.scanProgress = progress;
      
      // Perform different scan stages
      if (progress === 30) {
        await this.scanForMalwareSignatures(result);
      } else if (progress === 50) {
        await this.scanForSuspiciousPatterns(result);
      } else if (progress === 70) {
        await this.analyzeFileIntegrity(result);
      } else if (progress === 90) {
        await this.performBehaviorAnalysis(result);
      }
      
      this.notifyListeners(result);
    }

    // Calculate final risk score and threat level
    this.calculateFinalRisk(result);
    result.status = 'COMPLETED';
    result.endTime = new Date();
    this.notifyListeners(result);

    return result;
  }

  private async scanForMalwareSignatures(result: FileAnalysisResult) {
    const file = result.file;
    
    // Check against known malicious hashes
    if (this.maliciousHashes.includes(file.hash)) {
      result.detections.malwareSignatures.push({
        id: `sig_${Date.now()}`,
        category: 'Known Malware Hash',
        severity: 'CRITICAL',
        description: 'File hash matches known malware signature',
        evidence: `Hash: ${file.hash}`,
        confidence: 98
      });
      result.threatIntelligence.knownMalware = true;
      result.threatIntelligence.familyName = 'Generic.Malware';
    }

    // Check filename for malicious patterns
    const fileName = file.name.toLowerCase();
    for (const pattern of this.maliciousPatterns) {
      if (fileName.includes(pattern)) {
        result.detections.malwareSignatures.push({
          id: `sig_${Date.now()}_${Math.random()}`,
          category: 'Malicious Filename Pattern',
          severity: 'HIGH',
          description: `Filename contains suspicious pattern: ${pattern}`,
          evidence: `Filename: ${file.name}`,
          confidence: 85
        });
      }
    }

    // Simulate signature-based detection for executables
    if (this.suspiciousExtensions.some(ext => fileName.endsWith(ext))) {
      result.fileProperties.hasExecutableCode = true;
      
      if (Math.random() > 0.7) { // 30% chance of finding malware in executables
        result.detections.malwareSignatures.push({
          id: `sig_${Date.now()}_${Math.random()}`,
          category: 'Malware Signature',
          severity: 'CRITICAL',
          description: 'File contains known malware signature',
          evidence: 'Binary pattern match at offset 0x1234',
          confidence: 95
        });
      }
    }
  }

  private async scanForSuspiciousPatterns(result: FileAnalysisResult) {
    const file = result.file;
    
    // Check for suspicious file extensions
    const fileExt = file.name.toLowerCase().split('.').pop();
    if (this.suspiciousExtensions.includes(`.${fileExt}`)) {
      result.detections.suspiciousPatterns.push({
        id: `pat_${Date.now()}`,
        category: 'Suspicious File Extension',
        severity: 'MEDIUM',
        description: `File has potentially dangerous extension: .${fileExt}`,
        evidence: `Extension: .${fileExt}`,
        confidence: 70
      });
    }

    // Check for double extensions
    const parts = file.name.split('.');
    if (parts.length > 2) {
      result.detections.suspiciousPatterns.push({
        id: `pat_${Date.now()}_${Math.random()}`,
        category: 'Double Extension',
        severity: 'HIGH',
        description: 'File uses double extension, common in malware',
        evidence: `Filename: ${file.name}`,
        confidence: 80
      });
    }

    // Check file size anomalies
    if (file.size < 1024 && file.name.endsWith('.exe')) {
      result.detections.suspiciousPatterns.push({
        id: `pat_${Date.now()}_${Math.random()}`,
        category: 'Size Anomaly',
        severity: 'MEDIUM',
        description: 'Executable file unusually small',
        evidence: `Size: ${file.size} bytes`,
        confidence: 65
      });
    }

    if (file.size > 100 * 1024 * 1024) { // > 100MB
      result.detections.suspiciousPatterns.push({
        id: `pat_${Date.now()}_${Math.random()}`,
        category: 'Size Anomaly',
        severity: 'LOW',
        description: 'File unusually large, may contain hidden payload',
        evidence: `Size: ${(file.size / 1024 / 1024).toFixed(1)} MB`,
        confidence: 50
      });
    }
  }

  private async analyzeFileIntegrity(result: FileAnalysisResult) {
    const file = result.file;
    
    // Simulate entropy analysis
    const entropy = result.fileProperties.entropy;
    if (entropy > 7.5) {
      result.fileProperties.isEncrypted = true;
      result.detections.fileIntegrity.push({
        id: `int_${Date.now()}`,
        category: 'High Entropy',
        severity: 'MEDIUM',
        description: 'File has high entropy, may be encrypted or packed',
        evidence: `Entropy: ${entropy.toFixed(2)}`,
        confidence: 75
      });
    }

    // Check for file type mismatch
    const declaredType = file.type;
    const actualType = result.fileProperties.actualType;
    if (declaredType && actualType && declaredType !== actualType) {
      result.detections.fileIntegrity.push({
        id: `int_${Date.now()}_${Math.random()}`,
        category: 'Type Mismatch',
        severity: 'HIGH',
        description: 'File extension does not match actual file type',
        evidence: `Declared: ${declaredType}, Actual: ${actualType}`,
        confidence: 90
      });
    }
  }

  private async performBehaviorAnalysis(result: FileAnalysisResult) {
    const file = result.file;
    
    // Simulate behavior analysis for executables
    if (result.fileProperties.hasExecutableCode) {
      const behaviors = [
        'Network communication to suspicious domains',
        'Registry modification attempts',
        'File system monitoring',
        'Process injection techniques',
        'Anti-debugging mechanisms'
      ];

      // Randomly assign some behaviors for demo
      if (Math.random() > 0.6) {
        const behavior = behaviors[Math.floor(Math.random() * behaviors.length)];
        result.detections.behaviorAnalysis.push({
          id: `beh_${Date.now()}`,
          category: 'Suspicious Behavior',
          severity: 'HIGH',
          description: behavior,
          evidence: 'Static analysis of executable code',
          confidence: 82
        });
      }
    }

    // Check for suspicious strings or patterns
    if (Math.random() > 0.8) {
      result.detections.behaviorAnalysis.push({
        id: `beh_${Date.now()}_${Math.random()}`,
        category: 'Suspicious Strings',
        severity: 'MEDIUM',
        description: 'File contains suspicious text patterns',
        evidence: 'Encrypted strings, API calls, network URLs',
        confidence: 70
      });
    }
  }

  private calculateFinalRisk(result: FileAnalysisResult) {
    let riskScore = 0;
    let maxSeverity = 'CLEAN';

    // Calculate risk from all detections
    const allDetections = [
      ...result.detections.malwareSignatures,
      ...result.detections.suspiciousPatterns,
      ...result.detections.fileIntegrity,
      ...result.detections.behaviorAnalysis
    ];

    for (const detection of allDetections) {
      const severityScore = {
        'LOW': 10,
        'MEDIUM': 25,
        'HIGH': 50,
        'CRITICAL': 80
      }[detection.severity];

      riskScore += severityScore * (detection.confidence / 100);

      if (detection.severity === 'CRITICAL') maxSeverity = 'CRITICAL';
      else if (detection.severity === 'HIGH' && maxSeverity !== 'CRITICAL') maxSeverity = 'MALICIOUS';
      else if (detection.severity === 'MEDIUM' && !['CRITICAL', 'MALICIOUS'].includes(maxSeverity)) maxSeverity = 'SUSPICIOUS';
    }

    result.riskScore = Math.min(Math.round(riskScore), 100);
    
    // Determine overall threat level
    if (result.riskScore >= 80) {
      result.overallThreat = 'CRITICAL';
    } else if (result.riskScore >= 60) {
      result.overallThreat = 'MALICIOUS';
    } else if (result.riskScore >= 30) {
      result.overallThreat = 'SUSPICIOUS';
    } else {
      result.overallThreat = 'CLEAN';
    }

    // Generate recommendations
    this.generateRecommendations(result);
  }

  private generateRecommendations(result: FileAnalysisResult) {
    if (result.overallThreat === 'CRITICAL' || result.overallThreat === 'MALICIOUS') {
      result.recommendations.push('🚫 DO NOT EXECUTE this file - it contains malware');
      result.recommendations.push('🗑️ Delete the file immediately');
      result.recommendations.push('🔍 Scan your system for infections');
      result.recommendations.push('🛡️ Update antivirus signatures');
    } else if (result.overallThreat === 'SUSPICIOUS') {
      result.recommendations.push('⚠️ Exercise caution with this file');
      result.recommendations.push('🔍 Perform additional analysis before execution');
      result.recommendations.push('🏝️ Consider running in a sandboxed environment');
      result.recommendations.push('📋 Verify file source and authenticity');
    } else {
      result.recommendations.push('✅ File appears to be clean');
      result.recommendations.push('🔄 Regular scans recommended');
      result.recommendations.push('📊 Continue monitoring file behavior');
    }
  }

  private detectFileType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    const typeMap: { [key: string]: string } = {
      'exe': 'application/x-executable',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      'jpg': 'image/jpeg',
      'png': 'image/png',
      'txt': 'text/plain'
    };
    return typeMap[ext || ''] || 'application/octet-stream';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getSession(sessionId: string): ScanSession | undefined {
    return this.activeSessions.get(sessionId);
  }
}

export const fileAnalysisEngine = new FileAnalysisEngine();
