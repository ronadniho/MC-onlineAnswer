//radio插件加载
(function karma_load_radio() {
    $(".karma-radio-panel").each(function () {
        $(this).unbind("click");
        $(this).click(function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this).attr("data-select","false");
            }
            else {
                $(this).addClass("active");
                $(this).attr("data-select", "true");
            }
        });
    });
})();

$(document).ready(function () {
    $(".karma-radio-panel").click();
});