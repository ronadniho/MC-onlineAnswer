/// <reference path="common.js" />

export var __GlobalInfo = {
//  "webroot": "/dreaminvoice",
//  "postUrl": "/dreaminvoice/doPost",
	"webroot": "/iPB2018",
    "postUrl": "/iPB2018/doPost",
    "actionUrl": "/iPB2018/doAction",
//   "webroot": "/iPB-GXB",
//   "postUrl": "/iPB-GXB/doPost",
//   "actionUrl": "/iPB-GXB/doAction",
    //"dbType": "YUNTABLE"
    "dbType": "MYSQL",
    "poundage": 3,
//  "rooturl": "http://localhost:8080/dreaminvoice/"
    "rooturl": "http://localhost:8080/iPB/"
};




function replaceString(str) {
    str = str.toLowerCase();
    for (var key in __GlobalInfo) {
        var word = "{%" + key + "}"
        if (str.indexOf(word) >= 0) {
            str = str.replace(word, __GlobalInfo[key]);
        }
    }
    return str;
}

function getCookie(c_name){
	if (document.cookie.length>0) {
	    c_start=document.cookie.indexOf(c_name + "=");
	    if (c_start!=-1){
		    c_start=c_start + c_name.length+1 ;
		    c_end=document.cookie.indexOf(";",c_start);
		    if (c_end==-1) c_end=document.cookie.length;
		    return unescape(document.cookie.substring(c_start,c_end));
	    }
	}
	return "";
}
function getSystemConfig() {
    if (!top._systemConfig) {
        top._systemConfig = getXmlObj("config/dsf.xml");
    }
    return top._systemConfig;
}
