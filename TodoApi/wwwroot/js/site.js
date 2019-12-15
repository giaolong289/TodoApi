const uri = 'api/TodoItems';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));       
}

function _displayCount(itemCount) {
    const name = itemCount === 1 ? 'to-do' : 'to-dos';
    document.getElementById('counter').innerHTML = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;

        let editButton = createButton('Edit', `displayEditForm(${item.id})`);
        let deleteButton = createButton('Delete', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    todos = data;
}

function createButton(text, clickFunctionName) {
    let button = document.createElement('button');
    button.innerText = text;
    button.setAttribute('onclick', clickFunctionName);

    return button;
}

function addItem() {
    const addNameTextBox = document.getElementById('add-name');

    const item = {
        isComplete: false,
        name: addNameTextBox.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextBox.value = '';
        })
        .catch(error => console.error('Unable to get items.', error)); 
}

function displayEditForm(id) {
    const item = todos.find(d => d.id === id);

    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-isComplete').value = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId),
        name: document.getElementById('edit-name').value,
        isComplete: document.getElementById('edit-isComplete').checked
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => {
            getItems();
        })
        .catch(error => console.error('Unable to get items.', error)); 

    closeInput();

    return false;
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to get items.', error));
}