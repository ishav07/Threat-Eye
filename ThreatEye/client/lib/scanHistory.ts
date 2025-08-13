import { FileAnalysisResult, ScanSession, UploadedFile } from '@shared/fileAnalysis';

export interface HistoricalScan {
  id: string;
  sessionId: string;
  timestamp: Date;
  totalFiles: number;
  threatsFound: number;
  cleanFiles: number;
  avgRiskScore: number;
  duration: number; // in seconds
  results: FileAnalysisResult[];
  tags: string[];
  notes?: string;
}

export interface ScanHistoryStats {
  totalScans: number;
  totalFilesScanned: number;
  totalThreatsFound: number;
  avgRiskScore: number;
  mostDangerousFile: {
    name: string;
    riskScore: number;
    timestamp: Date;
  } | null;
  scanFrequency: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

class ScanHistoryManager {
  private readonly STORAGE_KEY = 'threateye_scan_history';
  private readonly MAX_HISTORY_ITEMS = 1000;

  saveHistoricalScan(session: ScanSession, results: FileAnalysisResult[]): void {
    // Calculate actual statistics from results
    const threatsFound = results.filter(r => r.overallThreat !== 'CLEAN').length;
    const cleanFiles = results.filter(r => r.overallThreat === 'CLEAN').length;
    const avgRiskScore = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.riskScore, 0) / results.length)
      : 0;

    const historicalScan: HistoricalScan = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: session.id,
      timestamp: session.startTime,
      totalFiles: results.length,
      threatsFound: threatsFound,
      cleanFiles: cleanFiles,
      avgRiskScore: avgRiskScore,
      duration: results.length > 0 && results[0].endTime
        ? Math.round((results[0].endTime.getTime() - session.startTime.getTime()) / 1000)
        : 0,
      results: results.map(r => ({
        ...r,
        // Clean up large binary data to save storage space
        file: {
          ...r.file,
          content: undefined
        }
      })),
      tags: this.generateAutoTags(results)
    };

    const history = this.getHistory();
    history.unshift(historicalScan);

    // Keep only the most recent items
    if (history.length > this.MAX_HISTORY_ITEMS) {
      history.splice(this.MAX_HISTORY_ITEMS);
    }

    this.saveHistory(history);
  }

  getHistory(): HistoricalScan[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
        results: item.results.map((r: any) => ({
          ...r,
          startTime: new Date(r.startTime),
          endTime: r.endTime ? new Date(r.endTime) : undefined,
          file: {
            ...r.file,
            uploadedAt: new Date(r.file.uploadedAt)
          }
        }))
      }));
    } catch (error) {
      console.error('Error loading scan history:', error);
      return [];
    }
  }

  getHistoryStats(): ScanHistoryStats {
    const history = this.getHistory();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalFilesScanned = history.reduce((sum, scan) => sum + scan.totalFiles, 0);
    const totalThreatsFound = history.reduce((sum, scan) => sum + scan.threatsFound, 0);

    // Calculate weighted average risk score based on all files
    let totalRiskSum = 0;
    let totalFileCount = 0;

    for (const scan of history) {
      totalRiskSum += scan.avgRiskScore * scan.totalFiles;
      totalFileCount += scan.totalFiles;
    }

    const overallAvgRiskScore = totalFileCount > 0
      ? Math.round(totalRiskSum / totalFileCount)
      : 0;

    // Find most dangerous file
    let mostDangerousFile = null;
    let maxRiskScore = 0;

    for (const scan of history) {
      for (const result of scan.results) {
        if (result.riskScore > maxRiskScore) {
          maxRiskScore = result.riskScore;
          mostDangerousFile = {
            name: result.file.name,
            riskScore: result.riskScore,
            timestamp: scan.timestamp
          };
        }
      }
    }

    return {
      totalScans: history.length,
      totalFilesScanned,
      totalThreatsFound,
      avgRiskScore: overallAvgRiskScore,
      mostDangerousFile,
      scanFrequency: {
        today: history.filter(scan => scan.timestamp >= today).length,
        thisWeek: history.filter(scan => scan.timestamp >= thisWeek).length,
        thisMonth: history.filter(scan => scan.timestamp >= thisMonth).length
      }
    };
  }

  searchHistory(query: string): HistoricalScan[] {
    const history = this.getHistory();
    const searchTerm = query.toLowerCase();
    
    return history.filter(scan => 
      scan.results.some(result => 
        result.file.name.toLowerCase().includes(searchTerm) ||
        result.overallThreat.toLowerCase().includes(searchTerm)
      ) ||
      scan.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      (scan.notes && scan.notes.toLowerCase().includes(searchTerm))
    );
  }

  filterHistoryByThreatLevel(threatLevel: string): HistoricalScan[] {
    const history = this.getHistory();
    
    if (threatLevel === 'ALL') return history;
    
    return history.filter(scan => 
      scan.results.some(result => result.overallThreat === threatLevel)
    );
  }

  filterHistoryByDateRange(startDate: Date, endDate: Date): HistoricalScan[] {
    const history = this.getHistory();
    
    return history.filter(scan => 
      scan.timestamp >= startDate && scan.timestamp <= endDate
    );
  }

  deleteHistoricalScan(scanId: string): void {
    const history = this.getHistory();
    const filtered = history.filter(scan => scan.id !== scanId);
    this.saveHistory(filtered);
  }

  clearAllHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  exportHistory(): string {
    const history = this.getHistory();
    return JSON.stringify(history, null, 2);
  }

  addNotesToScan(scanId: string, notes: string): void {
    const history = this.getHistory();
    const scanIndex = history.findIndex(scan => scan.id === scanId);
    
    if (scanIndex >= 0) {
      history[scanIndex].notes = notes;
      this.saveHistory(history);
    }
  }

  addTagsToScan(scanId: string, tags: string[]): void {
    const history = this.getHistory();
    const scanIndex = history.findIndex(scan => scan.id === scanId);
    
    if (scanIndex >= 0) {
      history[scanIndex].tags = [...new Set([...history[scanIndex].tags, ...tags])];
      this.saveHistory(history);
    }
  }

  private saveHistory(history: HistoricalScan[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving scan history:', error);
      // If storage is full, try to make space by removing oldest entries
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        const reduced = history.slice(0, Math.floor(history.length / 2));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reduced));
      }
    }
  }

  private generateAutoTags(results: FileAnalysisResult[]): string[] {
    const tags = new Set<string>();
    
    for (const result of results) {
      // Add threat level tag
      tags.add(result.overallThreat.toLowerCase());
      
      // Add file type tags
      const extension = result.file.name.split('.').pop()?.toLowerCase();
      if (extension) {
        tags.add(`file-${extension}`);
      }
      
      // Add risk level tags
      if (result.riskScore >= 80) tags.add('critical-risk');
      else if (result.riskScore >= 60) tags.add('high-risk');
      else if (result.riskScore >= 30) tags.add('medium-risk');
      else tags.add('low-risk');
      
      // Add detection type tags
      if (result.detections.malwareSignatures.length > 0) tags.add('malware-detected');
      if (result.detections.suspiciousPatterns.length > 0) tags.add('suspicious-patterns');
      if (result.detections.fileIntegrity.length > 0) tags.add('integrity-issues');
      if (result.detections.behaviorAnalysis.length > 0) tags.add('behavioral-threats');
    }
    
    return Array.from(tags);
  }
}

export const scanHistoryManager = new ScanHistoryManager();
