import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = globalThis.process?.env?.BACKEND_URL || "http://localhost:4291"

async function proxy(request: NextRequest): Promise<NextResponse> {
    const path = request.nextUrl.pathname.replace('/api/backend', '');
    const url = `${BACKEND_URL}/api${path}${request.nextUrl.search}`;

    const response = await fetch(url, {
        method: request.method,
        headers: {
            'Content-Type': request.headers.get('Content-Type') || 'application/json',
            cookie: request.headers.get('cookie') || '',
        },
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text(),
    });

    const data = await response.text();

    return new NextResponse(data, {
        status: response.status,
        headers: {
            'Content-Type': response.headers.get('Content-Type') || 'application/json',
        }
    });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;