import type { Database } from '../lib/supabaseClient';

type Memory = Database['public']['Tables']['memories']['Row'];
type DailyConnection = Database['public']['Tables']['daily_connections']['Row'];
type Activity = Database['public']['Tables']['activities']['Row'];

export interface ExportData {
  memories: Memory[];
  dailyConnections: DailyConnection[];
  activities: Activity[];
  exportDate: string;
  userInfo: {
    name: string;
    email: string;
  };
}

export const exportFormats = {
  JSON: 'json',
  CSV: 'csv',
  PDF: 'pdf',
  HTML: 'html',
} as const;

export type ExportFormat = typeof exportFormats[keyof typeof exportFormats];

// Export to JSON
export const exportToJSON = (data: ExportData): string => {
  return JSON.stringify(data, null, 2);
};

// Export to CSV
export const exportToCSV = (data: ExportData): string => {
  const csvLines: string[] = [];
  
  // Memories CSV
  csvLines.push('=== MEMORIES ===');
  csvLines.push('Title,Description,Date,Type,Location');
  data.memories.forEach(memory => {
    csvLines.push(`"${memory.title}","${memory.description || ''}","${memory.date}","${memory.type || ''}","${memory.location || ''}"`);
  });
  
  csvLines.push(''); // Empty line
  
  // Daily Connections CSV
  csvLines.push('=== DAILY CONNECTIONS ===');
  csvLines.push('Date,Question,Your Answer,Partner Answer');
  data.dailyConnections.forEach(connection => {
    const answers = connection.answers as Record<string, string> || {};
    const userAnswer = Object.values(answers)[0] || '';
    const partnerAnswer = Object.values(answers)[1] || '';
    csvLines.push(`"${connection.date}","${connection.question}","${userAnswer}","${partnerAnswer}"`);
  });
  
  csvLines.push(''); // Empty line
  
  // Activities CSV
  csvLines.push('=== ACTIVITIES ===');
  csvLines.push('Title,Description,Date,Status,Category');
  data.activities.forEach(activity => {
    csvLines.push(`"${activity.title}","${activity.description || ''}","${activity.date}","${activity.status || ''}","${activity.category || ''}"`);
  });
  
  return csvLines.join('\n');
};

// Export to HTML
export const exportToHTML = (data: ExportData): string => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Together Apart - Relationship Data Export</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #F28B82;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .section {
            margin-bottom: 40px;
        }
        .section h2 {
            color: #F28B82;
            border-bottom: 1px solid #A5B4FC;
            padding-bottom: 10px;
        }
        .memory, .connection, .activity {
            background: #f8f9fa;
            border-left: 4px solid #A5B4FC;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        .memory h3, .connection h3, .activity h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .meta {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>💕 Together Apart</h1>
        <h2>Relationship Data Export</h2>
        <p>Exported on ${formatDate(data.exportDate)}</p>
        <p>For: ${data.userInfo.name} (${data.userInfo.email})</p>
    </div>

    <div class="section">
        <h2>📸 Memories (${data.memories.length})</h2>
        ${data.memories.map(memory => `
            <div class="memory">
                <h3>${memory.title}</h3>
                <div class="meta">
                    <strong>Date:</strong> ${formatDate(memory.date)} | 
                    <strong>Type:</strong> ${memory.type || 'General'} | 
                    <strong>Location:</strong> ${memory.location || 'Not specified'}
                </div>
                ${memory.description ? `<p>${memory.description}</p>` : ''}
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>💬 Daily Connections (${data.dailyConnections.length})</h2>
        ${data.dailyConnections.map(connection => {
            const answers = connection.answers as Record<string, string> || {};
            const userAnswer = Object.values(answers)[0] || '';
            const partnerAnswer = Object.values(answers)[1] || '';
            return `
                <div class="connection">
                    <h3>${formatDate(connection.date)}</h3>
                    <div class="meta">
                        <strong>Question:</strong> ${connection.question}
                    </div>
                    ${userAnswer ? `<p><strong>Your Answer:</strong> ${userAnswer}</p>` : ''}
                    ${partnerAnswer ? `<p><strong>Partner's Answer:</strong> ${partnerAnswer}</p>` : ''}
                </div>
            `;
        }).join('')}
    </div>

    <div class="section">
        <h2>📅 Activities (${data.activities.length})</h2>
        ${data.activities.map(activity => `
            <div class="activity">
                <h3>${activity.title}</h3>
                <div class="meta">
                    <strong>Date:</strong> ${formatDate(activity.date)} | 
                    <strong>Status:</strong> ${activity.status || 'Planned'} | 
                    <strong>Category:</strong> ${activity.category || 'General'}
                </div>
                ${activity.description ? `<p>${activity.description}</p>` : ''}
            </div>
        `).join('')}
    </div>

    <div class="footer">
        <p>Generated by Together Apart - Strengthening relationships through shared experiences</p>
        <p>© ${new Date().getFullYear()} Together Apart</p>
    </div>
</body>
</html>
  `;

  return html;
};

// Download file utility
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Main export function
export const exportData = async (
  data: ExportData,
  format: ExportFormat,
  filename?: string
): Promise<void> => {
  const timestamp = new Date().toISOString().split('T')[0];
  const defaultFilename = `together-apart-export-${timestamp}`;
  
  switch (format) {
    case 'json':
      const jsonContent = exportToJSON(data);
      downloadFile(jsonContent, `${filename || defaultFilename}.json`, 'application/json');
      break;
      
    case 'csv':
      const csvContent = exportToCSV(data);
      downloadFile(csvContent, `${filename || defaultFilename}.csv`, 'text/csv');
      break;
      
    case 'html':
      const htmlContent = exportToHTML(data);
      downloadFile(htmlContent, `${filename || defaultFilename}.html`, 'text/html');
      break;
      
    case 'pdf':
      // For PDF export, we'll need to use a library like jsPDF or html2pdf
      // For now, we'll export as HTML which can be printed to PDF
      const pdfHtmlContent = exportToHTML(data);
      downloadFile(pdfHtmlContent, `${filename || defaultFilename}.html`, 'text/html');
      break;
      
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

// Generate export data from user's data
export const generateExportData = (
  memories: Memory[],
  dailyConnections: DailyConnection[],
  activities: Activity[],
  userInfo: { name: string; email: string }
): ExportData => {
  return {
    memories,
    dailyConnections,
    activities,
    exportDate: new Date().toISOString(),
    userInfo,
  };
};
