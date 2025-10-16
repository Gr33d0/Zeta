import { useNavigate } from "react-router-dom";
import { CSSProperties } from "react";

interface LockProps {
  size?: number;
}

const Lock = ({ size = 16 }: LockProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 10V7a5 5 0 0110 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="5" y="10" width="14" height="10" rx="2" ry="2" fill="currentColor" />
  </svg>
);

interface LevelButtonProps {
  level: number;
  locked?: boolean;
  size?: number;
  color?: string;
  border?: string;
  textColor?: string;
  className?: string;
}

export default function LevelButton({
  level,
  locked = true,
  size = 68,
  color = "#ffcc00",
  border = "#d9a600",
  textColor = "#ffffff",
  className = "",
}: LevelButtonProps) {
  const nav = useNavigate();

  const press = Math.round(size * 0.06);
  const hardShadowY = Math.round(size * 0.09);
  const softShadowY = Math.round(size * 0.15);
  const softShadowBlur = Math.round(size * 0.26);

  const baseStyle: CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    backgroundColor: locked ? "#c7c7c7" : color,
    color: textColor,
    border: "none",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
    fontSize: Math.max(14, Math.round(size * 0.35)),
    position: "relative",
    cursor: locked ? "not-allowed" : "pointer",
    userSelect: "none",
    boxShadow: `0 ${hardShadowY}px 0 ${locked ? "#9a9a9a" : border},
                0 ${softShadowY}px ${softShadowBlur}px rgba(0,0,0,.25)`,
    transition: "transform .2s ease, box-shadow .2s ease, filter .2s ease",
  };

  const handleClick = ():void => {
    if (!locked) {
      nav(`/levels/${level}`);
    }
  };

  return (
    <button
      type="button"
      className={`level-button ${locked ? "level-button--locked" : ""} ${className}`}
      style={baseStyle}
      disabled={locked}
      aria-label={`Nível ${level}${locked ? " bloqueado" : ""}`}
      title={`Nível ${level}`}
      onClick={handleClick}
    >
      <span className="level-button__label">{level}</span>

      {locked && (
        <span className="level-button__lock" style={{ position: "absolute", right: -4, bottom: -4, color: "#555" }}>
          <Lock />
        </span>
      )}

      <style>{`
        .level-button:active:not(.level-button--locked) {
          transform: translateY(${press}px);
          box-shadow:
            0 ${Math.max(0, hardShadowY - press)}px 0 ${border},
            0 ${Math.max(0, softShadowY - press)}px ${softShadowBlur}px rgba(0,0,0,.25);
        }
        .level-button:focus-visible {
          outline: 3px solid #2d6cdf;
          outline-offset: 2px;
        }
        .level-button--locked { filter: grayscale(.2); opacity: .85; }
      `}</style>
    </button>
  );
}
