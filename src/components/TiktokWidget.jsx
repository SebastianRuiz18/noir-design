// src/components/TiktokWidget.jsx
import React, { useEffect } from "react";

function TiktokWidget() {
  useEffect(() => {
    const scriptId = "elfsight-platform-script";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.id = scriptId;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div style={{ width: "100%", margin: "0 auto", padding: "0" }}>
      <div
        className="elfsight-app-c22d0d70-bf99-488f-8f87-86d44fba0f13"
        data-elfsight-app-lazy
      ></div>
    </div>
  );
}

export default TiktokWidget;
