import { ExhibitCard } from "crossroad-collection";
import { persephone, boudica, rudis } from "./_fixtures";

// A gallery tile: framed artwork, title, stop number, and a small StatusChip.
// The whole card is a link to the exhibit. `index` staggers the rise-in.
export function OnDisplay() {
  return (
    <div style={{ width: 300, padding: 16 }}>
      <ExhibitCard design={persephone} index={0} />
    </div>
  );
}

export function UnderStudy() {
  return (
    <div style={{ width: 300, padding: 16 }}>
      <ExhibitCard design={boudica} index={1} />
    </div>
  );
}

export function InConservation() {
  return (
    <div style={{ width: 300, padding: 16 }}>
      <ExhibitCard design={rudis} index={2} />
    </div>
  );
}
