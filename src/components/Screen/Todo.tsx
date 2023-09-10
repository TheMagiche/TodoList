import React, { useRef } from "react";
import { Todo } from "@/@types/todos";
import axiosHttp from "@/api/axiosHttp";
import { useTodos } from "@/hooks/useTodos";
import { AxiosResponse } from "axios";
import { classNames } from "@/utils/helper";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";

type TodoProp = {
  todo: Todo;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}
const ItemTypes = {
  TODO: "todo",
};

const TodoComponent: React.FC<TodoProp> = ({
  todo,
  index,
  moveCard,
}: TodoProp) => {
  const {id} = todo;
  const { setRefreshTodos, refreshTodos } = useTodos();
  const handleChange = (checked: boolean) => {
    return axiosHttp
      .patch(`/todos/${todo.id}`, {
        completed: checked,
      })
      .then(async (response: AxiosResponse) => {
        setRefreshTodos(!refreshTodos);
      })
      .catch((error: any) => {
        alert(error);
        return error;
      });
  };
  const handleDelete = () => {
    return axiosHttp
      .delete(`/todos/${todo.id}`)
      .then(async (response: AxiosResponse) => {
        setRefreshTodos(!refreshTodos);
        return response;
      })
      .catch((error: any) => {
        return error;
      });
  };
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.TODO,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TODO,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  return (
    <>
      <div
        ref={ref}
        data-handler-id={handlerId}
        className={classNames(
          todo?.completed ? "completed" : "not-completed",
          isDragging ? "dragging" : "",
          "todo-component"
        )}
      >
        <span onClick={() => handleDelete()} className="noselect todo-delete">
          &#120;
        </span>
        <span className="todo-id">{todo.id}</span>
        <span className="todo-title">{todo?.title}</span>
        <input
          type="checkbox"
          value={todo.id}
          checked={todo?.completed || false}
          onChange={(e) => handleChange(e.target.checked)}
          name="completed"
        />
      </div>
    </>
  );
};

export default TodoComponent;
