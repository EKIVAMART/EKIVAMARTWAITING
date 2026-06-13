'use client';

import { useCountdown } from '@/hooks/use-countdown';
import { DigitStack } from './digit-stack';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CalendarCountdownProps {
  targetDate: Date;
}

export function CalendarCountdown({ targetDate }: CalendarCountdownProps) {
  const timeLeft = useCountdown(targetDate);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const timeUnits = [
    { value: timeLeft.days,    label: 'DAYS' },
    { value: timeLeft.hours,   label: 'HOURS' },
    { value: timeLeft.minutes, label: 'MINS' },
    { value: timeLeft.seconds, label: 'SECS' },
  ];

  if (!isClient) {
    return (
      <div className="flex items-center justify-center gap-1 md:gap-3">
        {timeUnits.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-1 md:gap-3">
            <div className="flex gap-1 md:gap-2">
              <div className="w-8 h-12 md:w-16 md:h-20 bg-brand-200/50 rounded-lg animate-pulse" />
              <div className="w-8 h-12 md:w-16 md:h-20 bg-brand-200/50 rounded-lg animate-pulse" />
            </div>
            {i < timeUnits.length - 1 && (
              <span className="text-brand-600 font-bold text-lg md:text-3xl">:</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1 md:gap-3">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-1 md:gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <DigitStack currentValue={unit.value} label={unit.label} />
          </motion.div>
          {index < timeUnits.length - 1 && (
            <span className="text-brand-600 font-bold text-xl md:text-4xl pb-7 md:pb-9 leading-none">:</span>
          )}
        </div>
      ))}
    </div>
  );
}