import { todoRepository } from "../repository/todo";
import { Todo } from "../schema/todo";
import {z as schema} from "zod"

interface todoControllerGetParams {
    page: number;
}

async function get(params: todoControllerGetParams) {
    return todoRepository.get({
        page: params.page,
        limit: 2,
    });
}

function filterTodosByContent<Todo>(
    search: string,
    todos: Array<Todo & { content: string }>
): Todo[] {
    const homeTodos = todos.filter((todo) => {
        const searchNormalized = search.toLowerCase();
        const contentNormalized = todo.content.toLowerCase();
        return contentNormalized.includes(searchNormalized);
    });
    return homeTodos;
}

interface TodoControllerCreateParams {
    content?: string;
    onError: () => void;
    onSuccess: (todo: Todo) => void;
}

function create({ content, onError, onSuccess }: TodoControllerCreateParams) {

    const parsedParams = schema.string().nonempty().safeParse(content)
    if (!parsedParams){
        onError();
        return;
    }
    
    console.log(parsedParams)
    todoRepository
        .createByContent(parsedParams.data!)
        .then((newTodo) => {
            onSuccess(newTodo);
        })
        .catch(() => {
            onError();
        });
}

export const todoController = {
    get,
    filterTodosByContent,
    create,
};
