var socket = io.connect('http://' + document.domain + ':' + location.port);

// Вызов функции joinChat при загрузке страницы
$(document).ready(function() {
    joinChat();
});

socket.on('message', function(data) {
    var messages = document.getElementById('messages');
    messages.innerHTML += '<p><strong>' + data.username + ':</strong> ' + data.message + '</p>';
    messages.scrollTop = messages.scrollHeight;
});

socket.on('user_joined', function(data) {
    var messages = document.getElementById('messages');
    messages.innerHTML += '<p><em>' + data.username + ' joined the room.</em></p>';
    messages.scrollTop = messages.scrollHeight;
});

socket.on('user_left', function(data) {
    var messages = document.getElementById('messages');
    messages.innerHTML += '<p><em>' + data.username + ' left the room.</em></p>';
    messages.scrollTop = messages.scrollHeight;
});


function sendMessage() {
    var messageInput = document.getElementById('message_input');
    var message = messageInput.value;
    messageInput.value = '';

    socket.emit('message', { message: message });
}

// ... (ваш существующий код)

function toggleTheme() {
    var body = document.body;
    var themeCheckbox = document.getElementById('theme-checkbox');
    var themeToggleIcon = document.getElementById('theme-toggle-icon');

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        themeToggleIcon.classList.remove('fa-sun');
        themeToggleIcon.classList.add('fa-moon');
    } else {
        body.classList.add('dark-mode');
        themeToggleIcon.classList.remove('fa-moon');
        themeToggleIcon.classList.add('fa-sun');
    }
}



function joinChat() {
    // Открытие модального окна для ввода имени пользователя и комнаты
    $('#userRoomModal').modal('show');

    // Установка фокуса на поле ввода имени пользователя при открытии модального окна
    $('#userRoomModal').on('shown.bs.modal', function () {
        $('#usernameInput').focus();
    });

    // Обработка нажатия кнопки "Join Chat"
    $('#joinChatBtn').click(function() {
        var usernameInput = document.getElementById('usernameInput');
        var roomInput = document.getElementById('roomInput');
        
        var username = usernameInput.value.trim();
        var room = roomInput.value.trim();

        if (username === "" || room === "") {
            alert("Please enter both username and room.");
            return;
        }
        

        // Скрываем модальное окно
        $('#userRoomModal').modal('hide');

        // Отправляем событие 'join' на сервер
        socket.emit('join', { username: username, room: room });
    });
}