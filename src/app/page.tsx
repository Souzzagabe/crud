"use client";

import React, { useEffect, useState } from "react";
import { GlobalStyles } from "@/ui/theme/GlobalStyles";
import { todoController } from "@/ui/controller/todo";

const bg = "/bg.jpeg"; // inside public folder

interface HomeTodo {
    id: string;
    content: string;
}

function HomePage() {
    const [initialLoad, setInitialLoadComplete] = useState(false)
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [todos, setTodos] = useState<HomeTodo[]>([]);

    const hasNoTodos = todos.length === 0 && !isLoading;

    const hasMorePages = totalPages > page;

    useEffect(() => {

        setInitialLoadComplete(true)
        if(!initialLoad) {

            todoController
                .get({ page })
                .then(({ todos, pages }) => {
                    setTodos(todos) // Atualiza o estado com os novos itens
                    setTotalPages(pages); // Define o total de páginas
                })
                .finally(() => {
                    setIsLoading(false); // Certifique-se de indicar o fim do carregamento
                });
        }
    }, []);

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

                            {isLoading && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        align="center"
                                        style={{ textAlign: "center" }}
                                    >
                                        Carregando...
                                    </td>
                                </tr>
                            )}

                            {hasNoTodos && (
                                <tr>
                                    <td colSpan={4} align="center">
                                        Nenhum item encontrado
                                    </td>
                                </tr>
                            )}

                            {hasMorePages && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        align="center"
                                        style={{ textAlign: "center" }}
                                    >
                                        <button
                                            data-type="load-more"
                                            onClick={() => {
                                                setIsLoading(true);
                                                const nextPage = page + 1;
                                                setPage(nextPage);

                                                todoController
                                                    .get({ page: nextPage })
                                                    .then(
                                                        ({ todos, pages }) => {
                                                            setTodos(
                                                                (oldTodos) => [
                                                                    ...oldTodos,
                                                                    ...todos,
                                                                ]
                                                            );
                                                            setTotalPages(
                                                                pages
                                                            );
                                                        }
                                                    )
                                                    .finally(() => {
                                                        setIsLoading(false);
                                                    });
                                            }}
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
