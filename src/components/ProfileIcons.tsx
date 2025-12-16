// src/components/ProfileIcons.tsx
import React from 'react';

// Common props for all icons
interface IconProps {
  className?: string;
  strokeWidth?: number;
}

// 1. The "Wanderer" (Compass)
export const CompassIcon = ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

// 2. The "Photographer" (Camera)
export const CameraIcon = ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);

// 3. The "Backpacker" (Backpack)
export const BackpackIcon = ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

// 4. The "Jetsetter" (Suitcase) - Updated
export const SuitcaseIcon = ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={strokeWidth} 
    stroke="currentColor" 
    className={className}
  >
    {/* Handle */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    {/* Body */}
    <rect width="18" height="15" x="3" y="6" rx="2" ry="2" />
    {/* Straps/Details */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6v15" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 6v15" />
  </svg>
);


// 5. The "Road Tripper" (Van)
export const VanIcon = ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

// 6. The "Camper" (Tent)
export const TentIcon = ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  </svg>
);

// 7. The "Island Hopper" (Palm Tree)
export const PalmIcon = ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
  </svg>
);

// 8. The "Sightseer" (Binoculars)
export const BinocularsIcon = ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

// 9. The "Foodie" (Utensils)
export const FoodieIcon = ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

// 10. The "Spicy" (Chili Pepper)
export const ChiliIcon = ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 2.25c1.5 1.5 2.25 3 1.5 5.25-1.5 4.5-5.25 9-11.25 11.25-.75-2.25.75-7.5 3.75-10.5 2.25-2.25 4.5-4.5 6-6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 5.25c-1.5 1.5-3 1.5-5.25.75" />
  </svg>
);

// 11. The "Pit" (Avocado)
export const AvocadoIcon = ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-3 0-6 3.75-6 9 0 5.25 3 10.5 6 10.5s6-5.25 6-10.5c0-5.25-3-9-6-9z" />
    <circle cx="12" cy="14.25" r="3" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Map of all icons for easy lookup
export const PROFILE_ICONS: Record<string, React.ComponentType<IconProps>> = {
  compass: CompassIcon,
  camera: CameraIcon,
  backpack: BackpackIcon,
  suitcase: SuitcaseIcon,
  van: VanIcon,
  tent: TentIcon,
  palm: PalmIcon,
  binoculars: BinocularsIcon,
  foodie: FoodieIcon,
  chili: ChiliIcon,
  avocado: AvocadoIcon,
};

export type ProfileIconName = keyof typeof PROFILE_ICONS;
