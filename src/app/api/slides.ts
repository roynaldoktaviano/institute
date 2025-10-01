// pages/api/slides.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { exec } from "child_process";

const TMP_DIR = path.join(process.cwd(), "public", "slides"); // simpan PNG di public agar bisa diakses
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

async function downloadPPT(url: string, outputDir: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to download PPT");
  const buffer = Buffer.from(await res.arrayBuffer());
  const fileName = path.basename(url);
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

function convertPPTtoPNG(inputPath: string, outputDir: string) {
  return new Promise<void>((resolve, reject) => {
    exec(
      `libreoffice --headless --convert-to png --outdir "${outputDir}" "${inputPath}"`,
      (err, stdout, stderr) => {
        if (err) return reject(stderr);
        resolve();
      }
    );
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fileUrl } = req.query;
  if (!fileUrl || typeof fileUrl !== "string") return res.status(400).json({ error: "Missing fileUrl" });

  const pptName = path.parse(fileUrl).name;
  const outputDir = path.join(TMP_DIR, pptName);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  try {
    const localPPT = await downloadPPT(fileUrl, outputDir);
    await convertPPTtoPNG(localPPT, outputDir);

    // Ambil semua PNG hasil convert
    const slides = fs.readdirSync(outputDir)
      .filter(f => f.endsWith(".png"))
      .map(f => `/slides/${pptName}/${f}`); // public path

    res.status(200).json({ slides });
  } catch (err) {
    res.status(500).json({ error: "Conversion failed", details: err });
  }
}
