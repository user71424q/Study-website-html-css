

document.getElementById('submit_btn').addEventListener('click', function() {
    var inputText = document.getElementById('input').value;
    var items = inputText.split('-').map(item => item.trim()).filter(item => item.length > 0);

    var words = items.filter(item => isNaN(item)).sort();
    var numbers = items.filter(item => !isNaN(item)).sort((a, b) => a - b);

    var resultObj = {};
    words.forEach((word, index) => resultObj['a' + (index + 1)] = word);
    numbers.forEach((number, index) => resultObj['n' + (index + 1)] = number);

    // Очистка
    var blockArea = document.getElementById('block_area');
    var dragArea = document.getElementById('drag_area');
    blockArea.innerHTML = '';
    dragArea.innerHTML = '';

    // Добавление элементов в block_area
    for (var key in resultObj) {
        var block = document.createElement('div');
        block.className = 'dragable_block';
        block.setAttribute('draggable', true);
        block.textContent = key + ' ' + resultObj[key];
        blockArea.appendChild(block);
    }
});

// Инициализация переменных для хранения перетаскиваемого элемента и целевого контейнера
let draggedItem = null;
let targetContainer = null;


function dragStart(e)
{
    if (e.target.className.includes('dragable_block')) {
        draggedItem = e.target;
        e.dataTransfer.setData("text/plain", draggedItem.id);
    }
}
document.getElementById('drag_area').addEventListener('dragstart', dragStart);
document.getElementById('block_area').addEventListener('dragstart', dragStart);


function dragOver(e)
{
    e.preventDefault();
    if (e.target.id === 'block_area' || e.target.id === 'drag_area') {
        targetContainer = e.target;
    }
}
document.getElementById('drag_area').addEventListener('dragover', dragOver);
document.getElementById('block_area').addEventListener('dragover', dragOver);


function drop(e)
{
    e.preventDefault();
    if (targetContainer && draggedItem) {
        let targetBlock = null;

        // Проходим по всем блокам в контейнере
        Array.from(targetContainer.getElementsByClassName('dragable_block')).forEach(block => {
            const rect = block.getBoundingClientRect();
            
            // Проверяем, находится ли курсор левее правой границы блока
            if (e.clientX < rect.right) {
                if (!targetBlock || targetBlock.getBoundingClientRect().right > rect.right) {
                    targetBlock = block;
                }
            }
        });

        if (targetBlock && targetContainer.id === "drag_area") {
            // Вставляем перед найденным блоком
            targetContainer.insertBefore(draggedItem, targetBlock);
        } else {
            // Вставляем в конец, если подходящий блок не найден
            targetContainer.appendChild(draggedItem);
        }
        updateOutputText();
    }
    draggedItem = null;
    targetContainer = null;
    document.body.style.cursor = 'default';
}
document.getElementById('drag_area').addEventListener('drop', drop);
document.getElementById('block_area').addEventListener('drop', drop);


document.getElementById('task').addEventListener('dragleave', function() {
    document.body.style.cursor = 'default';
}, false);  

function updateOutputText() {
    const dragArea = document.getElementById('drag_area');
    const blocks = dragArea.getElementsByClassName('dragable_block');
    let textArray = [];

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const parts = block.textContent.trim().split(' ');
        const contentWithoutKey = parts.slice(1).join(' '); // Игнорируем первое слово (ключ)
        textArray.push(contentWithoutKey);
    }

    document.getElementById('output').value = textArray.join(' ');
}
