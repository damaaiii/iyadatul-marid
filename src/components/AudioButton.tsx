import React, { useState } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { arabicAudio } from "../utils/audio.ts";

interface AudioButtonProps {
  text: string;
  className?: string;
  rate?: number;
  label?: string;
  variant?: "primary" | "secondary" | "subtle" | "iconOnly";
  size?: "sm" | "md" | "lg";
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  className = "",
  rate = 0.85,
  label,
  variant = "subtle",
  size = "md",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      arabicAudio.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    await arabicAudio.speak(text, rate);
    setIsPlaying(false);
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const variantClasses = {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95",
    secondary:
      "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 active:scale-95",
    subtle:
      "bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 active:scale-95",
    iconOnly:
      "p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors active:scale-90",
  };

  if (variant === "iconOnly") {
    return (
      <button
        type="button"
        onClick={handlePlay}
        title="Dengarkan pelafalan Arab"
        className={`inline-flex items-center justify-center transition-all cursor-pointer ${variantClasses.iconOnly} ${className}`}
      >
        {isPlaying ? (
          <span className="relative flex items-center justify-center text-emerald-600">
            <Volume2 className={`${iconSizes[size]} animate-pulse`} />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </span>
        ) : (
          <Volume2 className={iconSizes[size]} />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      className={`inline-flex items-center font-medium rounded-lg transition-all cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      title="Dengarkan pelafalan bahasa Arab"
    >
      {isPlaying ? (
        <>
          <VolumeX className={`${iconSizes[size]} animate-pulse text-amber-500`} />
          <span>{label || "Berhenti"}</span>
        </>
      ) : (
        <>
          <Volume2 className={iconSizes[size]} />
          <span>{label || "Dengarkan"}</span>
        </>
      )}
    </button>
  );
};
