import Panel from "./ui/panel";
import GoogleIcon from "./components/icons/GoogleIcon";

export default function App() {
  return (
    <div className="w-full h-full font-sans antialiased p-4">
      <div className="flex flex-col items-center justify-center mt-4">
        <h1 className="text-2xl font-bold mb-2">HitMagnet</h1>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Save YouTube video thumbnails to HitMagnet collections
        </p>
        <button
          onClick={() => {
            console.log("Google sign in clicked");
          }}
          className="w-full px-4 py-2 font-bold bg-white shadow-md text-gray-700 rounded-xl hover:shadow-xl transition-shadow mb-4 border border-zinc-100 flex items-center justify-center gap-2 hover:text-blue-500"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
