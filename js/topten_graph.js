function create_datalist() {
    d3.csv('./data/data_top_10.csv', function (data) {
        var str = ''; // variable to store the options
        var all_artists = [];
        data.forEach(function (d) {
            all_artists.push(d.Artist);
        });
        for (var i = 0; i < all_artists.length; ++i) {
            str += '<option value="' + all_artists[i] + '" />'; // Storing options in variable
        }
        document.getElementById("all_artists").innerHTML = str;
    });
}

var counter = 1;
var limit = 5;

function removeInput(elm){
    $(elm).parent().parent().remove();
    counter--;
}

function addInput() {
    var divName = 'selection_artistes';
    if (counter < limit)  {
        // Get the last element
        var gp_form = document.getElementById(divName);
        // Copy the element and its child nodes
        itm=gp_form.lastElementChild;
        var cln = itm.cloneNode(true);
        cln.firstElementChild.value='';
        gp_form.appendChild(cln);
        itm.lastElementChild.firstElementChild.setAttribute("onclick","removeInput(this)");
        itm.lastElementChild.firstElementChild.firstElementChild.setAttribute("class","glyphicon glyphicon-minus-sign");
        counter++;
    }
}



// bar chart colors
let safeColors = ["#7D85E5","#49F1C3","#FC9665","#9D2F74","#36C6E4","#8FD847","#E62A30"];

function datalistValidator(entry) {
    var obj = $("#all_artists").find("option[value='" + entry + "']");
    if (obj != null && obj.length > 0) {
        return true
    }
    return false;
}

function replay(){
    counter=1;
    var dataviz_container = document.getElementById('dataviz');
    while (dataviz_container.firstChild) {
        dataviz_container.removeChild(dataviz_container.firstChild);
    }
    dataviz_container.setAttribute('w3-include-html','init_form.html');
    w3IncludeHTML();
    create_datalist();
}

// bar chart data
function plotdata() {
    //<div class="alert alert-danger" role="alert"></div>
    var artists = $('.form-control').map( function(){return $(this).val(); }).get();

    // check for the validity of the inputs before launching everything
    var invalid=true;
    for (var i = 0; i < artists.length; ++i) {
        invalid*=(!datalistValidator(artists[i]));
    }
    if (invalid) {
        console.log('mauvais artiste');
        var alert_msg=document.createElement('div');
        alert_msg.id="mauvais_artiste"
        alert_msg.className = "alert alert-danger";
        alert_msg.setAttribute("role","alert");
        alert_msg.innerHTML="<strong>Oh oh!</strong> " +
            "Nous n'avons pas les données pour certain de vos artistes. Aidez-vous de la liste pour choisir ! Si elle ne s'affiche pas, il faut réactualiser la page :(";
        document.getElementById("dataviz").insertBefore(alert_msg,document.getElementById("match_artists"));
    } else {
        if (document.getElementById("mauvais_artiste")){
            $("#mauvais_artiste").remove();
        }
        $('#mes_artistes').remove();

        /*$('.form-control').map(function () {
            $(this).prop('readOnly', true);
        });
        $('.btn.btn-default').map(function () {
            $(this).attr('onclick','');
        });*/

        var dataviz_container = document.getElementById('dataviz');
        var champion_msg = document.createElement('div');
        dataviz_container.append(champion_msg);
        var canvas_container = document.createElement('div');
        canvas_container.id="cc";
        var canvas = document.createElement('canvas');
        canvas.id = "match";
        var replay_button=document.getElementById('match_artists').cloneNode(true);
        replay_button.id="replay_button";
        replay_button.innerText="Rejouer";
        replay_button.setAttribute('onclick','replay()')
        $('#match_artists').remove();
        dataviz_container.append(canvas_container);
        document.getElementById('cc').appendChild(canvas);
        d3.csv('./data/data_top_10.csv', function (data) {
            let datasets = [];
            let color = safeColors.slice(0,counter);
            let i = 0;
            data.forEach(function (d) {
                if (artists.includes(d.Artist)) {
                    datasets.push({
                        label: [d.Artist],
                        data: [parseInt(d.nb)],
                        backgroundColor: color[i]
                    });
                    i++;
                }
            });

            // find champion and plot message before drawing chart
            var max = -Infinity, key;
            datasets.forEach(function (v) {
                if (max < v.data[0]) {
                    max = v.data[0];
                    key = v.label[0];
                }
            });
            champion_msg.className="alert alert-success";
            champion_msg.setAttribute('role','alert');
            champion_msg.id="champion"
            champion_msg.innerText="And the winner is... "+key+" ! :)";

            // draw bar chart
            Chart.defaults.global.defaultFontColor = '#ffffff';
            let chart = new Chart("match", {
                type: "bar",
                data: {
                    labels: ["Nombre de titres au top ten"],
                    datasets: datasets
                },
                options : {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                                // OR //
                                beginAtZero: true   // minimum value will be 0.
                            }
                        }]
                    }
                }
            });
            $('html, body').animate({
                scrollTop: $('#champion').offset().top - 20
            }, 'slow');
            // replay button
            dataviz_container.appendChild(replay_button);
        });
    }
}
