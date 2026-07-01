/** Museum-voice string constants. One place to edit the institution's tone. */
export const COPY = {
  department: "Department of Applied Mythology",
  siteTitle: "THE CROSSROAD ARCHIVE",
  siteTitleLines: ["THE CROSSROAD", "ARCHIVE"] as const,
  subtitle: "A permanent exhibit of Crossroad Threads · Admission is the joke itself",
  footer: "Crossroad Threads · The gift shop is the museum",
  allWings: "All Wings",
  audioGuidePrompt: "Press play on your handset",
  returnToGallery: "Return to Gallery",
  notFoundTitle: "This exhibit has been deaccessioned",
  notFoundBody:
    "The work you are looking for is no longer on display, was never on display, or exists only in the registrar's imagination. The docents apologize for any inconvenience.",
  giftShopHeading: "The Gift Shop",
  acquireButton: "ACQUIRE",
} as const;

/** e.g. "One hundred three works · Six wings open · No flash photography" */
export function facadeCounts(works: number, wings: number): string {
  return `${numberWord(works)} works · ${numberWord(wings)} wings open · No flash photography`;
}

function numberWord(n: number): string {
  const small = [
    "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
    "Nine", "Ten", "Eleven", "Twelve",
  ];
  return n < small.length ? small[n] : String(n);
}
