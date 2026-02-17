import { format, isToday, isYesterday, parseISO } from 'date-fns';
import type { Visitor } from '../types';

export const generateId = (): string => {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  );
};

export const formatDateTime = (iso: string): string => {
  const d = parseISO(iso);
  if (isToday(d)) return `Today ${format(d, 'HH:mm')}`;
  if (isYesterday(d)) return `Yesterday ${format(d, 'HH:mm')}`;
  return format(d, 'dd MMM yyyy HH:mm');
};

export const formatTime = (iso: string): string => {
  return format(parseISO(iso), 'HH:mm');
};

export const formatDate = (iso: string): string => {
  return format(parseISO(iso), 'dd MMM yyyy');
};

export const formatFullDateTime = (iso: string): string => {
  return format(parseISO(iso), 'dd MMM yyyy, HH:mm:ss');
};

export const getDuration = (timeIn: string, timeOut: string | null): string => {
  if (!timeOut) {
    const diff = Date.now() - parseISO(timeIn).getTime();
    return formatDuration(diff);
  }
  const diff = parseISO(timeOut).getTime() - parseISO(timeIn).getTime();
  return formatDuration(diff);
};

const formatDuration = (ms: number): string => {
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hrs < 24) return `${hrs}h ${rem}m`;
  const days = Math.floor(hrs / 24);
  return `${days}d ${hrs % 24}h`;
};

export const exportToCSV = (visitors: Visitor[], filename: string): void => {
  const headers = [
    'Full Name',
    'Phone',
    'ID Number',
    'Category',
    'Gender',
    'Purpose',
    'Unit Visited',
    'Tools',
    'Time In',
    'Time Out',
    'Duration',
    'Status',
    'Registered By',
    'Checked Out By',
  ];

  const rows = visitors.map((v) => [
    v.fullName,
    v.phoneNumber,
    v.idNumber,
    v.category,
    v.gender,
    v.purpose,
    v.unitVisited,
    v.tools.join('; '),
    formatFullDateTime(v.timeIn),
    v.timeOut ? formatFullDateTime(v.timeOut) : 'Still inside',
    getDuration(v.timeIn, v.timeOut),
    v.status,
    v.registeredBy,
    v.checkedOutBy ?? '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const printReport = (visitors: Visitor[], title: string): void => {
  const win = window.open('', '_blank');
  if (!win) return;

  const rows = visitors
    .map(
      (v) => `
    <tr>
      <td>${v.fullName}</td>
      <td>${v.phoneNumber}</td>
      <td>${v.idNumber}</td>
      <td>${v.category}</td>
      <td>${v.unitVisited}</td>
      <td>${v.tools.join(', ') || '—'}</td>
      <td>${formatFullDateTime(v.timeIn)}</td>
      <td>${v.timeOut ? formatFullDateTime(v.timeOut) : 'Still inside'}</td>
      <td>${v.status}</td>
    </tr>
  `
    )
    .join('');

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
        h1 { color: #1e40af; font-size: 20px; }
        h2 { color: #475569; font-size: 14px; font-weight: normal; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
        th { background: #f1f5f9; font-weight: 600; }
        tr:nth-child(even) { background: #f8fafc; }
        .meta { color: #64748b; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <h1>🛡️ SECUREPASS — ${title}</h1>
      <h2>Generated on ${format(new Date(), 'dd MMM yyyy, HH:mm:ss')}</h2>
      <p class="meta">Total Records: ${visitors.length}</p>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Phone</th><th>ID</th><th>Category</th>
            <th>Unit</th><th>Tools</th><th>Time In</th><th>Time Out</th><th>Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <script>window.print();</script>
    </body>
    </html>
  `);
  win.document.close();
};
