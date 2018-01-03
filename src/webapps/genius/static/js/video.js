function tplawesome(e, t) {
    res = e;
    for (var n = 0; n < t.length; n++) {
        res = res.replace(/\{\{(.*?)\}\}/g, function (e, r) {
            return t[n][r]
        })
    }
    return res
}


$(function () {
    $("form").on("submit", function (e) {
        e.preventDefault();
        // prepare the request
        var mynode = document.getElementById("results");
        while (mynode.firstChild) {
            mynode.removeChild(mynode.firstChild);
        }
        var listnode = document.getElementById("lists");
        while (listnode.firstChild) {
            listnode.removeChild(listnode.firstChild);
        }
        var newlistnode = document.getElementById("recommendationLists");
        while (newlistnode.firstChild) {
            newlistnode.removeChild(newlistnode.firstChild);
        }
        $('#hiddenText').hide();
        $('#hiddenText2').hide();
        rate_value = "relevance";
        if (document.getElementById('r1').checked) {
            rate_value = document.getElementById('r1').value;
        } else if (document.getElementById('r2').checked) {
            rate_value = document.getElementById('r2').value;
        }
        console.log(rate_value);
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($("#search").val() + "children").replace(/%20/g, "+"),
            maxResults: 3,
            order: rate_value,
            safeSearch: "strict",
            publishedAfter: "2015-01-01T00:00:00Z"
        });
        // execute the request
        request.execute(function (response) {
            var results = response.result;
            $("#results").html("");
            $.each(results.items, function (index, item) {
                $.get("../static/tpl/item.html", function (data) {
                    $("#results").append(tplawesome(data, [{"title": item.snippet.title, "videoid": item.id.videoId}]));
                });
            });
           // resetVideoHeight();
        });
    });

  //  $(window).on("resize", resetVideoHeight);
});

function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9 / 16);
}

sum = 0;
sumN = 1;
//var nextPageToken;
var dict = {};

dict["Math"] = "PLX2qyyY1nZsNBo0OPd_q5QkRX62uAv29V";
dict["Physics"] = "PLRSIe0MUxDndmkA4PyU-Zw6mNKVVcIXE8";
dict["Song"] = "PLQiKLJnked46Yrvp3mj7_vLwuwZkF21Lh"
dict["Dance"] = "PLQiKLJnked44MKxmCJ73-MaKEPIShe5wl"
dict["Story"] = "PLQiKLJnked46p1c8ZyY6NGlebzcCg2Ro4"

function test(val) {
    console.log(val)
}

function updateVideo(val, title) {
    console.log(val)
    console.log(title)
    var mynode = document.getElementById("results");
    while (mynode.firstChild) {
        mynode.removeChild(mynode.firstChild);
    }
    $.get("../static/tpl/item.html", function (data) {
        $("#results").append(tplawesome(data, [{"title": title, "videoid": val}]));
    });
    // resetVideoHeight();
}

function getVids(val) {
    $('#hiddenText').show();
    $('#hiddenText2').show();
    sum = 0;
    sumN = 0;
    console.log(val)
    pid = dict[val];
    /*
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent(val + "children").replace(/%20/g, "+"),
            maxResults: 6,
            order: "rating",
            safeSearch: "strict",
            publishedAfter: "2015-01-01T00:00:00Z"
        });
        // execute the request
        request.execute(function (response) {
            var results = response.result;
            var mynode = document.getElementById("recommendationLists");
            while (mynode.firstChild) {
                mynode.removeChild(mynode.firstChild);
            }
            $.each(results.items, function (index, item) {
                $.get("../static/tpl/list.html", function (data) {
                    $("#recommendationLists").append(tplawesome(data, [{"title": item.snippet.title, "videoid": item.snippet.resourceId.videoId}]));
                });
            });
            //resetVideoHeight();
        });*/
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet',
            maxResults: 3,
            q: encodeURIComponent(val + "kids").replace(/%20/g, "+"),
            safeSearch: "strict",
            order: "date",
            //  pageToken : PageToken,
            key: 'AIzaSyAbwO5vDKTpJvq2OHmjWDQZJgSv4vH4Lgo'
        },
        function (data) {
            getRecommend(data);
        }
    );
    $.get(
        "https://www.googleapis.com/youtube/v3/playlistItems", {
            part: 'snippet',
            maxResults: 50,
            playlistId: pid,
            //  pageToken : PageToken,
            key: 'AIzaSyAbwO5vDKTpJvq2OHmjWDQZJgSv4vH4Lgo'
        },
        function (data) {
            myPlan(data);
        }
    );
}

function getRecommend(data) {
    var mynode = document.getElementById("recommendationLists");
    while (mynode.firstChild) {
        mynode.removeChild(mynode.firstChild);
    }
    $.each(data.items, function (index, item) {

        $.get("../static/tpl/list.html", function (data) {
            $("#recommendationLists").append(tplawesome(data, [{
                "title": item.snippet.title,
                "videoid": item.id.videoId
            }]));
        });

    });
}

function myPlan(data) {
    total = data.pageInfo.totalResults;
    //  nextPageToken=data.nextPageToken;
    var mynode = document.getElementById("results");
    while (mynode.firstChild) {
        mynode.removeChild(mynode.firstChild);
    }
    var listnode = document.getElementById("lists");
    while (listnode.firstChild) {
        listnode.removeChild(listnode.firstChild);
    }
    //  for(i=0;i<data.items.length;i++){
    $.each(data.items, function (index, item) {
        sum++;
        sumN++;
        console.log("SUM")
        console.log(sum)
        if (sum == 1) {
            $.get("../static/tpl/item.html", function (data) {
                $("#results").append(tplawesome(data, [{
                    "title": item.snippet.title,
                    "videoid": item.snippet.resourceId.videoId
                }]));
            });
            $.get("../static/tpl/list.html", function (data) {
                $("#lists").append(tplawesome(data, [{
                    "title": item.snippet.title,
                    "videoid": item.snippet.resourceId.videoId
                }]));
            });
        }
        else {
            $.get("../static/tpl/list.html", function (data) {
                $("#lists").append(tplawesome(data, [{
                    "title": item.snippet.title,
                    "videoid": item.snippet.resourceId.videoId
                }]));
            });
        }
    });
    //  resetVideoHeight();
}

function init() {
    gapi.client.setApiKey("AIzaSyAbwO5vDKTpJvq2OHmjWDQZJgSv4vH4Lgo");
    gapi.client.load("youtube", "v3", function () {
        // yt api is ready
    });
}
