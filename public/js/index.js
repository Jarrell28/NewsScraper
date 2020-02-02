
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
            <li class='list-group-item bg-transparent border-none p-0 mb-5'>
            <h3 class='bg-danger text-white py-3 px-2 m-0'>${item.title}</h3>
            <p class='bg-white m-0 py-2 px-2'>${item.description}</p>
            </li>`;

            ul.append(listItem);
        })
    })
})