export const saveUserToStorage = async (user) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ user }, resolve);
  });
};

export const getUserFromStorage = async () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(["user"], (result) => {
      resolve(result.user || null);
    });
  });
};

export const removeUserFromStorage = async () => {
  return new Promise((resolve) => {
    chrome.storage.local.remove(["user"], resolve);
  });
};
