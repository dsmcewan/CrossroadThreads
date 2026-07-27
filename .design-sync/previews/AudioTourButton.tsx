import { AudioTourButton } from "crossroad-collection";

// The audio-tour handset: a small headphones button badged with the stop
// number. `playing` toggles the visual state; `onToggle` reports user intent.
export function Idle() {
  return (
    <div style={{ padding: 28 }}>
      <AudioTourButton slug="persephone" stopNumber={1} playing={false} onToggle={() => {}} />
    </div>
  );
}

export function Playing() {
  return (
    <div style={{ padding: 28 }}>
      <AudioTourButton slug="persephone" stopNumber={7} playing={true} onToggle={() => {}} />
    </div>
  );
}
