import { ExhibitImage } from "crossroad-collection";
import { persephone, boudica } from "./_fixtures";

// Static-export-safe responsive <picture> with a bordered frame and blur-up
// background. `kind` picks the card (smaller) or full (detail) variant set.
export function Card() {
  return (
    <div style={{ width: 300, padding: 16 }}>
      <ExhibitImage images={persephone.images} alt={persephone.title} kind="card" sizes="300px" />
    </div>
  );
}

export function Full() {
  return (
    <div style={{ width: 420, padding: 16 }}>
      <ExhibitImage images={boudica.images} alt={boudica.title} kind="full" sizes="420px" loading="eager" />
    </div>
  );
}
