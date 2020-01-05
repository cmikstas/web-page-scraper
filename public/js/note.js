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

    $(".add-note").on("click", function(event)
    {
        let noteText = $("#note-text").val().trim();
        console.log(noteText);

        let articleId = $(this).attr("article-id");
        console.log(articleId);

        $.ajax("/note",
        {
            type: "POST",
            data:
            {
                articleId: articleId,
                body: noteText
            }
        })

    });

    $(".delete-note").on("click", function(event)
    {
        event.preventDefault();

        let articleId = $(".add-note").attr("article-id");
        console.log(articleId);

        let noteId = $(this).attr("note-id");
        console.log(noteId);

        $.ajax(
        {
            type: "delete",
            url: "/note/" + articleId + "/" + noteId
        })
        .then(function()
        {
            location.reload();
        });
    });
});