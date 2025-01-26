import { read, create, update } from "@db-crud-todo";

interface TodoRepositoryGetParams {
    page?: number;
    limit?: number;
}

interface TodoRepositoryGetOutput {
    todos: Todo[];
    total: number;
    pages: number;
}

function get({
    page,
    limit,
}: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput {
    const currentPage = page || 1;
    const currentLimit = limit || 10;
    const ALL_TODOS = read().reverse();

    const startIndex = (currentPage - 1) * currentLimit;
    const endIndex = currentPage * currentLimit;
    const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
    const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

    return {
        total: ALL_TODOS.length,
        todos: paginatedTodos,
        pages: totalPages,
    };
}

async function createByContent(content: string): Promise<Todo> {
    const newTodo = create(content); // Aqui cria o Todo com a função create
    return newTodo;
}

async function toggleDone(id: string): Promise<Todo> {
    const ALL_TODOS = read();

    // Correção do `find`
    const todo = ALL_TODOS.find((todo) => todo.id === id);

    if (!todo) throw new Error(`Todo with id "${id}" not found`);

    // Atualizando corretamente o status com base no estado atual
    const updatedTodo = update(todo.id, {
        done: !todo.done, // Alterna o valor atual de `done`
    });

    return updatedTodo;
}

export const todoRepository = {
    get,
    createByContent,
    toggleDone,
};

//schema

interface Todo {
    id: string;
    content: string;
    date: string;
    done: boolean;
}
