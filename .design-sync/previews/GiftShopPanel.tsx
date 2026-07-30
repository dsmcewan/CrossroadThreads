import { GiftShopPanel } from "crossroad-collection";
import { persephone } from "./_fixtures";

// "The gift shop is the museum." Lists a design's product offerings (tee,
// poster) each with an ACQUIRE button. Commerce is pre-production, so ACQUIRE
// surfaces the placeholder notice.
export function Default() {
  return (
    <div style={{ maxWidth: 420, padding: 16 }}>
      <GiftShopPanel design={persephone} />
    </div>
  );
}
