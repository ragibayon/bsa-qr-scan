"use client";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <h2 className="text-3xl font-semibold mb-6">Membership QR Scan</h2>

      <button className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition">
        Start Scanner
      </button>
    </div>
  );
}
