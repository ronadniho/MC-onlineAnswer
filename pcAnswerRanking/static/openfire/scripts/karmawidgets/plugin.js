(function ($) {
    //分页插件--BEGIN
    var ms = {
        init: function (obj, args) {
            return (function () {
                ms.fillHtml(obj, args);
                ms.bindEvent(obj, args);
            })();
        },
        //填充html
        fillHtml: function (obj, args) {
            return (function () {
                obj.empty();
                //上一页
                if (args.current > 1) {
                    obj.append(args.htmlcontent.firstpage);
                } else {
                    obj.remove('.prevPage');
                    obj.append(args.htmlcontent.firstpage_disabled);
                }
                //中间页码
                if (args.current != 1 && args.current >= 4 && args.pageCount != 4) {
                    obj.append($.kStringFormat(args.htmlcontent.pagecode, 1));
                }
                if (args.current - 2 > 2 && args.current <= args.pageCount && args.pageCount > 5) {
                    obj.append(args.htmlcontent.omit);
                }
                var start = args.current - 2, end = args.current + 2;
                if ((start > 1 && args.current < 4) || args.current == 1) {
                    end++;
                }
                if (args.current > args.pageCount - 4 && args.current >= args.pageCount) {
                    start--;
                }
                for (; start <= end; start++) {
                    if (start <= args.pageCount && start >= 1) {
                        if (start != args.current) {
                            obj.append($.kStringFormat(args.htmlcontent.pagecode, start));
                        } else {
                            obj.append($.kStringFormat(args.htmlcontent.current, start));
                        }
                    }
                }
                if (args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5) {
                    obj.append(args.htmlcontent.omit);
                }
                if (args.current != args.pageCount && args.current < args.pageCount - 2 && args.pageCount != 4) {
                    obj.append($.kStringFormat(args.htmlcontent.pagecode, args.pageCount));
                }
                //下一页
                if (args.current < args.pageCount) {
                    obj.append(args.htmlcontent.lastpage);
                } else {
                    obj.remove('.nextPage');
                    obj.append(args.htmlcontent.lastpage_disabled);
                }
            })();
        },
        //绑定事件
        bindEvent: function (obj, args) {

            return (function () {
                obj.unbind("click");
                obj.on("click", "a.tcdNumber", function () {
                    var current = parseInt($(this).text());
                    ms.fillHtml(obj, { "current": current, "pageCount": args.pageCount, htmlcontent: args.htmlcontent });
                    if (typeof (args.backFn) == "function") {
                        args.backFn(current);
                    }
                });
                //上一页
                obj.on("click", "a.prevPage", function () {
                    var current = parseInt(obj.children("span.current").text());
                    ms.fillHtml(obj, { "current": current - 1, "pageCount": args.pageCount, htmlcontent: args.htmlcontent });
                    if (typeof (args.backFn) == "function") {
                        args.backFn(current - 1);
                    }
                });
                //下一页
                obj.on("click", "a.nextPage", function () {
                    var current = parseInt(obj.children("span.current").text());
                    ms.fillHtml(obj, { "current": current + 1, "pageCount": args.pageCount, htmlcontent: args.htmlcontent });
                    if (typeof (args.backFn) == "function") {
                        args.backFn(current + 1);
                    }
                });
            })();
        }
    }
    $.fn.createPage = function (options) {
        var args = $.extend({
            pageCount: 10,
            current: 1,
            htmlcontent: {
                "firstpage": '<a href="javascript:;" class="prevPage"><<</a>',
                "firstpage_disabled": '<span class="disabled"><<</span>',
                "lastpage": '<a href="javascript:;" class="nextPage">>></a>',
                "lastpage_disabled": '<span class="disabled">>></span>',
                "pagecode": '<a href="javascript:;" class="tcdNumber">{0}</a>',
                "omit": "<span>...</span>",
                "current": '<span class="current">{0}</span>'
            },
            backFn: function () { }
        }, options);
        ms.init(this, args);
    }
    //分页插件--END
})(jQuery);


