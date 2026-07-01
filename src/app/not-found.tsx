import Link from "next/link";
import { COPY } from "@/lib/copy";

export default function NotFound() {
  return (
    <main
      className="rise"
      style={{ maxWidth: 560, margin: "0 auto", padding: "64px 20px", textAlign: "center" }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display), serif",
          fontSize: 28,
          color: "var(--ink)",
          margin: "0 0 16px",
        }}
      >
        {COPY.notFoundTitle}
      </h2>
      <p style={{ fontStyle: "italic", color: "var(--brown-mid)", lineHeight: 1.6 }}>
        {COPY.notFoundBody}
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginTop: 24,
          fontFamily: "var(--font-caps), serif",
          fontSize: 13,
          letterSpacing: "0.12em",
          color: "var(--gold-dark)",
        }}
      >
        ← {COPY.returnToGallery}
      </Link>
    </main>
  );
}
