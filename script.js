const taskInput = document.querySelector("#taskInput");
const addButton = document.querySelector("#addTask");
const taskList = document.querySelector("#taskList");
const taskCount = document.querySelector("#taskCount");
const error = document.querySelector("#error");
const themeToggle = document.querySelector("#themeToggle");


const MAX_TASKS = 10;
let tasks = [];

function updateTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add("task");

    if (task.completed) {
      li.classList.add("completed");
    }

    const text = document.createElement("div");
    text.classList.add("task-text");
    text.textContent = task.name;

    const completeButton = document.createElement("button");
    completeButton.classList.add("complete-btn");
    completeButton.textContent = task.completed ? "↶" : "✓";
    completeButton.setAttribute(
      "aria-label",
      task.completed ? "Undo completion" : "Complete task"
    );

    completeButton.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      updateTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", "Delete task");

    deleteButton.addEventListener("click", () => {
      tasks.splice(index, 1);
      updateTasks();
    });

    li.append(text, completeButton, deleteButton);
    taskList.appendChild(li);
  });

  taskCount.textContent = `${tasks.length} / ${MAX_TASKS} tasks`;

  addButton.disabled = tasks.length >= MAX_TASKS;
  addButton.textContent =
    tasks.length >= MAX_TASKS ? "LIMIT REACHED" : "ADD TASK";
}

function addNewTask() {
  const taskName = taskInput.value.trim();

  error.textContent = "";

  if (taskName === "") {
    error.textContent = "Please enter a task!";
    return;
  }

  if (tasks.length >= MAX_TASKS) {
    error.textContent = "You can only have 10 tasks!";
    return;
  }

  tasks.push({
    name: taskName,
    completed: false
  });

  taskInput.value = "";
  updateTasks();
}

addButton.addEventListener("click", addNewTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addNewTask();
  }
});

updateTasks();


themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");

  themeToggle.textContent = isDark ? "☾" : "𖤓";

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
});


