(function( $ ) {
    "use strict";

    $(window).load(function() {

	    //These functions are affected by fonts loading

	});

	$( document ).ready(function() {

		$("#wp-client-reports-date-chooser-button").click(function() {
            $("#wp-client-reports-date-chooser").toggle();
        });

        $("#wp-client-reports-cancel").click(function() {
            $("#wp-client-reports-date-chooser").hide();
        });

        $("#wp-client-reports-apply").click(function() {
            $("#wp-client-reports-date-chooser").hide();
            var startDate = $("#from_value").val();
            var endDate = $("#to_value").val();
            getData(startDate, endDate);
            setDates(startDate, endDate, null);
        });

        $("#wp-client-reports-force-update").click(function() {
            var httpProtocol = ('https:' == document.location.protocol ? 'https://' : 'http://');
            var hostUrl = window.location.host;
            var dataString = 'action=wp_client_reports_force_update';
            $.ajax({
                type: "GET",
                url: httpProtocol + hostUrl + '/wp-admin/admin-ajax.php',
                data: dataString,
                dataType: 'json',
                success: function(data, err) {
                    location.reload();
                }
            });
        });

        $("#wp-client-reports-quick-today").click(function(e) {
            e.preventDefault();
            var label = $(this).text();
            $("#wp-client-reports-date-chooser").hide();
            var startDate = moment().format("YYYY-MM-DD");
            var endDate = moment().format("YYYY-MM-DD");
            setDates(startDate, endDate, label);
            getData(startDate, endDate);
        });

        $("#wp-client-reports-quick-yesterday").click(function(e) {
            e.preventDefault();
            var label = $(this).text();
            $("#wp-client-reports-date-chooser").hide();
            var startDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
            var endDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
            setDates(startDate, endDate, label);
            getData(startDate, endDate);
        });

        $("#wp-client-reports-quick-last7").click(function(e) {
            e.preventDefault();
            var label = $(this).text();
            $("#wp-client-reports-date-chooser").hide();
            var startDate = moment().subtract(7, 'days').format("YYYY-MM-DD");
            var endDate = moment().format("YYYY-MM-DD");
            setDates(startDate, endDate, label);
            getData(startDate, endDate);
        });

        $("#wp-client-reports-quick-last14").click(function(e) {
            e.preventDefault();
            var label = $(this).text();
            $("#wp-client-reports-date-chooser").hide();
            var startDate = moment().subtract(14, 'days').format("YYYY-MM-DD");
            var endDate = moment().format("YYYY-MM-DD");
            setDates(startDate, endDate, label);
            getData(startDate, endDate);
        });

        $("#wp-client-reports-quick-last30").click(function(e) {
            e.preventDefault();
            var label = $(this).text();
            $("#wp-client-reports-date-chooser").hide();
            var startDate = moment().subtract(30, 'days').format("YYYY-MM-DD");
            var endDate = moment().format("YYYY-MM-DD");
            setDates(startDate, endDate, label);
            getData(startDate, endDate);
        });

        $("#wp-client-reports-quick-lastmonth").click(function(e) {
            e.preventDefault();
            var label = $(this).text();
            $("#wp-client-reports-date-chooser").hide();
            var startDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
            var endDate = moment().subtract(1, 'month').endOf("month").format("YYYY-MM-DD");
            setDates(startDate, endDate, label);
            getData(startDate, endDate);
        });

        $("#wp-client-reports-quick-thismonth").click(function(e) {
            e.preventDefault();
            var label = $(this).text();
            $("#wp-client-reports-date-chooser").hide();
            var startDate = moment().startOf('month').format("YYYY-MM-DD");
            var endDate = moment().endOf("month").format("YYYY-MM-DD");
            setDates(startDate, endDate, label);
            getData(startDate, endDate);
        });

        function setDates(startDate, endDate, label) {
            var js_date_format = getDateFormat();
            var start_date_formatted = moment(startDate).format(js_date_format);
            var end_date_formatted = moment(endDate).format(js_date_format);
            $(".from_value").val(startDate);
            $(".to_value").val(endDate);
            $("#wp-client-reports-start-date").text(start_date_formatted);
            $("#wp-client-reports-end-date").text(end_date_formatted);
            if (label) {
                $("#wp-client-reports-button-label").text(label);
            } else {
                $("#wp-client-reports-button-label").text(start_date_formatted + " - " + end_date_formatted);
            }
            $("#date-range").datepicker( "refresh" );
        }

        getData(moment().subtract(30, 'days').format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"));
        setDates(moment().subtract(30, 'days').format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), "Last 30 Days");

        $("#date-range").datepicker({
            maxDate: 0,
            firstDay: 0,
            numberOfMonths: [2,1],
            dateFormat: 'yy-mm-dd',
            beforeShowDay: function(date) {
                var instance = $( this ).data( "datepicker" );
                var date1 = $.datepicker.parseDate(instance.settings.dateFormat, $("#from_value").val());
                var date2 = $.datepicker.parseDate(instance.settings.dateFormat, $("#to_value").val());
                var isHightlight = date1 && ((date.getTime() == date1.getTime()) || (date2 && date >= date1 && date <= date2));
                return [true, isHightlight ? "dp-highlight" : ""];
            },
            onSelect: function(dateText, inst) {
                var js_date_format = getDateFormat();
                var instance = inst;
                var date1 = $.datepicker.parseDate(instance.settings.dateFormat, $("#from_value").val());
                var date2 = $.datepicker.parseDate(instance.settings.dateFormat, $("#to_value").val());
                var selectedDate = $.datepicker.parseDate(instance.settings.dateFormat, dateText);
                if (!date1 || date2) {
                    $(".from_value").val(dateText);
                    $("#wp-client-reports-start-date").text(moment(dateText).format(js_date_format));
                    $(".to_value").val("");
                    console.log(dateText + " thing");
                } else if (selectedDate < date1) {
                    $(".to_value").val($("#from_value").val());
                    $(".from_value").val(dateText);
                    $("#wp-client-reports-end-date").text(moment(dateText).format(js_date_format));
                    // console.log(dateText + " blah");
                } else {
                    $(".to_value").val(dateText);
                    $("#wp-client-reports-end-date").text(moment(dateText).format(js_date_format));
                    // console.log(dateText + " blarg");
                }
                //$(this).datepicker(); //not really sure why this was here?
            }
        });

    });

    $("#wp-client-reports-send-email-report").submit(function(e) {
        e.preventDefault();
        var httpProtocol = ('https:' == document.location.protocol ? 'https://' : 'http://');
		var hostUrl = window.location.host;
        var dataString = $("#wp-client-reports-send-email-report").serialize();
        $.ajax({
            type: "GET",
            url: httpProtocol + hostUrl + '/wp-admin/admin-ajax.php',
            data: dataString,
            dataType: 'json',
            success: function(data, err) {
                alert('Report Sent!');
            }
        });
    });

    function getData(startDate, endDate) {
        var httpProtocol = ('https:' == document.location.protocol ? 'https://' : 'http://');
		var hostUrl = window.location.host;
        var dataString = 'action=wp_client_reports_stats_data&start=' + moment(startDate).utc().format("YYYY-MM-DD") + '&end=' + moment(endDate).utc().format("YYYY-MM-DD");
        var js_date_format = getDateFormat();
        $.ajax({
            type: "GET",
            url: httpProtocol + hostUrl + '/wp-admin/admin-ajax.php',
            data: dataString,
            dataType: 'json',
            success: function(data, err) {
                $("#wp-client-reports-total-update-count").text(data.total_updates);
                $("#wp-client-reports-wp-update-count").text(data.wp_updated);
                $("#wp-client-reports-plugin-update-count").text(data.total_plugins_updated);
                $("#wp-client-reports-theme-update-count").text(data.total_themes_updated);
                $("#wp-client-reports-wp-updates-list").html("");
                $("#wp-client-reports-plugin-updates-list").html("");
                $("#wp-client-reports-theme-updates-list").html("");
                $.each(data.updates, function( index, update ) {
                    var date_formatted = moment(update.date).format(js_date_format);
                    var newUpdate = '<li><strong class="wp-client-reports-name">' + update.name + '</strong><span class="wp-client-reports-from-to">' + update.version_before + ' <span class="dashicons dashicons-arrow-right-alt"></span> ' + update.version_after + '</span><span class="wp-client-reports-date">' + date_formatted + '</span></li>';
                    if (update.type == 'wp') {
                        $("#wp-client-reports-wp-updates-list").append(newUpdate)
                    } else if (update.type == 'plugin') {
                        $("#wp-client-reports-plugin-updates-list").append(newUpdate)
                    } else if (update.type == 'theme') {
                        $("#wp-client-reports-theme-updates-list").append(newUpdate)
                    }
                });
                if (data.wp_updated === 0) {
                    $("#wp-client-reports-wp-updates-list").append('<li class="wp-client-reports-empty">No WordPress Updates</li>');
                }
                if (data.total_plugins_updated === 0) {
                    $("#wp-client-reports-plugin-updates-list").append('<li class="wp-client-reports-empty">No Plugin Updates</li>');
                }if (data.total_themes_updated === 0) {
                    $("#wp-client-reports-theme-updates-list").append('<li class="wp-client-reports-empty">No Theme Updates</li>');
                }
            }
        });
    }

    
    
    function getDateFormat() {
        var php_date_format = wp_client_reports_data.php_date_format;
        if (php_date_format == 'F j, Y') {
            return 'MMMM D, YYYY';
        } else if (php_date_format == 'Y-m-d') {
            return 'YYYY-MM-DD';
        } else if (php_date_format == 'm/d/Y') {
            return 'MM/DD/YYYY';
        } else if (php_date_format == 'd/m/Y') {
            return 'DD/MM/YYYY';
        }
    }

}(jQuery));
