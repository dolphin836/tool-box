document.addEventListener('DOMContentLoaded', () => {
    var input     = document.getElementById("input"),
        transform = document.getElementById("transform"),
        output    = document.getElementById("output"),
        clean     = document.getElementById("clean");
    // 清除按钮是否显示标识
    var is_show_clean = false;
    // 是否已复制结果标识
    var is_copy       = false;
    // 定时器
    var outputTimer   = 0;
    // 获取焦点
    input.focus();
    // 键盘回车事件
    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            transform.click();
        }
    });
    // 输入框粘贴事件
    input.addEventListener("paste", function (event) {
        let text    = (event.clipboardData || window.clipboardData).getData('text');

        input.value = text;

        event.preventDefault();
        transform.click();
    });
    // 输入框输入事件 - 显示或隐藏清除图标
    input.addEventListener("keyup", function (event) {
        let inputText  = input.value;
        let textLength = inputText.length;

        if (textLength != 0 && !is_show_clean) {
            clean.classList.toggle("is-invisible");
            is_show_clean = true;
        }

        if (textLength == 0 && is_show_clean) {
            clean.classList.toggle("is-invisible");
            is_show_clean    = false;
            output.innerHTML = '';
        }

        event.preventDefault();
    });
    // 转换按钮点击事件
    transform.addEventListener('click', () => {
        let inputText  = input.value;
        let textLength = inputText.length;
        // 字符串转整型
        if (textLength == 19) {
            let timestamp = stringToInt(inputText) / 1000;

            showHtml(timestamp)

            return;
        }
        // 整型转字符串
        if (textLength == 10) {
            let timestamp = intToString(inputText);

            showHtml(timestamp)

            return;
        }

        return;
    });
    // 转换结果的点击事件 - 复制内容
    output.addEventListener('click', () => {
        let outputHtml = output.innerHTML;
        let el         = document.createElement('textarea');

        el.value = outputHtml;
        document.body.appendChild(el);
        el.select();

        document.execCommand('copy');
        document.body.removeChild(el);

        output.innerHTML = '已复制到剪切板';
        output.classList.toggle("is-success");

        is_copy = true;

        outputTimer = setTimeout(function () {
            output.innerHTML = outputHtml;
            output.classList.toggle("is-success");
            is_copy = false;
        }, 3000);
    });
    // 清除按钮点击事件
    clean.addEventListener('click', () => {
        input.value      = '';
        output.innerHTML = '';
        clean.classList.toggle("is-invisible");
        is_show_clean = false;
        clearTimeout(outputTimer);

        if (is_copy) {
            output.classList.toggle("is-success");
        }
    });
    // 字符串转整型
    function stringToInt(argc) {
        return Date.parse(argc);
    }
    // 整型转字符串
    function intToString(argc) {
        let date  = new Date(argc * 1000);

        let month = date.getMonth() + 1;

        return date.getFullYear() + '-' + zfill(month) + '-' + zfill(date.getDate()) + ' ' + zfill(date.getHours()) + ':' + zfill(date.getMinutes()) + ':' + zfill(date.getSeconds());
    }
    // 显示结果
    function showHtml(argc) {
        output.innerHTML = argc;
    }
    // 补零
    function zfill(argc) {
        let s = "0" + argc;

        return s.substr(s.length - 2);
    }
}); 