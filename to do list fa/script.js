
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const itemsLeft = document.getElementById("itemsLeft");
const clearCompleted = document.getElementById("clearCompleted");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const filterButtons = document.querySelectorAll(".filter");

const STORAGE_KEY = "blue-todo-items";
const THEME_KEY = "blue-todo-theme";

let todos = loadTodos();
let currentFilter = "all";

function loadTodos() {
    try {
        const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (Array.isArray(savedTodos)) {
            return savedTodos.filter(
                todo =>
                    todo &&
                    typeof todo.text === "string" &&
                    typeof todo.completed === "boolean" &&
                    Number.isFinite(todo.id)
            );
        }
    } catch (error) {
        console.warn("Could not load saved todos.", error);
    }

    return [
        { id: 1, text: "Jog around the park 3x", completed: false },
        { id: 2, text: "10 minutes meditation", completed: false },
        { id: 3, text: "Complete Todo App Frontend Mentor", completed: false },
        { id: 4, text: "Read for 1 hour", completed: false },
        { id: 5, text: "Pick up groceries", completed: false }
    ];
}

function saveTodos() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.warn("Could not save todos.", error);
    }
}

function renderTodos() {
    todoList.replaceChildren();

    const filteredTodos = todos.filter(todo => {
        if (currentFilter === "active") {
            return !todo.completed;
        }

        if (currentFilter === "completed") {
            return todo.completed;
        }

        return true;
    });

    if (filteredTodos.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "empty-state";

        if (currentFilter === "completed") {
            emptyMessage.textContent = "No completed tasks yet.";
        } else if (currentFilter === "active") {
            emptyMessage.textContent = "You're all caught up!";
        } else {
            emptyMessage.textContent = "Nothing here yet. Add your first todo!";
        }

        todoList.appendChild(emptyMessage);
    }

    filteredTodos.forEach(todo => {
        const item = document.createElement("li");
        item.className = `todo-item${todo.completed ? " completed" : ""}`;

        const checkButton = document.createElement("button");
        checkButton.className = "check-button";
        checkButton.type = "button";
        checkButton.textContent = todo.completed ? "✓" : "";
        checkButton.setAttribute(
            "aria-label",
            todo.completed ? "Mark as active" : "Mark as completed"
        );
        checkButton.setAttribute("aria-pressed", String(todo.completed));

        checkButton.addEventListener("click", () => {
            toggleTodo(todo.id);
        });

        const text = document.createElement("span");
        text.className = "todo-text";
        text.textContent = todo.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", `Delete ${todo.text}`);

        deleteButton.addEventListener("click", () => {
            deleteTodo(todo.id);
        });

        item.append(checkButton, text, deleteButton);
        todoList.appendChild(item);
    });

    updateFooter();
}

function updateFooter() {
    const activeCount = todos.filter(todo => !todo.completed).length;

    itemsLeft.textContent =
        `${activeCount} ${activeCount === 1 ? "item" : "items"} left`;
}

function addTodo(text) {
    const newTodo = {
        id: Date.now() + Math.random(),
        text,
        completed: false
    };

    todos.unshift(newTodo);
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo =>
        todo.id === id
            ? { ...todo, completed: !todo.completed }
            : todo
    );

    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function removeCompletedTodos() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

todoForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = todoInput.value.trim();

    if (!text) {
        todoInput.focus();
        return;
    }

    addTodo(text);
    todoInput.value = "";
    todoInput.focus();
});

clearCompleted.addEventListener("click", removeCompletedTodos);

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(filter => {
            const isActive = filter === button;

            filter.classList.toggle("active", isActive);
            filter.setAttribute("aria-pressed", String(isActive));
        });

        renderTodos();
    });
});

function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark", isDark);
    themeIcon.textContent = isDark ? "☀" : "☾";

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";

    applyTheme(nextTheme);

    try {
        localStorage.setItem(THEME_KEY, nextTheme);
    } catch (error) {
        console.warn("Could not save theme.", error);
    }
});

function loadTheme() {
    try {
        const savedTheme = localStorage.getItem(THEME_KEY);
        applyTheme(savedTheme === "dark" ? "dark" : "light");
    } catch (error) {
        applyTheme("light");
    }
}

loadTheme();
renderTodos();
