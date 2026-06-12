import React from 'react';
import { VisualState } from "../types";

const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t;
};

export const generateThemeVariables = (vs: VisualState): React.CSSProperties => {
  // 1. Premium Color System (Low Saturation, High Texture)
  // Reference: Deep Space Dashboard.
  // We move away from pure neon to "Titanium", "Deep Slate", "Muted Violet", "Champagne".

  let primaryHue: number;
  let secondaryHue: number;

  if (vs.temperature < 0.5) {
    // Cool: Slate Blue (220) -> Muted Violet (260)
    // Less saturation, more "tech" feel
    primaryHue = lerp(220, 260, vs.temperature * 2);
    secondaryHue = lerp(190, 280, vs.temperature * 2); 
  } else {
    // Warm: Dusty Rose (340) -> Champagne Gold (40)
    // Avoiding bright reds/oranges.
    primaryHue = lerp(260, 350, (vs.temperature - 0.5) * 2);
    secondaryHue = lerp(320, 45, (vs.temperature - 0.5) * 2); 
  }

  // Energy drives Brightness more than Saturation now to keep it classy.
  // Low Energy = Deep, Dim, Mysterious.
  // High Energy = Bright, luminous, but still pastel/refined.
  
  // Saturation: Kept low (20% - 60%) for that "premium" look.
  const accentSat = lerp(30, 60, vs.energy); 
  const accentLight = lerp(60, 85, vs.energy); // Higher lightness for contrast against dark bg

  // Background: Rich Dark Tones (not pure black)
  // Very dark slate/blue mixed with the theme hue
  const bgLightness = lerp(3, 6, vs.seriousness); 
  const bgSat = 15; 

  // 2. Spacing & Layout (iOS 17 Style - More breathing room)
  const pagePadding = 32; // Fixed generous padding
  const cardGap = 16;
  const cardInnerPadding = 20;

  // 3. Shape System (Apple-esque super-ellipses logic)
  // More rounded generally, unless extremely serious
  const radiusBase = lerp(24, 12, vs.seriousness); 

  // 4. UI Emphasis
  const borderOpacity = 0.08; // Very subtle borders
  const glassBlur = lerp(10, 30, vs.density); // Density affects blur amount

  return {
    // Semantic Colors
    '--theme-hue': Math.round(primaryHue),
    '--theme-hue-sec': Math.round(secondaryHue),
    
    '--theme-bg-h': Math.round(primaryHue),
    '--theme-bg-s': `${Math.round(bgSat)}%`,
    '--theme-bg-l': `${Math.round(bgLightness)}%`,
    
    '--theme-accent-s': `${Math.round(accentSat)}%`,
    '--theme-accent-l': `${Math.round(accentLight)}%`,
    
    // Derived Surface Colors (Glassmorphism)
    '--surface-glass': `hsla(${Math.round(primaryHue)}, 20%, 10%, 0.4)`,
    '--surface-glass-border': `hsla(${Math.round(primaryHue)}, 20%, 80%, ${borderOpacity})`,
    '--surface-glass-highlight': `hsla(${Math.round(primaryHue)}, 20%, 100%, 0.05)`,
    
    // Spacing
    '--space-page': `${pagePadding}px`,
    '--space-card-gap': `${cardGap}px`,
    '--space-card-inner': `${cardInnerPadding}px`,
    
    // Shape
    '--radius-base': `${Math.round(radiusBase)}px`,
    '--radius-sm': `${Math.round(radiusBase / 1.5)}px`,
    '--radius-xs': `${Math.round(radiusBase / 2.5)}px`,
    
    // Effects
    '--glass-blur': `${Math.round(glassBlur)}px`,
    '--shadow-elevation': `0 4px 20px -2px rgba(0,0,0,0.3)`,
    '--shadow-glow': `0 0 ${lerp(10, 30, vs.energy)}px hsla(${Math.round(primaryHue)}, ${Math.round(accentSat)}%, 60%, 0.15)`,
    
    // Global Transition
    '--transition-speed': '0.8s',
  } as React.CSSProperties;
};