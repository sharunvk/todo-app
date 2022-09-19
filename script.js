let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");
let addListButton = document.getElementById('addList');
let todoWrapper = document.getElementById('wrapper');
let deleteListButton = document.getElementById('deleteListButton');
let myList = document.getElementById('myList');

const getTodoListFromStorage = () => {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    if (parsedTodoList === null) {
        return [];
    } else {
        return parsedTodoList;
    }
}

const todoApp = (function () {
    let todoList = getTodoListFromStorage();
    let todosCount = todoList.length;

    const displayList = (todo) => {
        let listElement = document.getElementById('selectList');
        let listInput = document.getElementById('listInputElement');
        let newList = document.createElement('option');
        newList.id = todo.listName;
        newList.value = todo.listName;
        newList.textContent = todo.listName;
        listElement.appendChild(newList);
        listInput.value = '';
    }

    const createList = () => {
        let listElement = document.getElementById('selectList');
        let listInput = document.getElementById('listInputElement');
        let newListName = listInput.value;
        if (newListName === '') {
            alert('Please enter a list');
            return
        }

        const list = {
            listName: newListName,
            todoItems: []
        }

        let dataExist = todoList.some((item) => {
            return item.listName === newListName
        });

        if (dataExist) {
            listInput.value = '';
            alert('List already exists');
        } else {
            todoList.push(list)
            localStorage.setItem("todoList", JSON.stringify(todoList));

            let newList = document.createElement('option');
            newList.id = newListName;
            newList.value = newListName;
            newList.textContent = newListName;
            listElement.appendChild(newList);
            listInput.value = '';
        }

    }

    const createAndAppendTodo = (todo) => {
        let todoId = "todo" + todo.uniqueNo;
        let checkboxId = "checkbox" + todo.uniqueNo;
        let labelId = "label" + todo.uniqueNo;

        let todoElement = document.createElement("li");
        todoElement.classList.add("todo-item-container");
        todoElement.id = todoId;
        todoItemsContainer.appendChild(todoElement);

        let inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.id = checkboxId;
        inputElement.checked = todo.isChecked;

        inputElement.onclick = () => {
            onTodoStatusChange(labelId, todoId);
        };

        inputElement.classList.add("checkbox-input");
        todoElement.appendChild(inputElement);

        let labelContainer = document.createElement("div");
        labelContainer.classList.add("label-container");
        todoElement.appendChild(labelContainer);

        let labelElement = document.createElement("label");
        labelElement.setAttribute("for", checkboxId);
        labelElement.id = labelId;
        labelElement.classList.add("checkbox-label");
        labelElement.textContent = todo.text;
        if (todo.isChecked === true) {
            labelElement.classList.add("checked");
        }
        labelContainer.appendChild(labelElement);

        let iconContainer = document.createElement("div");
        iconContainer.classList.add("icon-container");
        labelContainer.appendChild(iconContainer);

        let deleteIcon = document.createElement("i");
        deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon", "pointer");

        let editIcon = document.createElement('li');
        editIcon.classList.add("fa-solid", "fa-pen", "delete-icon", "pointer");

        deleteIcon.onclick = () => {
            let listName = document.getElementById('selectList').value.trim();
            deleteTodo(todoId, listName);
        };

        editIcon.onclick = () => {
            let listName = document.getElementById('selectList').value.trim();
            editTodo(todoId, listName);
        }

        iconContainer.appendChild(editIcon);
        iconContainer.appendChild(deleteIcon);

    }

    for (let todo of todoList) {
        displayList(todo);
    }

    const onClickAdd = () => {
        let userInputElement = document.getElementById("todoUserInput");
        let userInputValue = userInputElement.value;

        if (userInputValue === "") {
            alert("Please enter a task to add");
            return;
        }

        todosCount = todosCount + 1;

        let newTodo = {
            text: userInputValue,
            uniqueNo: todosCount,
            isChecked: false
        };
        let listElement = document.getElementById('selectList');
        let listTodo = todoList.map((todoItem) => {
            if (todoItem.listName === listElement.value) {
                let tasks = todoItem.todoItems;
                tasks.push(newTodo);
            }
            return todoItem;
        });

        localStorage.setItem('todoList', JSON.stringify(listTodo));

        createAndAppendTodo(newTodo);
        userInputElement.value = "";

    }

    const onClickSave = () => {
        localStorage.setItem("todoList", JSON.stringify(todoList));
    }

    const onTodoStatusChange = (labelId) => {
        let labelElement = document.getElementById(labelId);
        labelElement.classList.toggle("checked");

        let currentItem = labelElement.textContent;
        let selectedElement = document.getElementById('selectList');
        let currentList = selectedElement.value;

        todoList = todoList.map((item) => {
            if (item.listName === currentList) {
                item.todoItems.map((subList) => {
                    if (subList.text === currentItem) {
                        if (subList.isChecked === true) {
                            subList.isChecked = false;
                        } else {
                            subList.isChecked = true;
                        }
                    }
                    return subList;
                });
            }
            return item;
        });

    }

    const deleteTodo = (todoId, listName) => {
        let todoElement = document.getElementById(todoId);
        todoItemsContainer.removeChild(todoElement);

        let listIndex = todoList.findIndex((eachList) => {
            return eachList.listName === listName;
        });
        let todoItemIndex = todoList[listIndex].todoItems.findIndex((eachTodo) => {
            return 'todo' + (eachTodo.uniqueNo) === todoId
        });
        todoList[listIndex].todoItems.splice(todoItemIndex, 1);
    }

    const editTodo = (todoId, listName) => {

        let mainContainer = document.getElementById('todoContainer');
        mainContainer.classList.add('dim');

        let checkboxEl = document.getElementById(todoId).firstElementChild;
        let divEl = checkboxEl.nextElementSibling;
        let labelEl = divEl.firstElementChild;

        let editTodoContainer = document.getElementById('editTodo');
        editTodoContainer.classList.add('open-edit');
        let updateInput = document.getElementById('updateTodo');
        updateInput.placeholder = labelEl.textContent;
        let updateButton = document.getElementById('updateButton');

        updateButton.onclick = () => {
            let todoNewValue = updateInput.value;
            if (todoNewValue === '') {
                alert('Please enter valid input');
                editTodoContainer.classList.remove('open-edit');
                mainContainer.classList.remove('dim');
                return;
            }
            let listIndex = todoList.findIndex((eachList) => {
                return eachList.listName === listName;
            });
            let todoItemIndex = todoList[listIndex].todoItems.findIndex((eachTodo) => {
                return 'todo' + (eachTodo.uniqueNo) === todoId
            });

            labelEl.textContent = todoNewValue;
            todoList[listIndex].todoItems[todoItemIndex].text = todoNewValue;
            editTodoContainer.classList.remove('open-edit');
            updateInput.value = '';
            mainContainer.classList.remove('dim');
        }
    }

    const deleteList = (selectedElement) => {
        let listName = selectedElement.value;
        let listIndex = todoList.findIndex((eachList) => {
            return eachList.listName === listName;
        });

        selectedElement.removeChild(selectedElement.children[listIndex + 1]);
        todoWrapper.style.display = 'none';

        todoList.splice(listIndex, 1);
        localStorage.setItem("todoList", JSON.stringify(todoList));
    }

    const changeListName = (listName) => {

        let mainContainer = document.getElementById('todoContainer');
        mainContainer.classList.add('dim');
    
        let editTodoContainer = document.getElementById('editTodo');
        editTodoContainer.classList.add('open-edit');
        let updateInput = document.getElementById('updateTodo');
        updateInput.placeholder = listName;
        let updateButton = document.getElementById('updateButton');
    
        updateButton.onclick = () => {
            let newListName = updateInput.value;
                if (newListName === '') {
                    alert('Please enter valid input');
                    editTodoContainer.classList.remove('open-edit');
                    mainContainer.classList.remove('dim');
                    return;
                }
    
                let listIndex = todoList.findIndex((eachList) => {
                    return eachList.listName === listName;
                });

                todoList[listIndex].listName = newListName;
                editTodoContainer.classList.remove('open-edit');
                updateInput.value = '';
                mainContainer.classList.remove('dim');
                myList.innerText = newListName;
                let selectedElement = document.getElementById('selectList');
                selectedElement.children[listIndex+1].innerText = newListName;
        }
    }

    return { onClickAdd, onClickSave, createList, createAndAppendTodo, deleteList, changeListName };

})();

