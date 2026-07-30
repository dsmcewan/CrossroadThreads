// Build .design-sync/ds-styles.css = the app's globals.css (design tokens,
// grain, base rules) PLUS the --font-display/body/caps definitions the app
// normally gets from next/font at runtime. The converter appends cssEntry
// verbatim into _ds_bundle.css, so pointing cssEntry here puts the font-var
// definitions into the styles.css closure — otherwise designs built with the
// DS fall back to serif because the vars are referenced but never defined.
// Regenerate whenever src/app/globals.css changes:
//   node .ds-sync/gen-css.mjs
import { readFileSync, writeFileSync } from "node:fs";

const globals = readFileSync("src/app/globals.css", "utf8");

const fontVars = `
/* --- design-sync: brand font variables (app supplies these via next/font at
   runtime; defined here so designs built with the DS get the real faces, not
   the serif fallback). Font families match fonts/fonts.css @font-face names. --- */
:root {
  --font-display: "Ultra DS", serif;
  --font-body: "IM Fell English DS", serif;
  --font-caps: "IM Fell English SC DS", serif;
}
`;

writeFileSync(".design-sync/ds-styles.css", globals.trimEnd() + "\n" + fontVars);
console.log("wrote .design-sync/ds-styles.css (globals.css + brand font vars)");
