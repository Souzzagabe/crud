import { NextRequest, NextResponse } from "next/server";
import { todoRepository } from "@/server/repository/todo";

const get = async (req: NextRequest) => {
    const query = req.nextUrl.searchParams;
    const page = Number(query.get("page"));
    const limit = Number(query.get("limit"));

    console.log("query.page", query.get("page"), typeof query.get("page"));

    if (isNaN(page)) {
        return NextResponse.json({
            error: {
                message: "'page' must be a number",
            },
        }, { status: 400 });
    }

    if (isNaN(limit)) {
        return NextResponse.json({
            error: {
                message: "'limit' must be a number",
            },
        }, { status: 400 });
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
        return NextResponse.json({
            error: {
                message: "An error occurred while fetching todos.",
            },
        }, { status: 500 });
    }
};

export const todoController = {
    get,
};
