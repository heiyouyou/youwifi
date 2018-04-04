(function ($) {
    var defaults = {
        callback: function () {
        },
        mode: "remote",//promote,local,msg
        url: "",//remote,
        id: "",//local
        msg: "",//msg
        width: 0,
        title: "title",
        setTimeout: true,
        before: function () {
        },
        onclick: function () {
        },
        validate: true,
        btText: "确定"
    }

    var method = {
            init: function (options) {
                if (!$("#i_modal") || $("#i_modal").length == 0) {
                    $("<div/>", {
                        class: "md-dialog-container ng-scope",
                        id: "i_modal"
                    }).appendTo("body")
                      .append(
                            $("<md-dialog/>").addClass("task-dialog _md md-default-theme md-content-overflow _md-transition-in")
                                .append(
                                    $("<md-toolbar/>").addClass("md-accent md-hue-2 _md md-default-theme")
                                        .append(
                                                $("<div/>").addClass("md-toolbar-tools layout-align-space-between-center layout-row")
                                                    .append(
                                                        $("<span/>").addClass("title ng-binding").text(options.title).css("font-weight","600")
                                                    )
                                                    .append(
                                                        $("<button/>",{type:"button"}).addClass("md-icon-button md-button md-ink-ripple md-default-theme")
                                                            .append(
                                                                $("<md-icon>").addClass("ng-scope md-font icon-close material-icons md-default-theme").attr("md-font-icon","icon-close")
                                                            )
                                                    )
                                        )
                                )
                                .append(
                                    $("<form/>").addClass("md-inline-form ng-pristine ng-invalid ng-invalid-required ng-valid-mindate ng-valid-maxdate ng-valid-filtered ng-invalid-valid")
                                        .append(
                                            $("<md-dialog-content/>").addClass("ms-scroll ps-container ps-theme-default")
                                        ).append(
                                            $("<md-dialog-actions/>").addClass("layout-align-space-between-center layout-row")
                                        )
                                )
                            );
                }
            },
            show: function (options) {
                options = $.extend({}, defaults, options);
                this.init(options);
                
                var content=$("#i_modal md-dialog form md-dialog-content");
                
                content.load(options.url, function (responseText, textStatus, XMLHttpResuest) {
                    if (textStatus == "error")
                        $(this).html("<p style='color:red;'>加载失败,可能是由于<b>无数据源</b>或者<b>登录超时</b>或者、以及其他<b>未知原因</b>造成!</p>");
                    else{
                        content.initControl();
                    }
                });
                
                return;
                $("#i_modal .modal-footer a.btn.btn-custom").html("<i class=\"icon-ok icon-white\"></i> " + options.btText);

                $('#i_modal').on('hidden', function () {
                    if (options.mode == "local")
                        $("#" + options.id).appendTo("body").hide();
                    $("#i_modal .modal-header h3").html("");
                    $("#i_modal .modal-body").html("");
                    $("#i_modal").unbind("hidden");
                    $("#i_modal .modal-footer a.btn.btn-custom").unbind("click");
                });
                $("#i_modal .modal-footer a.btn.btn-custom").on("click", options.onclick);

                if (options.width)
                    $("#i_modal").css({ width: options.width + "px", "margin-left": "-" + options.width / 2 + "px" })
                $("#i_modal .modal-header h3").html(options.title);
                if (options.mode == "local")
                    $("#" + options.id).appendTo("#i_modal .modal-body").show();
                if (options.mode == "msg")
                    $("<p/>").appendTo("#i_modal .modal-body").html(options.msg);
                if (options.mode == "remote")
                    $("#i_modal .modal-body").load(options.url, function (responseText, textStatus, XMLHttpResuest) {
                        if (textStatus == "error")
                            $(this).html("<p style='color:red;'>加载失败,可能是由于<b>无数据源</b>或者<b>登录超时</b>或者、以及其他<b>未知原因</b>造成!</p>");
                        $('#i_modal').modal();
                        options.before();
                        if (options.validate)
                            $(this).find("form").validationEngine('attach', { promptPosition: "bottomRight", autoPositionUpdate: true });
                    });
                else {
                    $('#i_modal').modal();
                    options.before();
                }
                $("#i_modal .modal-body").css({"position": 'initial'});
            },
            time: function (value) {
                if ($("#i_time").length == 0) {
                    $("body").append($("<div/>", {
                        id: "i_time",
                        class: "hide"
                    }));
                    $("#i_time").timePicker();
                }
                $("#i_time").setPicker(value);
            },
            hide: function () {
                $('#i_modal').modal('hide');
            }
       
    }

    $.imodal = function (options) {
        method.show(options);
    }
}(jQuery))