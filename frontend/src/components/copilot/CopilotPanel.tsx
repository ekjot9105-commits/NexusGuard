import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchRecommendations, executeRecommendation } from '../../services/copilot';
import RecommendationCard from './RecommendationCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

export default function CopilotPanel() {
  const [executionStatus, setExecutionStatus] = useState<'pending' | 'executing' | 'completed' | 'rejected'>('pending');

  const { data, isLoading, isError, error, refetch, isPaused } = useQuery({
    queryKey: ['copilotRecommendations'],
    queryFn: fetchRecommendations,
    retry: 2,
  });

  const mutation = useMutation({
    mutationFn: (action: 'approve' | 'reject' | 'modify') => executeRecommendation(data?.incident_id || '', action),
    onMutate: () => setExecutionStatus('executing'),
    onSuccess: (res) => {
      if (res.action === 'approve') setExecutionStatus('completed');
      if (res.action === 'reject') setExecutionStatus('rejected');
    },
    onError: () => setExecutionStatus('pending')
  });

  // Offline state (handled by React Query isPaused when no network)
  if (isPaused) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] glass-card">
        <WifiOff className="w-12 h-12 text-textSecondary mb-4" />
        <h3 className="text-lg font-semibold text-white">System Offline</h3>
        <p className="text-sm text-textSecondary mt-2">Check your connection to resume AI operations.</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] glass-card" aria-busy="true" aria-live="polite">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-textSecondary animate-pulse">AI Copilot is analyzing telemetry...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] glass-card border border-danger/30" role="alert">
        <AlertTriangle className="w-12 h-12 text-danger mb-4" />
        <h3 className="text-lg font-semibold text-white">Analysis Failed</h3>
        <p className="text-sm text-textSecondary mt-2 mb-6">{(error as Error).message}</p>
        <Button onClick={() => refetch()} variant="secondary">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry Analysis
        </Button>
      </div>
    );
  }

  // Empty state
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] glass-card">
        <div className="w-12 h-12 rounded-full bg-surfaceHighlight/50 mb-4 flex items-center justify-center">
          <span className="text-2xl">✨</span>
        </div>
        <h3 className="text-lg font-semibold text-white">No Active Incidents</h3>
        <p className="text-sm text-textSecondary mt-2">Stadium operations are normal.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full"
    >
      <RecommendationCard 
        data={data}
        status={executionStatus}
        onApprove={() => mutation.mutate('approve')}
        onReject={() => mutation.mutate('reject')}
        onModify={() => mutation.mutate('modify')}
      />
    </motion.div>
  );
}
