const api = "http://localhost:3000/todoes";

const testData = {
  todo: "go to school",
  isCompleted: false,
};

export async function getAllTodos() {
  try {
    const res = await fetch(api);

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error.message);
  }
}

export async function postTodo(todo) {
  try {
    const res = await fetch(api, {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(todo),
    });

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }
  } catch (error) {
    console.error(error.message);
  }
}

export async function deleteTodo(todo) {
    const res = await fetch(`${api}/${todo.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
       throw new Error(`Delete failed: ${res.status}`);
    }

    return res.json()
}

export async function updateTodo(updatedTodo) {
  const res = await fetch(`${api}/${updatedTodo.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });

  if (!res.ok) {
    throw new Error(`update failed: ${res.status}`);
  }
}
