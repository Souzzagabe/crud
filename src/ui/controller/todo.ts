import { todoRepository } from "../repository/todo";

interface todoControllerGetParams {
    page: number;
}

async function get( params : todoControllerGetParams) {
    return todoRepository.get({
        page: params.page,
        limit: 2,
    });
}

export const todoController = {
    get,
};
