'use client';

import { useEffect, useState, useRef } from 'react';
import { StackedFlipCard } from './stacked-flip-card';

interface DigitStackProps {
  currentValue: number;
  label: string;
}

export function DigitStack({ currentValue, label }: DigitStackProps) {
  const prevRef = useRef(currentValue);
  const [prevValue, setPrevValue] = useState(currentValue);
  const [flippingPositions, setFlippingPositions] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (currentValue !== prevRef.current) {
      setPrevValue(prevRef.current);
      prevRef.current = currentValue;
    }
  }, [currentValue]);

  const currentStr = currentValue.toString().padStart(2, '0');
  const previousStr = prevValue.toString().padStart(2, '0');
  const currentDigits = currentStr.split('');
  const previousDigits = previousStr.split('');

  useEffect(() => {
    if (currentValue === prevValue) return;
    const newFlipping = new Set<number>();
    for (let i = 0; i < currentDigits.length; i++) {
      if (currentDigits[i] !== previousDigits[i]) newFlipping.add(i);
    }
    if (newFlipping.size === 0) return;
    setFlippingPositions(newFlipping);
    const timer = setTimeout(() => setFlippingPositions(new Set()), 1000);
    return () => clearTimeout(timer);
  }, [currentValue, prevValue]);

  return (
    <div className="flex flex-col items-center gap-1 md:gap-2">
      <div className="flex gap-1 md:gap-2">
        {currentDigits.map((digit, position) => {
          const prevDigit = previousDigits[position];
          const isFlipping = flippingPositions.has(position);
          return (
            <StackedFlipCard
              key={`${label}-pos-${position}`}
              currentDigit={isFlipping ? prevDigit : digit}
              nextDigit={digit}
              shouldFlip={isFlipping}
              onFlipComplete={() => {
                setFlippingPositions(prev => {
                  const next = new Set(prev);
                  next.delete(position);
                  return next;
                });
              }}
            />
          );
        })}
      </div>
      <span className="text-[9px] md:text-xs font-semibold tracking-widest uppercase text-brand-800 mt-0.5">
        {label}
      </span>
    </div>
  );
}