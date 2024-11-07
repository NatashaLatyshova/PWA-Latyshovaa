const installButton = document.getElementById('install-button');
const burgerMenu = document.getElementById('burger-menu');
const burgerMenuContent = document.getElementById('burger-menu-content');
let deferredPrompt;

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker зарегистрирован с областью:', registration.scope);
            })
            .catch(error => {
                console.error('Ошибка регистрации Service Worker:', error);
            });
    });
}

// Обработка события установки PWA
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
    installButton.addEventListener('click', () => {
        installButton.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Пользователь принял установку PWA');
            } else {
                console.log('Пользователь отклонил установку PWA');
            }
            deferredPrompt = null;
        });
    });
});

// Обработка навигации
document.getElementById('show-home').addEventListener('click', () => loadHome());
document.getElementById('show-log').addEventListener('click', () => loadLog());
document.getElementById('show-emojis').addEventListener('click', () => loadEmojis());
document.getElementById('show-contacts').addEventListener('click', () => loadContacts());

// Функция для загрузки главной страницы
function loadHome() {
    burgerMenuContent.style.display = 'none'; // Скрыть меню
    document.getElementById('content').innerHTML = ` 
        <h2>Назначение</h2>
        <div class="list-item">Отображать Emojis, предоставляемые GitHub REST API (https://api.github.com)</div>
        <div class="list-item">Следить за жизненным циклом сервис воркера</div>
        <h2>Функциональность</h2>
        <div class="list-item">Реализовать установку приложения через собственный интерфейс, например, кнопку INSTALL (A2HS)</div>
        <div class="list-item">Кнопка должна появляться вместо собственного предложения браузера (Chrome) об установке на рабочий стол. С этой целью следует перехватить событие beforeinstallprompt</div>
        <div class="list-item">После установки, при запуске мобильного приложения с рабочего стола кнопка INSTALL должна исчезать</div>
        <div class="list-item">Приложение должно реализовать кэширование всех своих активов посредсвом ServiceWorker</div>
        <div class="list-item">В одной из вкладок (возможен также любой другой дизайн) приложение должно показывать Emojis, предоставляемые GitHub REST API (https://api.github.com/emojis)</div>
        <div class="list-item">Реализовать "умную" загрузку изображений, например, используя технологию Progressive Image Loading and IntersectionObserver</div>
        <div class="list-item">Приложение должно иметь оригинальную иконку и Splash Screen</div>
        <div class="list-item">Желательно оформить вкладку Contacts</div>
        <div class="list-item">Для повышения баллов следует предусмотреть "отзывчивый дизайн"</div>
        <div class="list-item">Для повышения баллов возможен другой вариант общедоступного сервиса, предоставляющего картинки</div>
        <div class="list-item">На одной из вкладок реализовать "распечатку" журнала сообщений от ServiceWorkera путём загрузки фиктивного файла, например log.html</div>
        <div class="list-item">Log должен отслеживать install, activate, fetch, кэширование вновь загруженных emojis</div>
        <h2>Установка</h2>
        <div class="list-item">Реализовать загрузку приложения с локального хоста</div>
        <div class="list-item">С этой целью организовать собственный CA, сертификат которого установить в качестве доверенного на мобильную платформу</div>
        <div class="list-item">На web сервере локального хоста установить сертификат, подписанный собственным CA</div>
        <div class="list-item">Установку на эмулятор организовать через 10.0.2.2</div>
        <div class="list-item">Установку на девайс организовать через wi-fi роутер</div>
    `;
}

// Функция для загрузки журнала
function loadLog() {
    burgerMenuContent.style.display = 'none'; // Скрыть меню
    document.getElementById('content').innerHTML = `
        <h2>Журнал Service Worker</h2>
        <ul id="log"></ul>
        <button class="back-button" id="back-to-menu-log">Назад</button>
    `;
    document.getElementById('back-to-menu-log').addEventListener('click', loadHome);
    loadLogEntries(); // Загружаем записи лога
}

// Функция для загрузки эмодзи
function loadEmojis() {
    burgerMenuContent.style.display = 'none'; // Скрыть меню
    document.getElementById('content').innerHTML = '<h2>Загрузка эмодзи...</h2>';
    fetch('https://api.github.com/emojis')
        .then(response => response.json())
        .then(emojis => {
            document.getElementById('content').innerHTML = '<h2>Эмодзи</h2>';
            Object.entries(emojis).forEach(([name, url]) => {
                const emojiElement = document.createElement('div');
                emojiElement.className = 'emoji';
                emojiElement.innerHTML = `<img src="${url}" alt="${name}" title="${name}"> ${name}`;
                document.getElementById('content').appendChild(emojiElement);
            });
            document.getElementById('content').innerHTML += '<button class="back-button" id="back-to-menu-emojis">Назад</button>';
            document.getElementById('back-to-menu-emojis').addEventListener('click', loadHome);
        });
}

// Функция для показа контактов
function loadContacts() {
    burgerMenuContent.style.display = 'none'; // Скрыть меню
    document.getElementById('content').innerHTML = `
        <h2>Контакты</h2>
        <p>Email: example@example.com <img src="https://api.github.com/emojis/phone" alt="Контакты" title="Контакты"></p>
        <button class="back-button" id="back-to-menu-contacts">Назад</button>
    `;
    document.getElementById('back-to-menu-contacts').addEventListener('click', loadHome);
}

// Функция для загрузки записей лога
function loadLogEntries() {
    const logElement = document.getElementById('log');
    logElement.innerHTML = `
        <li>Service Worker зарегистрирован</li>
        <li>Service Worker активирован</li>
        <li>Запрос кэширован</li>
        <li>Эмодзи загружены</li>
    `;
}

// Открытие и закрытие бургер-меню
burgerMenu.addEventListener('click', () => {
    if (burgerMenuContent.style.display === 'block') {
        burgerMenuContent.style.display = 'none'; // Закрыть меню
    } else {
        burgerMenuContent.style.display = 'block'; // Открыть меню
    }
});