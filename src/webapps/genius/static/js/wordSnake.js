var l, n, m, IsOver = true, Size = 7, StartTime, EndTime, Type = 0, I_Sel, J_Sel, TimeString = "00:00:00";
var Alphabet = " abcdefghijklmnopqrstuvwxyz";
var Dice = "aaaaaabbcccddeeeeeeeeeffgghhhiiiiijklllmmnnnnnoooooppqrrrrrrssssttttttuuvwwxyz";
console.log(Dice.length);
Pic = new Array(30);
Pic[0] = new Image();
Pic[0].src = "/static/images/" + "Word.GIF";
//26 alphabets
for (n = 1; n < 30; n++) {
    Pic[n] = new Image();
    if (n == 27) {
        Pic[27].src = "/static/images/word_red.GIF";
        continue;
    }
    if (n == 28) {
        Pic[28].src = "/static/images/word_orange.GIF";
        continue;
    }
    if (n == 29) {
        Pic[29].src = "/static/images/word_yellow.GIF";
        continue;
    }
    picName = 'word_' + Alphabet.charAt(n) + '.GIF';
    Pic[n].src = "/static/images/" + picName;
}

//Pic[27].src = "/static/images/word_red.GIF";
/*Pic[28].src = "/static/images/word_orange.GIF";
 Pic[29].src = "/static/images/word_yellow.GIF";
 console.log("here");*/
// 13 * 13, board size
Fld = new Array(Size + 1);
for (n = 0; n < Size + 1; n++)
    Fld[n] = new Array(Size);
for (n = 0; n < Size + 1; n++) {
    for (m = 0; m < Size; m++) {
        Fld[n][m] = 0;
    }
}

bonus = new Array(Size);
for (n = 0; n < Size; n++)
    bonus[n] = new Array(Size);

//self defined some bonus place
Fld[Math.floor(Size / 2)][Math.floor(Size / 2)] = 27;
Fld[0][Size - 1] = 28;
Fld[Size - 1][0] = 28;
Fld[0][0] = 28;
Fld[Size - 1][Size - 1] = 28;
Fld[Math.floor(Size / 4)][Math.floor(Size / 4)] = 29;
Fld[Math.floor(Size / 4)][Math.floor(Size / 4 + Size / 2)] = 29;
Fld[Math.floor(Size / 2 + Size / 4)][Math.floor(Size / 4)] = 29;
Fld[Math.floor(Size / 2 + Size / 4)][Math.floor(Size / 4 + Size / 2)] = 29;

Card = new Array(Size);
for (n = 0; n < Size; n++)
    Card[n] = 0;

/*
 Fld[3][2]=20;
 Fld[3][3]=8;
 Fld[3][4]=5;
 Fld[3][6]=17;
 Fld[3][7]=21;
 Fld[3][8]=9;
 Fld[3][9]=3;
 Fld[3][10]=11;
 Fld[2][7]=10;
 Fld[4][7]=13;
 Fld[5][7]=16;
 Fld[6][7]=19;
 Fld[6][1]=2;
 Fld[6][2]=18;
 Fld[6][3]=15;
 Fld[6][4]=23;
 Fld[6][5]=14;
 Fld[7][3]=22;
 Fld[8][3]=5;
 Fld[9][3]=18;
 Fld[8][1]=20;
 Fld[8][2]=8;
 Fld[9][7]=6;
 Fld[9][8]=15;
 Fld[9][9]=24;
 Fld[8][8]=4;
 Fld[10][8]=7;
 Fld[8][5]=12;
 Fld[9][5]=1;
 Fld[10][5]=26;
 Fld[11][5]=25;*/
function checkBonusPlace(i, j, Fld) {
    if (i == Math.floor(Size / 2) && j == Math.floor(Size / 2)) {
        Fld[i][j] = 27;
    }
    if (i == 0 && j == Size - 1) {
        Fld[i][j] = 28;
    }
    if (i == Size - 1 && j == 0) {
        Fld[i][j] = 28;
    }
    if (i == 0 && j == 0) {
        Fld[i][j] = 28;
    }
    if (i == Size - 1 && j == Size - 1) {
        Fld[i][j] = 28;
    }
    if (i == Math.floor(Size / 4) && j == Math.floor(Size / 4)) {
        Fld[i][j] = 29;
    }
    if (i == Math.floor(Size / 4) && j == Math.floor(Size / 2 + Size / 4)) {
        Fld[i][j] = 29;
    }
    if (i == Math.floor(Size / 4 + Size / 2) && j == Math.floor(Size / 4)) {
        Fld[i][j] = 29;
    }
    if (i == Math.floor(Size / 2 + Size / 4) && j == Math.floor(Size / 4 + Size / 2)) {
        Fld[i][j] = 29;
    }
}


