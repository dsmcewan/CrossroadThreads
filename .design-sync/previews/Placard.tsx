import { Placard } from "crossroad-collection";
import { persephone, rudis, wings } from "./_fixtures";

const wingOf = (slug: string) => wings.find((w) => w.slug === slug);

// The wall label: wing + stop kicker, title, tagline, a facts table (era,
// provenance, medium, edition), the placard prose, and a StatusChip. When the
// exhibit has audio, an AudioTourButton sits in the header row.
export function OnDisplay() {
  return (
    <div style={{ maxWidth: 440, padding: 16 }}>
      <Placard design={persephone} wing={wingOf(persephone.wing)} />
    </div>
  );
}

// IN CONSERVATION exhibit — also carries a conservator's note.
export function InConservation() {
  return (
    <div style={{ maxWidth: 440, padding: 16 }}>
      <Placard design={rudis} wing={wingOf(rudis.wing)} />
    </div>
  );
}
