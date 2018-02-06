Attendance.color_weekends = function () {
    var tds = $('.staff-row td');

    for (i = 5, j = 6; i < tds.length , j < tds.length; i += 7, j += 7) {
        const first = $(tds[i]).text(), second = $(tds[j]).text();
        $(tds[i]).addClass('col-division-left light-gray').html('<div class="content"> <span class="badge   badge-warning badge-center' + (!first.match(/\w/g) ? ' hidden' : '') + '">' + first + '</span> </div>')
        $(tds[j]).addClass('col-division-right light-gray').html('<div class="content"> <span class="badge   badge-warning badge-center' + (!second.match(/\w/g) ? ' hidden' : '') + '">' + second + '</span> </div>')
    }
}

Attendance.vacation = function () {

    $('.highlight .content .badge').html('')
    $('.highlight').toggleClass('vacation')

    Attendance.calculateHours($('.highlight').first().closest('tr'));
}

Attendance.calculateHours = function (tr) {
    var usr = tr.children('th').first(),
        tds = tr.children('td'), badges = [0, 0, 0, 0],
        chunk = 0, last3 = [];
    $(tr).find('td').removeClass('not-allowed');
    for (var i = 0; i < tds.length; i++) {
        if ($(tds[i]).find('.badge').text().match(/\w/g, '') ) {

            if (i < 7) {
                badges[0] += 12;
            }
            if (i < 14 && i > 6) {
                badges[1] += 12;
            }
            if (i < 21 && i > 13) {
                badges[2] += 12;
            }
            if (i < 28 && i > 20) {
                badges[3] += 12;
            }

            chunk++;
            last3.push(tds[i]);
            continue;
        }

        if (chunk > 4) {
            Attendance.alert('No More than 4 days in a row', 'hey there , ' +
                'you cant assign more than 4 days in a row in one week break them if you have to, ' +
                'just try not to break the 45 hours per week wage', 'error');
            $(last3).each(function (idx, val) {
                //   if ($(val).is('.highlight')) {
                $(val).addClass('not-allowed').removeClass('highlight')
                // }

            });

        }
        if ((chunk == 1)) {
            Attendance.alert('atleast 2 days in a row', 'hey there , ' +
                'you cant assign less than 2 days in a row in one week break them if you have to, ' +
                'just try not to break the 9 hours per week bare-minimum wage', 'error');
            $(last3).each(function (idx, val) {
                //       if ($(val).is('.highlight')) {
                $(val).addClass('not-allowed').removeClass('highlight')
                //         }
            });
        }
        chunk = 0;
        last3 = [];
    }
    Attendance.revokeNotAllowed(function (tds) {
        if ((tds && tds.length>4)) {

        } else {
            for (var i = 0; i < 4; i++) {
                var badge = $(usr).find('.badge-' + (i + 1)).first();
                if (badges[i] < 45) {
                    badge.removeClass('badge-light')
                    badge.addClass('badge-warning')
                } else {
                    badge.addClass('badge-light')
                    badge.removeClass('badge-warning')
                }
                badge.text(badges[i]);
            }
        }

    });



}
Attendance.setShift = function (shift) {
    $('.highlight').removeClass('vacation');
    $('.highlight .content .badge').html(shift).removeClass('highlight').removeClass('hidden')

    //hours per week

    Attendance.calculateHours($('.highlight').first().closest('tr'));
}

Attendance.statusBar = function (count, actionmessage, cause) {
    $('#search-status').html('<span class="font-weight-bold">' + count + '</span> ' + actionmessage + ' <span class="font-weight-bold">' + cause + '</span>');
}
Attendance.setAllowedShifts = function (shifts) {
    Attendance.allowedShifts = shifts;
}

Attendance.revokeNotAllowed = function (func, classes) {
    (function (feedback) {
        const classesExist = classes && classes.length,
            selection = classesExist ? classes.join(',') : '.not-allowed',
            tds = $(selection);
        classesExist ? $(classes).each(function (idx, selector) {
                tds.removeClass(selector.replace('.', ''));
            }) :
            tds.removeClass(selection.replace('.', ''));

        tds.find('.badge').html('');

        feedback(tds);
    })(function (data) {
        typeof func === "function" &&
        func(data);
    });
}

$(function () {
    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('.modal-title').text('New message to ' + recipient)
        modal.find('.modal-body input').val(recipient)
    })
    $('#set_vacation').click(Attendance.vacation);
    $('#set_single_shift').on('click', function (e) {
        var shift = $('#shifts_single_list').val();

        if (Attendance.allowedShifts.indexOf(shift) >= 0) {
            Attendance.setShift(shift);
        } else {
            Attendance.alert('Selected Shift is not allowed',
                'selected shift (' + shift + ') is not in the list of allowed shifts ',
                'error');
        }

    })

    $('#set_shifts').on('click', function () {
        Attendance.setAllowedShifts($('#shifts_list').val());
    })
    $('#shifts_list').on('change', function () {
        Attendance.setAllowedShifts($('#shifts_list').val());
    })
    $('#search-box').on('change', function (e) {
        e.stopPropagation();
        Attendance.filterTable();
    });
    $('#search-box').on('keydown', function (e) {
        if (e.keyCode == 27)
            Attendance.resetFilter();
    });


    Attendance.initialize();
    Attendance.fillTable();
    $('tbody tr').each(function (idx, val) {
        Attendance.calculateHours($(val));
    })
    Attendance.color_weekends();


})
$(document).ready(function () {

    var isMouseDown = false;
    var lastTr = -1;
    var isCtrlDown = false;


    $('body').on('keydown', function (e) {
        if (e.keyCode === 17)
            isCtrlDown = true;
    }).on('keyup', function (e) {
        if (e.keyCode === 17)
            isCtrlDown = false;
    })
    $('table').mousedown(function (e) {
        e.stopPropagation();
        isMouseDown = true;
        $('td').removeClass('highlight');
    })
        .mouseup(function (e) {
            e.stopPropagation();
            if (e.which == 1)
                if ($(e.target).hasAncestor('td').prop("tagName") == "TD") {

                    $('#exampleModal').modal('toggle');
                }

            isMouseDown = false;
        });
    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // E
    })

    $("table td").hover(function (e) {
        e.stopPropagation();

        var ctr = $(this).closest('tr').index();
        lastTr = lastTr === -1 ? ctr : lastTr;
        if (isMouseDown)
            if (lastTr !== ctr) {

                Attendance.statusBar('idle', ' ', '');
                $('td').removeClass('highlight');
            }
            else {
                $(this).addClass("highlight");
                Attendance.statusBar($('td.highlight').length, ' selected Cells', '');

            }

        lastTr = $(this).closest('tr').index();
    });

    $("table td").click(function (e) {
        $(e.target).toggleClass('highlight');
        Attendance.statusBar(1, ' selected Cell', '');


    });
});