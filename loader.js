Attendance.daysReservation = function ($res) {
    var $month = new Array(28).fill("");
    $($res).each(function (idx, val) {
        $month[val.key] = $res[idx];
    })
    return $month;
};
Attendance.initialize = function () {
    Attendance.statusBar('initializing . . . ', ' ','')
    var data = localStorage.getItem("staff"),
        rand_names=['majd haddad','liwa rezeg',"farah haddad",'wessam abdulrahman','ehsan haddad'];

    Attendance.staff = data ? staff : {users:Array.apply(null, Array(64)).map(function(val,idx){

            return {
                idx:idx,
                name: rand_names[(Math.floor(Math.random() * 4) + 0)],
                img:(Math.floor(Math.random() * 4) + 1)+'.jpg',
                shifts: [
                    "D1", "D2", "9", "D4"
                ],
                months: [{
                    days: Attendance.daysReservation([
                        // {key: Math.floor(Math.random() * 27) + 0  , val: "D1"},

                    ])
                }]
            };
        })}
    ;
}
;

