/***************************************************
 * Created by nanyuantingfeng on 2020/3/1 10:10. *
 ***************************************************/
var mdurl = require("mdurl");

function isNeedDecode (url, config) {
    config = config || "*";

    if (config === "*") {
        return true;
    }

    if (config === "./" || config === ".") {
        return !/^(\w+?:\/)?\//.test(url);
    }

    if (config instanceof RegExp) {
        return config.test(url);
    }

    config = [].concat(config);
    return config.some(a => url.startsWith(a));
}

function decodeURL (url, config) {
    url = isNeedDecode(url, config) ? mdurl.decode(url) : url;
    return /^(\w+?:\/)?\.?\//.test(url) ? url : "./" + url;
}

function getUrlParam (string, name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(string) || [, ""])[1].replace(/\+/g, '%20')) || null
}

// The reason why the URL needs to use the upper level is because test After MD is packaged, the file will be marked as test/index HTML, so you need to add `../`. Except absolute path
// 为什么url需要使用上一级，是因为test.md打包后文件会被打成test/index.html，故需要增加`../`。但绝对路径除外
module.exports = function (md, config) {
    md.renderer.rules.image = function (tokens, idx) {
        var token = tokens[idx];
        var srcIndex = token.attrIndex("src");
        var url = token.attrs[srcIndex][1];
        var caption = md.utils.escapeHtml(token.content);
        var w, h, align, styleString = ''
        url = decodeURL(url, config);
        // 存在？且存在w h
        if (url && url.indexOf('?') > -1) {
            w = getUrlParam(url, 'w')
            h = getUrlParam(url, 'h')
            align = getUrlParam(url, 'align')
            w && (styleString += `width:${w}px`)
            h && (styleString += `height:${h}px`)
        }

        if (align) {
            return `<div style="text-align: ${align};margin:0"><img :src="'${url.startsWith('/') || url.startsWith('http') ? url : '../' + url}'" style="${styleString}" alt="${caption}" /></div>`
        }

        return `<img :src="'${url.startsWith('/') || url.startsWith('http')  ? url : '../' + url}'" style="${styleString}" alt="${caption}" />`
    };
};
