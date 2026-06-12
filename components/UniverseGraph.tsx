import React, { useEffect, useMemo, useState } from 'react';
import { UniverseNode, VisualState } from '../types';

interface UniverseGraphProps {
  structure: UniverseNode;
  visualState: VisualState;
}

const UniverseGraph: React.FC<UniverseGraphProps> = ({ structure, visualState }) => {
  const [rotation, setRotation] = useState(0);
  
  // Animation loop
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      const speed = 0.02 + (visualState.energy * 0.05); // Slower, more majestic
      setRotation(r => r + speed);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [visualState.energy]);

  // Layout Calculations
  const planetRadius = 140 - (visualState.density * 40); 
  const moonRadius = 40 - (visualState.density * 10);

  const planets = useMemo(() => {
    if (!structure.children) return [];
    const count = structure.children.length;
    const angleStep = 360 / (count || 1);
    
    return structure.children.map((planet, index) => {
      const angleDeg = (index * angleStep) + rotation;
      const angleRad = (angleDeg * Math.PI) / 180;
      
      // Elliptical Orbit effect for 3D feel
      const x = Math.cos(angleRad) * planetRadius;
      const y = Math.sin(angleRad) * (planetRadius * 0.85); 
      
      const moons = (planet.children || []).map((moon, mIndex) => {
         const mCount = planet.children?.length || 1;
         const mAngleStep = 360 / mCount;
         const mAngleDeg = (mIndex * mAngleStep) + (rotation * 3); 
         const mAngleRad = (mAngleDeg * Math.PI) / 180;
         const mx = x + Math.cos(mAngleRad) * moonRadius;
         const my = y + Math.sin(mAngleRad) * moonRadius;
         return { ...moon, x: mx, y: my };
      });

      return { ...planet, x, y, moons };
    });
  }, [structure, rotation, planetRadius, moonRadius]);

  // Generate random background stars
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 500,
      r: Math.random() * 1.5,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden relative transition-colors duration-[1500ms]">
      
      {/* Note: Backgrounds are now handled by parent containers for flexibility, 
          but we keep the Grid/SVG specific elements here */}

      <svg viewBox="-250 -250 500 500" className="w-full h-full max-w-[600px] max-h-[600px] z-10">
        <defs>
          <filter id="glow-core" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-planet" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="star-gradient">
            <stop offset="0%" stopColor="white" />
            <stop offset="40%" stopColor="hsl(var(--theme-hue), 100%, 80%)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Background Stars (Dust) */}
        {stars.map((star, i) => (
          <circle key={i} cx={star.x} cy={star.y} r={star.r} fill="white" opacity={star.opacity}>
             <animate attributeName="opacity" values={`${star.opacity};${star.opacity * 0.3};${star.opacity}`} dur={`${3 + star.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Orbital Rings (Ellipses) */}
        <ellipse cx="0" cy="0" rx={planetRadius} ry={planetRadius * 0.85} fill="none" stroke="url(#star-gradient)" strokeWidth="0.5" strokeOpacity="0.2" className="transition-all duration-[1500ms]" />
        
        {/* Central Star */}
        <g>
          {/* Outer Halo */}
          <circle cx="0" cy="0" r={40 + (visualState.energy * 20)} fill="hsl(var(--theme-hue-sec), 100%, 50%)" opacity="0.05" className="transition-all duration-[1500ms]">
             <animate attributeName="r" values={`${40 + visualState.energy*10};${50 + visualState.energy*20};${40 + visualState.energy*10}`} dur="4s" repeatCount="indefinite" />
          </circle>
          {/* Inner Halo */}
          <circle cx="0" cy="0" r={25} fill="hsl(var(--theme-hue), 100%, 60%)" opacity="0.15" filter="url(#glow-core)" className="transition-all duration-[1500ms]" />
          
          {/* Core White Dwarf */}
          <circle cx="0" cy="0" r="8" fill="white" filter="url(#glow-core)" className="transition-all duration-[1500ms]" />
          
          {/* Tech Ring */}
          <circle cx="0" cy="0" r="18" fill="none" stroke="hsl(var(--theme-hue), 80%, 70%)" strokeWidth="1" opacity="0.6" strokeDasharray="10 5" className="transition-all duration-[1500ms]">
             <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="30s" repeatCount="indefinite"/>
          </circle>
          
          <text x="0" y="55" textAnchor="middle" fill="hsl(var(--theme-hue), 80%, 90%)" className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase opacity-80 pointer-events-none drop-shadow-lg transition-all duration-[1500ms]">
            {structure.name}
          </text>
        </g>

        {/* Planets & Moons */}
        {planets.map((planet) => (
          <g key={planet.id}>
            {/* Connecting Data Line (Faded) */}
            <line x1="0" y1="0" x2={planet.x} y2={planet.y} stroke="hsl(var(--theme-hue), 50%, 50%)" strokeWidth="1" opacity="0.1" strokeDasharray="2 2" />

            {/* Planet Node */}
            <circle cx={planet.x} cy={planet.y} r={visualState.seriousness > 0.6 ? 4 : 5} fill="hsl(var(--theme-hue-sec), 20%, 90%)" filter="url(#glow-planet)" className="transition-all duration-[1500ms]" />
            
            {/* Planet Ring (Cosmetic) */}
             <circle cx={planet.x} cy={planet.y} r={8} fill="none" stroke="hsl(var(--theme-hue-sec), 80%, 60%)" strokeWidth="0.5" opacity="0.4" />

            <text x={planet.x} y={planet.y + 18} textAnchor="middle" fill="hsl(var(--theme-hue-sec), 80%, 80%)" className="text-[7px] font-mono font-bold opacity-90 uppercase tracking-widest transition-all duration-[1500ms]">
              {planet.name}
            </text>

            {/* Moons */}
            {planet.moons.map((moon) => (
              <g key={moon.id}>
                <line x1={planet.x} y1={planet.y} x2={moon.x} y2={moon.y} stroke="hsl(var(--theme-hue), 50%, 50%)" strokeWidth="0.5" opacity="0.15" />
                <circle cx={moon.x} cy={moon.y} r="2" fill="hsl(var(--theme-hue), 90%, 70%)" opacity="0.9" />
              </g>
            ))}
          </g>
        ))}
      </svg>
      
      {/* Tech HUD Interface (Bottom Left) */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-2 text-[9px] text-cyan-500/60 font-mono tracking-widest pointer-events-none select-none">
         <div className="flex items-center gap-2">
            <span className="w-10 text-right">系统</span>
            <div className="flex gap-0.5">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className={`w-1 h-2 bg-cyan-500 ${i <= visualState.energy * 5 ? 'opacity-100' : 'opacity-20'}`}></div>
               ))}
            </div>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-10 text-right">稳定</span>
            <span className="text-cyan-300 animate-pulse">●</span>
         </div>
      </div>
      
    </div>
  );
};

export default UniverseGraph;