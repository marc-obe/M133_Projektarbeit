//DOM ready - Shorthand
$(document).ready(function () {
    // Ajax Request
    $.getJSON("http://sandbox.gibm.ch/berufe.php").done(function (data) {
        // loop über JSON-Array
        $.each(data, function (key, value) {
            // Optionen anhängen
            $('#beruf').append('<option value=' + value.beruf_id + '>' + value.beruf_name + '</option>');
        })
    }).fail(function () {
        // Fehlermeldung ausgeben - Bootstrap alert Box
        $('#message').html('<div class="alert alert-danger">Fehler ... </div>');
    });

    // Change Handler
    $('#beruf').change(function (e) {
        // leeren der Ausgabe
        $('#message').empty();
        // Ajax Request
        $.ajax({
            type: "GET",
            url: "http://sandbox.gibm.ch/klassen.php",
            data: { format: 'json', beruf: this.value }, // format und id mitgeben
            dataType: 'json'
        }).done(function (data) {
            // loop über JSON-Array
            $.each(data, function (key, value) {
                // Optionen anhängen
                $('#klasse').append('<option value=' + value.klasse_id + '>' + value.klasse_name + '</option>');
            })
        }).fail(function () {
            // Fehlermeldung ausgeben - Bootstrap alert Box
            $('#message').html('<div class="alert alert-danger">Fehler ... </div>');
        });
    });

    // Change Handler
    $('#klasse').change(function (e) {
        // leeren der Ausgabe
        $('#message').empty();
        // Ajax Request
        $.ajax({
            type: "GET",
            url: "https://sandbox.gibm.ch/tafel.php",
            data: { format: 'json', klasse_id: this.value }, // format und id mitgeben
            dataType: 'json'
        }).done(function (data) {
            var calendarEl = document.getElementById('calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
              initialView: 'dayGridMonth'
            });
            calendar.render();
            // loop über JSON-Array
            $.each(data, function (key, value) {
                // Optionen anhängen
                $('#klasse').append('<option value=' + value.klasse_id + '>' + value.klasse_name + '</option>');
            })
        }).fail(function () {
            // Fehlermeldung ausgeben - Bootstrap alert Box
            $('#message').html('<div class="alert alert-danger">Fehler ... </div>');
        });
    });
});