function LettersInit() {
    var nn, nn_aeiou, nn_u, nn_q, rr;
    do {
        nn_aeiou = 0;
        nn_u = 0;
        nn_q = 0;
        for (nn = 0; nn < Size; nn++) {
            rr = Math.floor(Math.random() * 1000) % 78;
            console.log("rr " + rr);
            Card[nn] = 1 + Dice.charCodeAt(rr) - 97;
            if (Dice.charAt(rr) == "a") nn_aeiou++;
            if (Dice.charAt(rr) == "e") nn_aeiou++;
            if (Dice.charAt(rr) == "i") nn_aeiou++;
            if (Dice.charAt(rr) == "o") nn_aeiou++;
            if (Dice.charAt(rr) == "u") nn_u++;
            if (Dice.charAt(rr) == "q") nn_q++;
        }
        nn_aeiou += nn_u;
    }
    while ((nn_q > nn_u) || (nn_aeiou < 4) || (nn_aeiou > 8));
}

function Timer() {
    var ii, jj, ss = "";
    if (IsOver) return;
    Now = new Date();
    EndTime = Now.getTime() / 1000;
    ii = Math.floor(EndTime - StartTime);
    jj = ii % 60;
    ss = eval(jj);
    if (jj < 10) ss = "0" + ss;
    ii -= jj;
    ii /= 60;
    jj = ii % 60;
    ss = eval(jj) + ":" + ss;
    if (jj < 10) ss = "0" + ss;
    ii -= jj;
    ii /= 60;
    jj = ii % 24;
    ss = eval(jj) + ":" + ss;
    if (jj < 10) ss = "0" + ss;
    window.document.OptionsForm.Time.value = ss;
    TimeString = ss;
}

function Clicked(ii, jj) {
    if (IsOver) return;
    if (I_Sel < 0) {
        if (Fld[ii][jj] == 0) return;
        I_Sel = ii;
        J_Sel = jj;
        return;
    }
    if (Fld[ii][jj] > 0 && Fld[ii][jj] < 27) {
        I_Sel = ii;
        J_Sel = jj;
        return;
    }
    Fld[ii][jj] = Fld[I_Sel][J_Sel];

    Fld[I_Sel][J_Sel] = 0;
    checkBonusPlace(I_Sel, J_Sel, Fld);
    RefreshPic(ii, jj);
    RefreshPic(I_Sel, J_Sel);
    I_Sel = ii;
    J_Sel = jj;

}


function Init(iisNew) {
    var ii, jj;
    if (iisNew) LettersInit();
    for (ii = 0; ii < Size; ii++) {
        for (jj = 0; jj < Size; jj++)
            Fld[ii][jj] = 0;
    }
    //self defined some bonus place
    Fld[Math.floor(Size / 2)][Math.floor(Size / 2)] = 27;
    Fld[0][Size - 1] = 28;
    Fld[Size - 1][0] = 28;
    Fld[0][0] = 28;
    Fld[Size - 1][Size - 1] = 28;
    Fld[Math.floor(Size / 4)][Math.floor(Size / 4)] = 29;
    Fld[Math.floor(Size / 4)][Math.floor(Size / 4 + Size / 2)] = 29;
    Fld[Math.floor(Size / 2 + Size / 4)][Math.floor(Size / 4)] = 29;
    Fld[Math.floor(Size / 2 + Size / 4)][Math.floor(Size / 4 + Size / 2)] = 29;

    for (jj = 0; jj < Size; jj++)
        Fld[Size][jj] = Card[jj];
    I_Sel = -1;
    RefreshScreen();
    Now = new Date();
    StartTime = Now.getTime() / 1000;
    IsOver = false;
}

function shuffle() {
    LettersInit();
    for (jj = 0; jj < Size; jj++)
        Fld[Size][jj] = Card[jj];
    I_Sel = -1;
    RefreshScreen();
    isOver = false;
}

function RefreshScreen() {
    for (n = 0; n < Size + 1; n++) {
        for (m = 0; m < Size; m++) {
            RefreshPic(n, m);
        }
    }
    // RefreshCard();
}

