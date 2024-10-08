// const fs = require('fs') - commonJS 
import { v4 as uuid } from 'uuid';
import fs from "fs"

const DB_FILE_PATH = "./core/db"


console.log("[CRUD]");

interface Todo {
    id: string;
    date: string;
    content: string;
    done: boolean;
}


function create(content: string): Todo {
    
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false,
    };

    const todos: Array<Todo> = [
        ...read(),
        todo,
    ];

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos,
    }, null, 2))

    return todo;
}

function read(): Array<Todo>  {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8")
    const db = JSON.parse(dbString || "{}")
    if (!db.todos) {
        return [];
    }
    return db.todos;
}

function update(id: string, partialTodo: Partial<Todo>) {
    let updatedTodo;
    const todos = read();
    todos.forEach((currentTodo) =>{
        const isToUpdate = currentTodo.id === id;
        if(isToUpdate) {
           updatedTodo = Object.assign(currentTodo, partialTodo)
        }
    })

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos,
    }, null, 2));
    if(!updatedTodo) {
        throw new Error(`Todo with id ${id} not found`)
    }
    return updatedTodo;
}

function updatedContentById(id: string, content: string): Todo {
    return update(id, {
     content,
    })
}

function deleteById(id: string ) {
    const todos = read();

    const todosWithoutOne = todos.filter((todo) => {

        if(id === todo.id) {
            return false
        }
        return true;
    })
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos: todosWithoutOne,
    }, null, 2))
}
 

function CLEAR_DB() {
    fs.writeFileSync(DB_FILE_PATH, "")
}


// SIMULATION
CLEAR_DB()
create("primeira todo")
const secondTodo = create("segunda todoOO")
deleteById(secondTodo.id);
const thirdTodo = create("terceira TODO")
// update(terceiraTodo.id, {
//     content: "Atualizada",
//     done: true,
// });

updatedContentById(thirdTodo.id, "Atualizada")

const todos = read()
console.log(todos)
console.log(todos.length)