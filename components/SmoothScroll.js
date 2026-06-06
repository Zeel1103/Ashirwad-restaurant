"use client";
import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Initialize Lenis with optimized settings for premium inertia scrolling
    const lenis = new Lenis({
      duration: 1.2, // Scroll speed
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom inertia curve
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: true, // Smooth scrolling on mobile devices
      touchMultiplier: 1.5,
      wheelMultiplier: 1.0,
      infinite: false,
    });

    let rafId;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    // Start the animation frame loop
    rafId = requestAnimationFrame(raf);

    // Global click listener to intercept internal anchor link clicks
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      
      // If it's a hash link pointing to an element on the same page
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            e.preventDefault();
            
            // Adjust offset depending on screen size to prevent headers from getting cut off by the sticky navbar
            const offset = window.innerWidth < 600 ? -70 : -85;
            
            lenis.scrollTo(targetElement, {
              offset: offset,
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Clean up all resources, loops, and listeners on component unmount
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return <>{children}</>;
}
