// 0. Button animation
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
        direction: 'right'
    });
});

// 1. Scraping button function
$(document.body).on("click", "#scraper", function () {
    $("#article_display").empty();
    $.ajax({
        method: "Get",
        url: "/scraping"
    })
        .then(function (result) {
            for (var i = 0; i < result.length; i++) {
                var article = $("<div class='col s4'>");
                var articleTop = $("<div class='row'>");
                var articleTopLeft = $("<div class='col s10'>");
                var articleTopRight = $("<div class='col s2'>");
                var articleTitle = $("<a href='" + result[i].link + "'><h3>" + result[i].articleTitle + "</h3></a>");
                var saveIcon = $("<i class='material-icons' id='save' data-id='" + result[i].id + "'>save</i>");
                var articleBody = $("<p>" + result[i].articleBody + "</p>");
                articleTopLeft.append(articleTitle);
                articleTopRight.append(saveIcon);
                articleTop.append(articleTopLeft).append(articleTopRight);
                article.append(articleTop).append(articleBody);
                $("#article_display").append(article);
            }
        });
});

// 2. Save article function
$(document.body).on("click", "#save", function () {
    $.ajax({
        method: "PUT",
        url: "/saveArticles/" + thisId
    })
        .then(function (err, res) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(res);
            }
        });
});

// 3. Delete scraped function
$(document.body).on("click", "#delete", function () {
    event.preventDefault();
    $.ajax({
        method: "DELETE",
        url: "/clearAll"
    })
        .then(function (err, res) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(res);
            }
            location.reload();
        });
});

// 4. List all saved articles
$.ajax({
    method: "GET",
    url: "/savedArticles"
})
    .then(function (result) {
        $("#warning").attr("style", "display: none;");
        $("#saved_article_display").empty();
        for (var i = 0; i < result.length; i++) {
            var article = $("<div class='col s4'>");
            var articleTop = $("<div class='row'>");
            var articleTopLeft = $("<div class='col s10'>");
            var articleTopRight = $("<div class='col s2'>");
            var articleTitle = $("<a href='" + result[i].link + "'><h3>" + result[i].articleTitle + "</h3></a>");
            var saveIcon = $("<i class='material-icons' id='remove' data-id='" + result[i].id + "'>delete</i> <i class='material-icons' id='note' data-id='" + result[i].id + "'>event_note</i>");
            var articleBody = $("<p>" + result[i].articleBody + "</p>");
            articleTopLeft.append(articleTitle);
            articleTopRight.append(saveIcon);
            articleTop.append(articleTopLeft).append(articleTopRight);
            article.append(articleTop).append(articleBody);
            $("#saved_article_display").append(article);
        }
    });


// 5. Unsave articles
$(document.body).on("click", "#remove", function () {
    $.ajax({
        method: "PUT",
        url: "/unsaveArticles/" + thisId
    })
        .then(function (err, res) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(res);
            }
            location.reload();
        });
});

// 6. Show note table
$(document.body).on("click", "#note", function(){
    $("#note_form").attr("style", "display: block;");
    

})


// 7. Post a note
$(document.body).on("click", "#submitBtn", function () {
    event.preventDefault();
    var newNote = {
        noteBody: $("#note_body").val().trim()
    };
    $.ajax({
        method: "POST",
        url: "/article/addNote/" + thisId,
        data: newNote
    })
        .then(function (err, res) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(res);
            }
        });
});

// 8. Delete a note