addTodoButton.addEventListener('click', () => {
    todoApp.onClickAdd();
});

saveTodoButton.addEventListener('click', () => {
    todoApp.onClickSave();
});

addListButton.addEventListener('click', () => {
    todoApp.createList();
});

deleteListButton.addEventListener('click', () => {
    let selectedElement = document.getElementById('selectList');
    todoApp.deleteList(selectedElement);
})

const populate = (event) => {
    if (event.target.value === '') {
        todoWrapper.style.display = 'none';
    } else {
        todoItemsContainer.innerHTML = '';
        todoWrapper.style.display = 'block';
        let todoList = JSON.parse(localStorage.getItem('todoList'));
        let todoTask = todoList.filter((eachTodo) => {
            return eachTodo.listName === event.target.value;
        })[0].todoItems;

        myList.innerText = event.target.value;

        todoTask.forEach((item) => {
            todoApp.createAndAppendTodo(item);
        });

        if (todoTask.length === 0) {
            deleteListButton.style.display = '';
        } else {
            deleteListButton.style.display = 'none';
        }
    }
}

changeName = () => {
    let listName = document.getElementById('selectList').value;
    todoApp.changeListName(listName);
}

hide = () => {
    let editTodoContainer = document.getElementById('editTodo');
    let mainContainer = document.getElementById('todoContainer');
    editTodoContainer.classList.remove('open-edit');
    mainContainer.classList.remove('dim');
}