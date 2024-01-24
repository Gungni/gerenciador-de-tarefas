document.addEventListener('DOMContentLoaded', () => {
    const styleSwitchButton = document.getElementById('style-switch');

    styleSwitchButton.addEventListener('click', toggleStyles);

    loadSavedStyle();

    function toggleStyles() {
        const currentStyle = getCurrentStyle();
        const newStyle = currentStyle === 'default' ? 'alt' : 'default';

        document.getElementById('page-style').setAttribute('href', `styles_${newStyle}.css`);

        saveStyleState(newStyle);
    }

    function saveStyleState(style) {
        localStorage.setItem('styleState', style);
    }

    function loadSavedStyle() {
        const savedStyle = localStorage.getItem('styleState') || 'default';
        document.getElementById('page-style').setAttribute('href', `styles_${savedStyle}.css`);
    }

    function getCurrentStyle() {
        const currentStyleHref = document.getElementById('page-style').getAttribute('href');
        return currentStyleHref.includes('styles_default.css') ? 'default' : 'alt';
    }
});


function mostrarConteudo(conteudo) {
    const taskForm = document.getElementById('task-form-container');
    const taskList = document.getElementById('task-list');
    const completedTasks = document.getElementById('completed-tasks');

    taskForm.style.display = 'none';
    taskList.style.display = 'none';
    completedTasks.style.display = 'none';

    if (conteudo === 'task-form') {
        taskForm.style.display = 'block';
    } else if (conteudo === 'task-list') {
        taskList.style.display = 'block';
    } else if (conteudo === 'completed-tasks') {
        completedTasks.style.display = 'block';
    }
}

function addTask() {
    const title = document.getElementById('task-title').value;
    const priority = document.getElementById('priority').value;
    const assignee = document.getElementById('assignee').value;
    const dueDate = document.getElementById('due-date').value;
    const description = document.getElementById('description').value;
    const checklistInput = document.getElementById('checklist').value;

    const checklistItems = checklistInput.split(',').map(item => item.trim());

    if (title && priority && assignee && dueDate) {
        const taskContainer = document.getElementById('tasks-container');

        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');

        let taskContent = `
            <h3>${title}</h3>
            <p>Prioridade: ${traduzirPrioridade(priority)}</p>
            <p>Responsável: ${assignee}</p>
            <p>Data de Vencimento: ${dueDate}</p>
            <p>Descrição: ${description}</p>
        `;

        if (checklistItems.length > 0) {
            taskContent += '<h4>Checklist:</h4>';
            taskContent += '<ul>';
            checklistItems.forEach(item => {
                taskContent += `<li>${item}</li>`;
            });
            taskContent += '</ul>';
        }

        taskContent += '<button class="edit-button" onclick="openEditModal(this.parentNode)">Editar</button>';
        taskContent += '<button class="complete-button" onclick="completeTask(this.parentNode)">Concluir</button>';

        taskDiv.innerHTML = taskContent;
        taskContainer.appendChild(taskDiv);

        document.getElementById('task-form').reset();

        saveTasksToLocalStorage();
    } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
}

function traduzirPrioridade(priority) {
    switch (priority) {
        case 'high':
            return 'Alta';
        case 'medium':
            return 'Média';
        case 'low':
            return 'Baixa';
        default:
            return priority;
    }
}

function clearLocalStorage() {
    if (confirm("Tem certeza que deseja limpar todas as tarefas armazenadas?")) {
        localStorage.removeItem('tasks');
        localStorage.removeItem('completedTasks');

        location.reload();
    }
}

function openEditModal(taskDiv) {
    const taskInfo = taskDiv.querySelectorAll('p');
    const checklist = taskDiv.querySelector('ul');

    const title = taskDiv.querySelector('h3').innerText;
    const priority = taskInfo[0].innerText.split(": ")[1];
    const assignee = taskInfo[1].innerText.split(": ")[1];
    const dueDate = taskInfo[2].innerText.split(": ")[1];
    const description = taskInfo[3].innerText.split(": ")[1];

    const checklistItems = [];
    if (checklist) {
        const checklistItemsNodes = checklist.querySelectorAll('li');
        checklistItemsNodes.forEach(item => {
            checklistItems.push(item.innerText);
        });
    }

    const editForm = document.getElementById('edit-task-form');
    editForm.innerHTML = `
        <label for="edit-task-title">Título da Tarefa:</label>
        <input type="text" id="edit-task-title" name="edit-task-title" value="${title}" required>

        <label for="edit-priority">Prioridade:</label>
        <select id="edit-priority" name="edit-priority">
            <option value="Alta" ${priority === 'Alta' ? 'selected' : ''}>Alta</option>
            <option value="Média" ${priority === 'Média' ? 'selected' : ''}>Média</option>
            <option value="Baixa" ${priority === 'Baixa' ? 'selected' : ''}>Baixa</option>
        </select>

        <label for="edit-assignee">Responsável:</label>
        <input type="text" id="edit-assignee" name="edit-assignee" value="${assignee}">

        <label for="edit-due-date">Data de Vencimento:</label>
        <input type="date" id="edit-due-date" name="edit-due-date" value="${dueDate}">

        <label for="edit-description">Descrição:</label>
        <textarea id="edit-description" name="edit-description">${description}</textarea>

        <label for="edit-checklist">Checklist (separe os itens por vírgulas):</label>
        <input type="text" id="edit-checklist" name="edit-checklist" value="${checklistItems.join(', ')}">

        <button type="button" onclick="saveChanges('${title}', '${dueDate}')">Salvar Alterações</button>
        <button type="button" onclick="deleteTask('${title}')">Excluir Tarefa</button>
    `;

    const editModal = document.getElementById('edit-task-modal');
    editModal.style.display = 'block';
}

