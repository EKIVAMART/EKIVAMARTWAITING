'use client';

import { useRef, useState, useEffect, TouchEvent, DragEvent } from 'react';
import { Zap } from 'lucide-react';

export default function DraggableWhatsAppButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ bottom: 20, right: 20 });
  const [dragging, setDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // MOBILE TOUCH HANDLERS
  const handleTouchStart = () => setDragging(true);

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const touch = e.touches[0];
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const newRight = windowWidth - touch.clientX - 30;
    const newBottom = windowHeight - touch.clientY - 30;

    setPosition({
      right: Math.max(10, Math.min(newRight, windowWidth - 60)),
      bottom: Math.max(10, Math.min(newBottom, windowHeight - 60)),
    });
  };

  const handleTouchEnd = () => setDragging(false);

  // DESKTOP DRAG HANDLERS
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    setDragging(true);
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    if (!dragging || (e.clientX === 0 && e.clientY === 0)) return;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const newRight = windowWidth - e.clientX - 30;
    const newBottom = windowHeight - e.clientY - 30;

    setPosition({
      right: Math.max(10, Math.min(newRight, windowWidth - 60)),
      bottom: Math.max(10, Math.min(newBottom, windowHeight - 60)),
    });
  };

  const handleDragEnd = () => setDragging(false);

  useEffect(() => {
    document.body.style.touchAction = dragging ? "none" : "auto";
  }, [dragging]);

  return (
    <div
      ref={buttonRef}
      draggable={!isMobile}
      onDragStart={!isMobile ? handleDragStart : undefined}
      onDrag={!isMobile ? handleDrag : undefined}
      onDragEnd={!isMobile ? handleDragEnd : undefined}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed z-50 cursor-move"
      style={{ bottom: position.bottom, right: position.right }}
    >
      <div className="relative">
        {/* WhatsApp Button - Light green background + white icon */}
        <div className="relative bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition duration-200">
          <a
            href="https://wa.me/2349069910407"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src="/whatsapp-icon.svg"
              alt="WhatsApp Icon"
              className="w-6 h-6 invert"
            />
          </a>
        </div>

        {/* Tooltip - Desktop hover only */}
        {!isMobile && isHovered && (
          <div className="absolute right-[68px] bottom-2 w-56 bg-white text-gray-800 text-xs rounded-lg px-4 py-3 shadow-xl z-50 border border-gray-100 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-brand-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 2.016c4.969 0 9 4.031 9 9s-4.031 9-9 9c-1.5 0-2.906-0.375-4.125-1.031l-4.875 1.031 1.031-4.734c-0.75-1.219-1.125-2.625-1.125-4.266 0-4.969 4.031-9 9-9z" />
                </svg>
              </div>
              <div className="font-semibold text-sm text-gray-800">Chat with us on WhatsApp</div>
            </div>
            
            <div className="text-gray-600 text-xs leading-relaxed mb-3">
              Have questions about EkivaMart? We're here to help!
            </div>
            
            <div className="text-brand-600 text-[10px] font-medium flex items-center gap-1">
              <Zap size={14} /> 
              <span>Quick responses, guaranteed</span>
            </div>

            {/* Triangle arrow */}
            <div className="absolute -right-2 bottom-4 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-white" />
          </div>
        )}
      </div>
    </div>
  );
}