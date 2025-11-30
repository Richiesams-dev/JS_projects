const button = document.getElementById("add-btn");
const list = document.getElementById("list");
const input = document.getElementById("input");
const categorySelect = document.getElementById("category");
const dueDateInput = document.getElementById("due-date");
const emptyMessage = document.getElementById("empty-message");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const filterButtons = document.querySelectorAll(".filter-btn");

// Initialize SortableJS for drag and drop
new Sortable(list, {
    animation: 150,
    ghostClass: 'sortable-chosen',
    onEnd: updateTaskOrder
});

// Load saved items when page loads
document.addEventListener("DOMContentLoaded", loadItems);

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    updateDarkModeButton();
});

// Check for saved dark mode preference
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
}
updateDarkModeButton();

function updateDarkModeButton() {
    const isDark = document.body.classList.contains("dark-mode");
    darkModeToggle.innerHTML = isDark 
        ? '<i class="fas fa-sun"></i> Light Mode' 
        : '<i class="fas fa-moon"></i> Dark Mode';
}

// Filter tasks by category
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filterTasks(btn.dataset.filter);
    });
});

function filterTasks(category) {
    const items = document.querySelectorAll(".todo-item");
    items.forEach(item => {
        const itemCategory = item.dataset.category;
        if (category === "all" || itemCategory === category) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

function loadItems() {
    const savedItems = JSON.parse(localStorage.getItem("todoItems")) || [];
    list.innerHTML = "";
    
    if (savedItems.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    savedItems.forEach((item, index) => {
        createListItem(item, index);
    });
}

function renderItem() {
    const text = input.value.trim();
    const category = categorySelect.value;
    const dueDate = dueDateInput.value;
    
    if (text === "") {
        alert("Please enter a task!");
        return;
    }
    
    const newItem = {
        text,
        completed: false,
        category,
        dueDate: dueDate || null,
        id: Date.now().toString()
    };
    
    const savedItems = JSON.parse(localStorage.getItem("todoItems")) || [];
    savedItems.push(newItem);
    localStorage.setItem("todoItems", JSON.stringify(savedItems));
    
    createListItem(newItem, savedItems.length - 1);
    input.value = "";
    dueDateInput.value = "";
    emptyMessage.style.display = "none";
}

function createListItem(item, index) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.category = item.category;
    li.dataset.id = item.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", () => toggleComplete(item.id));

    const contentDiv = document.createElement("div");
    contentDiv.className = "task-content";

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = item.text;
    if (item.completed) taskText.classList.add("completed");

    // Double-click to edit
    taskText.addEventListener("dblclick", () => editTask(item.id, taskText));

    const metaDiv = document.createElement("div");
    metaDiv.className = "task-meta";

    const categorySpan = document.createElement("span");
    categorySpan.className = `category category-${item.category}`;
    categorySpan.textContent = item.category;

    metaDiv.appendChild(categorySpan);

    if (item.dueDate) {
        const dueDateSpan = document.createElement("span");
        dueDateSpan.className = "due-date";
        dueDateSpan.innerHTML = `<i class="far fa-calendar-alt"></i> ${formatDate(item.dueDate)}`;
        metaDiv.appendChild(dueDateSpan);
    }

    contentDiv.appendChild(taskText);
    contentDiv.appendChild(metaDiv);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "todo-actions";

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.addEventListener("click", () => editTask(item.id, taskText));

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener("click", () => removeItem(item.id));

    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);

    li.appendChild(checkbox);
    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);

    list.appendChild(li);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function toggleComplete(id) {
    const savedItems = JSON.parse(localStorage.getItem("todoItems")) || [];
    const itemIndex = savedItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        savedItems[itemIndex].completed = !savedItems[itemIndex].completed;
        localStorage.setItem("todoItems", JSON.stringify(savedItems));
        loadItems();
    }
}

function editTask(id, taskTextElement) {
    const savedItems = JSON.parse(localStorage.getItem("todoItems")) || [];
    const itemIndex = savedItems.findIndex(item => item.id === id);
    if (itemIndex === -1) return;

    const item = savedItems[itemIndex];
    const newText = prompt("Edit your task:", item.text);
    if (newText !== null && newText.trim() !== "") {
        item.text = newText.trim();
        localStorage.setItem("todoItems", JSON.stringify(savedItems));
        loadItems();
    }
}

function removeItem(id) {
    const savedItems = JSON.parse(localStorage.getItem("todoItems")) || [];
    const updatedItems = savedItems.filter(item => item.id !== id);
    localStorage.setItem("todoItems", JSON.stringify(updatedItems));
    loadItems();
}

function updateTaskOrder() {
    const items = Array.from(list.children);
    const savedItems = JSON.parse(localStorage.getItem("todoItems")) || [];
    
    const newOrder = items.map(li => {
        return savedItems.find(item => item.id === li.dataset.id);
    }).filter(item => item !== undefined);
    
    localStorage.setItem("todoItems", JSON.stringify(newOrder));
}

button.addEventListener("click", renderItem);

// Allow pressing "Enter" to add tasks
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") renderItem();
});