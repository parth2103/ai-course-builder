'use client';
import { useEffect, useState } from 'react';

export default function ParallaxEffect() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Parallax Background Elements */}
      <div 
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      >
        {/* Grid Pattern - Moves slower */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-60"></div>
      </div>
      
      <div 
        className="fixed inset-0 -z-30 pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`
        }}
      >
        {/* Radial Gradient - Moves even slower */}
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)] dark:bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)] opacity-80"></div>
      </div>
      
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.8}px)`
        }}
      >
        {/* Floating Elements - Move faster for more dramatic effect */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#8ebb7a]/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-yellow-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
    </>
  );
}
