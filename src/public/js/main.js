$(function() {
    const socket = io();

    // getting dom elements from chat
    const $messageForm = $('#message-form');
    const $chat = $('#chat');
    const $messageBox = $('#message');

    // getting dom from login
    const $nickForm = $('#nickForm')
    const $nickname = $('#nickname')
    const $nickError = $('#nickError')
    const $users = $('#usernames')
    const actual_user = "";

    $nickForm.submit(e=> {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), res => {
            if(res) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
                actual_user = $nickname.val();
            } else {
                $nickError.html(`
                    <div class="alert alert-warning">
                        The username already exits.
                    </div>
                `)
            }
            $nickname.val('');
        });
    })

    // events
    $messageForm.submit((e) => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`);
        });
        $messageBox.val('');
    });

    socket.on('new message', data => {
        $chat.append('<b>'+ data.nick + '</b>: ' + data.msg + '<br/>');
    })

    socket.on('usernames', data => {
        let html = '';

        data.forEach(element => {
            console.log(element)
            if (element === $nickname.val()) {
                html += `<b><p><i class="fas fa-user"></i> ${element} (Tú)</p></b>`
            } else {
                html += `<p><i class="fas fa-user"></i> ${element}</p>`
            }
        });

        $users.html(html);
    })

    socket.on('whisper', data => {
        $chat.append(`<p class="whisper">${data.nick}: ${data.msg}</p>`)
    })

    socket.on('load ols mgs', data => {
        data.forEach(msg => {
            display(msg);
        });
    })

    function display(data) {
        $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>');
    }
})