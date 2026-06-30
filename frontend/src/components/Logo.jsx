import React from "react";

export const Logo = ({ size = 36, withWordmark = true }) => {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="g-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#90C2E7" />
            <stop offset="100%" stopColor="#22819A" />
          </linearGradient>
        </defs>
        {/* Connected nodes */}
        <circle cx="12" cy="14" r="3" fill="#90C2E7" />
        <circle cx="52" cy="12" r="3" fill="#22819A" />
        <circle cx="50" cy="50" r="3" fill="#90C2E7" />
        <line x1="12" y1="14" x2="32" y2="32" stroke="#CDD4DD" strokeWidth="1.5" />
        <line x1="52" y1="12" x2="32" y2="32" stroke="#CDD4DD" strokeWidth="1.5" />
        <line x1="50" y1="50" x2="32" y2="32" stroke="#CDD4DD" strokeWidth="1.5" />
        {/* G shape with upward arrow */}
        <path
          d="M32 12 C19 12 12 22 12 32 C12 42 19 52 32 52 C42 52 50 46 50 36 H34"
          stroke="url(#g-grad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Upward arrow inside G */}
        <path
          d="M40 38 L40 26 M40 26 L34 32 M40 26 L46 32"
          stroke="#22819A"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {withWordmark && (
        <span className="text-xl font-bold tracking-tight text-[#1F2937]">
          GUEGON
        </span>
      )}
    </div>
  );
};

export default Logo;
