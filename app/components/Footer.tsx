export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-white/10 bg-black">
      <div className="mx-auto max-w-5xl px-6 py-4 text-center">
        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} Bangladesh Student Association · Texas
          State University
        </p>
      </div>
    </footer>
  );
}