//表示全局唯一标识符 (GUID)。
jQuery.karmaGuid = function (format) {
    function Guid(g) {
        var arr = new Array(); //存放32位数值的数组
        if (typeof (g) == "string") { //如果构造函数的参数为字符串
            InitByString(arr, g);
        }

        else {
            InitByOther(arr);
        }
        //返回一个值，该值指示 Guid 的两个实例是否表示同一个值。
        this.Equals = function (o) {
            if (o && o.IsGuid) {
                return this.ToString() == o.ToString();
            }
            else {
                return false;
            }

        }

        //Guid对象的标记
        this.IsGuid = function () { }
        //返回 Guid 类的此实例值的 String 表示形式。
        this.ToString = function (format) {
            if (typeof (format) == "string") {
                if (format == "N" || format == "D" || format == "B" || format == "P") {
                    return ToStringWithFormat(arr, format);
                }
                else {
                    return ToStringWithFormat(arr, "D");
                }

            }

            else {
                return ToStringWithFormat(arr, "D");
            }

        }

        //由字符串加载
        function InitByString(arr, g) {
            g = g.replace(/\{|\(|\)|\}|-/g, "");
            g = g.toLowerCase();
            if (g.length != 32 || g.search(/[^0-9,a-f]/i) != -1) {
                InitByOther(arr);
            }
            else {
                var temp = g.split("");
                for (var i = 0; i < temp.length; i++) {
                    arr.push(temp[i]);
                }
                //                for (var i = 0; i < g.length; i++) {
                //                    var chat = g[i] || g.substr(i, 1)
                //                    arr.push(chat);
                //                }
            }
        }

        //由其他类型加载

        function InitByOther(arr) {
            var i = 32;
            while (i--) {
                arr.push("0");
            }
        }

        /*

        根据所提供的格式说明符，返回此 Guid 实例值的 String 表示形式。

        N  32 位： xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

        D  由连字符分隔的 32 位数字 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

        B  括在大括号中、由连字符分隔的 32 位数字：{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}

        P  括在圆括号中、由连字符分隔的 32 位数字：(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

        */
        function ToStringWithFormat(arr, format) {
            switch (format) {
                case "N":
                    return arr.toString().replace(/,/g, "");
                case "D":
                    var str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20, 32);
                    str = str.replace(/,/g, "");
                    return str;
                case "B":
                    var str = ToStringWithFormat(arr, "D");
                    str = "{" + str + "}";
                    return str;
                case "P":
                    var str = ToStringWithFormat(arr, "D");
                    str = "(" + str + ")";
                    return str;
                default:
                    return new Guid();
            }

        }

    }

    //Guid 类的默认实例，其值保证均为零。
    Guid.Empty = new Guid();
    //初始化 Guid 类的一个新实例。
    Guid.NewGuid = function () {
        var g = "";
        var i = 32;
        while (i--) {
            g += Math.floor(Math.random() * 16.0).toString(16);
        }
        return new Guid(g);
    }
    format = format || 'n';
    return Guid.NewGuid().ToString(format.toUpperCase());
}
//plugin-追加天数
jQuery.karmaAddDate = function (oDate, num) {
    oDate.setDate(oDate.getDate() + num);
    return oDate;
}
//plugin-追加月份
jQuery.karmaAddMonth = function (oDate, num) {
    var tempDate = oDate.getDate();
    oDate.setMonth(oDate.getMonth() + num);
    if (tempDate != oDate.getDate()) oDate.setDate(0);
    return oDate;
}
//plugin-追加年份
jQuery.karmaAddYear = function (oDate, num) {
    var tempDate = oDate.getDate();
    oDate.setYear(oDate.getYear() + num);
    if (tempDate != oDate.getDate()) oDate.setDate(0);
    return oDate;
}
//plugin-时间格式化
jQuery.karmaFomateDate = function (oDate, sFomate, bZone) {
    sFomate = sFomate.replace("YYYY", oDate.getFullYear());
    sFomate = sFomate.replace("YY", String(oDate.getFullYear()).substr(2));
    var month = oDate.getMonth() + 1;
    var day = oDate.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    sFomate = sFomate.replace("MM", month);
    sFomate = sFomate.replace("DD", day);

    var hh = oDate.getHours();
    var mm = oDate.getMinutes();
    var ss = oDate.getSeconds();
    var fff = oDate.getMilliseconds();

    hh = hh < 10 ? "0" + hh : hh;
    mm = mm < 10 ? "0" + mm : mm;
    ss = ss < 10 ? "0" + ss : ss;
    fff = fff < 10 ? "00" + fff : fff < 100 ? "0" + fff : fff;

    sFomate = sFomate.replace("hh", hh);
    sFomate = sFomate.replace("mm", mm);
    sFomate = sFomate.replace("ss", ss);
    sFomate = sFomate.replace("fff", fff);

    if (bZone) sFomate = sFomate.replace(/\b(\d)\b/g, '0$1');
    return sFomate;
};
//plugin-时间相减
jQuery.karmaDateDiff = function (sDate1, sDate2) {
    var aDate, oDate1, oDate2, iDays
    aDate = sDate1.split("-")
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2006格式
    aDate = sDate2.split("-")
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数
    return iDays + 1
};
//plugin-加载模板内容
jQuery.karmaLoadTemplate = function (url) {
    var ret = null;
    $.ajax({
        url: url,
        async: false,
        dataType: 'html',
        type: 'GET',
        timeout: 2000,
        error: function (xml) {
            alert("加载HTML 文件出错！url:" + url);
        },
        success: function (html) {
            ret = html;
        }
    });
    return ret;
};
//plugin-根据数据和模板添加元素
jQuery.karmaAddElementFromData_Template = function (e, item, _callback, _ch_callback) {
    var url = e.attr("data-template");
    var template = $.karmaLoadTemplate(url);
    var content = template;
    for (var key in item) {
        var strRegExp = new RegExp("\\[" + key + "\\]", "g");
        var itemValue = item[key];
        if (_callback != null) {
            itemValue = _callback(key, itemValue);
        }
        content = content.replace(strRegExp, itemValue);
    }
    var ch = $(content);
    ch.appendTo(e);
    if (_ch_callback) {
        _ch_callback(ch);
    }
};
//plugin-根据数据和模板添加元素(简化)
jQuery.karmaBriefAddElementFromData_Template = function (e, item, _callback) {
    var url = e.attr("data-template");
    var template = $.karmaLoadTemplate(url);
    var content = template;
    if (_callback) {
        _callback(e, item, content);
    }
    else {
        for (var key in item) {
            var strRegExp = new RegExp("\\[" + key + "\\]", "g");
            var itemValue = item[key];
            content = content.replace(strRegExp, itemValue);
        }
        var ch = $(content);
        ch.appendTo(e);
    }
};
//plugin-根据数据和模板添加元素-v2.0
//data:jsonArray
//templateUrl:列表子模版
//complete:列表元素的jQuery对象
//karmaArgs:{ "recast": function () { }, "complete": function () { }, "afterinsert": function () { }, "position": "before"}
jQuery.karmaLBind = function (data, templateUrl, vectorElement, karmaArgs) {
    var template = $.karmaLoadTemplate(templateUrl);
    var recastValueFunc = karmaArgs ? karmaArgs.recast ? karmaArgs.recast : null : null;
    var _callback = karmaArgs ? karmaArgs.complete ? karmaArgs.complete : null : null;
    var _afterItemback = karmaArgs ? karmaArgs.afterinsert ? karmaArgs.afterinsert : null : null;

    var position = karmaArgs ? karmaArgs.position ? karmaArgs.position : null : null;

    $.each(data, function (i, item) {
        var content = template;
        if (_afterItemback) {
            var afterParam = _afterItemback(item);
            if (afterParam != undefined) {
                for (var keyName in afterParam) {
                    item[keyName] = afterParam[keyName];
                }
            }
        }

        for (var key in item) {
            var strRegExp = new RegExp("\\[" + key + "\\]", "g");
            var itemValue = item[key];
            if (recastValueFunc != null) {
                var krVal = recastValueFunc(key, itemValue);
                if (krVal == undefined) {
                    itemValue = item[key];
                }
                else {
                    itemValue = krVal;
                }
            }
            content = content.replace(strRegExp, itemValue);
        }
        var itemElement = $(content);
        if (position && position == "before") {
            itemElement.prependTo(vectorElement);
        }
        else {
            itemElement.appendTo(vectorElement);
        }

        if (_callback) {
            _callback(itemElement,item);
        }
    });
};
//plugin-中括号替换
jQuery.karmaBracketReplace = function (content, key, value) {
    content = content.replace(new RegExp("\\[" + key + "\\]", "g"), value);
    return content;
}
//plugin-中括号替换-v2.0
jQuery.karmaBReplace = function (content, key, value) {
    content = content.replace(new RegExp("\\[" + key + "\\]", "g"), value);
    return content;
}
//字符串格式化
jQuery.kStringFormat = function (result) {
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] != undefined) {
            var reg = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            result = result.replace(reg, arguments[i]);
        }
    }
    return result;
}
//plugin-获取url参数
jQuery.karmaRequest = function (paras) {
    var url = location.href;
    var paramStr = url.substring(url.indexOf('?') + 1, url.length).split('&');
    var j;
    var paramObj = {};
    for (var i = 0; j = paramStr[i]; i++) {
        paramObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length);
    }
    var returnValue = paramObj[paras.toLowerCase()];

    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
};
//plugin-小数点保留2位不进行四舍五入
jQuery.karmaNotRounding = function (value) {
    var str = value.toString();
    if (str.indexOf('.') > -1) {
        var int = str.split('.')[0];
        var poi = str.split('.')[1];
        if (poi.length > 2) {
            poi = poi.substr(0, 2);
        }
        str = int + "." + poi;
    }
    return str;
}
//plugin-图片缩小处理
jQuery.karmaCalculateImgBox = function (boxW, boxH, url, imgObj, _callback) {
    $("<img />").attr("src", url).load(function () {
        var realW = this.width;
        var realH = this.height;

        var sin = realH / realW;
        var cos = realW / realH;

        var desH = boxW * sin;
        var algorithm_choice = 0;//算法选择,2种计算方法，均可达到同样的效果
        if (algorithm_choice == 0) {
            if (desH < boxH) {
                var left = 0 - boxH * cos / 2;
                var margin_left = boxW / 2;
                imgObj.css("height", "100%");
                imgObj.css("width", "auto");
                imgObj.css("left", left + "px");
                imgObj.css("margin-left", margin_left + "px");
                imgObj.css("top", "0px");
                imgObj.css("margin-top", "0px");
            }
            else {
                var top = 0 - boxW * sin / 2;
                var margin_top = boxH / 2;
                imgObj.css("height", "auto");
                imgObj.css("width", "100%");
                imgObj.css("left", "0px");
                imgObj.css("margin-left", "0px");
                imgObj.css("top", top + "px");
                imgObj.css("margin-top", margin_top + "px");
            }
        }
        else {
            if (desH < boxH) {
                var left = 0 - (boxH * cos / 2 - boxW / 2);
                imgObj.css("height", "100%");
                imgObj.css("width", "auto");
                imgObj.css("left", left + "px");
            }
            else {
                var top = 0 - (boxW * sin / 2 - boxH / 2);
                imgObj.css("height", "auto");
                imgObj.css("width", "100%");
                imgObj.css("top", top + "px");
            }
        }
        imgObj.attr("src", url);
        if (_callback) {
            _callback();
        }
    });
}
//plugin-获取http头
jQuery.karmaHttpHeader = function () {
    var karma_header = "";
    var karma_root_path = window.document.location.href;
    var karma_path_name = window.document.location.pathname;
    var pos = karma_root_path.indexOf(karma_path_name);
    var karma_header = karma_root_path.substring(0, pos);
    return karma_header;
}
//plugin-kTRCnt:总记录数;kPCnt:每页显示行
jQuery.arithmeticPage = function (kTRCnt, kPCnt) {
    var kMPCnt = kTRCnt % kPCnt != 0 ? (parseInt(kTRCnt / kPCnt) + 1) : parseInt(kTRCnt / kPCnt);//根据总数和页数计算最大页数
    return kMPCnt;
}
//plugin-计算字符长度
jQuery.kStrALen = function (str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}
//plugin-截取固定长度子字符串 sSource为字符串iLen为长度
jQuery.kInceStr = function (sSource, iLen) {
    if (sSource.replace(/[^x00-xff]/g, "xx").length <= iLen) {
        return sSource;
    }
    var str = "";
    var l = 0;
    var schar;
    for (var i = 0; schar = sSource.charAt(i); i++) {
        str += schar;
        l += (schar.match(/[^x00-xff]/) != null ? 2 : 1);
        if (l >= iLen) {
            break;
        }
    }
    return str;
}
jQuery.kIsNumber = function (val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}
//plugin-判断图片是否存在
jQuery.kIsExistImage = function (url,success,fail) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (this.status == 200) {
            if (success) {
                success(this);
            }
        }
        else {
            if (fail) {
                fail(this);
            }
        }
    };
    xhr.send();
}
//plugin-Base64
jQuery.kBase64 = function() {

    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
        if (input == null) return null;

        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    this.decode = function (input) {
        if (input == null) return null;
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}


