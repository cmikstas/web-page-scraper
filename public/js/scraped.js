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

    $(".save-article").on("click", function(event)
    {
        let topic = $(this).attr("topic-id");
        let title = $(this).attr("article-id");
        let link = $(this).attr("link-id");

        $.ajax("/api/savearticle",
        {
            type: "POST",
            data:
            { 
                topic: topic,
                title: title,
                link: link
            }
        })
        .then(function(data)
        {
                console.log(data);
        })
    });
});


