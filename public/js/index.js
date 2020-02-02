
//Button Scraper Event Listener
$("#btn-scraper").on("click", () => {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(result => {
        console.log(result);

        const ul = $(".article-list");
        ul.empty();

        result.forEach(item => {
            const listItem = `
            <li class='list-group-item bg-transparent border-0 p-0 mb-5'>
            <div class='d-flex justify-content-between align-items-center bg-danger px-2'>
            <h3 class='text-white py-3  m-0 h4'>${item.title}</h3>
            <button class='btn btn-outline-light btn-save'>Save Article</button>
            </div>
            <p class='bg-white m-0 py-3 px-2'>${item.description}</p>
            </li>`;

            ul.append(listItem);
        });

        $("#popup .modal-body").html(`<h4 class='text-center py-3'>Scraped ${result.length} articles!</h4>`);
        $("#popup-btn").trigger("click");

    })
})

//Save Article Event Listener
$(".article-list").on("click", ".btn-save", function () {
    const article = {};
    article.title = $(this).prev().text();
    article.description = $(this).parent().next().text();
    article.notes = [];

    $.ajax({
        method: "POST",
        url: "/saved",
        data: article
    }).then(response => {
        if (response.success) {
            $("#popup .modal-body").html(`<h4 class='text-center py-3'>Saved Article!</h4>`);
            $("#popup-btn").trigger("click");
        }

    })
});

$(".article-list").on("click", ".btn-delete", function () {
    const id = $(this).parent().data("id");

    $.ajax({
        method: "DELETE",
        url: "/saved/" + id,
    }).then(response => {
        if (response.success) {
            $(this).parent().parent().parent().remove();
        }

    })
});

$(".article-list").on("click", ".btn-article", function () {
    const id = $(this).parent().data("id");

    $.ajax({
        method: "GET",
        url: "/saved/" + id,
    }).then(response => {
        if (response.success) {
            const data = response.data;

            $("#noteForm").attr("data-id", data._id);
            $("#modal-article .modal-title").text(data.title);
            if (data.notes.length) {
                $("#noteList").empty();

                data.notes.forEach(note => {
                    const noteHtml = `
                    <li class="list-group-item d-flex justify-content-between">${note.note} 
                    <button class='btn btn-sm btn-danger btn-delete-note' data-id=${note._id}>X</button>
                    </li>`
                    $("#noteList").append(noteHtml);
                })
            } else {
                $("#noteList").html('<li class="list-group-item text-center">No Notes for this Article</li>');
            }


            $("#btn-view").trigger("click");
        }

    })
});

$("#noteForm").on("submit", function (e) {
    e.preventDefault();

    const newNote = $("#articleNote").val();
    const id = $(this).data("id");

    if (newNote) {
        $.ajax({
            method: "PUT",
            url: "/saved/" + id,
            data: { newNote }
        }).then(response => {

            if (response.success) {
                $("#articleNote").val("");

                $("#noteList").empty();

                response.data.notes.forEach(note => {
                    const noteHtml = `
                    <li class="list-group-item d-flex justify-content-between">${note.note} 
                    <button class='btn btn-sm btn-danger btn-delete-note' data-id=${note._id}>X</button>
                    </li>`
                    $("#noteList").append(noteHtml);
                })
            }
        })
    }
});

$("#noteList").on("click", ".btn-delete-note", function () {
    const id = $(this).data("id");

    $.ajax({
        method: "DELETE",
        url: "/saved/delete-note/" + id
    }).then(response => {
        if (response.success) {
            $(this).parent().remove();
        }
    })
})
