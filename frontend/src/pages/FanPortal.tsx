import BilingualConcierge from '../components/fan/BilingualConcierge';
import WayfindingEngine from '../components/fan/WayfindingEngine';
import StadiumHeatmap from '../components/dashboard/StadiumHeatmap';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function FanPortal() {
  const [activeRoute, setActiveRoute] = useState<{ start: string; end: string } | null>(null);

  const handleRouteSelect = (start: string, end: string) => {
    setActiveRoute({ start, end });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-start"
    >
      {/* Left Column: Interactive Map & Wayfinding */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <StadiumHeatmap 
          activeRoute={activeRoute}
          title="Smart Interactive Stadium Map"
          subtitle="Real-time Location & Sensor Overlays"
        />
        <WayfindingEngine onRouteSelect={handleRouteSelect} />
      </div>

      {/* Right Column: Chatbot */}
      <div className="flex flex-col gap-6 h-full">
        <BilingualConcierge />
      </div>
    </motion.div>
  );
}
