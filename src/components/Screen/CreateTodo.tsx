import axiosHttp from "@/api/axiosHttp";
import { useTodos } from "@/hooks/useTodos";
import { AxiosResponse } from "axios";
import React, { useState } from "react";

const CreateTodoComponent: React.FC = () => {
  const { refreshTodos, setRefreshTodos, setLoading } = useTodos();
  const [title, setTitle] = useState<string>('');
  const handleSubmit = () => {
    if (title === '') return;
    return axiosHttp
      .post('/todos', {
        completed: false,
        title: title,
      })
      .then(async (response: AxiosResponse) => {
        setTitle('');
        setRefreshTodos(!refreshTodos);
        return response
      })
      .catch((error: any) => {
        setTitle('');
        return error;
      });
  };
  return (
    <>
      <div className="create-todo-container">
        <input
          type="text"
          placeholder="Add your agenda ..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <span onClick={() => handleSubmit()} className="add-todo noselect">
         <span>+</span> 
        </span>
      </div>
    </>
  );
};

export default CreateTodoComponent;
