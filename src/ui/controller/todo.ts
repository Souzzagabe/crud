import { todoRepository } from "../repository/todo";
import { Todo } from "../schema/todo";
import { z as schema } from "zod";

interface todoControllerGetParams {
    page: number;
}

const get = async (params: todoControllerGetParams) => {
    return todoRepository.get({
        page: params.page,
        limit: 2,
    });
};

const filterTodosByContent = <Todo>(search: string, todos: Array<Todo & { content: string }>): Todo[] => {
    const homeTodos = todos.filter((todo) => {
        const searchNormalized = search.toLowerCase();
        const contentNormalized = todo.content.toLowerCase();
        return contentNormalized.includes(searchNormalized);
    });
    return homeTodos;
};

interface TodoControllerCreateParams {
    content?: string;
    onError: () => void;
    onSuccess: (todo: Todo) => void;
}

const create = ({ content, onError, onSuccess }: TodoControllerCreateParams) => {
    const parsedParams = schema.string().nonempty().safeParse(content);
    if (!parsedParams) {
        onError();
        return;
    }

    console.log(parsedParams);
    todoRepository
        .createByContent(parsedParams.data!)
        .then((newTodo) => {
            onSuccess(newTodo);
        })
        .catch(() => {
            onError();
        });
};

interface TodoControllerToggleDoneParams {
    id: string;
    updateTodoOnScreen: () => void;
}

const toggleDone = ({ id, updateTodoOnScreen }: TodoControllerToggleDoneParams): void => {
    todoRepository
        .toggleDone(id)
        .then(() => {
            updateTodoOnScreen();
        })
        .catch((error) => {
            console.error("Erro ao alternar o status do todo:", error);
        });
};

export const todoController = {
    get,
    filterTodosByContent,
    create,
    toggleDone,
};
