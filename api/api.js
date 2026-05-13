// Note: Ensure your URL includes the /rest/v1/ segment

const api = "https://xtqlxxgwcyrevztiswou.supabase.co/rest/v1/todoList";

const key = "sb_publishable_rqB1cZ9DXPT5PkS8O9eP_w_3ftdk0vu";

const headers = {
  "Content-Type": "application/json",

  apikey: key,

  Authorization: `Bearer ${key}`,
};

export async function getAllTodos() {
  try {
    // Select all columns using query params

    const res = await fetch(`${api}?select=*`, {
      method: "GET",

      headers: headers,
    });

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error(error.message);
  }
}

export async function postTodo(todo) {
  try {
    const res = await fetch(api, {
      method: "POST",

      headers: headers,

      body: JSON.stringify(todo),
    });

    if (!res.ok) throw new Error(`Post failed: ${res.status}`);
  } catch (error) {
    console.error(error.message);
  }
}

export async function updateTodo(updatedTodo) {
  try {
    // PostgREST uses query params to target the ID for updates

    const res = await fetch(`${api}?id=eq.${updatedTodo.id}`, {
      method: "PATCH",

      headers: headers,

      body: JSON.stringify(updatedTodo),
    });

    if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  } catch (error) {
    console.error(error.message);
  }
}

export async function deleteTodo(id) {
  // This 'id' should now be the number 3
  const res = await fetch(`${api}?id=eq.${id}`, {
    method: "DELETE",
    headers: headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Supabase rejected this:", errorData);
    throw new Error(`Delete failed with status ${res.status}`);
  }

  return true; // Success!
}