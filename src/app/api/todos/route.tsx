import { NextRequest, NextResponse } from "next/server";
import { todoController } from "@server/controller/todo";

export async function GET(request: NextRequest) {
    console.log(request.method); // Verifica o método da requisição

    if (request.method === "GET") {
        // Chama o controller para obter os dados
        const response = await todoController.get(request);

        // Obtém os dados JSON da resposta
        const data = await response.json(); // Agora podemos acessar o JSON corretamente

        // Log dos dados para verificar
        console.log("Dados retornados do todoController.get:", data);

        return NextResponse.json(data); // Retorna os dados como resposta
    }

    // Retorna erro para métodos não permitidos
    return NextResponse.json(
        {
            message: "Method not allowed",
        },
        { status: 405 } // Status HTTP 405 para método não permitido
    );
}
