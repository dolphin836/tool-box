document.addEventListener('DOMContentLoaded', () => {
    var menu   = document.getElementById("menu"),
        main   = document.getElementById("main"),
        search = document.getElementById("search");
    // 全局变量，所有的网站数据，用于搜索
    var Data   = new Array();
    // 搜索框获取焦点
    search.focus();
    // 初始化
    init();

    // 搜索事件
    search.addEventListener("keyup", function (event) {
        event.preventDefault();

        if (search.value == '') {
            init();
            
            return;
        }

        if (event.keyCode === 13) {
            let data   = find(search.value);

            let group  = new Object();

            group.name = '搜索结果';
            group.mark = '';
            group.data = data;
            // 隐藏网站列表
            hideGroups();
            // 添加搜索结果
            addGroup(group);
        }

        if (event.keyCode === 27) {
            search.value = '';
            init();

            return;
        }
    });

    // 搜索
    function find(text) {
        let config = {
            keys: [
                'name',
                'word'
            ]
        };

        let fuse = new Fuse(Data, config)

        return fuse.search(text);
    }

    // 隐藏网站列表
    function hideGroups() {
        let groupArr = main.children;

        for (let i = 0; i < groupArr.length; i++) {
            let isHidden = groupArr[i].classList.contains("is-hidden");

            if (! isHidden) {
                groupArr[i].classList.add('is-hidden');
            }
        } 
    }

    // 初始化
    function init() {
        main.innerHTML = '';
        menu.innerHTML = '';
        // 从本地读取数据
        let data = store.get('data');
        // 从本地读取数据失败，从服务器获取数据
        if (data === undefined) {
            fetch(GROUP)
                .then(function (response) {
                    if (response.ok) {
                        let json = response.json();
                        // 全局变量清空
                        Data = []

                        json.then(function(data) {  
                            // 将数据存储到本地
                            store.set('data', data);
                            // 渲染数据
                            draw(data);
                        });
                    }
                })
                .catch(function (error) {
                    console.log(JSON.stringify(error));
                });
        } else {
            // 渲染数据
            draw(data);
        }
    }

    // 渲染数据
    function draw(data) {
        data.map(function (group) {
            addMenu(group.name, group.mark);
            addGroup(group);
            // 将网站数据添加到全局变量，用于搜索
            let siteArr = group.data;

            siteArr.map(function (site) {
                Data.push(site);
            });
        }); 
    }

    // 添加快捷导航
    function addMenu(name, mark) {
        let li = createNode('li'),
            a  = createNode('a');

        a.innerHTML = name;
        a.href      = '#' + mark;
        
        append(li, a);
        append(menu, li);
    }

    // 添加分组
    function addGroup(group) {
        // 先添加分组名称
        addGroupName(group);
        // 再添加网站
        let siteArr = group.data;

        siteArr.map(function (site, i) {
            if (i % 4 == 0) {
                let div       = createNode('div');
                div.className = 'columns';

                append(main, div);  
            }

            addGroupSite(site);
        });
        // 补全列
        let groupArr = main.children;

        for (let i = 0; i < groupArr.length; i++) {
            if (groupArr[i].nodeName != 'DIV') {
                continue;
            }

            let length = groupArr[i].children.length;

            if (length >= 4) {
                continue;
            }

            let emptyCount = 4 - length;

            for (let k = 0; k < emptyCount; k++) {
                let el = addEmpty();
                append(groupArr[i], el); 
            }
        }
    }

    // 添加分组名称
    function addGroupName(group) {
        let h1 = createNode('h1');

        h1.className = 'title up';
        h1.innerHTML = group.name;
        h1.id        = group.mark;
        // 收起 - 展开事件
        h1.addEventListener('click', function () {
            let el = this;

            while (el) { 
                el = el.nextElementSibling;

                if (! el || el.nodeName == 'H1') {
                    break;
                }

                el.classList.toggle('is-hidden');
            }
        });
        // 数量
        let span       = createNode('span');
        span.className = 'is-size-6 has-text-grey-light';
        span.innerHTML = group.data.length;

        append(h1, span);

        append(main, h1);
    }

    // 添加网站
    function addGroupSite(site) {
        let group = main.children;

        for (let i = 0; i < group.length; i++) {
            if (group[i].nodeName != 'DIV') {
                continue;
            }

            if (group[i].children.length >= 4) {
                continue;
            }

            if (site.icon === undefined) {
                site.icon = 'far fa-circle';
            }

            if (site.word === undefined) {
                site.word = '';
            }

            let html = '<div class="tags has-addons are-medium" title="' + site.word + '"><span class="tag"><span class="icon is-medium"><i class="' + site.icon + '"></i></span></span><span class="tag is-rounded is-primary"><a href="' + site.href + '" class="has-text-white" target="_blank">' + site.name + '</a></span></div>';
            let div  = createNode('div');

            div.className = 'column';
            div.innerHTML = html;

            append(group[i], div); 
        }
    }

    //
    function addEmpty() {
        let div       = createNode('div');

        div.className = 'column';

        return div;  
    }

    // 创建节点
    function createNode(element) {
        return document.createElement(element);
    }

    // 追加节点
    function append(parent, el) {
        return parent.appendChild(el);
    }
});