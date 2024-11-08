function createHitMagnetButton() {
  const button = document.createElement("button");
  button.className = "hitmagnet-save-button";
  button.innerHTML = "💾";
  button.style.cssText = `
    background-color: transparent;
    color: #606060;
    border: none;
    font-size: 12px;
    cursor: pointer;
    padding: 0 4px;
    margin-left: 4px;
    display: inline-flex;
    align-items: center;
    transition: color 0.2s;
  `;

  button.addEventListener("mouseenter", () => {
    button.style.color = "#ff0000";
  });

  button.addEventListener("mouseleave", () => {
    button.style.color = "#606060";
  });

  return button;
}

function addButtonsToVideos() {
  // Select all video items on the page
  const videoItems = document.querySelectorAll(
    "ytd-rich-item-renderer, ytd-compact-video-renderer"
  );

  videoItems.forEach((videoItem) => {
    // Check if button is already added
    if (videoItem.querySelector(".hitmagnet-save-button")) {
      return;
    }

    // Find the metadata line (where channel name and publish date are)
    const metadataLine = videoItem.querySelector("#metadata-line");
    if (!metadataLine) return;

    // Create button
    const button = createHitMagnetButton();

    // Add click event listener
    button.addEventListener("click", (e) => {
      e.stopPropagation();

      const panel = document.getElementById("hitmagnet-panel");
      if (!panel) return;

      const thumbnailsContainer = panel.querySelector("#thumbnail-container");

      // Create and add the thumbnail element
      const thumbnailContainer = videoItem.querySelector("#thumbnail");
      const videoLink = thumbnailContainer?.href;
      const thumbnailImg = thumbnailContainer?.querySelector("img");
      const videoTitle = videoItem
        .querySelector("#video-title")
        ?.textContent?.trim();

      // Create thumbnail element
      const thumbnailElement = document.createElement("div");
      thumbnailElement.style.cssText = `
        position: relative;
        flex: 0 0 200px;
        cursor: pointer;
      `;

      thumbnailElement.innerHTML = `
        <img src="${thumbnailImg?.src}" alt="${videoTitle}" style="
          width: 200px;
          height: 112px;
          object-fit: cover;
          border-radius: 4px;
        "/>
        <div style="
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0,0,0,0.5);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: background-color 0.2s;
        ">×</div>
      `;

      // Add hover effect for remove button
      const closeButton = thumbnailElement.querySelector(
        'div[style*="position: absolute"]'
      );
      closeButton.addEventListener("mouseenter", () => {
        closeButton.style.backgroundColor = "rgba(0,0,0,0.7)";
      });
      closeButton.addEventListener("mouseleave", () => {
        closeButton.style.backgroundColor = "rgba(0,0,0,0.5)";
      });

      // Add click handler to remove thumbnail
      closeButton.onclick = (e) => {
        e.stopPropagation();
        thumbnailElement.remove();
        updateThumbnailCounter();

        // Hide panel if no thumbnails left
        if (thumbnailsContainer.children.length === 0) {
          panel.style.display = "none";
        }
      };

      // Add click handler to open video
      thumbnailElement.onclick = (e) => {
        if (e.target !== closeButton) {
          window.open(videoLink, "_blank");
        }
      };

      thumbnailsContainer.appendChild(thumbnailElement);

      // Update the counter after adding the thumbnail
      const counter = panel.querySelector("#thumbnail-counter");
      const count = thumbnailsContainer.children.length;
      counter.textContent = `${count} file${count !== 1 ? "s" : ""} selected`;

      // Show panel if it was hidden
      panel.style.display = "block";
    });

    // Add a separator dot before the button
    const separator = document.createElement("span");
    separator.textContent = "•";
    separator.style.cssText = `
      margin: 0 4px;
      color: #606060;
      font-size: 12px;
    `;

    // Add button and separator to metadata line
    metadataLine.appendChild(separator);
    metadataLine.appendChild(button);
  });
}

// Initial run
addButtonsToVideos();

// Create an observer to handle dynamically loaded content
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      addButtonsToVideos();
    }
  });
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

function updateThumbnailCounter() {
  const panel = document.getElementById("hitmagnet-panel");
  const counter = panel.querySelector("#thumbnail-counter");
  const thumbnailContainer = panel.querySelector("#thumbnail-container");
  const count = thumbnailContainer.children.length;
  counter.textContent = `${count} file${count !== 1 ? "s" : ""} selected`;
}
