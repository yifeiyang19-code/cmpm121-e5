import { LEVELS } from "../core/mod.ts";

export function LevelPicker(
  { current, onChoose }: {
    current: number;
    onChoose: (level: number) => void;
  },
) {
  return (
    <nav className="levels" aria-label="Levels">
      {LEVELS.map((level, index) => (
        <button
          key={level.name}
          type="button"
          aria-pressed={index === current}
          onClick={() => onChoose(index)}
        >
          {index + 1}. {level.name}
        </button>
      ))}
    </nav>
  );
}
