/****************************************************************************utils jscript*********************************************************************************************************/
/***************************************
 *****   author    *****     jerifer
 ***** create date  ***** 2011.5.13
 ***** modify date  ***** 2012.7.31
 ***************************************/

/* web browser*/
var isIE = navigator.userAgent.toLowerCase().indexOf("msie") != -1;
var isIE8 = !!window.XDomainRequest && !!document.documentMode;
var isIE7 = navigator.userAgent.toLowerCase().indexOf("msie 7.0") != -1 && !isIE8;
var isIE6 = navigator.userAgent.toLowerCase().indexOf("msie 6.0") != -1;
var isGecko = navigator.userAgent.toLowerCase().indexOf("gecko") != -1;
var isOpera = navigator.userAgent.toLowerCase().indexOf("opera") != -1;
var isQuirks = document.compatMode == "BackCompat";
var isStrict = document.compatMode == "CSS1Compat";
var isBorderBox = isIE && isQuirks;

/* root path */
var CONTEXTPATH = '/';
var scripts = $("script");
for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].getAttribute("src") == null) continue;
    var src = scripts[i].getAttribute("src").toLowerCase();
    if (/.*frame\/jscript\/common\.js$/g.test(src)) {
        var jsPath = src.replace(/frame\/jscript\/common\.js$/g, '');
        if (jsPath.indexOf("/") == 0 || jsPath.indexOf("://") > 0) {
            CONTEXTPATH = jsPath;
            break;
        }
        var arr1 = jsPath.split("/");
        var path = window.location.href;
        if (path.indexOf("?") != -1) {
            path = path.substring(0, path.indexOf("?"));
        }
        var arr2 = path.split("/");
        arr2.splice(arr2.length - 1, 1);
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] == "..") {
                arr2.splice(arr2.length - 1, 1);
            }
        }
        CONTEXTPATH = arr2.join('/') + '/';
        break;
    }
}

/*setTimeout extend*/
var _setTimeout = window.setTimeout;
window.setTimeout = function (callback, timeout, param) {
    if (typeof callback == 'function') {
        var args = Array.prototype.slice.call(arguments, 2); //   ==  args=Array.slice(begin,end) 
        var _callback = function () {
            callback.apply(null, args);
        }
        return _setTimeout(_callback, timeout);
    }
    return _setTimeout(callback, timeout);
}

function encodeURL(str) {
    return encodeURI(str).replace(/=/g, "%3D").replace(/\+/g, "%2B").replace(/\?/g, "%3F").replace(/\&/g, "%26");
}
function htmlEncode(str) {
    return str.replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;");
}
function htmlDecode(str) {
    return str.replace(/\&quot;/g, "\"").replace(/\&lt;/g, "<").replace(/\&gt;/g, ">").replace(/\&nbsp;/g, " ").replace(/\&amp;/g, "&");
}
function javaEncode(txt) {
    if (!txt) {
        return txt;
    }
    return txt.replace("\\", "\\\\").replace("\r\n", "\n").replace("\n", "\\n").replace("\"", "\\\"").replace("\'", "\\\'");
}
function javaDecode(txt) {
    if (!txt) {
        return txt;
    }
    return txt.replace("\\\\", "\\").replace("\\n", "\n").replace("\\r", "\r").replace("\\\"", "\"").replace("\\\'", "\'");
}
function IsNull(obj) {
    return obj == null || typeof (obj) == "undefine";
}
function IsNotNull(obj) {
    return !IsNull(obj);
}

