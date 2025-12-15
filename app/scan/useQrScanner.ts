import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";

export function useQrScanner(onScan: (text: string) => void) {
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) {
      setIsScanning(false);
      return;
    }

    try {
      if (scanner.isScanning) await scanner.stop();
    } catch {}

    try {
      await scanner.clear();
    } catch {}

    scannerRef.current = null;
    setIsScanning(false);
  }, []);

  // Pause on background
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) stopScanner();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [stopScanner]);

  // Start camera
  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    setTimeout(async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 5, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onScan(decodedText);
            stopScanner();
          },
          () => {}
        );
      } catch {
        setErrorMsg("Failed to initialize camera.");
        stopScanner();
      }
    }, 300);

    return () => {
      stopScanner();
    };
  }, [isScanning, onScan, stopScanner]);

  return {
    isScanning,
    errorMsg,
    start: () => {
      setErrorMsg(null);
      setIsScanning(true);
    },
    stop: stopScanner,
  };
}
