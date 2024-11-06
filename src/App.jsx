function App() {
  const openInterface = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      try {
        await chrome.scripting.insertCSS({
          target: { tabId: tabs[0].id },
          css: `
            .hitmagnet-interface {
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
            }
          `,
        });

        await chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            const div = document.createElement("div");
            div.className = "hitmagnet-interface";
            div.innerHTML = `
              <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
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
  };

  return (
    <div className="w-full h-full font-sans antialiased p-4">
      <button
        onClick={openInterface}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mb-4"
      >
        Open Interface
      </button>
    </div>
  );
}

export default App;
