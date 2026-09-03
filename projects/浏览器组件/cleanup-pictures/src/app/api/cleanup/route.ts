import { NextResponse } from "next/server";

/**
 * 擦除接口。
 *
 * 配了 CLIPDROP_API_KEY 就转发到 ClipDrop 的真实 inpainting 接口；
 * 没配就返回 501，前端会退回本地的兜底算法（见 lib/inpaint.ts）。
 */

const CLIPDROP_ENDPOINT = "https://clipdrop-api.co/cleanup/v1";

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, payload = ""] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function POST(request: Request) {
  const apiKey = process.env.CLIPDROP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "NO_API_KEY", message: "服务端未配置 CLIPDROP_API_KEY，请使用本地兜底算法" },
      { status: 501 },
    );
  }

  let body: { image?: string; mask?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  if (!body.image || !body.mask) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  const form = new FormData();
  form.append("image_file", dataUrlToBlob(body.image), "image.png");
  form.append("mask_file", dataUrlToBlob(body.mask), "mask.png");

  try {
    const upstream = await fetch(CLIPDROP_ENDPOINT, {
      method: "POST",
      headers: { "x-api-key": apiKey },
      body: form,
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      return NextResponse.json(
        { error: "UPSTREAM_ERROR", status: upstream.status, detail },
        { status: 502 },
      );
    }

    const buffer = await upstream.arrayBuffer();
    return new NextResponse(buffer, {
      headers: { "content-type": upstream.headers.get("content-type") ?? "image/png" },
    });
  } catch {
    return NextResponse.json({ error: "UPSTREAM_UNREACHABLE" }, { status: 502 });
  }
}
