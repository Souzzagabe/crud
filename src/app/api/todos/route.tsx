import { NextRequest, NextResponse } from "next/server";
import { todoController } from "@server/controller/todo";

export async function GET(request: NextRequest) {
    console.log(request.method);

    if (request.method === "GET") {
        // Assumindo que `todoController.get` retorna os dados diretamente
        const data = await todoController.get(request);
        return NextResponse.json(data);
    }

    // Retorna um erro para métodos não permitidos
    return NextResponse.json(
        {
            message: "Method not allowed",
        },
        { status: 405 } // Define o status HTTP como 405
    );
}
