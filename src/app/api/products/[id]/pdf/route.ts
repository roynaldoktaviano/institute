// app/api/products/[id]/pdf/route.ts
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

// Pastikan route ini dijalankan di Node.js, bukan edge
export const runtime = "nodejs";

interface RouteParams {
  params: { id: string };
}

export async function GET(req: Request, { params }: RouteParams) {
  const { id } = params;

  // Launch browser Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
    await page.setCookie({
    name: "next-auth.session-token", // atau nama cookie yang dipakai
    value: "isi_cookie_sessimu",
    domain: "localhost",
    path: "/",
    httpOnly: true,
    secure: false,
    });

  // Pergi ke halaman produk
  await page.goto(`http://localhost:3000/products/${id}`, {
    waitUntil: "networkidle0", // tunggu hingga network idle
  });

  // Tunggu selector muncul, tambahan fallback timeout
  try {
    await page.waitForSelector("#product-detail", { timeout: 60000 });
  } catch (err) {
    console.error("Selector #product-detail tidak ditemukan:", err);
  }

  // Render halaman untuk PDF
  await page.emulateMediaType("screen");

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length.toString(),
      "Content-Disposition": `attachment; filename="product-${id}.pdf"`,
    },
  });
}
