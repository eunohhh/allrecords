import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
const ADMIN_KEY = process.env.GRAPHQL_ADMIN_KEY;

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 500;

// 서버 사이드 프록시. 브라우저가 백엔드 /graphql 을 직접 호출하면
// X-Admin-Key 를 실을 수 없으므로(번들에 노출됨) 이 라우트가 대신 붙인다.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    if (!ADMIN_KEY) {
      return NextResponse.json(
        { error: "GRAPHQL_ADMIN_KEY is not set" },
        { status: 500 }
      );
    }

    const raw = new URL(req.url).searchParams.get("limit");
    const parsed = Number.parseInt(raw ?? "", 10);
    const limit = Number.isFinite(parsed)
      ? Math.min(Math.max(parsed, 1), MAX_LIMIT)
      : DEFAULT_LIMIT;

    const upstream = await fetch(`${API_BASE}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": ADMIN_KEY,
      },
      body: JSON.stringify({
        query: `query ($limit: Int!) {
          historianGraph(limit: $limit) {
            nodes { id created title content sourcePath theme source kind era year tags people }
            edges { from to type }
          }
        }`,
        variables: { limit },
      }),
      cache: "no-store",
    });

    const json = (await upstream.json().catch(() => null)) as any;

    if (!upstream.ok || json?.errors) {
      const message =
        json?.errors?.[0]?.message ?? `Upstream error (${upstream.status})`;
      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json(json.data.historianGraph);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
