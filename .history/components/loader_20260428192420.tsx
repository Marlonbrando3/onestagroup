export default function FullscreenLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex gap-3">
        <span className="w-8 h-8 bg-yellow-900 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-6 h-6 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-4 h-4 bg-black rounded-full animate-bounce" />
      </div>
    </div>
  );
}
