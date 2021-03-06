Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};
wochentag = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
let date = new Date();
const dateTodayWKw = new Date().getWeekNumber() + "-" + date.getFullYear();
let weekToday = new Date().getWeekNumber();
let yearToday = date.getFullYear();
//DOM ready - Shorthand
$(document).ready(function () {
    // Ajax Request
    $.getJSON("http://sandbox.gibm.ch/berufe.php").done(function (data) {
        // loop über JSON-Array
        $.each(data, function (key, value) {
            if (localStorage.getItem('idBeruf') == value.beruf_id) {
                $('#beruf').append('<option value=' + value.beruf_id + ' selected>' + value.beruf_name + '</option>');
            } else {
                if (value.beruf_name == '') {
                    $('#beruf').append('<option value=' + value.beruf_id + '>Bitte Beruf wählen</option>')
                } else {
                    $('#beruf').append('<option value=' + value.beruf_id + '>' + value.beruf_name + '</option>')
                }
            }
        })
    }).fail(function () {
        // Fehlermeldung ausgeben - Bootstrap alert Box
        $('#message').html('<div class="alert alert-danger">Fehler getBerufe </div>');
    });

    if (localStorage.getItem('idBeruf')) {
        getKlasseById(localStorage.getItem('idBeruf'));
    }

    if (localStorage.getItem('idKlasse')) {
        getKalenderFromDate(localStorage.getItem('idKlasse'), dateTodayWKw, date);
    }

    // Change Handler
    $('#beruf').change(function (e) {
        localStorage.setItem('idBeruf', this.value);
        getKlasseById(this.value)
    });

    // Change Handler
    $('#klasse').change(function (e) {
        localStorage.setItem('idKlasse', this.value);
        getKalenderFromDate(this.value, dateTodayWKw, date);
    });

});

function getKlasseById(idKlasse) {
    $('#message').empty();
    $('#klasse').empty();
    $.ajax({
        type: "GET",
        url: "http://sandbox.gibm.ch/klassen.php",
        data: { format: 'json', beruf_id: idKlasse },
        dataType: 'json'
    }).done(function (data) {
        // loop über JSON-Array
        if (data != '') {
            $('#klassenlabel').removeClass('d-none');
            $('#klasse').removeClass('d-none');
            $.each(data, function (key, value) {
                if (localStorage.getItem('idKlasse') == value.klasse_id) {
                    $('#klasse').append('<option value=' + value.klasse_id + ' selected>' + value.klasse_name + '</option>');
                } else {
                    $('#klasse').append('<option value=' + value.klasse_id + '>' + value.klasse_name + '</option>');
                }
            })
        } else {
            $('#message').html('<div class="alert alert-danger">Keine Klasse gefunden </div>');
        }
    }).fail(function () {
        // Fehlermeldung ausgeben - Bootstrap alert Box
        $('#message').html('<div class="alert alert-danger">Fehler getKlassen </div>');
    });
}

function getKalenderFromDate(value, wwYYYY, date) {
    $('#message').empty();
    createTabelehead(wwYYYY);
    // Ajax Request
    $.ajax({
        type: "GET",
        url: "https://sandbox.gibm.ch/tafel.php",
        data: { format: 'json', klasse_id: value, woche: wwYYYY },
        dataType: 'json'
    }).done(function (data) {
        if (data != '') {
            $('#message').append('<table class="table table-responsive table-hover table-dark"><tr><th>Datum</th><th>Wochentag</th><th>Von</th><th>Bis</th><th>Lehrer</th><th>Fach</th><th>Raum</th></tr></table>');
            $.each(data, function (key, value) {
                createMessageTable(value);
            });
        } else {
            // Fehlermeldung ausgeben - Bootstrap alert Box
            $('#message').append('</br><div class="alert alert-warning">Keine Daten gefunden </div>');
        }
        document.getElementById('back').addEventListener('click', function (event) {
            date.setDate(date.getDate() - 7)
            getKalenderFromDate(value, getDateWWYYYY(), date);
        });
        document.getElementById('next').addEventListener('click', function (event) {
            date.setDate(date.getDate() + 7)
            getKalenderFromDate(value, getDateWWYYYY(), date);
        });
    }).fail(function () {
        // Fehlermeldung ausgeben - Bootstrap alert Box
        $('#message').html('<div class="alert alert-danger">Fehler GetKalender </div>');
    });
};

function createMessageTable(value) {
    $('#message table').append(
        '<tr><td>' + value.tafel_datum +
        '</td><td>' + wochentag[value.tafel_wochentag] +
        '</td><td>' + value.tafel_von +
        '</td><td>' + value.tafel_bis +
        '</td><td>' + value.tafel_lehrer +
        '</td><td>' + value.tafel_longfach +
        '</td><td>' + value.tafel_raum +
        '</td></tr>');
}

function createTabelehead(wwYYYY) {
    $('#message').append('<div class="d-flex justify-content-center"><nav aria-label="Page navigation example"><ul class="pagination"><li class="page-item"><button id="back" class="page-link" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li><li class="page-item disabled"><a class="page-link" >KW ' + wwYYYY +
        '</button></a></li><li  class="page-item"><button id="next" class="page-link" aria-label="Next"><span aria-hidden="true">&raquo;</span></button></li></ul></nav></div></br>');
}

function getDateWWYYYY() {
    return date.getWeekNumber() + "-" + date.getFullYear();
}