String.prototype.IsPhone = function () {
    return /^1[3458]\d{9}$/.test(this);
};
String.prototype.IsMobile = function () {
    return /^(\d{3}-|\d{4}-)?(\d{8}|\d{7})$/.test(this);
};
String.prototype.IsContact = function () {
    return this.IsPhone() || this.IsMobile();
};
String.prototype.IsEmpty = function () {
    return this == "";
};
String.prototype.ToJson = function () {
    try {
        return eval('(' + this + ')');
    } catch (e) {
        return null;
    }
};
String.prototype.IsQQ = function () {
    return /^[1-9]\d{4,12}$/.test(this);
};
String.prototype.IsUrl = function () {
    return /^(http|https):\/\/[A-Za-z0-9%\-_@]+\.[A-Za-z0-9%\-_@]{2,}[A-Za-z0-9\.\/=\?%\-&_~`@[\]:+!;]*$/.test(this);
};
String.prototype.IsIP = function () {
    return /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/.test(this);
};
String.prototype.IsMac = function () {
    return /[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}/.test(this) || /[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}/.test(this);
};
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
};
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
};
String.prototype.IsInt = function (m, n) {
    return /^\-?\d+$/.test("" + this) && (this >= m || IsNull(m)) && (this <= n || IsNull(n));
};
String.prototype.IsPlus = function () {
    return /^[1-9]\d*$/.test(this);
}; //Non-negative
String.prototype.IsNotsc = function () {
    return /^[-a-zA-Z0-9_\u4e00-\u9fa5\s]+$/.test("" + this);
};//en,num,chinese,_
String.prototype.IsFloat = function () {
    return /^(?:[1-9][0-9]*(?:\.[0-9]+)?|0\.(?!0+$)[0-9]+)$/.test(this);
};//float
String.prototype.IsLetter = function () {
    return /^[a-zA-Z]+$/g.test("" + this);
};//letter
String.prototype.IsLetterOrNum = function () {
    return /^[0-9a-zA-Z]+$/g.test("" + this);
};//letter and number
String.prototype.IsLegalityName = function () {
    return /^[-a-zA-Z0-9_]+$/g.test(this);
};//username
String.prototype.IsEmail = function () {
    return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this);
};
String.prototype.startsWith = function (str) {
    return this.indexOf(str) == 0;
};
String.prototype.endsWith = function (str) {
    var i = this.lastIndexOf(str);
    return i >= 0 && this.lastIndexOf(str) == this.length - str.length;
};
String.prototype.ToUpperFirst = function () {
    if (this.IsEmpty())return this;
    return  this.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
}

Array.prototype.clone = function () {
    var len = this.length;
    var r = [];
    for (var i = 0; i < len; i++) {
        if (typeof (this[i]) == "undefined" || this[i] == null) {
            r[i] = this[i];
            continue;
        }
        if (this[i].constructor == Array) {
            r[i] = this[i].clone();
        } else {
            r[i] = this[i];
        }
    }
    return r;
};//array clone

Array.prototype.insert = function (index, data) {
    if (isNaN(index) || index < 0 || index > this.length) {
        this.push(data);
    } else {
        var temp = this.slice(index);
        this[index] = data;
        for (var i = 0; i < temp.length; i++) {
            this[index + 1 + i] = temp[i];
        }
    }
    return this;
};

Array.prototype.remove = function (s, dust) {
    if (dust) {
        if (isNaN(s) || s < 0 || s > this.length - 1) {
            this.splice(this.length - 1, 1);
        }
        else {
            this.splice(s, 1);
        }
    }
    else {
        for (var i = 0; i < this.length; i++) {
            if (s == this[i]) {
                this.splice(i, 1);
                i--;
            }
        }
    }
    return this;
};

Array.prototype.ToString = function (s) {
    if (IsNull(this)) return "";
    var len = this.length;
    var string = "";
    for (var i = 0; i < len; i++) {
        if (i == 0)
            string += this[i];
        else
            string += s + this[i];
    }
    return string;
};

Array.prototype.indexOf = function (func) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (this[i] == arguments[0])
            return i;
    }
    return -1;
};

//+---------------------------------------------------
//| 日期计算
//+---------------------------------------------------
Date.prototype.DateAdd = function (strInterval, Number) {
    var dtTmp = this;
    switch (strInterval) {
        case 's':
            return new Date(Date.parse(dtTmp) + (1000 * Number));
        case 'n':
            return new Date(Date.parse(dtTmp) + (60000 * Number));
        case 'h':
            return new Date(Date.parse(dtTmp) + (3600000 * Number));
        case 'd':
            return new Date(Date.parse(dtTmp) + (86400000 * Number));
        case 'w':
            return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
        case 'q':
            return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'm':
            return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'y':
            return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
}

//+---------------------------------------------------
//| 求两个时间的天数差 日期格式为 YYYY-MM-dd
//+---------------------------------------------------
function daysBetween(DateOne, DateTwo) {
    var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
    var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
    var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

    var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
    var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
    var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

    var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
    return cha
}

//+---------------------------------------------------
//| 
//+---------------------------------------------------
var nowDate = new Date();
var prevDate = nowDate.DateAdd('m', -1);
nowDate = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
prevDate = prevDate.getFullYear() + "-" + (prevDate.getMonth() + 1) + "-" + prevDate.getDate();

function getEvent(evt) {
    if (document.all) return window.event;
    if (evt) {
        if ((evt.constructor == Event || evt.constructor == MouseEvent) || (typeof (evt) == "object" && evt.preventDefault && evt.stopPropagation)) {
            return evt;
        }
    }
    func = getEvent.caller;
    while (func != null) {
        var arg0 = func.arguments[0];
        if (arg0) {
            if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                return arg0;
            }
        }
        func = func.caller;
    }
    return null;
}

function stopEvent(evt) {
    evt = getEvent(evt);
    if (!evt) {
        return;
    }
    if (isGecko) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    evt.cancelBubble = true
    evt.returnValue = false;
}

function cancelEvent(evt) {
    evt = getEvent(evt);
    evt.cancelBubble = true;
}

function getEventPosition(evt) {
    evt = getEvent(evt);
    var pos = { x: evt.clientX, y: evt.clientY };
    var win;
    if (isGecko) {
        win = evt.srcElement.ownerDocument.defaultView;
    } else {
        win = evt.srcElement.ownerDocument.parentWindow;
    }
    var sw, sh;
    while (win != win.parent) {
        if (win.frameElement && win.parent.DataCollection) {
            pos2 = $E.getPosition(win.frameElement);
            pos.x += pos2.x;
            pos.y += pos2.y;
        }
        sw = Math.max(win.document.body.scrollLeft, win.document.documentElement.scrollLeft);
        sh = Math.max(win.document.body.scrollTop, win.document.documentElement.scrollTop);
        pos.x -= sw;
        pos.y -= sh;
        if (!win.parent.DataCollection) {
            break;
        }
        win = win.parent;
    }
    return pos;
}

/*datetime format*/
Date.prototype.format = function (format) {
    /*
     * eg:format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+": this.getMonth() + 1,  //month
        "d+": this.getDate(),     //day
        "h+": this.getHours(),    //hour
        "m+": this.getMinutes(),  //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

/* get method*/
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/*---------------------------Server,Page-------------------------*/
var Server = {};
Server.RequestMap = {};
Server.MainServletURL = "MainServlet.aspx";
Server.ContextPath = CONTEXTPATH;
Server.Pool = [];

Server.getXMLHttpRequest = function () {
    for (var i = 0; i < Server.Pool.length; i++) {
        if (Server.Pool[i][1] == "0") {
            Server.Pool[i][1] = "1";
            return Server.Pool[i][0];
        }
    }

    var request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        for (var i = 5; i > 1; i--) {
            try {
                if (i == 2) {
                    request = new ActiveXObject("Microsoft.XMLHTTP");
                } else {
                    request = new ActiveXObject("Msxml2.XMLHTTP." + i + ".0");
                }
            } catch (ex) {
            }
        }
    }
    Server.Pool.push([request, "1"]);
    return request;
};

Server.loadURL = function (url, func) {
    var Request = Server.getXMLHttpRequest();
    Request.open("GET", Server.ContextPath + url, true);
    Request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    Request.onreadystatechange = function () {
        if (Request.readyState == 4 && Request.status == 200) {
            try {
                if (func) {
                    func(Request.responseText);
                }
                ;
            } finally {
                for (var i = 0; i < Server.Pool.length; i++) {
                    if (Server.Pool[i][0] == Request) {
                        Server.Pool[i][1] = "0";
                        break;
                    }
                }
                Request = null;
                func = null;
            }
        }
    }
    Request.send(null);
};

Server.loadScript = function (url) {
    document.write('<script type="text/javascript" src="' + Server.ContextPath + url + '"><\/script>');
};

Server.loadCSS = function (url) {
    if (isGecko) {
        var e = document.createElement('LINK');
        e.rel = 'stylesheet';
        e.type = 'text/css';
        e.href = Server.ContextPath + url;
        document.getElementsByTagName("HEAD")[0].appendChild(e);
    } else {
        document.createStyleSheet(Server.ContextPath + url);
    }
};

/*
 *	auto copy
 */
var Misc = {};
Misc.copyToClipboard = function (text) {
    if (text == null) {
        return;
    }
    if (window.clipboardData) {
        if (!window.clipboardData.setData("Text", text))
            return;
    } else if (window.netscape) {
        try {
            netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
        } catch (ex) {
            jAlert('warning', 'Firefox自动复制功能未启用!请&nbsp;<a href=about:config target=_blank>点击此处</a> &nbsp;将’signed.applets.codebase_principal_support’设置为’true’', '提示');
        }
        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        if (!clip) {
            return;
        }
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        if (!trans) {
            return;
        }
        trans.addDataFlavor('text/unicode');
        var str = new Object();
        var len = new Object();
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        var copytext = text;
        str.data = copytext;
        trans.setTransferData("text/unicode", str, copytext.length * 2);
        var clipid = Components.interfaces.nsIClipboard;
        if (!clip) {
            return;
        }
        clip.setData(trans, null, clipid.kGlobalClipboard);
    } else {
        jAlert('warning', '该浏览器不支持自动复制功能!', '提示');
        return;
    }
    jAlert('info', '己复制文字：<font color=red>' + text + '</font>&nbsp;到剪贴板', '提示');
};

var Check = {};
Check.SelectAll = function (spanChk, spanStatus, IsAnti, Name) {
    var name = Name == null ? spanChk.name : Name;
    var obj = document.getElementsByName(name);
    if (obj.length == 0) return;

    if (spanChk.type != "checkbox" && spanStatus == null) return;

    var xState = spanStatus == null ? spanChk.checked : spanStatus;

    for (var i = 0; i < obj.length; i++) {
        if (obj[i].type == "checkbox" && !obj[i].disabled && obj[i].name == name) {
            if (obj[i].checked != xState || IsAnti) FFClick.call(obj[i]);
        }
    }
};

var List = {};
List.GetCheck = function (Name) {
    var obj = $("input[name=" + Name + "]");
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].name == Name && obj[i].checked)
            return obj[i].value;
    }
    return null;
};

List.SetCheck = function (Name, value) {
    $("#" + Name + value).attr("checked", true);
};

List.GetMuti = function (Name) {
    var obj = $("input[name=" + Name + "]");
    var listview = new Array();
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].name == Name && obj[i].checked)
            listview.push(obj[i].value);
    }
    return listview;
};

List.SetMuti = function (Name, listview) {
    var obj = $("input[name=" + Name + "]");
    for (var i = 0; i < listview.length; i++) {
        $("#" + Name + listview[i]).attr("checked", true);
    }
};

List.Append = function (ID, Text, Value, Title) {
    var option = document.createElement("option");
    option.value = Value;
    option.innerText = Text;
    if (IsNotNull(Title)) option.title = Title;
    $("#" + ID).append(option);
};

List.Remove = function (ID) {
    var obj = document.getElementById(ID);
    for (var i = 0; i < obj.length; i++) {
        if (obj.options[i].selected) {
            obj.remove(i);
            i--;
        }
    }
};

List.Move = function (OldID, NewID) {
    var obj = document.getElementById(OldID);
    for (var i = 0; i < obj.length; i++) {
        if (obj.options[i].selected) {
            List.Append(NewID, obj.options[i].text, obj.options[i].value);
            obj.remove(i);
            i--;
        }
    }
};

//////////////////////////////////////////////////////////////////////////cookie
/*
 jQuery cookie是个很好的cookie插件，大概的使用方法如下
 example $.cookie(’name’, ‘value’);
 设置cookie的值，把name变量的值设为value
 example $.cookie(’name’, ‘value’, {expires: 7, path: ‘/’, domain: ‘jquery.com’, secure: true});
 新建一个cookie 包括有效期 路径 域名等
 example $.cookie(’name’, ‘value’);
 新建cookie
 example $.cookie(’name’, null);
 删除一个cookie

 var account= $.cookie('name');
 取一个cookie(name)值给myvar
 */
jQuery.cookie = function (name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        return true;
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

/////////////////////////////////////////////////////////////////////////////mask
jQuery.fn.mask = function () {
    var self = this;
    self[0].style.position = 'relative';
    var maskDiv = document.createElement("div");
    maskDiv.className = "mask";
    self.append(maskDiv);
}

jQuery.fn.wait = function (msg) {
    this.mask();
    msg = IsNull(msg) || msg.IsEmpty() ? "Loading..." : msg;
    var self = this;
    //append shadow
    var shadowDiv = document.createElement("div");
    shadowDiv.className = "mask-shadow";
    self.append(shadowDiv);
    //append msg
    var msgDiv = document.createElement("div");
    msgDiv.className = "mask-msg";
    var loadingDiv = document.createElement("div");
    loadingDiv.className = "mask-loading";
    loadingDiv.innerHTML = msg;

    msgDiv.appendChild(loadingDiv);

    self.append(msgDiv);
}

jQuery.fn.setValue = function (dataJson) {
    for (var key in dataJson) {
        var obj = this.find("[name=" + key + "]");
        if (obj.length == 0) continue;

        if (obj[0].type == "radio") {
            obj.each(function (k, v) {
                if (v.value == dataJson[key])
                    v.checked = true;
            });
            continue;
        }

        if (obj[0].type == "checkbox") {
            if (obj.length == 1 && (IsNull(obj[0].value) || obj[0].value.IsEmpty() || obj[0].value == "on")) {
                obj[0].checked = (dataJson[key] != 0 && dataJson[key] != "") ? true : false;
                continue;
            }
            obj.each(function (k, v) {
                if ($.isArray(dataJson[key])) {
                    $.each(dataJson[key], function (k1, v1) {
                        if (v1 == v.value)
                            v.checked = true
                    });
                }
                else {
                    if (v.value == dataJson[key])
                        v.checked = true;
                    else
                        v.checked = false;
                }
            });
            continue;
        }

        if (obj[0].nodeName.toLowerCase() == "textarea") {
            obj.val(decodeURIComponent(dataJson[key]));
            continue;
        }
        obj.val(dataJson[key]);
    }
}

jQuery.fn.getValue = function () {
    var objs = this.find("[name]")
    var dataJson = {};
    for (var index = 0; index < objs.length; index++) {
        var obj = objs[index];
        if (obj.disabled) continue;
        if (obj.type == "radio") {
            if ((IsNull(obj.value) || obj.value.IsEmpty()) && this.find("[name=" + obj.name + "]").length == 1) {
                dataJson[obj.name] = obj.checked ? 1 : 0;
                continue;
            }
            if (obj.checked) {
                dataJson[obj.name] = obj.value;
            }
            continue;
        }
        if (obj.tagName.toLowerCase()=="md-checkbox") {
            if ($(obj).hasClass("md-checked")) {
                dataJson[$(obj).attr("name")]=$(obj).hasClass("md-checked")?1:0
            }
            continue;
        }
        if (obj.tagName.toLowerCase()=="input" || obj.tagName.toLowerCase()=='textarea') {
            dataJson[obj.name] = obj.type == "password" ? obj.value : obj.value.trim();
        }
        else{
            dataJson[$(obj).attr("name")]=$(obj).attr("value");
        }
    }
    return dataJson;
}


////////////////////////////////////////////////////////////////////////////preventDefault
$(document).on("click", 'a[href^=#]', function (e) {
    return false;
});

//获取一个控件距离左边浏览器的距离
function getAbsoluteLeft(o) {
    // Get an object left position from the upper left viewport corner
    oLeft = o.offsetLeft            // Get left position from the parent object
    while (o.offsetParent != null) {   // Parse the parent hierarchy up to the document element
        oParent = o.offsetParent    // Get parent object reference
        oLeft += oParent.offsetLeft // Add parent left position
        o = oParent
    }
    return oLeft
}

//获取一个控件距离顶部浏览器的距离
function getAbsoluteTop(o) {
    // Get an object top position from the upper left viewport corner
    oTop = o.offsetTop            // Get top position from the parent object
    while (o.offsetParent != null) { // Parse the parent hierarchy up to the document element
        oParent = o.offsetParent  // Get parent object reference
        oTop += oParent.offsetTop // Add parent top position
        o = oParent
    }
    return oTop
}

////////////////////////////////////////////////////////////////////////////////ajax
function __ajax_func(u, d, c, noticy, async, extra) {
    __ajax__(u, d, function (data, textStatus) {
        //data = data.d.ToJson();
        if (data.result === "true") {
            if (noticy) {
                if (c) c(data);
                return;
            }
            __ajax_noticy(data.msg, {
                "before_init": function () {
                    if (c) c(data);
                }
            }).success();
        }
        else {
            __ajax_noticy(data.msg, {}, data.session).error();
        }
    }, function (XMLHttpRequest, textStatus, errorThrown) {
        __ajax_noticy("服务器发生异常，请稍后再试，如有问题，请联系管理员").error();
    }, async, extra);
}

function __ajax__(url, d, s, e, async, extra) {
    var options = {
        type: "post",
        url: url,
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(d),
        cache: false,
        success: s,
        error: e,
        async: !async
    };
    if (IsNotNull(extra)) {
        for (var k in extra) {
            options[k] = extra[k]
        }
    }
    $.ajax(options);
}

function __ajax_noticy(m, options, session) {
    var o = {
        text: m,
        type: 'info',
        history: false,
        animation: 'show',
        delay: 2000
    }
    options = $.extend({}, o, options);
    return {
        error: function () {
            options.title = "ERROR";
            options.type = "error";
            if (session)
                options.before_close = function () {
                    window.location.href = Server.ContextPath + "login.aspx"
                }
            $.pnotify(options);
        },
        warning: function () {
            options.title = "WARNING";
            options.type = "warning";
            $.pnotify(options);
        },
        success: function () {
            options.title = "SUCCESS";
            options.type = "success";
            $.pnotify(options);
        }
    }
};

function __ajax_grid(s, u, c, extra) {
    var options = {
        "sAjaxSource": u,
        "aaSorting": [],
        "aoColumns": c,
        "bProcessing": true,
        "bServerSide": true,
        "sServerMethod": "POST",
        "bAutoWidth": false,
        "sPaginationType": "full_numbers",
        "bFilter": false,
        "iDisplayLength": 25,
        "bSort": true, // 排序
        "width": "100%",
        "sDom": "rt<'bottom'<'left'<'length'l><'info'i>><'right'<'pagination'p>>>",
        "oLanguage": {
            "sProcessing": "Loading......",
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "对不起，查询不到相关数据！",
            "sEmptyTable": "对不起，查询不到相关数据！",
            "sInfo": "，当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
            "sInfoEmpty": "记录数为0",
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
            "sSearch": "搜索",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "末页"
            }
        },
        "fnDrawCallback": function(settings, json) {
            $(this).find("[data-toggle='tooltip']").tooltip();
        }
    };
    if (IsNotNull(extra)) {
        for (var k in extra) {
            options[k] = extra[k]
        }
    }
    options = $.extend({}, options, extra);
    return $(s).dataTable(options);
}

$.fn.extend({
    "initControl":function(){
        $(this).find(".md-input:not(.no-focus)").focus(function(){
            $(this).parent().addClass("md-input-focused");
        }).blur(function(){
            var val=$(this).val();
            if (val!='') {
                $(this).parent().addClass("md-input-has-value").removeClass("md-input-focused");
            }
            else
            {
                $(this).parent().removeClass("md-input-has-value").removeClass("md-input-focused");
            }
            $(this).validate();
        });
        
        $(this).find("md-radio-button").click(function(){
            $(this).parent().find("md-radio-button.md-checked").removeClass("md-checked");
            $(this).addClass("md-checked");
            $(this).parent().attr("value",$(this).attr("value"));
        });
        
        $(this).find("md-select:not('[disabled]')").click(function(event){
            var obj=this;
            event.stopPropagation();
            
            
            $(this).find("._md-select-menu-container").addClass("_md-active");
            $(document).one('click',function(e){
                e.stopPropagation();
                if (e.target.tagName!='MD-OPTION') {
                    $(obj).find("._md-select-menu-container").removeClass("_md-active")
                    $(obj).find("md-select-value").validate();
                }
            })
        });
        $(this).find("md-option").click(function(event){
            event.stopPropagation();
            var val=$(this).attr("value");
            var name=$(this).find("._md-text").text();
            
            $(this).parents("div._md-select-menu-container").removeClass("_md-active")
                .prev().attr("value",val).find("._md-text").text(name);
                       
            $(this).parents("md-input-container").addClass("md-input-has-value");
            
            var child=$(this).parents("md-select-menu").attr("for");
            if (IsNotNull(child) && child!="" && $(child).length>0) {
                $(child).find("md-option").each(function(k,v){
                    var pid=$(v).attr("pid");
                    if (pid!=val) {
                        $(v).addClass("hide")
                    }
                    else
                        $(v).removeClass("hide")
                })
            }
        });
        
        $(this).find("md-checkbox:not('[disabeld]')").click(function(){
            $(this).toggleClass("md-checked");
        })
        if ($(this).find(".datetimepicker").length>0) {
            $(this).find(".datetimepicker").datetimepicker();
        }

        $(this).find(".img_upload").each(function(k,v){
            var dropbox = $(v),message = $('.message', dropbox);
            
            var upload_url=dropbox.attr("upload-url");
            var file_size=dropbox.attr("file-size");
            
            dropbox.on("click","button.md-remove",function(){
                $(this).parents(".preview").remove()
            });
            
            var template = '<div class="preview">'+
				'<span class="imageHolder">'+
                                    '<img/>'+
				    '<span class="uploaded"></span>'+
				'</span>'+
                                '<br/>'+
                                '<button type="button" class="md-remove md-icon-button md-button md-ink-ripple md-default-theme">'+
                                    '<md-icon class="ng-scope md-font icon-close-circle-outline material-icons md-default-theme" md-font-icon="icon-close"></md-icon>'+
                                '</button>'+
				'<div class="progressHolder">'+
                                    '<div class="progress"></div>'+
				'</div>'+
			    '</div>'; 
            
            dropbox.filedrop({
		// The name of the $_FILES entry:
		paramname:'pic',
		maxfiles: 5,
		maxfilesize: file_size,
		url: upload_url,
		uploadFinished:function(i,file,response){
                    if (response.result) {
                        $.data(file).addClass('done').attr("_uuid",response.msg)
                    }
		},
		error: function(err, file) {
			switch(err) {
				case 'BrowserNotSupported':
					showMessage('Your browser does not support HTML5 file uploads!');
					break;
				case 'TooManyFiles':
					alert('Too many files! Please select 5 at most! (configurable)');
					break;
				case 'FileTooLarge':
					alert(file.name+' is too large! Please upload files up to '+file_size+'mb (configurable).');
					break;
				default:
					break;
			}
		},
                beforeEach: function(file){
                    // Called before each upload is started
			if(!file.type.match(/^image\//)){
				alert('Only images are allowed!');
				
				// Returning false will cause the
				// file to be rejected
				return false;
			}
		},
		uploadStarted:function(i, file, len){
			createImage(file);
		},
		progressUpdated: function(i, file, progress) {
			$.data(file).find('.progress').width(progress);
		}
            });
            
            function createImage(file){

		var preview = $(template), image = $('img', preview);
			
		var reader = new FileReader();
		
		image.width = 100;
		image.height = 100;
		
		reader.onload = function(e){
			// e.target.result holds the DataURL which
			// can be used as a source of the image:
			image.attr('src',e.target.result);
		};
		
		// Reading the file as a DataURL. When finished,
		// this will trigger the onload function above:
		reader.readAsDataURL(file);
		
		message.hide();
		preview.appendTo(dropbox);
		
		// Associating a preview container
		// with the file, using jQuery's $.data():
		
		$.data(file,preview);
            }

            function showMessage(msg){
		message.html(msg);
            }
        });        
    },
    "validate":function(){
        var obj=this;
        if ($(this).attr("disabled")!=undefined) {
            return true;
        }
        var val=$(this).val();
        if (IsNull(val) || val=="") {
            val=$(this).attr("value");
        }
        var valide=$(this).attr("aria-invalid")=="true";
            
        if (valide) {
            if ($(this).parents("md-input-container").find('.md-input-messages-animation').length==0) {
                $(this).parents("md-input-container").append($("<div/>").addClass("md-input-messages-animation md-auto-hide"));
            }
                    
            if ($(this).parents("md-input-container").find('.md-input-messages-animation').find(".md-input-message-animation").length==0) {
                $(this).parents("md-input-container").find('.md-input-messages-animation').append($("<div/>").addClass("md-input-message-animation ng-scope"));
            }
        }
        else
            return true;
            
        var error=$(this).parents("md-input-container").find('.md-input-messages-animation').find(".md-input-message-animation")
            
        if (IsNotNull(val) && val!='') {
            var pattern=$(this).attr("pattern");
            pattern=IsNull(pattern)?[]:pattern.split(",");
            var errors=[]
            
            $.each(pattern,function(k,v){
                if (v=='onlyLetterNumber') {
                    if (!val.IsLegalityName()) {
                        errors.push("只允许输入下划线、减号、数字、字母！")
                    }
                }
                if (v=='onlyNumber') {
                    var min=$(obj).attr("min");
                    var max=$(obj).attr("max");
                    if (!val.IsInt(min,max)) {
                        var msg='只允许输入数字'
                        if (IsNotNull(min)) {
                            msg+=',不能小于'+min
                        }
                        if (IsNotNull(max)) {
                            msg+=',不能大于'+min
                        }
                        errors.push(msg)
                    }
                }
                if (v=='notsc') {
                    if (!val.IsNotsc()) {
                        errors.push("只允许输入下划线、减号、数字、字母、中文！")
                    }
                }
                if (v=='url') {
                    if (!val.IsUrl()) {
                        error.push("不合法的URL地址！")
                    }
                }
                
            });
                
            var equal=$(this).attr("equal");
            if (equal!=undefined && equal!="" && $(equal).length>0) {
                var equalVal=$(equal).val();
                if (equalVal==undefined || equalVal==null) {
                    equalVal=$(equal).attr("value");
                }
                    
                if (val!=equalVal) {
                    errors.push("两次输入的密码不一致");
                }
            }
                
            if (errors.length>0) {
                error.text(errors.join(";")).css({opacity: 1,"margin-top": "0px","float":"right","padding-right":"10px"});
                $(this).parents("md-input-container").addClass("md-input-invalid");
                return false;
            }
            else{
                error.empty().removeAttr("style");
                $(this).parents("md-input-container").removeClass("md-input-invalid");
                return true;
            }
        }
        else
        {
            if ($(this).attr("required")!="") {
                error.text("必须").css({opacity: 1,"margin-top": "0px","float":"right","padding-right":"10px"});
                $(this).parents("md-input-container").addClass("md-input-invalid");
                return false;
            }
            else{
                error.empty().removeAttr("style");
                $(this).parents("md-input-container").removeClass("md-input-invalid");
                return true;
            }
        }
    },
    "validateAll":function(){
        var validate=true;
        $(this).find("[aria-invalid='true']").each(function(k,v){
            validate=$(v).validate() && validate;
        })
        return validate
    }
});

$.extend({
    "modal":function(options){
        var defaults = {
            url: "",//remote,
            title: "title",
            validate:true,
            comfirm:false,
            msg:"",
            afterInit:function(){
                
            },
            btn:{
                text:"确定",
                click:function(form,callback){}
            }
        }
        
        options = $.extend({}, defaults, options);
        
        if (!$("#i_modal") || $("#i_modal").length == 0) {
            $("<div/>", {
                class: "md-dialog-container ng-scope",
                id: "i_modal"
            }).css("display","none").appendTo("body")
                .append(
                    $("<md-dialog/>").addClass("task-dialog _md md-default-theme md-content-overflow _md-transition-in")
                        .append(
                            $("<md-toolbar/>").addClass("md-accent md-hue-2 _md md-default-theme")
                                .append(
                                    $("<div/>").addClass("md-toolbar-tools layout-align-space-between-center layout-row")
                                        .append(
                                            $("<span/>").addClass("title ng-binding")
                                                .append(
                                                    $("<md-icon/>").addClass("ng-scope md-font icon-tag-text-outline material-icons md-default-theme")
                                                        .attr("md-font-icon","")
                                                        .css({"margin-top":"-4px","margin-right":"2px"})
                                                ).append(options.title).css("font-weight","600")
                                        )
                                        .append(
                                            $("<button/>",{type:"button"}).addClass("md-icon-button md-button md-ink-ripple md-default-theme")
                                                .append(
                                                    $("<md-icon>").addClass("ng-scope md-font icon-close material-icons md-default-theme").attr("md-font-icon","icon-close")
                                                )
                                        )
                                )
                        ).append(
                            $("<form/>").addClass("md-inline-form ng-pristine ng-invalid ng-invalid-required ng-valid-mindate ng-valid-maxdate ng-valid-filtered ng-invalid-valid")
                                .append(
                                    $("<md-dialog-content/>").addClass("ms-scroll ps-container ps-theme-default")
                                )
                        ).append(
                            $("<md-dialog-actions/>").addClass("layout-align-space-between-center layout-row")
                                .append($("<div/>"))
                                .append(
                                    $("<div/>").addClass("layout-row")
                                        .append(
                                            $("<button/>").addClass("md-accent md-raised md-button ng-scope md-ink-ripple md-default-theme")
                                                .append($("<span/>").addClass("ng-scope").text(options.btn.text))
                                                .append($("<div/>").addClass("md-ripple-container"))
                                        )    
                                )
                        )
                );
        }
        
        $("#i_modal md-dialog form md-dialog-content").perfectScrollbar();
        
        var close=function(){
            $("#i_modal").fadeOut(200,function(){
                $(this).remove();
            });
        }
        
        
        $("#i_modal md-dialog md-toolbar button").click(function(){
            close();
        });
        
        $("#i_modal md-dialog md-dialog-actions button.md-accent").click(function(){
            var form=$("#i_modal md-dialog form")
            options.btn.click(form,function(){
                close();
            });
        });
        
        if (options.comfirm) {
            $("#i_modal md-toolbar span.title md-icon").removeClass("icon-tag-text-outline").addClass("icon-comment-alert-outline")
            
            $("#i_modal md-dialog").css("width","400px");
            $("#i_modal md-dialog md-toolbar").css(
            {
                "background-color":"rgb(70, 96, 110)"
            });
            
            $("#i_modal md-dialog form md-dialog-content").append(
                $("<h2/>").addClass("md-title ng-binding").css("font-weight","600").text(options.msg)
            );
            
            $("#i_modal md-dialog md-dialog-actions > div.layout-row").append(
                $("<button/>").addClass("md-cancel md-raised md-button ng-scope md-ink-ripple md-default-theme")
                    .append($("<span/>").addClass("ng-scope").text("取消"))
                    .append($("<div/>").addClass("md-ripple-container"))
            );
            
            $("#i_modal md-dialog md-dialog-actions button.md-cancel").click(function(){
                close();
            });
            
            $("#i_modal").fadeIn(200);
            options.afterInit();
        }
        else{
            $("#i_modal md-dialog form md-dialog-content").load(options.url, function (responseText, textStatus, XMLHttpResuest) {
                if (textStatus == "error")
                    $(this).html("<p style='color:red;'>加载失败,可能是由于<b>无数据源</b>或者<b>登录超时</b>或者、以及其他<b>未知原因</b>造成!</p>");
                else{
                    $(this).initControl();
                }
                
                $(this).parents("#i_modal").fadeIn(200);
                options.afterInit();
            });
        }
    },
    "timeago":function(time){
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var halfamonth = day * 15;
        var month = day * 30;
        var year = month * 12;
        
        var now = new Date().getTime();
        time=Date.parse(time.replace(/-/gi,"/"));
        
        var diffValue = now - time;
        
        var yearC=diffValue/year;
        var monthC =diffValue/month;
        var weekC =diffValue/(7*day);
        var dayC =diffValue/day;
        var hourC =diffValue/hour;
        var minC =diffValue/minute;
        
        if (yearC>=1) {
            result=parseInt(yearC) + "年前";
        }
        else if(monthC>=1){
            result=parseInt(monthC) + "个月前";
        }
        else if(weekC>=1){
            result=parseInt(weekC) + "周前";
        }
        else if(dayC>=1){
            result=parseInt(dayC) +"天前";
        }
        else if(hourC>=1){
            result=parseInt(hourC) +"个小时前";
        }
        else if(minC>=1){
            result=parseInt(minC) +"分钟前";
        }else
            result="刚刚";
            
        return result;
    }
})