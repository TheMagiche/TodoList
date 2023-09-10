import React, { ReactNode, useState } from "react";
import { Todo } from "@/@types/todos";

export const TodosContext = React.createContext(null);

type TodosProps = {
  children?: ReactNode;
};

export const TodosProvider = ({ children }: TodosProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [refreshTodos, setRefreshTodos] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <TodosContext.Provider
      value={{todos, setTodos, refreshTodos, setRefreshTodos, loading, setLoading }}
    >
      {children}
    </TodosContext.Provider>
  );
};
