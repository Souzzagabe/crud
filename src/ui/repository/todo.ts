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
    return fetch("/api/todos").then(async (respostaDoServidor) => {
        const todoString = await respostaDoServidor.text();
        const todosFromServer = JSON.parse(todoString).todos;
        console.log("page", page);
        console.log("limit", limit);

        const ALL_TODOS = todosFromServer;
        const startIndex = (page -1) * limit;
        const endIndex = page * limit
        const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
        const totalPages = Math.ceil(ALL_TODOS.length / limit);

        return {
            todos: paginatedTodos,
            total: ALL_TODOS.length,
            pages: 1,
        };
    });
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
