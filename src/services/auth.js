import { auth } from "./firebase";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

export const signInWithGoogle = () => {
  return new Promise((resolve, reject) => {
    const handleSignIn = async (token) => {
      try {
        // Create credential with the token
        const credential = GoogleAuthProvider.credential(null, token);

        // Sign in to Firebase with the credential
        const result = await signInWithCredential(auth, credential);

        // Return both token and user info
        resolve({
          token,
          user: {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          },
        });
      } catch (error) {
        console.error("Firebase auth error:", error);
        if (error.code === "auth/invalid-credential") {
          // Remove the cached token
          chrome.identity.removeCachedAuthToken({ token }, () => {
            // Clear any existing token
            chrome.identity.clearAllCachedAuthTokens(() => {
              // Get a new token and retry
              chrome.identity.getAuthToken(
                { interactive: true },
                (newToken) => {
                  if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                  }
                  handleSignIn(newToken);
                }
              );
            });
          });
        } else {
          reject(error);
        }
      }
    };

    // Clear any existing tokens before starting
    chrome.identity.clearAllCachedAuthTokens(() => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!token) {
          reject(new Error("Failed to get authentication token"));
          return;
        }

        handleSignIn(token);
      });
    });
  });
};

export const signOut = async () => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken(
      { interactive: false },
      async function (token) {
        if (!token) {
          resolve();
          return;
        }

        try {
          // Sign out from Firebase
          await auth.signOut();

          // Revoke Chrome identity token
          chrome.identity.removeCachedAuthToken({ token }, function () {
            fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`)
              .then(() => resolve())
              .catch((error) => reject(error));
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};
