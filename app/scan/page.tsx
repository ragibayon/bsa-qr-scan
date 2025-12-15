// app/scan/page.tsx
"use client";

import { useState } from "react";
import { ScanView } from "./ScanView";
import { useQrScanner } from "./useQrScanner";
import { useMemberLookup } from "./useMemberLookup";

export default function ScanPage() {
  const [membershipId, setMembershipId] = useState<string | null>(null);

  const { member, setMember } = useMemberLookup(membershipId);

  const scanner = useQrScanner((text) => {
    setMembershipId(text);
  });

  return (
    <ScanView
      isScanning={scanner.isScanning}
      errorMsg={scanner.errorMsg}
      membershipId={membershipId}
      member={member}
      onStart={() => {
        setMembershipId(null);
        setMember(null);
        scanner.start();
      }}
      onStop={scanner.stop}
      onRestart={() => {
        setMembershipId(null);
        setMember(null);
        scanner.start();
      }}
    />
  );
}
