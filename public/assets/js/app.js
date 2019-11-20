// 0. Button animation
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
        direction: 'left'
    });
});

// 1.1 Get all scraped articles
$.ajax({
    method: "Get",
    url: "/scraping/all/articles"
})
    .then(function (result) {
        $("#article_display").empty();
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

// 2. Save article function
$(document.body).on("click", "#save", function () {
    var id = $(this).data("id");
    console.log(id);
    $.ajax({
        method: "PUT",
        url: "/saveArticles/" + id
    })
        .then(function (res) {
            console.log(res);
        });
});

// 3. Delete scraped function
$(document.body).on("click", "#delete", function () {
    event.preventDefault();
    $.ajax({
        method: "DELETE",
        url: "/clearAll"
    })
        .then(function (res) {
            console.log(res);
            location.reload();
        });
});

// 4. List all saved articles
$.ajax({
    method: "GET",
    url: "/savedArticles"
})
    .then(function (result) {
        console.log(result);
        $("#warning").attr("style", "display: none;");
        $("#saved_article_display").empty();
        for (var i = 0; i < result.length; i++) {
            var article = $("<div class='col s4'>");
            var articleTop = $("<div class='row'>");
            var articleTopLeft = $("<div class='col s10'>");
            var articleTopRight = $("<div class='col s2'>");
            var articleTitle = $("<a href='" + result[i].link + "'><h3>" + result[i].articleTitle + "</h3></a>");
            var saveIcon = $("<i class='material-icons' id='unsave' data-id='" + result[i]._id + "'>delete</i> <i class='material-icons' id='note' data-id='" + result[i]._id + "' note-id='" + result[i].note + "'>event_note</i>");
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
    var id = $(this).data("id");
    $.ajax({
        method: "PUT",
        url: "/unsaveArticles/" + id
    })
        .then(function (res) {
            console.log(res);
            location.reload();
        });
});

// 6. Show note table
$(document.body).on("click", "#note", function () {
    $("#note_form").attr("style", "display: block;");
    var id = $(this).data("id");
    $("#submitBtn").attr("data-id", id);
    var noteId = $(this).attr("note-id");
    $("#deleteBtn").attr("data-id", noteId);
    $.ajax({
        method: "GET",
        url: "/article/" + id
    })
        .then(function (result) {
            $("#note_list").empty();
            console.log(result);
            var noteList = $("<div class='row'>")
            var noteTopLeft = $("<div class='col s11'>");
            var noteTopRight = $("<div class='col s1'><i class='material-icons' id='escape'>clear</i></div>");
            var noteTitle = $("<h5> Note for: " + result._id + "</h5>");
            noteTopLeft.append(noteTitle);
            noteList.append(noteTopLeft).append(noteTopRight);
            $("#note_list").append(noteList);
            console.log(result.note);
            if (result.note) {
                $("#note_body").val(result.note.body);
            }
            else {
                $("#note_body").val("Please enter note here");
            }
        });
});

// 7. Post a note
$(document.body).on("click", "#submitBtn", function (event) {
    event.preventDefault();
    var newNote = {
        body: $("#note_body").val().trim()
    };
    var id = $(this).data("id");
    $.ajax({
        method: "POST",
        url: "/article/addNote/" + id,
        data: newNote
    })
        .then(function (res) {
            console.log(res);
        });
});

// 8. Delete a note
$(document.body).on("click", "#deleteBtn", function () {
    var id = $(this).data("id");
    $.ajax({
        method: "DELETE",
        url: "/article/deleteNote/" + id
    })
        .then(function (res) {
            console.log(res);
            location.reload();
        });
})

// 9. Close note list
$(document.body).on("click", "#escape", function () {
    $("#note_form").attr("style", "display: none;");
});