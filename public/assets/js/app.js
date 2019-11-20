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
                var saveIcon = $("<i class='material-icons' id='save' data-id='" + result[i]._id + "'>save</i>");
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
            var saveIcon = $("<i class='material-icons' id='unsave' data-id='" + result[i]._id + "'>delete</i> <i class='material-icons' id='note' data-id='" + result[i]._id + "'>event_note</i>");
            var articleBody = $("<p>" + result[i].articleBody + "</p>");
            articleTopLeft.append(articleTitle);
            articleTopRight.append(saveIcon);
            articleTop.append(articleTopLeft).append(articleTopRight);
            article.append(articleTop).append(articleBody);
            $("#saved_article_display").append(article);
        }
    });


// 5. Unsave articles
$(document.body).on("click", "#unsave", function () {
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
$(document.body).on("click", "#note", function () {
    $("#note_form").attr("style", "display: block;");
    $a.jax({
        method: "GET",
        url: "/article/" + thisId
    })
        .then(function (result) {
            var noteList = $("<div class='row'>")
            var noteTopLeft = $("<div class='col s11'>");
            var noteTopRight = $("<div class='col s1'><i class='material-icons' id='escape'>clear</i></div>");
            var noteTitle = $("<h3> Note for: " + result._id + "</h3>")
            var hr = $("<hr>");
            var noteBody = $("<div clasee='note row'>");
            for (var i = 0; i < result.note[i]; i++) {
                var note = $("<div class='col s11'><p>" + result.note[i].body + "</p></div>");
                var icon = $("<div class='col s1'><i class='material-icons' id='delete' data-id='" + result.note[i]._id + "'>delete</i></div>")
                noteBody.append(note).append(icon);
            }
            noteTopLeft.append(noteTitle);
            noteList.append(noteTopLeft).append(noteTopRight).append(hr).append(noteBody);
            $("#note_list").append(noteList);
        });
});

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
            location.reload();
        });
});

// 8. Delete a note
$(document.body).on("click", "#delete", function () {
    $.ajax({
        method: "DELETE",
        url: "/article/deleteNote/" + thisId
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
})

// 9. Close note list
$(document.body).on("click", "#escape", function () {
    $("#note_form").attr("style", "display: none;");
});