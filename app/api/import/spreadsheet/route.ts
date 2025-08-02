/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import path from "path";
import * as XLSX from "xlsx";
import { connectDB } from "@/utils/mongodb";
import AccountList from "@/models/AccountList";


export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  await connectDB();

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // parse workbook
  const data = Buffer.from(await file.arrayBuffer());
  const wb   = XLSX.read(data, { type: "buffer" });
  const sheet= wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: [
    "fullnames","contractNumber","courseOfStudy",
    "bankName","accountNumber","cofirmationDate","studentId","signature"
  ], range: 1 });

  // sanitize & set default status
  const docs = (rows as any[]).map(r => ({
    fullnames:      String(r.fullnames).trim(),
    contractNumber: String(r.contractNumber).trim(),
    courseOfStudy:  String(r.courseOfStudy).trim(),
    bankName:       String(r.bankName).trim(),
    accountNumber:  String(r.accountNumber).trim(),
    studentId:      r.studentId ? String(r.studentId).trim() : undefined,
    status:         "pending",
  }));

  // upsert each row to avoid duplicates
  for (const doc of docs) {
    await AccountList.updateOne(
      { contractNumber: doc.contractNumber },
      { $set: doc },
      { upsert: true }
    );
  }

  return NextResponse.json({ success: true, imported: docs.length });
}
