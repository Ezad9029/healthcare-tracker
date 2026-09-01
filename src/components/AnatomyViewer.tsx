"use client";

import { useState } from "react";

interface OrganInfo {
  id: string;
  name: string;
  icon: string;
  status: string;
  progress: number;
  color: string;
  x: number;
  y: number;
}

const organs: OrganInfo[] = [
  { id: "brain", name: "Brain", icon: "🧠", status: "Healthy", progress: 95, color: "#8b5cf6", x: 50, y: 8 },
  { id: "heart", name: "Heart", icon: "❤️", status: "Healthy", progress: 80, color: "#ef4444", x: 44, y: 28 },
  { id: "lungs", name: "Lungs", icon: "🫁", status: "Healthy", progress: 85, color: "#f97316", x: 56, y: 28 },
  { id: "stomach", name: "Stomach", icon: "🟠", status: "Good", progress: 70, color: "#f59e0b", x: 50, y: 38 },
  { id: "liver", name: "Liver", icon: "🫘", status: "Healthy", progress: 90, color: "#a855f7", x: 42, y: 35 },
  { id: "kidneys", name: "Kidneys", icon: "🫘", status: "Good", progress: 75, color: "#06b6d4", x: 50, y: 43 },
];

export default function AnatomyViewer() {
  const [hovered, setHovered] = useState<string | null>(null);

  const activeOrgan = organs.find((o) => o.id === hovered);

  return (
    <div className="anatomy_viewer_card">
      <svg
        viewBox="0 0 100 80"
        style={{ width: "100%", height: "100%", maxHeight: 400 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="organGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(6,182,212,0.3)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0.1)" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Body silhouette */}
        <g filter="url(#shadow)">
          {/* Head */}
          <ellipse cx="50" cy="10" rx="6" ry="7" fill="url(#bodyGrad)" opacity="0.9" />

          {/* Neck */}
          <rect x="48" y="16" width="4" height="3" rx="1.5" fill="url(#bodyGrad)" opacity="0.85" />

          {/* Torso */}
          <path
            d="M 38 19 Q 37 19 36 22 L 34 38 Q 34 46 38 50 L 42 52 Q 46 54 50 54 Q 54 54 58 52 L 62 50 Q 66 46 66 38 L 64 22 Q 63 19 62 19 Z"
            fill="url(#bodyGrad)"
            opacity="0.85"
          />

          {/* Left arm */}
          <path
            d="M 36 21 L 30 24 Q 26 26 24 32 L 22 42 Q 21 44 22 45 L 24 44 Q 26 38 28 32 L 32 26 Z"
            fill="url(#bodyGrad)"
            opacity="0.7"
          />

          {/* Right arm */}
          <path
            d="M 64 21 L 70 24 Q 74 26 76 32 L 78 42 Q 79 44 78 45 L 76 44 Q 74 38 72 32 L 68 26 Z"
            fill="url(#bodyGrad)"
            opacity="0.7"
          />

          {/* Left leg */}
          <path
            d="M 42 52 L 40 60 Q 39 66 38 72 L 37 78 Q 37 80 38 80 L 42 80 L 43 78 Q 44 72 45 66 L 48 54 Z"
            fill="url(#bodyGrad)"
            opacity="0.7"
          />

          {/* Right leg */}
          <path
            d="M 58 52 L 60 60 Q 61 66 62 72 L 63 78 Q 63 80 62 80 L 58 80 L 57 78 Q 56 72 55 66 L 52 54 Z"
            fill="url(#bodyGrad)"
            opacity="0.7"
          />
        </g>

        {/* Organ hotspots */}
        {organs.map((organ) => {
          const isActive = hovered === organ.id;
          return (
            <g
              key={organ.id}
              onMouseEnter={() => setHovered(organ.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Pulse ring on hover */}
              {isActive && (
                <circle
                  cx={organ.x}
                  cy={organ.y}
                  r={4}
                  fill="none"
                  stroke={organ.color}
                  strokeWidth="0.4"
                  opacity="0.5"
                >
                  <animate attributeName="r" from="3" to="6" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="1s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Organ dot */}
              <circle
                cx={organ.x}
                cy={organ.y}
                r={isActive ? 2.8 : 2}
                fill={isActive ? organ.color : "rgba(255,255,255,0.7)"}
                stroke={organ.color}
                strokeWidth={isActive ? 0.5 : 0.3}
                style={{
                  transition: "all 0.2s",
                  filter: isActive ? `drop-shadow(0 0 4px ${organ.color})` : "none",
                }}
              />

              {/* Connector line to label */}
              {isActive && (
                <line
                  x1={organ.x}
                  y1={organ.y}
                  x2={organ.x > 50 ? organ.x + 10 : organ.x - 10}
                  y2={organ.y - 4}
                  stroke={organ.color}
                  strokeWidth="0.2"
                  strokeDasharray="1,0.5"
                  opacity="0.6"
                />
              )}

              {/* Label on hover */}
              {isActive && (
                <foreignObject
                  x={organ.x > 50 ? organ.x + 6 : organ.x - 30}
                  y={organ.y - 10}
                  width={24}
                  height={10}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.95)",
                      padding: "4px 8px",
                      borderRadius: 6,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      fontSize: 10,
                      fontWeight: 700,
                      color: organ.color,
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    {organ.icon} {organ.name}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}

        {/* Center spine line for realism */}
        <line x1="50" y1="16" x2="50" y2="52" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
      </svg>

      {/* Info panel */}
      <div style={{
        position: "absolute",
        bottom: 12,
        left: 12,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}>
        {activeOrgan ? (
          <div style={{
            background: "rgba(255,255,255,0.95)",
            padding: "8px 14px",
            borderRadius: 10,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            animation: "fadeIn 0.15s ease",
          }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: activeOrgan.color }}>
              {activeOrgan.icon} {activeOrgan.name}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
              {activeOrgan.status} • {activeOrgan.progress}%
            </div>
            <div style={{ height: 4, background: "#e2e8f0", borderRadius: 2, marginTop: 4, width: 80 }}>
              <div style={{ height: "100%", background: activeOrgan.color, borderRadius: 2, width: `${activeOrgan.progress}%`, transition: "width 0.3s" }} />
            </div>
          </div>
        ) : (
          <div style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 11,
            background: "rgba(0,0,0,0.3)",
            padding: "4px 10px",
            borderRadius: 6,
          }}>
            Hover over organs for details
          </div>
        )}
      </div>
    </div>
  );
}
