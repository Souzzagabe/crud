import { todoRepository } from '@/server/repository/todo';
import { NextResponse, NextRequest } from 'next/server';

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const todoId = params.id;

        if (!todoId || typeof todoId !== "string") {
            return NextResponse.json(
                { error: { message: "Todo ID is required." } },
                { status: 400 }
            );
        }

        const updatedTodo = await todoRepository.toggleDone(todoId);

        return NextResponse.json({ todo: updatedTodo }, { status: 200 });

    } catch (error) {
        console.error("Erro ao atualizar todo:", error);
        return NextResponse.json(
            { error: { message: "An error occurred while updating the todo." } },
            { status: 500 }
        );
    }
};
