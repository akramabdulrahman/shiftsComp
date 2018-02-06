Attendance.fillTable = function () {
    Attendance.statusBar('filling the table . . . ', ' ', '')

    if (!Attendance.staff) {
        return;
    }
    console.log(Attendance.staff);
    var table = ich['staff-row'](Attendance.staff);
    $(Attendance.SELECTORS['MAIN_TABLE'] + ' tbody').append(table);


    Attendance.statusBar('idle', ' ', '')

}

Attendance.filterTable = function () {
    var search = $('#search-box').val();
    $('tbody tr th:first-child .username').each(function (idx, val) {
        if (!($(val).text().toLowerCase().indexOf(search.toLowerCase()) >= 0))
            $(this).closest('tr').fadeOut();

    })
    Attendance.statusBar($('tbody tr:visible').length, 'matching records found for query', search);
}

Attendance.resetFilter = function () {
    Attendance.statusBar('idle', ' ', '');
    $('tbody tr').fadeIn();
    $('#search-box').val('')
}



