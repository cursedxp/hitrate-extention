import Panel from "./ui/panel";

export default function App() {
  return (
    <div className="w-full h-full font-sans antialiased p-4">
      <button
        onClick={() => Panel()}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mb-4"
      >
        Open Interface
      </button>
    </div>
  );
}
