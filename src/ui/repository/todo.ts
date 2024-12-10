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
            const responseParsed = parseTodosFromServer(
                JSON.parse(todoString)
            );

            console.log("page", page);
            console.log("limit", limit);

            return {
                todos: responseParsed.todos,  // Aqui 'responseParsed' é um objeto, com a propriedade 'todos'
                total: responseParsed.total,  // A propriedade 'total' vem do objeto retornado
                pages: responseParsed.pages,  // A propriedade 'pages' também
            };
        }
    );
}


export const todoRepository = {
    get,
};

interface Todo {
    id: string;
    content: string;
    date: Date;
    done: boolean;
}

function parseTodosFromServer(responseBody: unknown): {total: number, pages: number, todos: Array<Todo> } {
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
                    date: new Date(date),
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
