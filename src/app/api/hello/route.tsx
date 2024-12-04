// import { NextResponse } from "next/server";

// export async function GET() {
//     return NextResponse.json({ message: 'Hello, World!' });
// }

// export default function handler (request, response) {
//     response.status(200).json({message: "olá mundo"})
// }

// export async function GET(request: Request) {
//     return new Response(JSON.stringify({ message: "olá mundo" }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
  

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: "olá mundo" });
}
