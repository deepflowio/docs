import ClipboardJS from 'clipboard'
const eBPFUrl = '/blog/035-deepflow-enabling-zero-code-observability-for-applications-by-webAssembly/'
const eBPFZHUrl = '/blog/zh/035-deepflow-enabling-zero-code-observability-for-applications-by-webAssembly/'

export default () => {
    function addWebHeaderEvent() {
        document.querySelectorAll(".to-signup").forEach((element) => {
            element.addEventListener("click", function () {
                window.open('/signup.html', '_blank')
            });
        });
        document.querySelectorAll(".to-demo").forEach((element) => {
            element.addEventListener("click", function () {
                window.open('https://ce-demo.deepflow.yunshan.net/', '_blank')
            });
        });
        document.querySelector('.feature-list').querySelectorAll('.feature-item').forEach(element => {
            element.addEventListener('click', function () {
                var name = element.getAttribute('data-name')
                var href = '', target = ''
                const isZH = window.location.href.indexOf('/zh/') > -1
                switch (name) {
                    case 'deepflow-cloud':
                        href = isZH ? '/zh/' : '/'
                        target = '_self'
                        break;
                    case 'eBPF':
                        href = isZH ? eBPFZHUrl : eBPFUrl
                        target = '_self'
                        break;
                    case 'blog':
                        href = "/blog/" + (isZH ? 'zh/' : '');
                        target = '_self'
                        break;
                    case 'docs':
                        href = "/docs/" + (isZH ? 'zh/' : '');
                        target = '_self'
                        break;
                    default:
                        break;
                }
                window.open(href, target)
            })
        })
    }

    // 跳转js
    window.jumpByTag = function (root, name) {
        //  window.location.href = root+'?tag='+encodeURIComponent(name)
    }

    function IsMobile() {
        var ua = navigator.userAgent;
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            isIphone = ua.match(/(iPhone\sOS)\s([\d_]+)/),
            isAndroid = ua.match(/(Android)\s+([\d.]+)/),
            isMobile = ipad || isIphone || isAndroid;
        return !!isMobile;
    }


    function addMobileHeaderEvent() {
        document.querySelectorAll(".to-signup").forEach((element) => {
            element.addEventListener("click", function () {
                window.location.href = "/signup.html";
            });
        });
        // document.getElementById("signin-m").addEventListener("click", function () {
        //     document.querySelector(".ys-model").style.display = "block";
        //     setTimeout(() => {
        //         document
        //             .querySelector(".ys-model-contianer")
        //             .classList.remove("captcha-box");
        //     });
        // });
    }


    function addModelEvent() {
        document
            .querySelector(".ys-model-masking")
            .addEventListener("click", function () {
                document
                    .querySelector(".ys-model-contianer")
                    .classList.add("captcha-box");
                setTimeout(() => {
                    document.querySelector(".ys-model").style.display = "none";
                }, 300);
            });

        var btnCopy = new ClipboardJS("#copy-button", {
            // 通过target指定要复印的节点
            target: function () {
                return document.querySelector("#copy-content");
            },
        });
        btnCopy.on("success", function (e) {
            e.clearSelection();
            // btnCopy.destroy();
            showToast();
        });
    }


    function addNavClick() {
        let showNav = false;
        let timer;
        let lastOverflow

        document.getElementById("nav").addEventListener("click", function () {
            if (timer) {
                return false;
            }
            if (showNav) {
                document.body.style.overflow = lastOverflow
                showNav = false;
                document.querySelector(".nav-list-box").style.height = "1px";
                timer = setTimeout(() => {
                    document.querySelector(".nav-list").style.display = "none";
                    timer = null;
                }, 300);
            } else {
                showNav = true;
                lastOverflow = document.body.style.overflow
                document.body.style.overflow = 'hidden'
                document.querySelector(".nav-list").style.display = "block";
                timer = setTimeout(() => {
                    document.querySelector(".nav-list-box").style.height = document.querySelector('.nav-list-box').querySelectorAll('.nav-link').length * 2.1742 + "rem";
                    timer = null;
                });
            }
        });

        document.querySelectorAll(".nav-link").forEach((element) => {
            element.addEventListener("click", function () {
                const name = element.getAttribute("data-name");
                let href = "",
                    target = "";
                const isZH = window.location.href.indexOf('/zh/') > -1
                switch (name) {
                    case 'deepflow-cloud':
                        href = isZH ? '/zh/' : '/'
                        target = '_self'
                        break;
                    case 'eBPF':
                        href = isZH ? eBPFZHUrl : eBPFUrl
                        target = '_self'
                        break;
                    case 'blog':
                        href = "/blog/" + (isZH ? 'zh/' : '');
                        target = '_self'
                        break;
                    case 'docs':
                        href = "/docs/" + (isZH ? 'zh/' : '');
                        target = '_self'
                        break;
                    default:
                        return false
                }
                window.open(href, target);
            });
        });
    }

    var timer;
    var timer1;
    function showToast() {
        // 展示成功
        var el = document.querySelector("#ys-toast");
        if (!el) {
            return false;
        }
        el.style.display = "flex";
        setTimeout(() => {
            el.classList.remove("hide");
        });

        if (timer) {
            clearTimeout(timer);
        }
        if (timer1) {
            clearTimeout(timer1);
        }
        document.querySelector(".ys-model-contianer").classList.add("captcha-box");
        setTimeout(() => {
            document.querySelector(".ys-model").style.display = "none";
        }, 300);
        timer = setTimeout(hideToast, 2000);
    }

    function hideToast() {
        var el = document.querySelector("#ys-toast");
        if (!el) {
            loadToast();
            return false;
        }
        el.classList.add("hide");
        timer1 = setTimeout(() => {
            el.style.display = "none";
        }, 1000);
    }

    window.addEventListener('load', function () {
        if (IsMobile()) {
            addMobileHeaderEvent();
            addModelEvent();
            addNavClick();
        } else {
            addWebHeaderEvent();
        }
        getGithubInfo();
    })

    async function getGithubInfo() {
        const res = await fetch('https://api.github.com/repos/deepflowio/deepflow').then(response => response.json())
        if (!res.stargazers_count) {
            return false
        }
        document.querySelectorAll(".github-stars").forEach(stars_counts => {
            stars_counts.innerHTML = res.stargazers_count;
            stars_counts.setAttribute("style", "display: flex");
        });
    }
}