function RefreshPic(ii, jj) {
    window.document.images[Size * ii + jj + 1].src = Pic[Fld[ii][jj]].src;
}
function isBonusPoint(i, j) {
    if (i == Math.floor(Size / 2) && j == Math.floor(Size / 2)) {
        return 2;
    }
    if (i == 0 && j == Size - 1) {
        return 10;
    }
    if (i == Size - 1 && j == 0) {
        return 10;
    }
    if (i == 0 && j == 0) {
        return 10;
    }
    if (i == Size - 1 && j == Size - 1) {
        return 10;
    }
    if (i == Math.floor(Size / 4) && j == Math.floor(Size / 4)) {
        return 5;
    }
    if (i == Math.floor(Size / 4) && j == Math.floor(Size / 2 + Size / 4)) {
        return 5;
    }
    if (i == Math.floor(Size / 4 + Size / 2) && j == Math.floor(Size / 4)) {
        return 5;
    }
    if (i == Math.floor(Size / 2 + Size / 4) && j == Math.floor(Size / 4 + Size / 2)) {
        return 5;
    }
    return 0;
}
function Eval(bb) {
    var ii, jj, kk, ww = " ", vvalid = "", iinvalid = "", vv = 0;
    if (bb) IsOver = true;
    //snapshot of Fld
    uu = new Array(Size);
    for (ii = 0; ii < Size; ii++)
        uu[ii] = new Array(Size);
    for (ii = 0; ii < Size; ii++) {
        for (jj = 0; jj < Size; jj++) {
            uu[ii][jj] = Fld[ii][jj];
        }
    }
    var bonus = 0;
    //horizontal direction
    for (ii = 0; ii < Size; ii++) {
        ww = " ";
        for (jj = 0; jj < Size; jj++) {
            if (Fld[ii][jj] > 0 && Fld[ii][jj] < 27) //there is letter in this place
            {
                ww = ww + Alphabet.charAt(Fld[ii][jj]);
                bonus += isBonusPoint(ii, jj);

            }
            else {
                if (ww.length > 2) {
                    ww = ww + " ";
                    if (WordList.search(ww) >= 0) {
                        vvalid = vvalid + "\n" + ww + eval(ww.length - 2);
                        vv += (ww.length - 2) + bonus;
                        for (kk = 1; kk < ww.length - 1; kk++) uu[ii][jj - kk] = 0;
                    }
                    else iinvalid = iinvalid + "\n" + ww;
                }
                bonus = 0;
                ww = " ";
            }
        }
        if (ww.length > 2) {
            ww = ww + " ";
            if (WordList.search(ww) >= 0) {
                vvalid = vvalid + "\n" + ww + eval(ww.length - 2);
                vv += (ww.length - 2) + bonus;
                for (kk = 1; kk < ww.length - 1; kk++) uu[ii][jj - kk] = 0;
            }
            else iinvalid = iinvalid + "\n" + ww;
        }
    }
    bonus = 0;
    ww = " ";
    for (jj = 0; jj < Size; jj++) {
        ww = " ";
        for (ii = 0; ii < Size; ii++) {
            if (Fld[ii][jj] > 0 && Fld[ii][jj] < 27) {
                ww = ww + Alphabet.charAt(Fld[ii][jj]);
                bonus += isBonusPoint(ii, jj);
            }
            else {
                console.log(ww);
                if (ww.length > 2) {
                    ww = ww + " ";
                    if (WordList.search(ww) >= 0) {
                        vvalid = vvalid + "\n" + ww + eval(ww.length - 2);
                        vv += (ww.length - 2);
                        for (kk = 1; kk < ww.length - 1; kk++) uu[ii - kk][jj] = 0;
                    }
                    else iinvalid = iinvalid + "\n" + ww;
                }
                bonus = 0;
                ww = " ";
            }
        }
        if (ww.length > 2) {
            ww = ww + " ";
            if (WordList.search(ww) >= 0) {
                vvalid = vvalid + "\n" + ww + eval(ww.length - 2);
                vv += (ww.length - 2);
                for (kk = 1; kk < ww.length - 1; kk++) uu[ii - kk][jj] = 0;
            }
            else iinvalid = iinvalid + "\n" + ww;
        }
        bonus = 0;
        ww = " ";
    }
    // if (vvalid == "")
    //     alert("No valid words.\n\nScore: " + vv + "\n\nTime: " + TimeString);
    // else {
    //     if (iinvalid != "")
    //         alert("Valid words:" + vvalid + "\n\nInvalid words:" + iinvalid + "\n\nScore:" + vv + "\n\nTime: " + TimeString);
    //     else
    //         alert("Valid words:" + vvalid + "\n\nScore: " + vv + "\n\nTime: " + TimeString);
    // }

    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    var headers = new Headers();
    headers.append('X-CSRFToken', csrftoken);
    $.ajax({
        // points to the url where your data will be posted
        url: '../genius/postendpoint',
        // post for security reason
        type: "GET",
        // data that you will like to return
        data: {score: vv, words: vvalid},
        headers: headers,
        // what to do when the call is success
        success: function (response) {
            console.log("success")
        },
        // what to do when the call is complete ( you can right your clean from code here)
        complete: function () {
            console.log("complete")
        },
        // what to do when there is an error
        error: function (xhr, textStatus, thrownError) {
            console.log("throw error")
        }
    });

    window.location.href = "/genius/word-snake-end/" + vv;
}

function Help() {
    alert("Connect the letters to words. The words must be from the word list. There are about 4000 words" +
        "\nin the list. For every letter of a word you get one point. If all letters are in words, you get a bonus" +
        "\nof 10 points. Try to cross words, so you get more points. Don't take more than 5 minutes for one" +
        "\npuzzle. Good luck!");
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}



