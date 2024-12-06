import { NextRequest, NextResponse } from "next/server";
import { read } from "@db-crud-todo";

// A função get agora retorna os dados diretamente
const get = async (req: NextRequest) => {
    const ALL_TODOS = read(); // Lê os dados
    console.log("Dados lidos do banco:", ALL_TODOS); // Adicionando o log para depuração
    return NextResponse.json({
        todos: ALL_TODOS, // Retorna os dados como JSON
    });
};

export const todoController = {
    get,
};
