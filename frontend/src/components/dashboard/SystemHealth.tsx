import { useQuery } from '@tanstack/react-query';
import { fetchSystemHealth } from '../../services/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import SkeletonLoader from '../ui/SkeletonLoader';
import { Server, Cpu, Database, HardDrive } from 'lucide-react';

export default function SystemHealth() {
  const { data, isLoading } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: fetchSystemHealth,
    refetchInterval: 15000
  });

  if (isLoading) {
    return <SkeletonLoader className="h-48 w-full" />;
  }

  return (
    <Card className="col-span-1 min-h-[200px]">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Server size={16} className="text-textSecondary" />
          System Health
        </CardTitle>
        <Badge variant={data?.status === 'healthy' ? 'success' : 'danger'}>
          {data?.status.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-sm text-textSecondary">
                <Cpu size={14} /> CPU Usage
              </div>
              <div className="font-medium text-sm">{data?.cpuUsage}%</div>
            </div>
            <div className="w-full bg-surfaceHighlight/50 rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${data?.cpuUsage}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 pt-2">
              <div className="flex items-center gap-2 text-sm text-textSecondary">
                <HardDrive size={14} /> Memory
              </div>
              <div className="font-medium text-sm">{data?.memoryUsage}%</div>
            </div>
            <div className="w-full bg-surfaceHighlight/50 rounded-full h-1.5 overflow-hidden">
              <div className="bg-accent h-full rounded-full transition-all duration-1000" style={{ width: `${data?.memoryUsage}%` }}></div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-borderWhite/20">
            <div className="flex items-center gap-2 text-sm text-textSecondary">
              <Database size={14} /> Semantic Cache
            </div>
            <div className="text-xs text-textSecondary">
              <span className="text-accent">{data?.cacheHits}</span> hits / <span className="text-warning">{data?.cacheMisses}</span> misses
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
