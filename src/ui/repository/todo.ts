import { z as schema } from "zod";
import { Todo, TodoSchema } from "../schema/todo";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";

interface todoRepositoryGetParams {
    page: number;
    limit: number;
}

interface todoRepositoryGetOutput {
    todos: Todo[];
    pages: number;
    total: number;
}

function get({
    page,
    limit,
}: todoRepositoryGetParams): Promise<todoRepositoryGetOutput> {
    return fetch(`/api/todos?page=${page}&limit=${limit}`).then(
        async (respostaDoServidor) => {
            const todoString = await respostaDoServidor.text();
            const responseParsed = parseTodosFromServer(JSON.parse(todoString));

            console.log("page", page);
            console.log("limit", limit);

            return {
                todos: responseParsed.todos, // Aqui 'responseParsed' é um objeto, com a propriedade 'todos'
                total: responseParsed.total, // A propriedade 'total' vem do objeto retornado
                pages: responseParsed.pages, // A propriedade 'pages' também
            };
        }
    );
}

export async function createByContent(content: string): Promise<Todo> {
    const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            content,
        }),
    });
    if (response.ok) {
        const serverResponse = await response.json();
        const ServerResponseSchema = schema.object({
            todo: TodoSchema,
        });

        const serverResponseParsed =
            ServerResponseSchema.safeParse(serverResponse);
        if (!serverResponseParsed.success) {
            throw new Error("failed to create todo");
        }

        const todo = serverResponseParsed.data.todo;

        return todo;
    }
    throw new Error("failed to create todo:");
}


async function toggleDone(todoID: string | undefined): Promise<Todo> {
    if (!todoID) {
        throw new Error("Todo ID is required but was not provided.");
    }

    const response = await fetch(`/api/todos/${todoID}/toggle-done`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        // body: JSON.stringify({ id: todoID }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to toggle done: ${response.status} - ${errorText}`);
    }

    const serverResponse = await response.json();

    const serverResponseSchema = schema.object({
        todo: TodoSchema,
    });

    const serverResponseParsed = serverResponseSchema.safeParse(serverResponse);

    if (!serverResponseParsed.success) {
        throw new Error(`Failed to update TODO with id ${todoID}`);
    }

    return serverResponseParsed.data.todo;
}



export const todoRepository = {
    get,
    createByContent,
    toggleDone
};

// interface Todo {
//     id: string;
//     content: string;
//     date: Date;
//     done: boolean;
// }

function parseTodosFromServer(responseBody: unknown): {
    total: number;
    pages: number;
    todos: Array<Todo>;
} {
    if (
        responseBody != null &&
        typeof responseBody === "object" &&
        "todos" in responseBody &&
        "total" in responseBody &&
        "pages" in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            total: Number(responseBody.total),
            pages: Number(responseBody.pages),

            todos: responseBody.todos.map((todo: unknown) => {
                if (todo === null && typeof todo !== "object") {
                    throw new Error("invalid todo from API");
                }
                const { id, content, done, date } = todo as {
                    id: string;
                    content: string;
                    done: string;
                    date: string;
                };

                return {
                    id,
                    content,
                    done: String(done).toLocaleLowerCase() === "true",
                    date: date,
                };
            }),
        };
    }

    return {
        pages: 1,
        total: 0,
        todos: [],
    };
}
