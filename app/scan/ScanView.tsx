"use client";

import { MemberResponse } from "./types";

interface Props {
  isScanning: boolean;
  errorMsg: string | null;
  membershipId: string | null;
  member: MemberResponse | null;
  onStart: () => void;
  onStop: () => void;
  onRestart: () => void;
}

export function ScanView({
  isScanning,
  errorMsg,
  membershipId,
  member,
  onStart,
  onStop,
  onRestart,
}: Props) {
  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-black text-white">
      {/* Title */}
      <h1 className="text-3xl font-medium mt-4 mb-8 text-center tracking-wide">
        QR Scanner
      </h1>

      <div className="flex flex-col items-center gap-6 w-full">
        {/* Error */}
        {errorMsg && <p className="text-red-400 mb-4">{errorMsg}</p>}

        {/* Start */}
        {!isScanning && !member && (
          <button
            onClick={onStart}
            className="px-4 py-2 bg-white text-black rounded-lg
                       transition-colors duration-200
                       hover:bg-blue-500 hover:text-white"
          >
            Start Scanner
          </button>
        )}

        {/* Scanner */}
        {isScanning && (
          <>
            <div
              id="qr-reader"
              className="w-full max-w-xs bg-black rounded-lg"
            />
            <button
              onClick={onStop}
              className="mt-4 px-4 py-2 bg-white text-black rounded-lg
                         transition-colors duration-200
                         hover:bg-red-500 hover:text-white"
            >
              Stop Scanner
            </button>
          </>
        )}

        {/* Result */}
        {member && (
          <>
            <div
              className={`mt-6 p-6 rounded-lg w-full max-w-xs text-center ${
                !member.valid
                  ? "bg-red-700 text-white border border-red-500"
                  : member.active
                  ? "bg-green-800 text-white border border-green-500"
                  : "bg-white text-black"
              }`}
            >
              {/* Membership ID (always shown first) */}
              {membershipId && (
                <p className="text-sm opacity-90 font-mono break-all mb-2">
                  {membershipId}
                </p>
              )}

              {/* INVALID */}
              {!member.valid ? (
                <>
                  <h2
                    className="inline-block mt-3 px-3 py-1 text-xs font-semibold
                       bg-red-600 text-white rounded-full"
                  >
                    Not verified
                  </h2>
                </>
              ) : member.active ? (
                <>
                  <p className="text-lg font-medium">{member.name}</p>

                  <span
                    className="inline-block mt-3 px-3 py-1 text-xs font-semibold
                       bg-green-600 text-white rounded-full"
                  >
                    Verified
                  </span>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">{member.name}</p>
                  <p className="text-sm mt-2">
                    Last Paid: <b>{member.lastPaidSemester || "None"}</b>
                  </p>
                </>
              )}
            </div>

            {/* Restart */}
            <button
              onClick={onRestart}
              className="mt-6 px-6 py-3 bg-white text-black rounded-lg
                 transition-colors duration-200
                 hover:bg-blue-500 hover:text-white"
            >
              Start New Scan
            </button>
          </>
        )}
      </div>
    </div>
  );
}
