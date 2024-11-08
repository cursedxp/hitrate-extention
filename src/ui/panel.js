export default function Panel() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          // Create panel if it doesn't exist
          if (!document.getElementById("hitmagnet-panel")) {
            const div = document.createElement("div");
            div.id = "hitmagnet-panel";
            div.style.cssText = `
              position: fixed;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              z-index: 9999;
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              width: 680px;
              padding: 16px;
              display: flex;
              flex-direction: column;
              gap: 12px;
            `;

            div.innerHTML = `
              <h1 style="font-size: 1.5rem; font-weight: bold; color:#000000">
                Saved Thumbnails
              </h1>
              <div id="thumbnail-container" style="
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                justify-content: start;
              "></div>
            `;

            document.body.appendChild(div);
          }
        },
      });
    } catch (err) {
      console.error("Failed to inject interface:", err);
    }
  });
}
