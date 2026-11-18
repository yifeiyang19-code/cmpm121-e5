import { type ControllerName, CONTROLLERS } from "./controllers.ts";

export function ControlsPicker(
  { current, onChoose }: {
    current: ControllerName;
    onChoose: (name: ControllerName) => void;
  },
) {
  const names = Object.keys(CONTROLLERS) as ControllerName[];
  return (
    <fieldset className="controls">
      <legend>Controls</legend>
      {names.map((name) => (
        <button
          key={name}
          type="button"
          aria-pressed={name === current}
          onClick={() => onChoose(name)}
        >
          {CONTROLLERS[name].label}
        </button>
      ))}
    </fieldset>
  );
}
