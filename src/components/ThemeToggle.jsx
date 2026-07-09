import { MoonStar, Sun } from "lucide-react";

export default function ThemeToggle({ dark, onChange }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span 
        className="font-display text-sm sm:text-2xl"
        style={{ color: 'var(--hero-title-color)' }}
      >
        MODE
      </span>
      <button
        aria-label="Toggle theme"
        onClick={() => onChange((d) => !d)}
        className="hero-toggle-btn"
      >
        <span className="hero-toggle-emoji">{dark ? <MoonStar className="text-white" /> : <Sun />}</span>
        <div className={`hero-toggle-knob ${dark ? 'toggled' : ''}`} />
      </button>
    </div>
  );
}
