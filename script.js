'use strict';
(function () {
    var pageWho = 'who';
    var pageWhat = 'what';
    var pageHow = 'howmuch';
    var pageWrite = 'writeme';

    window.onload = function () {
        document.getElementById('back').onclick = function () {
            window.history.back();
        };
        document.getElementById('startWho').onclick = function () {
            displayPage(pageWho, true);
        };
        document.getElementById('startWhat').onclick = function () {
            displayPage(pageWhat, true);
        };
        document.getElementById('startHow').onclick = function () {
            displayPage(pageHow, true);
        };
        document.getElementById('startWrite').onclick = function () {
            displayPage(pageWrite, true);
        };
        document.getElementById('writeText').onkeyup = function (event) {
            if (event.keyCode === 27) {
                event.preventDefault();
                document.getElementById('writeText').value = '';
                document.getElementById('writeText').placeholder = '';
            }
        };
        document.getElementById('writeSend').onclick = sendMessage;
        displayPage(parsePage(), false);
        log();
    };

    window.onpopstate = function () {
        displayPage(parsePage(), false);
    };

    function displayPage(page, saveInHistory) {
        document.getElementById('back').style.display = page ? 'block' : 'none';
        document.getElementById('start').style.display = page ? 'none' : 'block';
        document.getElementById('who').style.display = page === pageWho ? 'block' : 'none';
        document.getElementById('what').style.display = page === pageWhat ? 'block' : 'none';
        document.getElementById('how').style.display = page === pageHow ? 'block' : 'none';
        document.getElementById('write').style.display = page === pageWrite ? 'block' : 'none';
        if (saveInHistory) {
            var query = '';
            if (page) {
                query = '?page=' + page;
            }
            history.pushState(null, page, query);
        }
    }

    function sendMessage() {
        var message = document.getElementById('writeText').value;
        if (!message) {
            document.getElementById('writeText').placeholder =
                'write your message here\n(1 - 1000 symbols)';
            return;
        }
        document.getElementById('writeText').value = '';
        document.getElementById('writeText').placeholder = 'sending...';
        document.getElementById('writeSend').disabled = true;
        fetch('https://api.telegram.org/bot1617972527:' +
              'AAG3vW6xi2FjdXDb6PTLXWLosti261d1Cck/sendMessage', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                chat_id: 1079223062,
                text: localStorage.getItem('name') + ':\n' + message
            })
        }).then(function (response) {
            if (!response.ok) {
                response.text().then(console.error);
                throw new Error(response.status);
            }
            return response.json();
        }).then(function (json) {
            if (!json.ok) {
                console.error(JSON.stringify(json));
                throw new Error('not ok');
            }
            document.getElementById('writeText').placeholder = 'i will read it soon';
            document.getElementById('writeSend').disabled = false;
            setTimeout(function () {
                if (document.getElementById('writeText').placeholder === 'i will read it soon') {
                    document.getElementById('writeText').placeholder = '';
                }
            }, 5000);
        }).catch(function (error) {
            document.getElementById('writeText').placeholder = error;
            document.getElementById('writeSend').disabled = false;
        });
    }

    function log() {
        var name = localStorage.getItem('name');
        if (!name) {
            name = getName(8);
            localStorage.setItem('name', name);
        }
        var count = localStorage.getItem('count');
        if (!count) {
            count = 1;
        } else {
            count++;
        }
        localStorage.setItem('count', count);
        var timezone = new Date().toString();
        timezone = timezone.substr(timezone.indexOf('GMT') + 3, 5);
        var message = name + ': ' + count + '\n' + navigator.userAgent + ', ' +
            navigator.language.substr(0, 2) + ', ' + timezone;
        fetch('https://api.telegram.org/bot1617972527:' +
              'AAG3vW6xi2FjdXDb6PTLXWLosti261d1Cck/sendMessage', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                chat_id: 1079223062,
                text: message
            })
        }).catch(console.error);
    }

    function parsePage() {
        var page = parse('page');
        if (page === pageWho || page === pageWhat || page === pageHow || page === pageWrite) {
            return page;
        }
        return null;

        function parse(querry) {
            var startIndex = window.location.search.indexOf(querry + '=');
            if (startIndex < 0) {
                return null;
            }
            startIndex = startIndex + querry.length + 1;
            var stopIndex = window.location.search.indexOf('&', startIndex);
            if (stopIndex < 0) {
                return window.location.search.substring(startIndex);
            } else {
                return window.location.search.substring(startIndex, stopIndex);
            }
        }
    }

    function getName(length) {
        var name = '';
        for (var i = 0; i < length ; i++) {
            name += String.fromCharCode(97 + Math.random() * 26);
        }
        return name;
    }
})();