export default function Panel({ user }) {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    try {
      const isSubscribed = Boolean(user?.isSubscribed);

      await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (subscriptionStatus) => {
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
              display: none;
            `;

            div.innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h1 style="font-size: 1.5rem; font-weight: bold; color:#000000">
                  Saved Thumbnails
                </h1>
                <div style="display: flex; gap: 8px;">
                  ${
                    !subscriptionStatus
                      ? `
                    <button id="subscribe-all" style="
                      background: #ff0000;
                      color: white;
                      padding: 8px 16px;
                      border: none;
                      border-radius: 4px;
                      cursor: pointer;
                      font-weight: 500;
                      display: flex;
                      align-items: center;
                      gap: 8px;
                    ">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      Subscribe
                    </button>
                  `
                      : ""
                  }
                  <button id="close-panel" style="
                    background: #f0f0f0;
                    color: #606060;
                    padding: 8px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s;
                  ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
              <div id="thumbnail-container" style="
                display: flex;
                gap: 12px;
                overflow-x: auto;
                white-space: nowrap;
                scrollbar-width: thin;
                scrollbar-color: #909090 #f0f0f0;
              ">
              </div>
              <div style="
                display: flex;
                align-items: center;
                gap: 8px;
              ">
                <span id="thumbnail-counter" style="
                  color: #606060;
                  font-size: 14px;
                ">0 files selected</span>
                <button id="download-all" style="
                  color: black;
                  background:none;
                  padding: 8px 16px;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  font-weight: 500;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-left: auto;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download
                </button>
              </div>
            `;

            // Add custom scrollbar styles for webkit browsers
            const style = document.createElement("style");
            style.textContent = `
              #thumbnail-container::-webkit-scrollbar {
                height: 8px;
              }
              #thumbnail-container::-webkit-scrollbar-track {
                background: #f0f0f0;
                border-radius: 4px;
              }
              #thumbnail-container::-webkit-scrollbar-thumb {
                background: #909090;
                border-radius: 4px;
              }
              #thumbnail-container::-webkit-scrollbar-thumb:hover {
                background: #707070;
              }
            `;
            document.head.appendChild(style);
            document.body.appendChild(div);

            // Add download functionality
            const downloadBtn = div.querySelector("#download-all");
            downloadBtn.addEventListener("click", async () => {
              const thumbnails = div.querySelectorAll(
                "#thumbnail-container img"
              );

              thumbnails.forEach(async (img) => {
                try {
                  // Get video ID from the thumbnail URL
                  const videoId = getVideoIdFromUrl(img.src);
                  if (!videoId) return;

                  // Construct high-res thumbnail URL
                  const highResUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

                  // Try to get maxresdefault first
                  let response = await fetch(highResUrl);

                  // If maxresdefault doesn't exist, fall back to hqdefault
                  if (!response.ok) {
                    const hqUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                    response = await fetch(hqUrl);
                  }

                  if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `thumbnail-${videoId}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  }
                } catch (error) {
                  console.error("Error downloading thumbnail:", error);
                }
              });
            });

            // Add close button functionality
            const closeBtn = div.querySelector("#close-panel");
            closeBtn.addEventListener("mouseenter", () => {
              closeBtn.style.backgroundColor = "#e0e0e0";
            });
            closeBtn.addEventListener("mouseleave", () => {
              closeBtn.style.backgroundColor = "#f0f0f0";
            });
            closeBtn.addEventListener("click", () => {
              const thumbnailContainer = div.querySelector(
                "#thumbnail-container"
              );
              thumbnailContainer.innerHTML = "";
              updateThumbnailCounter();
              div.style.display = "none";
            });

            // Helper function to extract video ID from thumbnail URL
            function getVideoIdFromUrl(url) {
              // Handle different YouTube thumbnail URL formats
              const patterns = [
                /\/vi\/([^/]+)\//, // Standard format
                /\/vi_webp\/([^/]+)\//, // WebP format
                /\/([^/]+)\/hqdefault/, // HQ default format
                /\/([^/]+)\/mqdefault/, // MQ default format
                /\/([^/]+)\/sddefault/, // SD default format
                /\/([^/]+)\/maxresdefault/, // Max res format
              ];

              for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match && match[1]) {
                  return match[1];
                }
              }

              return null;
            }

            // Add function to update counter
            function updateThumbnailCounter() {
              const thumbnailContainer = div.querySelector(
                "#thumbnail-container"
              );
              const counter = div.querySelector("#thumbnail-counter");
              const count = thumbnailContainer.children.length;
              counter.textContent = `${count} file${
                count !== 1 ? "s" : ""
              } selected`;
            }

            // Add subscribe button click handler if not subscribed
            if (!subscriptionStatus) {
              const subscribeBtn = div.querySelector("#subscribe-all");
              subscribeBtn.addEventListener("click", () => {
                window.open("https://your-subscription-url.com", "_blank");
              });
            }
          }
        },
        args: [isSubscribed],
      });
    } catch (err) {
      console.error("Failed to inject interface:", err);
    }
  });
}
