import { useMutation } from "@tanstack/react-query";
import { deleteTodo, updateTodo } from "../../api/api";

const Task = ({ data }) => {
  function handleUpdate() {
    const updateStatus = !data.isComplete;
    updatedTodo.mutate({
      isComplete: updateStatus,
      id: data.id,
    });
  }

  function handleDelete(){
    delTodo.mutate(data)
  }

  const updatedTodo = useMutation({
    mutationFn: (data) => updateTodo(data),
  });

  const delTodo = useMutation({
    mutationFn: (data) => deleteTodo(data)
  })

  return (
    <div className=" items-center flex px-5 py-4 border-b border-b-slate-200">
      <img
        onClick={() => handleUpdate()}
        src={`${data.isComplete ? `completedCircle.svg` : `taskCircle.svg`}`}
        alt=""
      />
      <p
        className={`${data.isComplete ? `line-through text-gray-300` : `text-slate-600`} ml-3 max-w-53.75 
text-xs
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
