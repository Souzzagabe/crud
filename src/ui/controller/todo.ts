async function get() {
   return fetch("/api/todos")
        .then(async (respostaDoServidor) => {
            const todoString = await respostaDoServidor.text();
            const todosFromServer = JSON.parse(todoString).todos;
            console.log(todosFromServer);
            // setTodos(todosFromServer);
            return todosFromServer;
        })
}

export const todoController = {
    get,
};
