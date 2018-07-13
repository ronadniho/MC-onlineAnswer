var canvas = document.getElementById('canvas');
var cxt = canvas.getContext('2d');
drawString(randomString());
function randomString() {
    var code = '';
    var source = '012345789ascdefgqwrtyuioplkjghmnvczx';

    for (var i = 0; i < 4; i++) {
        var index = Math.floor(Math.random() * source.length);
        code = code + source.charAt(index);
    }
    return code;
}
function drawString(code) {
    sessionStorage.setItem('Code', code);
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    cxt.fillStyle = '#ccc';
    cxt.font = '30px 黑体';
    cxt.textBaseline = 'top';
    for (var i = 0; i < code.length; i++) {
        var r = randomNumber(0, 255);
        var g = randomNumber(0, 255);
        var b = randomNumber(0, 255);
        var h = randomNumber(0, canvas.height - 30);
        cxt.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        cxt.fillText(code.charAt(i), 10 + i * 18, h);
    }
    for (var i = 0; i < 20; i++) {
        var x1 = randomNumber(0, canvas.width);
        var y1 = randomNumber(0, canvas.height);

        var x2 = randomNumber(0, canvas.width);
        var y2 = randomNumber(0, canvas.height);

        cxt.strokeStyle = '#ddd';
        cxt.beginPath();
        cxt.moveTo(x1, y1);
        cxt.lineTo(x2, y2);
        cxt.closePath();
        cxt.stroke();
    }
}
canvas.onclick = function (e) {
    var code = randomString();
    drawString(code);
}
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}