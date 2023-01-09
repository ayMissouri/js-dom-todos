// STATE
const state = {
    tasks: []
}

// SELECTORS
const taskUL = document.querySelector("#todo-list")
const newTaskBox = document.querySelector("#newTaskInput")
const form = document.querySelector("form")
const addTaskButton = document.querySelector("#addTaskButton")

// ADDING NEW TASK
form.addEventListener("submit", (event) => {
    event.preventDefault()
    const inputField = newTaskBox.value
    if (inputField.length > 0) {
        fetch("http://localhost:3000/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: inputField,
                completed: false
            })
        })
        .then(() => {getAllTasks()}).catch((error) => {alert(error)})
    } else {alert(`Please enter a task!`)}
})

// NETWORKING
const getAllTasks = () => {
    fetch("http://localhost:3000/todos")
        .then((response) => {
            return response.json()
        })
        .then((responseData) => {
            console.log("Tasks received:", responseData)
            state.tasks = responseData
            renderTasks()
        })
}

// RENDERING
const clearTaskList = () => {taskUL.innerHTML = ""}

const afterDelete = () => {
    clearTaskList()
    getAllTasks()
}

const renderTasks = () => {
    clearTaskList()
    state.tasks.forEach((task) => {
        const newTask = document.createElement("li")
        newTask.innerText = task.title
        taskUL.append(newTask)
        if (task.completed) {
            newTask.setAttribute("class", "completed")
        }

        const completeCheckbox = document.createElement("input")
        completeCheckbox.setAttribute("type", "checkbox")
        completeCheckbox.checked = task.completed
        completeCheckbox.setAttribute("id", task.id)
        newTask.append(completeCheckbox)

        completeCheckbox.addEventListener("change", (event) => {
            task.completed = completeCheckbox.checked
            if (completeCheckbox.checked) {
                newTask.setAttribute("class", "completed")
            } else {newTask.setAttribute("class", "incomplete")}
            fetch(`http://localhost:3000/todos/${task.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: task.title, 
                    completed: task.completed
                })
            }).catch((error) => {alert(error)})
        })

        const deleteButton = document.createElement("button")
        deleteButton.innerText = "Delete task"
        deleteButton.setAttribute("id", task.id)
        newTask.append(deleteButton)

        deleteButton.addEventListener("click", () => {
            fetch(`http://localhost:3000/todos/${task.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }) .then(() => {afterDelete()}).catch((error) => {alert(error)})
        })
    })
}

getAllTasks()