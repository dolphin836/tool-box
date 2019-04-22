import "./SQL.scss";

document.addEventListener('DOMContentLoaded', () => {
    var input     = document.getElementById("input"),
        output    = document.getElementById("output"),
        transform = document.getElementById("transform");

    // 转换按钮点击事件
    transform.addEventListener('click', () => {
        let inputText = input.value;
        let valueArr  = inputText.split('\n');
        let valueTemp = [];

        for (let i = 0; i < valueArr.length; i++) {
            if(valueArr[i] == '') {
                continue;
            }

            valueTemp.push(valueArr[i]);
        }

        output.value = '"' + valueTemp.join('","') + '"';

        return;
    });
}); 

