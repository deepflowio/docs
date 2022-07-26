// 用于标识下哪个下拉框存在
let selected = "";

// 显示options
export function show (element) {
    const intl = document.querySelector(element);
    const options = intl.querySelector(".intl-options-wrapper");
    options.setAttribute("style", "display: block;");
}

// 隐藏options
export function hidden (element) {
    const intl = document.querySelector(element);
    const options = intl.querySelector(".intl-options-wrapper");
    options.setAttribute("style", "display: none;");
}

export function showHead (event, elementId) {
    if (selected === elementId) return;
    // 获取选项元素到屏幕左边的距离
    const left = event.target.nodeName === 'LI' ? event.target.childNodes[0].getClientRects()[0].left : event.target.getClientRects()[0].left;
    const optionBox = document.querySelector(".option-box");
    // 用于判断是英文页面还是中文
    const langZH = window.location.href.indexOf('/zh/') > -1;
    // 当移动另一个选项重置下拉框的位置
    optionBox.setAttribute("style", "top: -7vh;");
    // 悬浮到不同的选项渲染对应的内容
    switch (elementId) {
        case "#product":
            optionBox.innerHTML = `<a href="/index.html" style="margin-left: ${left}px">DeepFlow Cloud</a>`;
            break;
        case "#open":
            if (langZH) {
                optionBox.innerHTML = `<a href="/zh/community.html" style="margin-left: ${left}px">DeepFlow (Community)</a>`;
                break;
            }
            optionBox.innerHTML = `<a href="/community.html" style="margin-left: ${left}px">DeepFlow (Community)</a>`;
            break;
        case "#learn":
            if (langZH) {
                optionBox.innerHTML = `<a href="/docs/zh/" style="margin-left: ${left}px">文档</a>`;
                break;
            }
            optionBox.innerHTML = `<a href="/docs/" style="margin-left: ${left}px">Docs</a>`;
            break;
    }
    setTimeout(function () {
        optionBox.setAttribute(
            "style",
            `transition: 1s; transform: translateY(0%); background-color: rgba(255, 255, 255, 0.6)`
        );
        selected = elementId;
    }, 0);
}

export function hiddenHead () {
    // 重置下拉框存在
    selected = "";
    const optionBox = document.querySelector(".option-box");
    optionBox.setAttribute("style", "");
}

function addEvent (tagName, cb, eventType, useCapture = false) {
    const tag_ele = document.querySelector(tagName);
    tag_ele.addEventListener(eventType, cb, useCapture);
}

function productOver (event) {
    showHead(event, "#product")
}
function openOver (event) {
    showHead(event, "#open")
}
function learnOver (event) {
    showHead(event, "#learn")
}

function removeEvent (tagName, cb, eventType, useCapture = false) {
    const tag_ele = document.querySelector(tagName);
    tag_ele.removeEventListener(eventType, cb, useCapture);
}

export function initHead () {
    // addEvent("#product", productOver, "mouseover");
    // addEvent("#open", openOver, "mouseover");
    // addEvent("#learn", learnOver, "mouseover");
    // document.addEventListener("scroll", hiddenHead)
}

export function unbind () {
    // removeEvent("#product", productOver, "mouseover");
    // removeEvent("#open", openOver, "mouseover");
    // removeEvent("#learn", learnOver, "mouseover");

    // document.removeEventListener("scroll", hiddenHead)
}
