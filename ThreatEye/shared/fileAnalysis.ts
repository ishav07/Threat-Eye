export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  content?: ArrayBuffer;
  hash: string;
}

export interface FileAnalysisResult {
  id: string;
  file: UploadedFile;
  status: 'SCANNING' | 'COMPLETED' | 'FAILED';
  overallThreat: 'CLEAN' | 'SUSPICIOUS' | 'MALICIOUS' | 'CRITICAL';
  riskScore: number;
  scanProgress: number;
  startTime: Date;
  endTime?: Date;
  
  detections: {
    malwareSignatures: DetectionResult[];
    suspiciousPatterns: DetectionResult[];
    fileIntegrity: DetectionResult[];
    behaviorAnalysis: DetectionResult[];
  };
  
  fileProperties: {
    fileType: string;
    actualType: string;
    size: number;
    entropy: number;
    isEncrypted: boolean;
    hasExecutableCode: boolean;
    suspiciousNames: string[];
  };
  
  recommendations: string[];
  threatIntelligence: {
    knownMalware: boolean;
    familyName?: string;
    firstSeen?: Date;
    prevalence: 'RARE' | 'UNCOMMON' | 'COMMON' | 'WIDESPREAD';
  };
}

export interface DetectionResult {
  id: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  evidence: string;
  confidence: number;
}

export interface ScanSession {
  id: string;
  files: FileAnalysisResult[];
  startTime: Date;
  totalFiles: number;
  completedFiles: number;
  threatsFound: number;
  cleanFiles: number;
}
