import Panel from "./ui/panel";
import GoogleIcon from "./components/icons/GoogleIcon";
import { signInWithGoogle, signOut } from "./services/auth";
import { useState } from "react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await signInWithGoogle();

      // Fetch user info using the token
      const userInfo = await fetchUserInfo(token);
      setUser(userInfo);
    } catch (err) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);
    } catch (err) {
      setError(err.message || "Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async (token) => {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }
    return response.json();
  };

  return (
    <div className="w-full h-full font-sans antialiased p-4">
      <div className="flex flex-col items-center justify-center mt-4">
        <h1 className="text-2xl font-bold mb-2">HitMagnet</h1>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Save YouTube video thumbnails to HitMagnet collections
        </p>
        {user ? (
          <div className="flex flex-col items-center">
            <img
              src={user.picture}
              alt="User Avatar"
              className="rounded-full w-16 h-16 mb-2"
            />
            <p className="text-lg font-bold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full px-4 py-2 font-bold bg-white shadow-md text-gray-700 rounded-xl hover:shadow-xl transition-shadow mt-4 border border-zinc-100 flex items-center justify-center gap-2 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing out..." : "Sign out"}
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full px-4 py-2 font-bold bg-white shadow-md text-gray-700 rounded-xl hover:shadow-xl transition-shadow mb-4 border border-zinc-100 flex items-center justify-center gap-2 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </button>
        )}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
      {user && <Panel />}
    </div>
  );
}
