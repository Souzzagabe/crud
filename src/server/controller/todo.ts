import { NextRequest, NextResponse } from "next/server";
import { todoRepository } from "@/server/repository/todo";
import { z as schema } from "zod";

const get = async (req: NextRequest) => {
    const query = req.nextUrl.searchParams;
    const page = Number(query.get("page"));
    const limit = Number(query.get("limit"));

    console.log("query.page", query.get("page"), typeof query.get("page"));

    if (isNaN(page)) {
        return NextResponse.json(
            {
                error: {
                    message: "'page' must be a number",
                },
            },
            { status: 400 }
        );
    }

    if (isNaN(limit)) {
        return NextResponse.json(
            {
                error: {
                    message: "'limit' must be a number",
                },
            },
            { status: 400 }
        );
    }

    try {
        const output = await todoRepository.get({
            page,
            limit,
        });

        return NextResponse.json({
            total: output.total,
            pages: output.pages,
            todos: output.todos,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: {
                    message: "An error occurred while fetching todos.",
                },
            },
            { status: 500 }
        );
    }
};

const create = async (req: NextRequest) => {
    try {
        const body = await req.json(); // Lê os dados enviados no body

        if (!body || !body.content) {
            return NextResponse.json(
                {
                    error: {
                        message: "'content' is required",
                    },
                },
                { status: 400 }
            );
        }

        // Chama o repositório para criar o Todo
        const createdTodo = await todoRepository.createByContent(body.content);

        return NextResponse.json({ todo: createdTodo }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                error: {
                    message: "An error occurred while creating a todo.",
                },
            },
            { status: 400 }
        );
    }
};


export const todoController = {
    get,
    create,
};
