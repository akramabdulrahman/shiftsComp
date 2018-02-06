Attendance.SELECTORS = {
    'MAIN_TABLE':'#',
    'WEEK_TITLE':'#week-title',
    'MAIN_TABLE':'#mainTable'

};

$.fn.hasAncestor = function(a) {
    return this.filter(function() {
        return !!$(this).closest(a).length;
    });
};