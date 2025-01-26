import { NextRequest, NextResponse } from "next/server";
import { todoRepository } from "@/server/repository/todo";
import { z as schema } from "zod";

const get = async (req: NextRequest) => {
    const query = req.nextUrl.searchParams;
    const page = Number(query.get("page"));
    const limit = Number(query.get("limit"));

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
        const body = await req.json();

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

export const toggleDone = async (req: NextRequest, { params }: { params: { todoId: string } }) => {
    try {
        if (!params.todoId || typeof params.todoId !== "string") {
            return NextResponse.json(
                { error: { message: "Todo ID is required." } },
                { status: 400 }
            );
        }

        const updatedTodo = await todoRepository.toggleDone(params.todoId);

        return NextResponse.json({ todo: updatedTodo }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: { message: error.message } },
                { status: 500 }
            );
        }
    }
};

export const todoController = {
    get,
    create,
    toggleDone,
};
