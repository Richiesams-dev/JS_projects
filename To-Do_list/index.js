const button = document.querySelector("button");
const list = document.querySelector("ul");
const input = document.getElementById("input");

// Load saved items when page loads
document.addEventListener("DOMContentLoaded", loadItems);

function loadItems() {
    //     Gets stored to-do items from localStorage (browser storage).
    
    const savedItems = JSON.parse(localStorage.getItem("todoItems")) || []; // If no items exist, then set as an empty array [].
    list.innerHTML = ''; // Clear the list before loading
    
    savedItems.forEach((item, index) => {
        createListItem(item, index);
    });
}

function renderItem() {
    const value = input.value.trim();
    
    if (value === "") {
        alert("Please enter a value");
        return;
    }
    
    // Get current items from storage
    const savedItems = JSON.parse(localStorage.getItem("todoItems")) || [];
    
    // Add new item
    savedItems.push(value);
    
    // Save back to storage
    localStorage.setItem("todoItems", JSON.stringify(savedItems));
    
    // Create and display the new item
    createListItem(value, savedItems.length - 1);
    
    input.value = ""; // Clear the input
}

function createListItem(value, index) {
    const li = document.createElement("li");
    li.textContent = value;
    li.style.display = "inline";
    li.style.marginRight = "10px";
    
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    
    const itemContainer = document.createElement("div");
    itemContainer.style.marginBottom = "5px";
    itemContainer.appendChild(li);
    itemContainer.appendChild(deleteButton);
    
    list.appendChild(itemContainer);
    list.style.background = "blue";
    
    deleteButton.onclick = function() {
        removeItem(index);
    };
}

function removeItem(index) {
    // Get current items
    let savedItems = JSON.parse(localStorage.getItem("todoItems")) || [];
    
    // Remove the item at the specified index
    savedItems.splice(index, 1);
    
    // Save back to storage
    localStorage.setItem("todoItems", JSON.stringify(savedItems));
    
    // Reload the list to reflect changes
    loadItems();
}

button.addEventListener("click", renderItem);