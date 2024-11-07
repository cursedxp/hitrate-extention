export const signInWithGoogle = () => {
  return new Promise((resolve, reject) => {
    if (!chrome || !chrome.identity) {
      console.error("Chrome identity API not available");
      reject(new Error("Chrome identity API not available"));
      return;
    }

    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError) {
        console.error(
          "Error getting auth token:",
          chrome.runtime.lastError.message
        );
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      if (!token) {
        console.error("Failed to get authentication token");
        reject(new Error("Failed to get authentication token"));
        return;
      }

      resolve(token);
    });
  });
};

export const signOut = () => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: false }, function (token) {
      if (!token) {
        resolve();
        return;
      }

      // Revoke token
      chrome.identity.removeCachedAuthToken({ token }, function () {
        fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`)
          .then(() => resolve())
          .catch((error) => reject(error));
      });
    });
  });
};
