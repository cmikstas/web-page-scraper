$(document).ready(function ()
{
    const scrapeArticles = () =>
    {
        $("#start-scraping").on("click", function(event)
        {
            window.location.assign("/scrape");
        });
    }

    const goToSavedArticles = () =>
    {
        $("#saved-articles").on("click", function(event)
        {
            window.location.assign("/saved");
        });
    }

    scrapeArticles();
    goToSavedArticles();
});
