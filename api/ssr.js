import { buffer } from "node:stream/consumers";

const serverModule = await import("../dist/server/server.js");
const serverHandler = serverModule.default ?? serverModule;

export default async function handler(req, res) {
  try {
    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host || "localhost";
    const url = new URL(req.url, `${proto}://${host}`);

    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v === undefined) continue;
      headers.set(k, Array.isArray(v) ? v.join(",") : String(v));
    }

    const bodyBuf = await buffer(req);
    const request = new Request(url.toString(), {
      method: req.method,
      headers,
      body: bodyBuf && bodyBuf.length ? bodyBuf : undefined,
    });

    const response = await serverHandler.fetch(request, {}, {});

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      // Some headers like transfer-encoding should be omitted
      if (key.toLowerCase() === "transfer-encoding") return;
      res.setHeader(key, value);
    });

    const arr = await response.arrayBuffer();
    res.end(Buffer.from(arr));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("Internal Server Error");
  }
}
