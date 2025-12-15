"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { MemberResponse } from "./types";

export function useMemberLookup(membershipId: string | null) {
  const [member, setMember] = useState<MemberResponse | null>(null);

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

  return { member, setMember };
}
