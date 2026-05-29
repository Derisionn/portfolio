import React, { useState, useEffect } from 'react';
import './ScrollToTop.css';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = totalScroll / windowHeight;
      
      // Clamp between 0 and 1 to prevent bounce-overscroll bugs
      const clampedProgress = Math.max(0, Math.min(1, progress));
      setScrollProgress(clampedProgress);

      // Show button after 300px
      if (totalScroll > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const isFullyFueled = scrollProgress >= 0.99;

  return (
    <div className={`scroll-to-top ${isVisible ? 'visible' : ''} ${isFullyFueled ? 'fully-fueled' : ''}`} onClick={scrollToTop}>
      <div className="rocket-btn-wrapper">
        <button className="creative-btn" aria-label="Scroll to top">
          {/* Liquid fuel inside container */}
          <div 
            className="fuel-fill-container" 
            style={{ transform: `translateY(${100 - scrollProgress * 100}%)` }}
          >
            <div className="wave-surface layer-1">
              <svg viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M 0 10 C 15 20, 35 20, 50 10 C 65 0, 85 0, 100 10 L 100 20 L 0 20 Z" /></svg>
              <svg viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M 0 10 C 15 20, 35 20, 50 10 C 65 0, 85 0, 100 10 L 100 20 L 0 20 Z" /></svg>
            </div>
            <div className="wave-surface layer-2">
              <svg viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M 0 10 C 15 20, 35 20, 50 10 C 65 0, 85 0, 100 10 L 100 20 L 0 20 Z" /></svg>
              <svg viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M 0 10 C 15 20, 35 20, 50 10 C 65 0, 85 0, 100 10 L 100 20 L 0 20 Z" /></svg>
            </div>
            <div className="fuel-body"></div>
          </div>
        </button>
        {/* Exhaust flame fires from the bottom of the whole button on hover */}
        <div className="exhaust-flame"></div>
      </div>
    </div>
  );
};

export default ScrollToTop;