function closeEditModal() {
    const editModal = document.getElementById('edit-task-modal');
    editModal.style.display = 'none';
}

function saveChanges(originalTitle, originalDueDate) {
    const newTitle = document.getElementById('edit-task-title').value;
    const newPriority = document.getElementById('edit-priority').value;
    const newAssignee = document.getElementById('edit-assignee').value;
    const newDueDate = document.getElementById('edit-due-date').value;
    const newDescription = document.getElementById('edit-description').value;
    const newChecklistInput = document.getElementById('edit-checklist').value;

    const newChecklistItems = newChecklistInput.split(',').map(item => item.trim());

    const tasksContainer = document.getElementById('tasks-container');
    const tasks = tasksContainer.getElementsByClassName('task');

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const taskTitle = task.querySelector('h3').innerText;

        if (taskTitle === originalTitle) {
            task.querySelector('h3').innerText = newTitle;
            task.querySelector('p:nth-of-type(1)').innerText = `Prioridade: ${newPriority}`;
            task.querySelector('p:nth-of-type(2)').innerText = `Responsável: ${newAssignee}`;
            task.querySelector('p:nth-of-type(3)').innerText = `Data de Vencimento: ${newDueDate}`;
            task.querySelector('p:nth-of-type(4)').innerText = `Descrição: ${newDescription}`;

            const checklist = task.querySelector('ul');
            if (checklist) {
                checklist.innerHTML = '';
                newChecklistItems.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.innerText = item;
                    checklist.appendChild(listItem);
                });
            }

            closeEditModal();

            saveTasksToLocalStorage();
            
            break;
        }
    }
}

function deleteTask(originalTitle) {
    const confirmDelete = confirm("Tem certeza que deseja excluir esta tarefa?");
    if (confirmDelete) {
        const tasksContainer = document.getElementById('tasks-container');
        const tasks = tasksContainer.getElementsByClassName('task');

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const taskTitle = task.querySelector('h3').innerText;

            if (taskTitle === originalTitle) {
                task.remove();

                closeEditModal();

                saveTasksToLocalStorage();

                break;
            }
        }
    }
}

function completeTask(taskDiv) {
    const completedContainer = document.getElementById('completed-container');
    const taskContent = taskDiv.innerHTML;

    const completedDiv = document.createElement('div');
    completedDiv.classList.add('completed-task');
    completedDiv.innerHTML = taskContent;

    const buttons = completedDiv.querySelectorAll('button');
    buttons.forEach(button => {
        button.remove();
    });

    completedContainer.appendChild(completedDiv);

    taskDiv.remove();

    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    const tasksContainer = document.getElementById('tasks-container');
    const completedContainer = document.getElementById('completed-container');

    const tasksHTML = tasksContainer.innerHTML;
    const completedHTML = completedContainer.innerHTML;

    localStorage.setItem('tasks', tasksHTML);
    localStorage.setItem('completedTasks', completedHTML);
}

function loadTasksFromLocalStorage() {
    const tasksContainer = document.getElementById('tasks-container');
    const completedContainer = document.getElementById('completed-container');

    const tasksHTML = localStorage.getItem('tasks');
    const completedHTML = localStorage.getItem('completedTasks');

    tasksContainer.innerHTML = tasksHTML || '';
    completedContainer.innerHTML = completedHTML || '';
}

loadTasksFromLocalStorage();

function baixarTarefas() {
    const contTasks = document.getElementById('tasks-container');
    const contTarefasConcluidas = document.getElementById('completed-container');

    const htmlTarefas = contTasks.innerHTML;
    const htmlTarefasConcluidas = contTarefasConcluidas.innerHTML;

    const dadosTarefas = {
        tarefas: extrairDadosTarefas(htmlTarefas),
        tarefasConcluidas: extrairDadosTarefas(htmlTarefasConcluidas)
    };

    const jsonDados = JSON.stringify(dadosTarefas, null, 2);

    const blob = new Blob([jsonDados], { type: 'application/json' });

    const linkDownload = document.createElement('a');
    linkDownload.href = URL.createObjectURL(blob);
    
    const data = new Date();
    const nomeArquivo = `tarefas_export_${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}.json`;
    linkDownload.download = nomeArquivo;

    document.body.appendChild(linkDownload);
    linkDownload.click();

    document.body.removeChild(linkDownload);
}

