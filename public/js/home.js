$(document).ready(function ()
{
    $("#start-scraping").on("click", function(event)
    {
        window.location.assign("/scrape");
    });

    $("#saved-articles").on("click", function(event)
    {
        window.location.assign("/saved");
    });
});
