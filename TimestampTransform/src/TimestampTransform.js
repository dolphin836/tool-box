import "./TimestampTransform.scss";
import "./css/open-iconic.scss";

document.addEventListener('DOMContentLoaded', () => {
    var input     = document.getElementById("input"),
        transform = document.getElementById("transform"),
        output    = document.getElementById("output"),
        datetime  = document.getElementById("datetime"),
        timestamp = document.getElementById("timestamp");
    // 是否已复制结果标识
    var is_copy       = false;
    // 定时器
    var outputTimer   = 0;
    // 时钟
    setInterval(function () {
        let now             = new Date();
        let month           = now.getMonth() + 1;

        let datetimeHtml    = now.getFullYear() + '-' + zfill(month) + '-' + zfill(now.getDate()) + ' ' + zfill(now.getHours()) + ':' + zfill(now.getMinutes()) + ':' + zfill(now.getSeconds());
 
        let timestampHtml   = stringToInt(datetimeHtml);

        datetime.innerHTML  = datetimeHtml;
        timestamp.innerHTML = timestampHtml;
    }, 1000);

    // 获取焦点
    input.focus();
    // 键盘回车事件
    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) { // 转换
            event.preventDefault();
            transform.click();
        }

        if (event.keyCode === 27) { // 清除
            input.value      = '';
            output.innerHTML = '';
            clearTimeout(outputTimer);
    
            if (is_copy) {
                output.classList.toggle("is-success");
                is_copy = false;
            }
        }
    });
    // 输入框粘贴事件
    input.addEventListener("paste", function (event) {
        let text    = (event.clipboardData || window.clipboardData).getData('text');

        input.value = text;

        event.preventDefault();
        transform.click();
    });
    // 转换按钮点击事件
    transform.addEventListener('click', () => {
        let inputText  = input.value;
        let textLength = inputText.length;

        if (textLength < 1) {
            return;
        }

        if (isNaN(inputText)) { // 字符串转整型
            let timestamp = stringToInt(inputText);

            showHtml(timestamp)

            return;
        } else { // 整型转字符串
            if (textLength > 10) {
                return;
            }

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
    // 字符串转整型
    function stringToInt(argc) {
        let date = new Date(argc);

        return date.getTime() / 1000;
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
