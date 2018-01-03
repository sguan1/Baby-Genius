/**
 * Created by candy on 29/10/17.
 */

var count = 1;
var choice = '';
var game_id;
function getQuestion() {
    document.getElementById("mathTable").setAttribute("name",game_id);
    choice = '';
    var choice_value='';
    var radios = document.getElementsByName("choice");
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            choice = radios[i].value; // if so, hold its value in valr
            radios[i].checked = false;

            break; // and break out of for loop
        }
    }
    if(choice != ''){
        var id = "choice"+choice
        choice_value = parseInt(document.getElementById(id).innerHTML);
    }
    else{
        choice_value = ''
    }

    var number1 = document.getElementById("number1").childElementCount;
    var number2 = document.getElementById("number2").childElementCount;
    var operation = document.getElementById("operation").innerHTML;
    count++;
    if(count == 11){

        window.location.href = "/genius/math-game-end/" + game_id +"/" + count + "/" +choice;
        return;
    }

    document.getElementById("count").innerHTML = count + ' / 10';
    $.get("/genius/get-question/" + game_id + "/" + count +"/" + choice)
        .done(function (data) {

            var x = document.createElement("img");
            x.setAttribute("src","http://clipartix.com/wp-content/uploads/2017/06/Apple-clip-art-free-black-and-white-clipart.png");
            x.setAttribute("width","50");
            x.setAttribute("height","50")
            document.getElementById("number1").innerHTML='';

            for(var i = 0; i < data['number1']; i++){
                document.getElementById("number1").appendChild(x.cloneNode(true));
            }
            document.getElementById("operation").innerHTML = data['operation'];
            document.getElementById("number2").innerHTML='';
            for(var i = 0; i < data['number2']; i++){
                document.getElementById("number2").appendChild(x.cloneNode(true));
            }
            document.getElementById("choiceA").innerHTML = data['choiceA'];
            document.getElementById("choiceB").innerHTML = data['choiceB'];
            document.getElementById("choiceC").innerHTML = data['choiceC'];
            document.getElementById("choiceD").innerHTML = data['choiceD'];
            var answer;
            if(operation == '+'){
                answer = number1 + number2;
            }
            else{
                answer = number1 - number2;
            }

            if(data['result'] == 'correct'){
                document.getElementById("result1").innerHTML = 'correct';
                document.getElementById("result2").innerHTML = '';
            }
            else{
                document.getElementById("result1").innerHTML = number1 + operation + number2 + '=' + answer;
                document.getElementById("result2").innerHTML = 'Your answer: ' + choice_value;
            }

        });

}

$( document ).ready(function() {  // Runs when the document is ready
    window.onload = function(){
        game_id = document.getElementById("mathTable").getAttribute("name");
        var countDownTime = new Date().setMinutes(new Date().getMinutes() + 1);
        var x = setInterval(function () {
            var now = new Date().getTime();
            var distance = countDownTime - now;
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById("countdown").innerHTML = minutes + ":" +seconds;
            if(distance < 0) {
                var radios = document.getElementsByName("choice");
                for (var i = 0, len = radios.length; i < len; i++) {
                    if (radios[i].checked) { // radio checked?
                        choice = radios[i].value; // if so, hold its value in valr
                        radios[i].checked = false;
                        break; // and break out of for loop
                    }
                }
                var id = document.getElementById("mathTable").getAttribute("name");
                console.log(count + choice);
                window.location.href = "/genius/math-game-end/" + id + "/" +  count +"/"+choice;
            }

        }, 1000);
    };

  // using jQuery
  // https://docs.djangoproject.com/en/1.10/ref/csrf/
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

  var csrftoken = getCookie('csrftoken');

  function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }

  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      }
  });


}); // End of $(document).ready
