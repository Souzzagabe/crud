import { NextRequest, NextResponse } from "next/server";
import { todoController } from "@/server/controller/todo";

export async function GET(request: NextRequest) {
    return todoController.get(request); // Handler para GET
}

export async function POST(request: NextRequest) {
    return todoController.create(request); // Handler para POST
}
