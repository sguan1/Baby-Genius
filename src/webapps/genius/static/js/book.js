/**
 * Created by WangZheng on 11/5/17.
 */
//To wait for the document fully loaded and ready before to start working with it.
// document start

$(document).ready(function () {// jQuery methods go here
// This is to prevent any jQuery code from running before the document is finished loading (is ready).
    $("input").focus(function () {
        $(this).css("border", "2px solid #ef812f");
    });


    /* main fuction holds all the function
     in this file */
    function bookSearch(e) {
        e.preventDefault(); // to stop the browser refreshing when a search input is submitted

        var search = document.getElementById('search').value; // getting input value title or author

        document.getElementById('search').value = "";
        document.getElementById("results").innerHTML = "";  // empty the content for a new search
        document.getElementById("book-box").innerHTML = "";
        document.getElementById("sort-box").innerHTML = "";

        /* Ajax request

         */
        $.ajax({
            url: "https://www.googleapis.com/books/v1/volumes?q=" + search + "&orderBy=relevance",
            dataType: "json",

            success: function (data) {

                var smallArray = [];
                var bigArray = [];
// for loop to extract the data from the ajax request
                for (i = 0; i < data.items.length; i++) {
                    var title = data.items[i].volumeInfo.title;

                    var author = data.items[i].volumeInfo.authors;
                    var subject = data.items[i].volumeInfo.categories[0];

                    var publishedDate = data.items[i].volumeInfo.publishedDate;
                    var publisher = data.items[i].volumeInfo.publisher;
                    var isbn = data.items[i].volumeInfo.industryIdentifiers[0].identifier;
                    var numberOfPages = data.items[i].volumeInfo.pageCount;

                    var cover = data.items[i].volumeInfo.imageLinks["thumbnail"];
                    var infoLink = data.items[i].volumeInfo.infoLink;

                    smallArray.push(title, author, publishedDate, publisher, isbn, numberOfPages, infoLink, cover); // changing the data into array of arrays
                    bigArray.push(smallArray);
                    smallArray = [];
// row for each loop
                    $('.results').append("<div class='row result-row' style='margin-top: 10px'> \
<div class = 'col-md-4'> <h3> " + title + " </h3></div> \
<div class = 'col-md-4'> <h4> " + author + " </h4> <h5> Year: " + publishedDate + " </h5> <h5> Category: " + subject + " </h5><h5> Publisher: " + publisher + " </h5> <h5>ISBN " + isbn + " </h5><h5>Pages :" + numberOfPages + " </h5> </div>\
<div class = 'col-md-4'><a href = '" + infoLink + "' target='_blank'><img src = " + cover + "/></a> <hr></div> \
</div>");

                }

//variables to access the buttons
                var buttonTitle = document.getElementById("button-title");
                var buttonAuthor = document.getElementById("button-author");
                var buttonYear = document.getElementById("button-year");

// sorting by title function
                buttonTitle.onclick = function () {
                    document.getElementById("results").innerHTML = "";
                    function comparatorTitle(a, b) {
                        if (b[0] > a[0]) return 1;
                        if (b[0] < a[0]) return -1;
                        return 0;
                    }

                    bigArray.sort();
                    for (var i = 0; i < bigArray.length; i++) {
                        $('.results').append("<div class='row result-row'> \
               <div class = 'col-md-4'> <h3>" + bigArray[i][0] + " </h3></div> \
               <div class = 'col-md-4'> <h4>" + bigArray[i][1] + " </h4> <h5> Year: " + bigArray[i][2] + " </h5><h5> Publisher: " + bigArray[i][3] + " </h5> <h5>ISBN: " + bigArray[i][4] + " </h5><h5>Pages :" + bigArray[i][5] + " </h5> </div>\
               <div class = 'col-md-4'><a href = '" + bigArray[i][6] + "' target='_blank'> <img src = '" + bigArray[i][7] + "'/></a> <hr></div> \
               </div>");

                    }

                }
// sorting by author function
                buttonAuthor.onclick = function () {
                    document.getElementById("results").innerHTML = "";
                    function comparatorAuthor(a, b) {
                        if (b[1] > a[1]) return -1;
                        if (b[1] < a[1]) return 1;
                        return 0;
                    }

                    bigArray.sort(comparatorAuthor);
                    for (var i = 0; i < bigArray.length; i++) {
                        $('.results').append("<div class='row result-row'> \
               <div class = 'col-md-4'> <h3> " + bigArray[i][0] + " </h3></div> \
               <div class = 'col-md-4'> <h4>" + bigArray[i][1] + " </h4> <h5> Year: " + bigArray[i][2] + " </h5><h5> Publisher: " + bigArray[i][3] + " </h5> <h5>ISBN: " + bigArray[i][4] + " </h5><h5>Pages :" + bigArray[i][5] + " </h5> </div>\
               <div class = 'col-md-4'><a href = '" + bigArray[i][6] + "' target='_blank'> <img src = '" + bigArray[i][7] + "'/></a><hr> </div> \
               </div>");

                    }

                }

// sorting by year function
                buttonYear.onclick = function () {
                    document.getElementById("results").innerHTML = "";

                    function comparatorYear(a, b) {
                        if (b[2] > a[2]) return 1;
                        if (b[2] < a[2]) return -1;
                        return 0;
                    }

                    bigArray.sort(comparatorYear);
                    for (var i = 0; i < bigArray.length; i++) {

                        $('.results').append("<div class='row result-row'> \
               <div class = 'col-md-4'> <h3> " + bigArray[i][0] + " </h3></div> \
               <div class = 'col-md-4'> <h4>" + bigArray[i][1] + " </h4> <h5> Year: " + bigArray[i][2] + " </h5><h5> Publisher: " + bigArray[i][3] + " </h5> <h5>ISBN: " + bigArray[i][4] + " </h5><h5>Pages :" + bigArray[i][5] + " </h5> </div>\
               <div class = 'col-md-4'><a href = '" + bigArray[i][6] + "' target='_blank'> <img src = '" + bigArray[i][7] + "'/></a><hr> </div> \
               </div>");

                    }
                }

            },
            type: 'GET'
        });
    }

    document.getElementById('button').addEventListener('click', bookSearch, false); // calling the main function

//document ready end

})