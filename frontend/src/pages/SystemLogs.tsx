import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import Badge from '../components/ui/Badge';

export default function SystemLogs() {
  const logs = [
    { id: '10234', time: '15:12:04', service: 'SensorIngest', level: 'info', message: 'Ingested 500 telemetry points.' },
    { id: '10235', time: '15:12:05', service: 'AICore', level: 'warning', message: 'Cache miss for incident INC-04.' },
    { id: '10236', time: '15:12:08', service: 'WebSocket', level: 'error', message: 'Connection dropped for client C-92.' },
    { id: '10237', time: '15:12:10', service: 'Sanitizer', level: 'info', message: 'Masked 12 PII fields.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Logs</h2>
        <p className="text-textSecondary text-sm mt-1">Raw telemetry and service execution logs.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">{log.time}</TableCell>
                  <TableCell>{log.service}</TableCell>
                  <TableCell>
                    <Badge variant={log.level === 'error' ? 'danger' : log.level === 'warning' ? 'warning' : 'info'}>
                      {log.level.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-textSecondary">{log.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
