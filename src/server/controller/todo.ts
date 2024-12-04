import { read } from "@db-crud-todo";
import { NextRequest, NextResponse } from "next/server";

const get = (req: NextRequest) => {
    const ALL_TODOS = read(); // Função para obter os todos
    return NextResponse.json({
        todos: ALL_TODOS,
    });
};

export const todoController = {
    get,
};
