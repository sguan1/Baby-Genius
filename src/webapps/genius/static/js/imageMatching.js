/**
 * Created by candy on 15/11/17.
 */
var tmp = null;
var dict = {};

function CB(id) {
    tmp = document.getElementById(id).getAttribute("value");
    dict[tmp] = id;
}

function CL(id) {
    if(tmp != null && tmp != "") {
        old_value = document.getElementById(id+"-picture").getAttribute("value");
        if(old_value != "") {
            document.getElementById(dict[old_value]).setAttribute("value",old_value);
        }
        document.getElementById(id+"-picture").setAttribute("value",tmp);
        document.getElementById(id+"-data").setAttribute("value",tmp);


        document.getElementById(dict[tmp]).setAttribute("value","");
        tmp = null;
    }
    else{
        value = document.getElementById(id+"-picture").getAttribute("value");
        document.getElementById(dict[value]).setAttribute("value",value);
        document.getElementById(id+"-picture").setAttribute("value","");
        document.getElementById(id+"-data").setAttribute("value","");

    }

}

$( document ).ready(function() {  // Runs when the document is ready
        window.onload = function(){
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
                form=document.getElementById("form")
                console.log(form)
                form.submit()
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
