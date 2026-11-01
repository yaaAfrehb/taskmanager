
const taskInput = document.querySelector("#taskInput");
const addButton = document.querySelector("#addTask");
const taskList = document.querySelector("#taskList");
const taskCount = document.querySelector("#taskCount");
const error = document.querySelector("#error");
const themeToggle = document.querySelector("#themeToggle");
const taskCategory = document.querySelector("#taskCategory");

const totalTasks = document.querySelector("#totalTasks");
const completedTasks = document.querySelector("#completedTasks");
const remainingTasks = document.querySelector("#remainingTasks");

const progressBar = document.querySelector("#progressBar");
const progressPercent = document.querySelector("#progressPercent");
const emptyMessage = document.querySelector("#emptyMessage");

const filters = document.querySelectorAll(".filter");

const MAX_TASKS = 10;

let tasks = [];
let currentFilter = "All";

// UPDATE DASHBOARD
function updateDashboard() {
    const completed = tasks.filter(task => task.completed).length;
    const remaining = tasks.length - completed;

    const percentage = tasks.length === 0
        ? 0
        : Math.round((completed / tasks.length) * 100);

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    remainingTasks.textContent = remaining;

    progressBar.style.width = percentage + "%";
    progressPercent.textContent = percentage + "%";

    taskCount.textContent = `${tasks.length} / ${MAX_TASKS} tasks`;

    addButton.disabled = tasks.length >= MAX_TASKS;

    addButton.textContent = tasks.length >= MAX_TASKS
        ? "LIMIT REACHED"
        : "ADD TASK";
}

// DISPLAY TASKS
function updateTasks() {
    taskList.innerHTML = "";

    const visibleTasks = tasks
        .map((task, index) => ({ task, index }))
        .filter(item =>
            currentFilter === "All" ||
            item.task.category === currentFilter
        );

    visibleTasks.forEach(({ task, index }) => {
        const li = document.createElement("li");
        li.classList.add("task");

        if (task.completed) {
            li.classList.add("completed");
        }

        const text = document.createElement("div");
        text.classList.add("task-text");
        text.textContent = task.name;

        const category = document.createElement("span");
        category.classList.add("task-category", task.category);
        category.textContent = task.category;

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
        deleteButton.textContent = "x";
        deleteButton.setAttribute("aria-label", "Delete task");

        deleteButton.addEventListener("click", () => {
            li.classList.add("removing");

            deleteButton.disabled = true;

            li.addEventListener("animationend", () => {
                tasks.splice(index, 1);
                updateTasks();
            }, { once: true });
        });

        li.append(text, category, completeButton, deleteButton);
        taskList.appendChild(li);
    });

    emptyMessage.style.display =
        visibleTasks.length === 0 ? "block" : "none";

    updateDashboard();
}

// ADD TASK
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
        category: taskCategory.value,
        completed: false
    });

    taskInput.value = "";

    updateTasks();
}

// ADD BUTTON
addButton.addEventListener("click", addNewTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addNewTask();
    }
});

// CATEGORY FILTERS
filters.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filters.forEach(filter => {
            filter.classList.remove("active");
        });

        button.classList.add("active");

        updateTasks();
    });
});

// LIGHT AND DARK MODE
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    themeToggle.textContent = isDark ? "☾" : "𖤓";

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
});

// INITIAL DISPLAY
updateTasks();
