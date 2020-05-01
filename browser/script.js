$(document).ready(function () {
    $('#selected').hide();
    $('.final').hide();
    $('#go').click(function (e) {
        var url = ($('#inputUrl').val());

        if (url.indexOf('http') == 0) {
            $('#selected').show();
            $('#url').text(url);

            $.ajax({
                method: 'GET',
                url: `/pdf?url=${url}`,
                context: document.body
            }).done(function(data) {
                $('.final').show();
            });
        } else {
            alertify.alert('Error', 'Please enter a valid link to continue');
        }
    });
});