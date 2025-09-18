import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ChevronUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      size="sm"
      className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 p-0 shadow-lg"
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-5 h-5" />
    </Button>
  );
}