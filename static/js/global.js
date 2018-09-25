var input
if (input = document.getElementById('numInput')) {
    function prevent(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false
    }
    function digitInput(el, e) {
        var ee = e || window.event
        var c = e.charCode || e.keyCode
        var val = el.value
        if (c == 110 || c == 190) {
            (val.indexOf('.') >= 0 || !val.length) && prevent(e)
        } else {
            if ((c != 8 && c != 46 && (c < 37 || c > 40) && (c < 48 || c > 57) && (c < 96 || c > 105)) || e.shiftKey) {
                prevent(e)
            }
        }
    }

    input.keydown(function (e) {
        digitInput(this, e)
    })
}
