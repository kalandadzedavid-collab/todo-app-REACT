import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteTodo, getAllTodos, postTodo } from "../api/api";

import { useForm } from "react-hook-form";

import Task from "./components/task";

import { useEffect, useMemo, useState } from "react";

const App = () => {
  const queryClient = useQueryClient();

  const { data: todos } = useQuery({
    queryKey: ["todos"],

    queryFn: getAllTodos,
  });

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
        delTodo.mutate(todo.id);
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

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("isDark");

    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("isDark", JSON.stringify(isDark));
  }, [isDark]);

  function handleTheme() {
    setIsDark((prev) => !prev);
  }

  return (
    <main
      className={`${
        isDark && "bg-[#171823]"
      } min-h-screen py-12 px-6 md:flex flex-col items-center`}
    >
      <div
        className={`bg-center ${
          isDark
            ? `bg-[url(/bg-dark-phone.svg)] md:bg-[url(/bg-dark.svg)]`
            : `bg-[url(/bg-white-phone.svg)] md:bg-[url(/bg.svg)]`
        } md:h-[300px]  w-full h-50 absolute  left-0 top-0 bg-cover bg-no-repeat`}
      ></div>

      <div className="relative z-10 md:w-[540px] flex justify-between items-center mb-10">
        <button>
          <img src="/logo.svg" alt="" />
        </button>

        <button>
          {isDark ? (
            <img
              onClick={handleTheme}
              className="cursor-pointer"
              src="/sun.svg"
              alt="Switch to light mode"
            />
          ) : (
            <img
              onClick={handleTheme}
              className="cursor-pointer"
              src="/moon.svg"
              alt="Switch to dark mode"
            />
          )}
        </button>
      </div>

      <form
        className="md:text-lg relative z-10 mb-4 md:w-[540px]"
        onSubmit={handleSubmit((data) => {
          data = {
            todo: data.todo,

            isComplete: false,
          };

          addTodo.mutate(data, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["todos"] });

              reset();
            },

            onError: (err) => {
              console.error("Mutation error:", err);
            },
          });
        })}
      >
        <label
          className={`flex gap-3 items-center px-5 py-3.5 ${
            isDark ? `bg-[#25273D]` : `bg-white`
          } rounded-[5px] shadow-[0px_35px_50px_-15px_rgba(194,195,214,0.50)]`}
          htmlFor="newTodo"
        >
          <img src={`${isDark ? "Ovaldark.svg" : "taskCircle.svg"}`} alt="" />

          <input
            {...register("todo")}
            className={`${
              isDark ? `text-slate-300 placeholder:text-slate-300` : ``
            }  outline-0 w-full`}
            id="newTodo"
            placeholder="Create a new todo…"
            type="text"
          />

          <button type="submit"></button>
        </label>
      </form>

      <section
        className={`md:max-w-[540px] w-full ${
          isDark
            ? `bg-[#25273D]`
            : `bg-white shadow-[0px_35px_50px_-15px_rgba(194,195,214,0.50)]`
        } relative z-10 rounded-[5px]  mb-4`}
      >
        {filteredTodos &&
          filteredTodos?.map((todo) => {
            return <Task theme={isDark} key={todo.id} data={todo} />;
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

      <div
        className={`relative z-100 md:w-[540px] py-3.75 flex justify-center gap-4.75 ${
          isDark
            ? `bg-[#25273D]`
            : `bg-white shadow-[0px_35px_50px_-15px_rgba(194,195,214,0.50)]`
        } rounded-[5px]`}
      >
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

      <p
        className="text-center mt-10 text-zinc-400

text-sm

font-normal"
      >
        Drag and drop to reorder list
      </p>
    </main>
  );
};

export default App;
