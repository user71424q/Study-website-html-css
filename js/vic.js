// Определение вопросов и вариантов ответов
const questions = [
    {
        question: "Если человека назвали мордофиля, то это…",
        choices: ["Значит, что он тщеславный.", "Значит, что у него лицо как у хряка.", "Значит, что чумазый."],
        correctAnswer: "Значит, что он тщеславный.",
        description: "Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется, что мордофилей называют чванливого человека. Ну а «чванливый» — это высокомерный, тщеславный."
    },
    {
        question: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
        choices: ["Он маленький и невзрачный.", "Он тот еще алкоголик.", "Он не держит свое слово."],
        correctAnswer: "Он маленький и невзрачный.",
        description: "Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека. А еще так называют прыщи."
    },
    {
        question: "Если человека прозвали пятигузом, значит, он…",
        choices: ["Не держит слово.", "Изменяет жене.", "Без гроша в кармане."],
        correctAnswer: "Не держит слово.",
        description: "Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера, пятигуз — это ненадежный, непостоянный человек."
    },
    {
        question: "Кто такой шлындра?",
        choices: ["Обманщик.", "Нытик.", "Бродяга."],
        correctAnswer: "Бродяга.",
        description: "Да! В Словаре русского арго «шлындрать» означает бездельничать, шляться."
    }
];

let currentQuestion = 0; // Текущий вопрос
let score = 0; // Количество правильных ответов
let answerList = []; // Массив true/false ответов на вопросы

const questionText = document.getElementById("question");
const choicesList = document.getElementById("choices");
const submitButton = document.getElementById("submitBtn");
const description = document.getElementById("description");
submitButton.addEventListener("click", handleAnswerClick);
let selectedChoice = NaN;

//Функция перемешивает массив
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Функция для отображения текущего вопроса и вариантов ответов
function showQuestion() {
    const currentQuestionObj = questions[currentQuestion];
    questionText.textContent = `Вопрос ${currentQuestion + 1} из ${questions.length}. ${currentQuestionObj.question}`;
    //Обновляем кнопку подтвержения ответа
    submitButton.disabled = true;
    submitButton.textContent = "Подтвердить";
    submitButton.removeEventListener("click", handleContinueClick);
    submitButton.removeEventListener("click", handleStartAgain);
    submitButton.addEventListener("click", handleAnswerClick);
    submitButton.classList.remove("pulse");

    choicesList.innerHTML = "";
    for (let i = 0; i < currentQuestionObj.choices.length; i++) {
        const choice = currentQuestionObj.choices[i];
        const choiceItem = document.createElement("div");
        choiceItem.className = "questionChoice";
        choiceItem.textContent = choice;
        choiceItem.addEventListener("click", handleAnswerSelect);
        choicesList.appendChild(choiceItem);
    }
}

// Функция для установки стиля для выбранного варианта ответа
function handleAnswerSelect(event)
{
    submitButton.disabled = false;
    submitButton.classList.add("pulse");
    selectedChoice = event.target;
    for (let i = 0; i < choicesList.children.length; i++)
        choicesList.children[i].classList.remove("selectedAnswer");
    selectedChoice.classList.add("selectedAnswer");
}

// Функция для обработки выбора ответа пользователем
function handleAnswerClick() {

    for (let i = 0; i < choicesList.children.length; i++)
        choicesList.children[i].removeEventListener("click", handleAnswerSelect);

    for (let i = 0; i < choicesList.children.length; ++i)
        if (choicesList.children[i].textContent != questions[currentQuestion].correctAnswer)
            choicesList.children[i].classList.add("wrongAnswer");
        else
        {   
            choicesList.children[i].classList.remove("selectedAnswer");
            choicesList.children[i].classList.add("correctAnswer");
        }
        
    
    const selectedAnswer = selectedChoice.textContent;
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
        description.textContent = questions[currentQuestion].description;
        score++;
        answerList.push(true);
    }
    else
        answerList.push(false);


    currentQuestion++;
    submitButton.textContent = "Продолжить";
    submitButton.removeEventListener("click", handleAnswerClick);
    submitButton.addEventListener("click", handleContinueClick);
}

// Функция для обработки нажатия на кнопку "Продолжить"
function handleContinueClick()
{
    description.textContent = "";
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

// Функция для отображения правильного варианта ответа на вопрос после окончания викторины
function handleShowCorrectAnswer(event)
{
    selectedQuestion = event.target.textContent;
    for (let i = 0; i < questions.length; ++i)
        if (`Вопрос ${i + 1}. ${questions[i].question}` === selectedQuestion) {
            event.target.textContent += `\nПравильный ответ: ${questions[i].correctAnswer}`;
        } else {
            choicesList.children[i].textContent = `Вопрос ${i + 1}. ${questions[i].question}`;
        }
}

//функция для повторного запуска викторины
function handleStartAgain()
{
    score = 0;
    answerList = [];
    currentQuestion = 0;

    // Перемешиваем массив вопросов
    shuffle(questions);
    // Перемешиваем варианты ответов для каждого вопроса
    for (let i = 0; i < questions.length; i++) {
        shuffle(questions[i].choices);
    }

    showQuestion();
}

// Функция для отображения результата
function showResult() {
    questionText.textContent = `Вы ответили правильно на ${score} из ${questions.length} вопросов.`;
    choicesList.innerHTML = "";
    for (let i = 0; i < questions.length; ++i)
    {
        const question = document.createElement("div");
        question.className = "questionChoice";
        question.textContent = `Вопрос ${i + 1}. ${questions[i].question}`;
        question.addEventListener("click", handleShowCorrectAnswer);
        choicesList.appendChild(question);
        if (answerList[i] === true) 
            question.classList.add("correctQuestion");
        else
            question.classList.add("wrongQuestion");
    }
    submitButton.textContent = "Пройти ещё раз";
    submitButton.removeEventListener("click", handleContinueClick);
    submitButton.addEventListener("click", handleStartAgain);
}

handleStartAgain();
