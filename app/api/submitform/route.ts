import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { firstName, lastName, licenseNo, expiryDate, dob, address } = body;

    const { data, error } = await supabase
      .from("driving_licenses")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          license_no: licenseNo,
          expiry_date: expiryDate,
          dob,
          address,
          created_at: new Date(),
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Supabase insert error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
