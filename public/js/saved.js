$(document).ready(function ()
{
    $("#home-page2").on("click", function(event)
    {
        window.location.assign("/home");
    });

    let getArticles = function()
    {
        $.get("/savedArticles", function(data)
        {
            console.log(data);

            for (let i = 0; i < data.length; i++)
            {
                let topic = data[i].topic;
                let title = data[i].title;
                let link = data[i].link;
                let id = data[i]._id;

                //console.log(topic);
                //console.log(title);
                //console.log(link);

                let articleDiv = $("<div>")

                let li1 = $("<li>");
                li1.addClass("mt-3");

                let li2 = $("<li>");

                let li3 = $("<li>");
                li3.addClass("mb-1");

                let deleteBtn = $("<button>");
                let deleteBtnTxt = "Remove Article";
                deleteBtn.attr("type", "button");
                deleteBtn.addClass("btn btn-danger mb-3");
                deleteBtn.append(deleteBtnTxt);

                let notesBtn = $("<button>");
                let notesBtnTxt = "Article Notes";
                notesBtn.attr("type", "button");
                notesBtn.addClass("btn btn-primary mb-3 mr-2");
                notesBtn.append(notesBtnTxt);


                li1.append("<b>" + "Topic: " + "</b>" + topic);
                li2.append("<b>" + "Title: " + "</b>" + title);
                li3.append("<b>" + "Link: " + "</b>" + "<a href=" + link + ">" + link + "</a>");

                articleDiv.append(li1);
                articleDiv.append(li2);
                articleDiv.append(li3);
                articleDiv.append(notesBtn);
                articleDiv.append(deleteBtn);

                $("#saved-articles-list").append(articleDiv);

                notesBtn.on("click", function (event)
                {
                    window.location.assign("/article/" + id);
                });

                deleteBtn.on("click", function (event)
                {
                    let removeOption = $(this).parent();

                    removeOption.remove();

                    $.ajax(
                    {
                        type: "delete",
                        url: "/article/" + id
                    });

                });

            }
        });
    }

    getArticles();
});