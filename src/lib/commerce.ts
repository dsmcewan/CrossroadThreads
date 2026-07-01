import type { Design, ProductOffering } from "./types";

/**
 * Commerce abstraction. The museum is pre-production: the active provider is
 * `placeholder`. Wiring a real provider later (Shopify Buy Button, Printful
 * links, Snipcart) means implementing one provider object here and filling
 * `externalId` on product offerings in content/designs.json — no component
 * changes.
 */
export type BuyAction =
  | { kind: "message"; text: string }
  | { kind: "link"; href: string; label: string };

export interface CommerceProvider {
  id: "placeholder" | "shopify" | "printful" | "snipcart";
  isLive: boolean;
  getBuyAction(design: Design, offering: ProductOffering): BuyAction;
}

const placeholderProvider: CommerceProvider = {
  id: "placeholder",
  isLive: false,
  getBuyAction() {
    return {
      kind: "message",
      text: "The gift shop is currently being installed. The docents thank you for your patience.",
    };
  },
};

export const commerce: CommerceProvider = placeholderProvider;
