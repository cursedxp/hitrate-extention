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
      e.preventDefault();
      e.stopPropagation();

      const thumbnailContainer = videoItem.querySelector("#thumbnail");
      const videoLink = thumbnailContainer?.href;
      const thumbnailImg = thumbnailContainer?.querySelector("img");
      const videoTitle = videoItem
        .querySelector("#video-title")
        ?.textContent?.trim();
      const channelName = videoItem
        .querySelector("#channel-name")
        ?.textContent?.trim();

      console.log("Save video:", {
        title: videoTitle,
        url: videoLink,
        thumbnail: thumbnailImg?.src,
        channel: channelName,
      });
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
