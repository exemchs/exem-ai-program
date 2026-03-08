import { useEffect } from "react";

export default function UnicornEmbed() {
  useEffect(() => {
    // Add global style to hide unicorn studio badge
    const style = document.createElement("style");
    style.innerHTML = `
      a[href*="unicorn.studio"] {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);

    // Load Unicorn Studio script
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.1/dist/unicornStudio.umd.js";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.UnicornStudio) {
        // @ts-ignore
        window.UnicornStudio.init();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-60">
      <div
        style={{ width: "100%", height: "100%" }}
        data-us-project="wR7neCzxMdk6sttaOSHc"
      ></div>
    </div>
  );
}
