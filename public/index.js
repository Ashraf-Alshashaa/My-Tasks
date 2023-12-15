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
    editTask(task, ids);
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
    editInputID: `edit_${task._id}_input`,
    doneID: `done_${task._id}`,
    cancelID: `cancel_${task._id}`,
  };
};

const createTask = (task, ids) => {
  const element = document.createElement("li");
  element.id = ids.listItemsID;

  element.innerHTML = String.raw`
    <p class="task-content" id="${ids.taskID}">${task.task}</p>
    <div class="btn-container">
      <button class="edit-btn" type="button" id="${ids.editID}">
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

const editTaskModal = (ids) => {
  const element = document.createElement("div");
  element.className = "edit-modal-container";
  element.innerHTML = String.raw`
    <div class="edit-modal">
      <div class="modal-header">
        <p class="title">Edit Task</p>
          <span id="${ids.cancelID}" class="material-symbols-outlined cancel-icon" >
            close
          </span>
      </div>
      <textarea class="edit-task-input" id="${ids.editInputID}"></textarea>
      <div class="done-btn-container">
        <button class="done-btn" type="button" type="submit" id="${ids.doneID}">
          Done
        </button>
      </div>
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
  let ids = createIDS(data.document);
  const newTask = createTask(data.document, ids);
  tasksList.appendChild(newTask);
  taskUserInput.value = "";
});

const editTask = (task, ids) => {
  const btn = document.querySelector(`#${ids.editID}`);
  btn.addEventListener("click", async () => {
    const editedTask = document.querySelector(`#${ids.taskID}`);
    const editTaskModalElement = editTaskModal(ids);
    document.body.appendChild(editTaskModalElement);
    const editTaskInput = document.querySelector(`#${ids.editInputID}`);
    editTaskInput.value = editedTask.textContent;
    editTaskInput.style.height = editTaskInput.scrollHeight + 8 + "px";

    const doneBtn = document.querySelector(`#${ids.doneID}`);
    doneBtn.addEventListener("click", async () => {
      const data = await fetchData(`/${task._id}`, {
        method: "put",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ task: editTaskInput.value }),
      });
      editedTask.innerHTML = data.userInput.task;
      editTaskModalElement.remove();
    });

    const cancelBtn = document.querySelector(`#${ids.cancelID}`);
    cancelBtn.addEventListener("click", () => {
      editTaskModalElement.remove();
    });
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
