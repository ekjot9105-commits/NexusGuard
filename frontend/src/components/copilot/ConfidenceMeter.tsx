import { motion } from 'framer-motion';

export default function ConfidenceMeter({ confidence }: { confidence: number }) {
  const strokeDasharray = 251.2; // 2 * pi * r (r=40)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * (confidence / 100));

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
          <motion.circle 
            cx="50" cy="50" r="40" 
            stroke="currentColor" 
            strokeWidth="8" 
            fill="none"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: strokeDasharray }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="text-accent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-sm font-bold text-textPrimary">{confidence}%</span>
        </div>
      </div>
      <div>
        <div className="text-xs text-textSecondary uppercase tracking-wider font-semibold">AI Confidence</div>
        <div className="text-sm text-textPrimary">High accuracy predicted</div>
      </div>
    </div>
  );
}
