const form = document.querySelector("#form");
const tasksList = document.querySelector("#tasks-list");
const taskUserInput = document.querySelector("#taskUserInput");

const initTasks = async () => {
  const data = await fetchData("/tasks", {
    method: "get",
  });
  data.forEach((task) => {
    let ids = createIDS(task);
    const taskItem = createTask(task, ids);
    tasksList.appendChild(taskItem);
    deleteTask(task, ids.listItemsID, ids.deleteID);
    editTask(task, ids.taskID, ids.editID);
  });
};

const fetchData = async (url, obj) => {
  const response = await fetch(url, obj);
  return response.json();
};

const createIDS = (task) => {
  return {
    listItemsID: `listItems_${task._id}`,
    taskID: `task_${task._id}`,
    deleteID: `delete_${task._id}`,
    editID: `edit_${task._id}`,
  };
};

const createTask = (task, ids) => {
  const element = document.createElement("li");
  element.id = ids.listItemsID;

  element.innerHTML = String.raw`
    <p class="task-content" id="${ids.taskID}">${task.task}</p>
    <div class="btn-container">
      <button class="edit-btn" type="button" type="submit" id="${ids.editID}">
        <span class="material-symbols-outlined edit-icon">
          edit
        </span>
      </button>
      <button class="delete-btn" type="button" id="${ids.deleteID}">
        <span class="material-symbols-outlined delete-icon" >
          delete
        </span>
      </button>
    </div>
`;
  return element;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = await fetchData("/", {
    method: "post",
    body: JSON.stringify({ task: taskUserInput.value }),
    headers: { "Content-type": "application/json; charset=utf-8" },
  });
  console.log("data", data);
  let ids = createIDS(data.document);
  const newTask = createTask(data.document, ids);
  tasksList.appendChild(newTask);
  location.reload();
  taskUserInput.value = "";
});

const editTask = (task, taskID, editID) => {
  const btn = document.querySelector(`#${editID}`);
  btn.addEventListener("click", async () => {
    const data = await fetchData(`/${task._id}`, {
      method: "put",
      headers: { "Content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ task: taskUserInput.value }),
    });
    const editedTask = document.querySelector(`#${taskID}`);
    editedTask.innerHTML = data.userInput.task;
    taskUserInput.value = "";
  });
};

const deleteTask = (task, listItemsID, deleteID) => {
  let deleteBut = document.querySelector(`#${deleteID}`);
  deleteBut.addEventListener("click", async () => {
    const url = `/${task._id}`;
    const data = await fetchData(url, { method: "delete" });
    if (data.ok == 1) {
      document.querySelector(`#${listItemsID}`).remove();
    }
  });
};

window.addEventListener("load", () => {
  initTasks();
});