function extrairDadosTarefas(html) {
    const divTarefas = document.createElement('div');
    divTarefas.innerHTML = html;

    const tarefas = [];
    for (const divTarefa of divTarefas.children) {
        const dadosTarefa = {
            titulo: divTarefa.querySelector('h3').innerText,
            prioridade: divTarefa.querySelector('p:nth-of-type(1)').innerText.split(": ")[1],
            responsavel: divTarefa.querySelector('p:nth-of-type(2)').innerText.split(": ")[1],
            dataVencimento: divTarefa.querySelector('p:nth-of-type(3)').innerText.split(": ")[1],
            descricao: divTarefa.querySelector('p:nth-of-type(4)').innerText,
            checklist: extrairChecklist(divTarefa.querySelector('ul'))
        };

        tarefas.push(dadosTarefa);
    }

    return tarefas;
}

function extrairChecklist(ul) {
    if (!ul) return [];

    const itensChecklistNodes = ul.querySelectorAll('li');
    const itensChecklist = [];
    itensChecklistNodes.forEach(item => {
        itensChecklist.push(item.innerText);
    });

    return itensChecklist;
}

function organizarPorData() {
    const tasksContainer = document.getElementById('tasks-container');
    const tasks = Array.from(tasksContainer.getElementsByClassName('task'));

    const sortedTasks = tasks.sort((a, b) => {
        const dateA = new Date(a.querySelector('p:nth-of-type(3)').innerText.split(": ")[1]);
        const dateB = new Date(b.querySelector('p:nth-of-type(3)').innerText.split(": ")[1]);
        return dateA - dateB;
    });

    tasksContainer.innerHTML = '';
    sortedTasks.forEach(task => {
        tasksContainer.appendChild(task);
    });
}

function organizarPorPrioridade() {
    const tasksContainer = document.getElementById('tasks-container');
    const tasks = Array.from(tasksContainer.getElementsByClassName('task'));

    const sortedTasks = tasks.sort((a, b) => {
        const priorityA = extrairPrioridade(a);
        const priorityB = extrairPrioridade(b);
        return prioridadeNumerica(priorityA) - prioridadeNumerica(priorityB);
    });

    tasksContainer.innerHTML = '';
    sortedTasks.forEach(task => {
        tasksContainer.appendChild(task);
    });
}

function extrairPrioridade(taskDiv) {
    const priorityText = taskDiv.querySelector('p:nth-of-type(1)').innerText.split(": ")[1];
    return priorityText.toLowerCase();
}

function prioridadeNumerica(priority) {
    switch (priority) {
        case 'alta':
            return 1;
        case 'média':
            return 2;
        case 'baixa':
            return 3;
        default:
            return 0;
    }
}

function organizarConcluidas() {
    const completedContainer = document.getElementById('completed-container');
    const completedTasks = Array.from(completedContainer.getElementsByClassName('completed-task'));

    const sortedCompletedTasksIniciais = completedTasks.sort((a, b) => {
        const titleA = extrairInicialTitulo(a);
        const titleB = extrairInicialTitulo(b);
        return titleA.localeCompare(titleB);
    });

    const altaPrioridade = [];
    const mediaPrioridade = [];
    const baixaPrioridade = [];

    sortedCompletedTasksIniciais.forEach(task => {
        const priority = extrairPrioridade(task);
        switch (priority) {
            case 'alta':
                altaPrioridade.push(task);
                break;
            case 'média':
                mediaPrioridade.push(task);
                break;
            case 'baixa':
                baixaPrioridade.push(task);
                break;
            default:
                break;
        }
    });

    const sortedAltaPrioridade = altaPrioridade.sort((a, b) => extrairInicialTitulo(a).localeCompare(extrairInicialTitulo(b)));
    const sortedMediaPrioridade = mediaPrioridade.sort((a, b) => extrairInicialTitulo(a).localeCompare(extrairInicialTitulo(b)));
    const sortedBaixaPrioridade = baixaPrioridade.sort((a, b) => extrairInicialTitulo(a).localeCompare(extrairInicialTitulo(b)));

    completedContainer.innerHTML = '';

    sortedAltaPrioridade.forEach(task => {
        completedContainer.appendChild(task);
    });

    sortedMediaPrioridade.forEach(task => {
        completedContainer.appendChild(task);
    });

    sortedBaixaPrioridade.forEach(task => {
        completedContainer.appendChild(task);
    });
}

function extrairInicialTitulo(taskDiv) {
    const titleText = taskDiv.querySelector('h3').innerText;
    const firstChar = titleText.charAt(0).toLowerCase();
    return firstChar;
}
