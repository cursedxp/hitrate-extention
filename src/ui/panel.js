export default function Panel() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          const div = document.createElement("div");
          div.style.cssText = `
              position: fixed;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              z-index: 9999;
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              width: 300px;
              padding: 16px;
              
            `;
          div.innerHTML = `
              <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color:#000000">
                Interface Mode
              </h1>
              <!-- Add your interface content here -->
            `;
          document.body.appendChild(div);
        },
      });
    } catch (err) {
      console.error("Failed to inject interface:", err);
    }
  });
}
