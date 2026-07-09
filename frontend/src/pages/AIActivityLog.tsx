import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import Badge from '../components/ui/Badge';

export default function AIActivityLog() {
  const logs = [
    { id: 'AI-991', incident: 'INC-2026-004', time: '14:28:00', confidence: 94, action: 'Mitigation Plan Generated' },
    { id: 'AI-992', incident: 'INC-2026-004', time: '14:30:12', confidence: 100, action: 'Operator Approved' },
    { id: 'AI-993', incident: 'INC-2026-005', time: '15:01:00', confidence: 72, action: 'Anomaly Detected' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI Activity Log</h2>
        <p className="text-textSecondary text-sm mt-1">Audit trail for AI Copilot reasoning and operator actions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Decision Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Incident</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium text-primary">{log.id}</TableCell>
                  <TableCell>{log.incident}</TableCell>
                  <TableCell className="font-mono text-xs">{log.time}</TableCell>
                  <TableCell>
                    <Badge variant={log.confidence > 90 ? 'success' : 'warning'}>{log.confidence}%</Badge>
                  </TableCell>
                  <TableCell className="text-textSecondary">{log.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
