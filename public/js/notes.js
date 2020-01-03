$(document).ready(function ()
{
    $("#home-page").on("click", function(event)
    {
        window.location.assign("/home");
    });

    $("#saved-articles").on("click", function(event)
    {
        window.location.assign("/saved");
    });
});