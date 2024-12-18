"use client";

import React, { useEffect, useState } from "react";
import { GlobalStyles } from "@/ui/theme/GlobalStyles";
import { todoController } from "@/ui/controller/todo";

// const bg = "https://mariosouto.com/cursos/crudcomqualidade/bg";
const bg = "/bg.jpeg"; // inside public folder

interface HomeTodo {
    id: string;
    content: string;
}

function HomePage() {
    const [totalPages, setTotalPages] = useState(0);
    const [initialLoad, SetInitialLoad] = useState(false);
    const [page, setPage] = useState(1);
    const [todos, setTodos] = useState<HomeTodo[]>([]);

    const hasMorePages = totalPages > page;

    useEffect(() => {
        if (!initialLoad) {
            todoController.get({ page }).then(({ todos, pages }) => {
                console.log("Dados recebidos do backend:", todos);
                setTodos((oldTodos) => {
                    return [...oldTodos, ...todos];
                });
                setTotalPages(pages);
            });
        }
    }, [page]);

    console.log("Estado de todos:", todos); // Verifique o estado aqui também

    console.log("todos", fetch("http://localhost:3000/api/todos"));
    return (
        <>
            <main>
                <GlobalStyles themeName="souzzagabe" />
                <header
                    style={{
                        backgroundImage: `url('${bg}')`,
                    }}
                >
                    <div className="typewriter">
                        <h1>O que fazer hoje?</h1>
                    </div>
                    <form>
                        <input type="text" placeholder="Correr, Estudar..." />
                        <button type="submit" aria-label="Adicionar novo item">
                            +
                        </button>
                    </form>
                </header>

                <section>
                    <form>
                        <input
                            type="text"
                            placeholder="Filtrar lista atual, ex: Dentista"
                        />
                    </form>

                    <table border={1}>
                        <thead>
                            <tr>
                                <th align="left">
                                    <input type="checkbox" disabled />
                                </th>
                                <th align="left">Id</th>
                                <th align="left">Conteúdo</th>
                                <th />
                            </tr>
                        </thead>

                        <tbody>
                            {todos && todos.length > 0 ? (
                                todos.map((todo) => (
                                    <tr key={todo.id}>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>{todo.id.substring(0, 4)}</td>
                                        <td>{todo.content}</td>
                                        <td align="right">
                                            <button data-type="delete">
                                                Apagar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} align="center">
                                        Carregando...
                                    </td>
                                </tr>
                            )}
                            {/* <tr>
                                <td
                                    colSpan={4}
                                    align="center"
                                    style={{ textAlign: "center" }}
                                >
                                    Carregando...
                                </td>
                            </tr> */}

                            {/* <tr>
                                <td colSpan={4} align="center">
                                    Nenhum item encontrado
                                </td>
                            </tr> */}

                            {hasMorePages && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        align="center"
                                        style={{ textAlign: "center" }}
                                    >
                                        <button
                                            data-type="load-more"
                                            onClick={() => setPage(page + 1)}
                                        >
                                            Página {page}, Carregar mais{" "}
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    marginLeft: "4px",
                                                    fontSize: "1.2em",
                                                }}
                                            >
                                                ↓
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </main>
        </>
    );
}

export default HomePage;
