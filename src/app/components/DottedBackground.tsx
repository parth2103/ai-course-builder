'use client';

interface DottedBackgroundProps {
  className?: string;
}

export default function DottedBackground({ className = "" }: DottedBackgroundProps) {
  return (
    <div 
      className={`absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 bg-[radial-gradient(#9ca3af_2px,transparent_2px)] dark:bg-[radial-gradient(#6b7280_2px,transparent_2px)] [background-size:16px_16px] ${className}`}
    />
  );
}