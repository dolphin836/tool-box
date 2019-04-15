import "./GeneratorRandonPassword.scss";

document.addEventListener('DOMContentLoaded', () => {
    var CHAR_SET = [
        [true,  "Cap", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],
        [true,  "Low", "abcdefghijklmnopqrstuvwxyz"],
        [true,  "Num", "0123456789"],
        [false, "Oth", "#%*^&-_+=|[]{}()?/`~'"]
    ];

    var passwordLength       = document.getElementById("passwordLength"),
        passwordLengthNumber = document.getElementById("passwordLengthNumber"),
        inputNum             = document.getElementById("Num"),
        inputLow             = document.getElementById("Low"),
        inputCap             = document.getElementById("Cap"),
        inputOth             = document.getElementById("Oth"),
        passwordHtml         = document.getElementById("password"),
        copy                 = document.getElementById("copy"),
        refresh              = document.getElementById("refresh");

    var input  = [inputNum, inputLow, inputCap, inputOth];

    var length = 16;

    passwordLength.addEventListener('change', () => {
        length                         = passwordLength.value;
        passwordLengthNumber.innerHTML = length;

        Init();
    });

    for (let i = 0; i < input.length; i++) {
        input[i].addEventListener('click', () => {
            let isEmpty = true;

            for (let i = 0; i < input.length; i++) {
                if (input[i].checked) {
                    isEmpty = false;
                }
            }

            if (isEmpty) {
                input[i].checked = true;
            }

            Init();
        });
    }

    refresh.addEventListener('click', () => {
        Init();
    });

    copy.addEventListener('click', () => {
        let passwordValue = passwordHtml.innerHTML;
        let el            = document.createElement('textarea');

        el.value = passwordValue;
        document.body.appendChild(el);
        el.select();

        document.execCommand('copy');
        document.body.removeChild(el);

        copy.innerHTML = '成 功';

        setTimeout(function () {
            copy.innerHTML = '复 制';
        }, 3000);
    });

    function Init() {
        for (let i = 0; i < input.length; i++) {
            let checked    = input[i].checked;
            CHAR_SET[i][0] = checked;
        }

        let char     = getPasswordCharacterSet();
        let password = generatePassword(char, length);
    
        passwordHtml.innerHTML = password;
    }

    function getPasswordCharacterSet() {
        let char = "";

        CHAR_SET.forEach(function(set) {
            if (document.getElementById(set[1]).checked) {
                char += set[2];
            }
        });

        return char;
    }

    function generatePassword(char, len) {
        let password = "";

        for (let i = 0; i < len; i++) {
            password += char[randomInt(char.length)];
        }

        return password;
    }

    
    function randomInt (n) {
        let x = new Uint32Array(1);

        window.crypto.getRandomValues(x);
       
        return x[0] % n;
    }

    Init();
}); 
