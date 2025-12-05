import { NextResponse } from "next/server";
import members from "@/app/data/members.json";

// Load active semester from env (fallback for safety)
const activeSemester = process.env.ACTIVE_SEMESTER?.trim() || "Fall 2025";

// Convert semester to sortable numeric index
function semesterRank(sem: string) {
  if (!sem) return 0;
  const [term, year] = sem.split(" ");
  const order: Record<string, number> = {
    Spring: 1,
    Summer: 2,
    Fall: 3,
  };
  return parseInt(year) * 10 + (order[term] || 0);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { valid: false, error: "Missing ID" },
      { status: 400 }
    );
  }

  const normalized = id.trim().toLowerCase();
  const member = (members as any)[normalized];

  // Member not found in database
  if (!member) {
    return NextResponse.json({
      valid: false,
      active: false,
      name: null,
      lastPaidSemester: null,
    });
  }

  // Sort payment history safely
  const sortedHistory = [...member.paymentHistory].sort(
    (a, b) => semesterRank(a.semester) - semesterRank(b.semester)
  );

  const lastPayment = sortedHistory.at(-1);
  const isActive =
    lastPayment?.semester === activeSemester && lastPayment?.paid === true;

  return NextResponse.json({
    valid: true,
    active: isActive,
    name: member.name,
    lastPaidSemester: lastPayment?.semester ?? null,
  });
}
