import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  const { stream } = data;
  
  const API_SECRET = process.env.API_SECRET;
  
  const srtUrl = `srt://${stream.host || 'localhost'}:10800?streamid=#!::r=${stream.app}/${stream.name}?secret=${API_SECRET}&password=${stream.password},m=publish`;
  const rtmpUrl = `rtmp://${stream.host || 'localhost'}/${stream.app || ''}`;
  const rtmpKey = `/${stream.name}?secret=${API_SECRET}&password=${stream.password}`;
  
  return NextResponse.json({ 
    srtUrl,
    rtmpUrl,
    rtmpKey
  });
}
