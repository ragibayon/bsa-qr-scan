"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useRef, useState, useEffect } from "react";
import axios from "axios";

interface MemberResponse {
  valid: boolean;
  name?: string;
  lastPaidSemester?: string;
  active: boolean;
}

export default function ScanPage() {
  const [membershipId, setMembershipId] = useState<string | null>(null);
  const [member, setMember] = useState<MemberResponse | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  /** Safe stop function */
  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (!scanner) {
      setIsScanning(false);
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch (e) {
      console.warn("stop() error:", e);
    }

    try {
      await scanner.clear();
    } catch (e) {
      console.warn("clear() error:", e);
    }

    scannerRef.current = null;
    setIsScanning(false);
  };

  /** Start scanner AFTER isScanning turns true */
  useEffect(() => {
    if (!isScanning) return;

    const start = async () => {
      setErrorMsg(null);

      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch {
        setErrorMsg("Camera permission denied.");
        setIsScanning(false);
        return;
      }

      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (text) => {
            setMembershipId(text);
            stopScanner(); // safe stop
          },
          (errorMessage) => {
            setErrorMsg(errorMessage);
          }
        );
      } catch (err) {
        console.error("Start failed:", err);
        setErrorMsg("Failed to start scanner.");
        stopScanner();
      }
    };

    start();

    /** CLEANUP: do NOT stop scanner here (React is transitioning) */
    return () => {};
  }, [isScanning]);

  /** Start scanner button action */
  const handleStartScanner = () => {
    setMembershipId(null);
    setMember(null);
    setErrorMsg(null);
    setIsScanning(true);
  };

  /** Fetch member info */
  useEffect(() => {
    if (!membershipId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/check", {
          params: { id: membershipId },
        });
        setMember(res.data);
      } catch {
        setMember(null);
      }
    };

    fetchData();
  }, [membershipId]);

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-black text-white">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mt-4 text-center tracking-wide">
        Bangladesh Stundent Association
      </h1>
      <h2 className="text-lg font-semibold mb-6 text-center">
        Texas State University <br /> Membership QR Scan
      </h2>

      {/* SHOW START BUTTON WHEN NOTHING IS SCANNING & NO RESULT */}
      {!isScanning && !member && (
        <button
          onClick={handleStartScanner}
          className="mt-4 px-4 py-2 bg-white text-black rounded-lg"
        >
          Start Scanner
        </button>
      )}

      {/* LIVE SCANNER UI */}
      {isScanning && (
        <>
          <div id="qr-reader" className="w-full max-w-xs mx-auto bg-black" />
          <button
            onClick={stopScanner}
            className="mt-4 px-4 py-2 bg-white text-black rounded-lg"
          >
            Stop Scanner
          </button>
        </>
      )}

      {/* SCANNED RAW TEXT */}
      {membershipId && (
        <p className="text-lg font-semibold mt-4 text-center break-words">
          Membership ID: {membershipId}
        </p>
      )}

      {/* RESULT CARD */}
      {member && (
        <>
          <div className="mt-6 p-6 rounded-lg bg-white text-black w-full max-w-xs text-center shadow-md">
            {!member.valid ? (
              <h2 className="text-xl font-bold">Invalid Member</h2>
            ) : member.active ? (
              <>
                <h2 className="text-xl font-bold">Active Member</h2>
                <p className="mt-2">{member.name}</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">Not Active</h2>
                <p className="mt-2">{member.name}</p>
                <p className="text-sm mt-1">
                  Last Paid: <b>{member.lastPaidSemester || "None"}</b>
                </p>
              </>
            )}
          </div>

          {/* ONE BUTTON BELOW CARD */}
          <button
            onClick={handleStartScanner}
            className="mt-6 px-6 py-3 bg-white text-black rounded-lg"
          >
            Start New Scan
          </button>
        </>
      )}
    </div>
  );
}
