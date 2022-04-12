
const warning = document.getElementById('warning');

function closeWarning() {
    warning.style.background = "#fff";
    warning.style.left = "-5000px";
    setTimeout(() => warning.style.display = "none", 600);
}



$(function () {
    $("#tagCloud a").tagcloud({
        size: {
            start: 12,
            end: 36,
            unit: "px"
        },
        color: {
            start: '#889099',
            end: '#000'
        }

    });
});