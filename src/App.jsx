import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteTodo, getAllTodos, postTodo, updateTodo } from "../api/api";
import { useForm } from "react-hook-form";
import Task from "./components/task";
import { useMemo, useState } from "react";

const App = () => {
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: getAllTodos,
  });

  console.log(todos);

  const addTodo = useMutation({
    mutationFn: (data) => postTodo(data),
  });

  const delTodo = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { register, reset, handleSubmit } = useForm();

  function handleClear() {
    todos?.forEach((todo) => {
      if (todo.isComplete) {
        delTodo.mutate(todo);
      }
    });
  }

  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Active", "Completed"];

  function handleFilterClick(e) {
    const value = e.target.textContent;
    setSelectedFilter(value);
  }

  const filteredTodos = useMemo(() => {
    if (selectedFilter === "Active") {
      return todos.filter((todo) => todo.isComplete === false);
    } else if (selectedFilter === "Completed") {
      return todos.filter((todo) => todo.isComplete);
    }
    return todos;
  }, [selectedFilter, todos]);

  console.log(filteredTodos);

  return (
    <main className="py-12 px-6">
      <img
        className="w-full absolute -z-1 bg-cover bg-no-repeat left-0 top-0"
        src="/bg-white-phone.svg"
        alt=""
      />

      <div className="flex justify-between items-center mb-10">
        <button>
          <img src="/logo.svg" alt="" />
        </button>
        <button>
          <img src="/moon.svg" alt="" />
        </button>
      </div>

      <form
        className="mb-4"
        onSubmit={handleSubmit((data) => {
          data = {
            todo: data.todo,
            isComplete: false,
          };
          addTodo.mutate(data, {
            onSuccess: () => {
              reset();
            },
            onError: (err) => {
              console.error("Mutation error:", err);
            },
          });
        })}
      >
        <label
          className="flex gap-3 items-center px-5 py-3.5 bg-white rounded-[5px] shadow-[0px_35px_50px_-15px_rgba(194,195,214,0.50)]"
          htmlFor="newTodo"
        >
          <img src="/taskCircle.svg" alt="" />
          <input
            {...register("todo")}
            className="outline-0 w-full"
            id="newTodo"
            placeholder="Create a new todo…"
            type="text"
          />
          <button type="submit"></button>
        </label>
      </form>

      <section className="w-full bg-white rounded-[5px] shadow-[0px_35px_50px_-15px_rgba(194,195,214,0.50)] mb-4">
        {filteredTodos &&
          filteredTodos?.map((todo) => {
            return <Task key={todo.id} data={todo} />;
          })}
        <div
          className="px-5 py-3.5 text-zinc-400
text-xs
font-normal flex justify-between"
        >
          <p>{todos?.length} items left</p>
          <button onClick={() => handleClear()}>Clear Completed</button>
        </div>
      </section>

      <div className="py-3.75 flex justify-center gap-4.75 bg-white rounded-[5px] shadow-[0px_35px_50px_-15px_rgba(194,195,214,0.50)]">
        {filters.map((filter) => {
          return (
            <button
              key={filter}
              onClick={handleFilterClick}
              className={`${
                selectedFilter === filter ? "text-blue-500" : "text-zinc-400"
              } 
text-sm
font-bold`}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </main>
  );
};

export default App;
