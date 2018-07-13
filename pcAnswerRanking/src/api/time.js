export function times(){
  var date = new Date();
  var now = "";
  var y = (date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1);
  var r = date.getDate()<10?'0'+date.getDate():date.getDate();
  var h = date.getHours()<10?'0'+date.getHours():date.getHours();
  var m = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
  var s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
  now = date.getFullYear()+"-"; //读英文就行了
  now = now + y+"-";//取月的时候取的是当前月-1如果想取当前月+1就可以了
  now = now + r+" ";
  now = now + h+":";
  now = now + m+":";
  now = now + s+"";
  return now;
}
