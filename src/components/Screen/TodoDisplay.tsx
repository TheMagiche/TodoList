import React, { createContext, useCallback, useEffect, useState } from "react";
import TodoComponent from "./Todo";
import { Todo } from "@/@types/todos";
import axiosHttp from "@/api/axiosHttp";
import { useTodos } from "@/hooks/useTodos";
import { AxiosResponse } from "axios";
import LoadingScreen from "./LoadingScreen";
import SearchComponent from "./Search";
import CreateTodoComponent from "./CreateTodo";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
export const ContainerContext = createContext({
  moveCards: (id: number, container: string) => {
    console.log(id, container);
  },
});

const TodoDisplayComponent: React.FC = () => {
  const { todos, setTodos, refreshTodos, loading, setLoading } = useTodos();
  const [displayTodos, setDisplayTodos] = useState<Todo[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    setDisplayTodos(
      todos.filter((todo: Todo) => todo?.title.includes(searchText))
    );
  }, [todos, searchText]);

  useEffect(() => {
    fetchTodos();
  }, [refreshTodos]);

  const fetchTodos = () => {
    setLoading(true);
    return axiosHttp
      .get("/todos")
      .then(async (response: AxiosResponse) => {
        setLoading(false);
        setTodos([...response.data.todos.map((todo: Todo, index: number) => ({...todo, line: index}))] || []);
      })
      .catch((error: any) => {
        setLoading(false);
        return error;
      });
  };

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setTodos((prevTodos: Todo[]) =>
      update(prevTodos, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevTodos[dragIndex] as Todo],
        ],
      })
    );
  }, []);

  const handleUpdateCards = (id: number) => {
    const draggedCard: Todo = displayTodos.filter((todo) => todo.id === id)[0];
    setTodos((prevTodos: Todo[]) => [
      ...prevTodos.filter((todo) => todo.id !== id),
      draggedCard,
    ]);
  };

  const renderTodos = useCallback((todo: Todo, index: number) => {
    return (
      <TodoComponent key={todo.id} index={index} todo={todo} moveCard={moveCard} />
    )
  }, [])

  return (
    <div className="todo-wrapper">
      <div className="todo-nav">
        <SearchComponent
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <CreateTodoComponent />
      </div>
      <div className="todo-display-container">
        <DndProvider backend={HTML5Backend}>
          <ContainerContext.Provider value={{ moveCards: handleUpdateCards }}>
            {displayTodos.length !== 0 &&
              displayTodos.map((todo: Todo, index: number) => {
                return renderTodos(todo, index);
              })}
            {loading && <LoadingScreen />}
            {displayTodos.length === 0 && !loading && (
              <span className="no-results flexed">No results</span>
            )}
          </ContainerContext.Provider>
        </DndProvider>
      </div>
    </div>
  );
};

export default TodoDisplayComponent;
