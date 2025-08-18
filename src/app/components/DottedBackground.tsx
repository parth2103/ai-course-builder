'use client';

interface DottedBackgroundProps {
  className?: string;
}

export default function DottedBackground({ className = "" }: DottedBackgroundProps) {
  return (
    <div 
      className={`absolute inset-0 -z-10 h-full w-full 
                  bg-white dark:bg-gray-900 
                  bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] 
                  dark:bg-[radial-gradient(#374151_1px,transparent_1px)]
                  [background-size:16px_16px] ${className}`}
    />
  );
}