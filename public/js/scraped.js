$(document).ready(function ()
{
    const goToHome = () =>
    {
        $("#home-page").on("click", function(event)
        {
            window.location.assign("/home");
        });
    }

    const goToSavedArticles = () =>
    {
        $("#saved-articles").on("click", function(event)
        {
            window.location.assign("/saved");
        });
    }

    const saveArticle = () =>
    {
        $(".save-article").on("click", function(event)
        {
            let topic = $(this).attr("topic-id");
            let title = $(this).attr("article-id");
            let link = $(this).attr("link-id");
            let button = $(this); // It took me much aggravation to figure this part out...
            let buttonSpot = $(this).parent();
    
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
    
                button.remove(); // It took me much aggravation to figure this part out...
    
                let alreadySelected = $("<p>");
                alreadySelected.addClass("mt-2 mb-2 text-danger");
                alreadySelectedText = "Article Saved";
    
                alreadySelected.append(alreadySelectedText);
                buttonSpot.append(alreadySelected);
    
            })
        });
    }

    goToHome();
    goToSavedArticles();
    saveArticle();
});


