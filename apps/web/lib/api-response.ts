import { NextResponse } from 'next/server';

export function getRequestId(req: Request): string {
  return req.headers.get('x-request-id') || crypto.randomUUID();
}

export function jsonError(
  req: Request,
  status: number,
  message: string,
  extra: Record<string, unknown> = {},
  headers: Record<string, string> = {}
) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      request_id: getRequestId(req),
      ...extra
    },
    { status, headers }
  );
}

export function jsonOk(
  req: Request,
  payload: Record<string, unknown>,
  headers: Record<string, string> = {}
) {
  return NextResponse.json(
    {
      ok: true,
      request_id: getRequestId(req),
      ...payload
    },
    { headers }
  );
}
