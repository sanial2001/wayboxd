import { NextResponse } from 'next/server';
import { getSwaggerSpec } from '@/app/_lib/swagger.config';

export async function GET() {
  const appEnv = process.env.APP_ENV || 'development';
  const isProduction = appEnv === 'production';

  if (isProduction) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  return NextResponse.json(getSwaggerSpec());
}
