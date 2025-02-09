"use client";

import React, { useEffect, useState, useRef } from "react";
import { GlobalStyles } from "@/ui/theme/GlobalStyles";
import { todoController } from "@/ui/controller/todo";

const bg = "/bg.jpeg"; // inside public folder

interface HomeTodo {
    id: string;
    content: string;
    done: boolean;
}

function HomePage() {
    const initialLoadComplete = useRef(false);
    const [newTodoContent, setNewTodoContent] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [todos, setTodos] = useState<HomeTodo[]>([]);
    const [search, setSearch] = useState("");

    const homeTodos = todoController.filterTodosByContent<HomeTodo>(
        search,
        todos
    );

    const isFiltering = search.trim() !== ""; // Verifica se está filtrando
    const showLoadMoreButton = !isFiltering && totalPages > page; // Botão aparece apenas sem filtro e com mais páginas
    const hasNoTodos = isFiltering && homeTodos.length === 0 && !isLoading; // Mostra "Nenhum item encontrado" só durante a filtragem

    useEffect(() => {
        console.log("complete", initialLoadComplete.current);
        if (!initialLoadComplete.current) {
            todoController
                .get({ page })
                .then(({ todos, pages }) => {
                    setTodos(todos); // Atualiza o estado com os novos itens
                    setTotalPages(pages); // Define o total de páginas
                })
                .finally(() => {
                    setIsLoading(false); // Indica o fim do carregamento
                    initialLoadComplete.current = true;
                });
        }
    }, []);

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
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            todoController.create({
                                content: newTodoContent,
                                onSuccess(todo: HomeTodo) {
                                    setTodos((oldTodos) => {
                                        return [todo, ...oldTodos];
                                    });
                                    setNewTodoContent("");
                                },
                                onError() {
                                    alert("Você precisa criar");
                                },
                            });
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Correr, Estudar..."
                            className="text-black"
                            value={newTodoContent}
                            onChange={function newTodoHandler(event) {
                                setNewTodoContent(event.target.value);
                            }}
                        />
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
                            onChange={(event) => {
                                setSearch(event.target.value);
                            }}
                            className="text-black"
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
                            {homeTodos && homeTodos.length > 0
                                ? homeTodos.map((todo) => (
                                      <tr key={todo.id}>
                                          <td>
                                              <input
                                                  defaultChecked={todo.done}
                                                  onChange={function handleToggle() {
                                                      todoController.toggleDone(
                                                          {
                                                              id: todo.id,
                                                              updateTodoOnScreen:
                                                                  () => {
                                                                      setTodos(
                                                                          (
                                                                              currentTodos
                                                                          ) => {
                                                                              return currentTodos.map(
                                                                                  (
                                                                                      currentTodo
                                                                                  ) => {
                                                                                      if (
                                                                                          currentTodo.id ===
                                                                                          todo.id
                                                                                      ) {
                                                                                          return {
                                                                                              ...currentTodo,
                                                                                              done: !currentTodo.done,
                                                                                          };
                                                                                      }
                                                                                      return currentTodo;
                                                                                  }
                                                                              );
                                                                          }
                                                                      );
                                                                  },
                                                          }
                                                      );
                                                  }}
                                                  type="checkbox"
                                              />
                                          </td>
                                          <td>{todo.id.substring(0, 4)}</td>
                                          <td>
                                              {!todo.done && todo.content}
                                              {todo.done && (
                                                  <s>{todo.content}</s>
                                              )}
                                          </td>
                                          <td align="right">
                                              <button data-type="delete">
                                                  Apagar
                                              </button>
                                          </td>
                                      </tr>
                                  ))
                                : null}

                            {isLoading && (
                                <tr>
                                    <td colSpan={4} align="center">
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

                            {showLoadMoreButton && (
                                <tr>
                                    <td colSpan={4} align="center">
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
