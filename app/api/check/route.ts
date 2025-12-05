import { NextResponse } from "next/server";
import members from "@/app/data/members.json";
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

  if (!member) {
    return NextResponse.json({
      valid: false,
      active: false,
      name: null,
      lastPaidSemester: null,
    });
  }

  // Determine active status based on payment history
  const lastPayment = member.paymentHistory.at(-1);
  const isActive = lastPayment?.semester === "Fall 2025" && lastPayment?.paid;

  return NextResponse.json({
    valid: true,
    active: isActive,
    name: member.name,
    lastPaidSemester: lastPayment?.semester ?? null,
  });
}
