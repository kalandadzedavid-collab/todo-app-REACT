import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTodo, updateTodo } from "../../api/api";

const Task = ({ data, theme }) => {
  const queryClient = useQueryClient();

  function handleUpdate() {
    const updateStatus = !data.isComplete;

    updatedTodo.mutate({
      isComplete: updateStatus,

      id: data.id,
    });
  }

  function handleDelete() {
    // CRITICAL: Pass data.id (the number), NOT data (the object)
    if (data?.id) {
      delTodo.mutate(data.id);
    }
  }
  const updatedTodo = useMutation({
    mutationFn: (data) => updateTodo(data),

    onSuccess: () => {
      // Refresh the list so the deleted item disappears

      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const delTodo = useMutation({
    // Extract the id right here
    mutationFn: (todoObject) => deleteTodo(todoObject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <div className=" items-center flex px-5 py-4 border-b border-b-slate-200">
      <img
        onClick={() => handleUpdate()}
        src={`${
          data.isComplete
            ? `completedCircle.svg`
            : `${theme ? `Ovaldark.svg` : `taskCircle.svg`}`
        }`}
        alt=""
      />

      <p
        className={`${
          data.isComplete
            ? `line-through ${theme ? `text-[#4D5067]` : `text-gray-300`}`
            : `${theme ? `text-[#C8CBE7]` : `text-slate-600`}`
        } ml-3 max-w-53.75

text-xs

md:text-lg

font-normal`}
      >
        {data.todo}
      </p>

      <button onClick={() => handleDelete()} className="ml-auto">
        <img src="delTask.svg" alt="" />
      </button>
    </div>
  );
};

export default Task;
