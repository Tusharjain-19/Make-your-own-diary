"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#f9f9f7",
          color: "#1a1c1b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 440, padding: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              backgroundColor: "#1a1a1a",
              color: "#fff",
              fontSize: 18,
              marginBottom: 24,
            }}
          >
            S
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.01em" }}>
            Critical Error
          </h1>
          <p style={{ fontSize: 14, color: "#6b6b66", lineHeight: 1.7, marginTop: 12 }}>
            A critical error occurred. Please refresh or contact us at{" "}
            <a href="mailto:hello@storybound.app" style={{ color: "#1a1a1a" }}>
              hello@storybound.app
            </a>
          </p>
          {error.digest && (
            <p style={{ fontSize: 11, color: "#999", fontFamily: "monospace", marginTop: 8 }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "10px 24px",
              fontSize: 13,
              fontWeight: 500,
              backgroundColor: "#1a1a1a",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
