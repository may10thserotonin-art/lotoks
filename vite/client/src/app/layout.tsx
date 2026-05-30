import "./globals.css";
import React from "react";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-primary/20 selection:text-primary">
        {/* Under-development notification bar */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "linear-gradient(90deg, #1a2f50 0%, #0B1D3A 50%, #1a2f50 100%)",
            borderBottom: "1px solid rgba(201,164,75,0.4)",
            padding: "8px 16px",
            textAlign: "center",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.02em",
            color: "#C9A44B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "14px" }}>🚧</span>
          <span>Our website is currently under development. Some features may be unavailable. Thank you for your patience!</span>
          <span style={{ fontSize: "14px" }}>🚧</span>
        </div>
        {/* Spacer so page content isn't hidden behind the banner */}
        <div style={{ height: "37px", flexShrink: 0 }} />
        {children}
      </body>
    </html>
  );
}
