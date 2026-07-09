import { useQuery } from '@tanstack/react-query';
import { fetchTimeline } from '../../services/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import SkeletonLoader from '../ui/SkeletonLoader';
import { Train, Activity, BrainCircuit, CheckCircle, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IncidentTimeline() {
  const { data, isLoading } = useQuery({
    queryKey: ['timeline'],
    queryFn: fetchTimeline,
    refetchInterval: 8000
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'delay': return <Train size={16} />;
      case 'medical': return <Activity size={16} />;
      case 'prediction': return <BrainCircuit size={16} />;
      case 'approved': return <CheckCircle size={16} />;
      case 'announcement': return <Megaphone size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'delay': return 'bg-warning/20 text-warning';
      case 'medical': return 'bg-danger/20 text-danger';
      case 'prediction': return 'bg-accent/20 text-accent';
      case 'approved': return 'bg-primary/20 text-primary';
      case 'announcement': return 'bg-info/20 text-info';
      default: return 'bg-surfaceHighlight text-white';
    }
  };

  if (isLoading) {
    return <SkeletonLoader className="h-96 w-full" />;
  }

  return (
    <Card className="col-span-1 flex flex-col h-full min-h-[400px]">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle>Event Timeline</CardTitle>
        <Badge variant="info">Live</Badge>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2 pb-4">
        <div 
          className="relative border-l border-white/10 ml-3 space-y-6 mt-4" 
          aria-live="polite" 
          aria-atomic="false"
        >
          {data?.map((event, index) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-6"
            >
              <div className={`absolute -left-3.5 top-0.5 p-1.5 rounded-full ring-4 ring-background ${getIconColor(event.type)}`}>
                {getIcon(event.type)}
              </div>
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-sm leading-none">{event.title}</h4>
                <span className="text-xs text-textSecondary tabular-nums">{event.timestamp}</span>
              </div>
              <p className="text-sm text-textSecondary">{event.description}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
