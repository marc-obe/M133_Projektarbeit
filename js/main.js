wochentag = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
//DOM ready - Shorthand
$(document).ready(function () {
    var date = new Date();

    var currentThursday = new Date(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 86400000);
    var yearOfThursday = currentThursday.getFullYear();
    var firstThursday = new Date(new Date(yearOfThursday, 0, 4).getTime() + (3 - ((new Date(yearOfThursday, 0, 4).getDay() + 6) % 7)) * 86400000);
    var weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000 / 7);
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
        $('#klasse').empty();
        // Ajax Request
        $.ajax({
            type: "GET",
            url: "http://sandbox.gibm.ch/klassen.php",
            data: { format: 'json', beruf: this.value },
            dataType: 'json'
        }).done(function (data) {
            // leere Option einfügen
            $('#klasse').append('<option>Klasse auswählen ... </option>');
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
            if (data != '') {

                $('#message').append('<div class="d-flex justify-content-center"><nav aria-label="Page navigation example"><ul class="pagination"><li id="back" class="page-item"><a class="page-link" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li><li class="page-item disabled"><a class="page-link" >KW ' + weekNumber + '-' + date.getFullYear() +
                    '</a></li><li id="next" class="page-item"><a class="page-link" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li></ul></nav></div></br><table class="table"><tr><th>Datum</th><th>Wochentag</th><th>Von</th><th>Bis</th><th>Lehrer</th><th>Fach</th><th>Raum</th></tr></table>');
                // Loop über JSON
                $.each(data, function (key, value) {
                    // Tabellenzeilen anfügen   
                    $('#message table').append(
                        '<tr><td>' + value.tafel_datum +
                        '</td><td>' + wochentag[value.tafel_wochentag] +
                        '</td><td>' + value.tafel_von +
                        '</td><td>' + value.tafel_bis +
                        '</td><td>' + value.tafel_lehrer +
                        '</td><td>' + value.tafel_longfach +
                        '</td><td>' + value.tafel_raum +
                        '</td></tr>');
                })
            } else {
                // Fehlermeldung ausgeben - Bootstrap alert Box
                $('#message').html('<div class="alert alert-warning">Wählen Sie eine andere Klasse aus </div>');
            }
        }).fail(function () {
            // Fehlermeldung ausgeben - Bootstrap alert Box
            $('#message').html('<div class="alert alert-danger">Fehler ... </div>');
        });
    });

    $('li#back').click(function () {
        console.log('test');
        getKalenderFromDate(weekNumber - 1 + '-' + date.getFullYear());
    });

    $('li#next').click(function (e) {
        e.preventDefault();
        getKalenderFromDate(weekNumber + 1 + '-' + date.getFullYear());
    });
});

function getKWFromDate(date) {
    var currentThursday = new Date(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 86400000);
    var yearOfThursday = currentThursday.getFullYear();
    var firstThursday = new Date(new Date(yearOfThursday, 0, 4).getTime() + (3 - ((new Date(yearOfThursday, 0, 4).getDay() + 6) % 7)) * 86400000);
    return weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000 / 7);
};

function getKalenderFromDate(kalenderwoch) {
    $('#message').empty();
    $.ajax({
        type: "GET",
        url: "https://sandbox.gibm.ch/tafel.php",
        data: { format: 'json', klasse_id: this.value, woche: kalenderwoch }, // format und id mitgeben
        dataType: 'json'
    }).done(function (data) {
        if (data != '') {

            $('#message').append('<div class="d-flex justify-content-center"><nav aria-label="Page navigation example"><ul class="pagination"><li id="back" class="page-item"><a class="page-link" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li><li class="page-item disabled"><a class="page-link" >KW ' + kalenderwoch +
                '</a></li><li id="next" class="page-item"><a class="page-link" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li></ul></nav></div></br><table class="table"><tr><th>Datum</th><th>Wochentag</th><th>Von</th><th>Bis</th><th>Lehrer</th><th>Fach</th><th>Raum</th></tr></table>');
            // Loop über JSON
            $.each(data, function (key, value) {
                // Tabellenzeilen anfügen   
                $('#message table').append(
                    '<tr><td>' + value.tafel_datum +
                    '</td><td>' + wochentag[value.tafel_wochentag] +
                    '</td><td>' + value.tafel_von +
                    '</td><td>' + value.tafel_bis +
                    '</td><td>' + value.tafel_lehrer +
                    '</td><td>' + value.tafel_longfach +
                    '</td><td>' + value.tafel_raum +
                    '</td></tr>');
            })
        } else {
            // Fehlermeldung ausgeben - Bootstrap alert Box
            $('#message').html('<div class="alert alert-warning">Wählen Sie eine Filiale aus ...</div>');
        }
    }).fail(function () {
        // Fehlermeldung ausgeben - Bootstrap alert Box
        $('#message').html('<div class="alert alert-danger">Fehler ... </div>');
    });
};

