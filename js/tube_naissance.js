var datasets={}

function load_data() {
    //load data
    d3.csv('./data/best_songs_top_ten_per_year.csv', function (data) {
        data.forEach(function (d) {
            datasets[d.Year] = {track: d.Track, weeks: parseInt(d.Weeks), artist:d.Artist};
        });
    });
}

$( document ).ready(function() {
    load_data();
});

function print_hit(year){

    var born_tube=document.getElementById("born_tube");
    while (born_tube.firstChild) {
        born_tube.removeChild(born_tube.firstChild);
    }

    year=String(year);
    var the_song = {label:datasets[year].track,
            data: datasets[year].weeks,
            artist: datasets[year].artist};

    // affiche le nombre de semaines dans le top de la chanson
    var nb_w = document.createElement('div');
    nb_w.id="nb_weeks";
    var subdiv=document.createElement('div');
    subdiv.id = 'songdata';
    var span1=document.createElement('p');
    span1.innerText=String(the_song.data);
    span1.className="printhit";
    span1.style.fontSize="2em";
    var span2=document.createElement('p');
    span2.className="printhit";
    span2.innerText="semaines \n au top";
    span2.style.fontSize="0.6em";
    subdiv.appendChild(span1);
    subdiv.appendChild(span2);
    nb_w.appendChild(subdiv);

    // message avec titre de la chanson
    var hit_tube_born = document.createElement('div');
    hit_tube_born.id="tube";
    var phrase = document.createElement('h1');
    phrase.className="description_tube";
    phrase.innerText="Le tube qui a bercé ton enfance est ";
    phrase.style.fontSize="1.2em";
    phrase.style.color="#3E3636";
    var song_title = document.createElement('h1');
    song_title.className="description_tube";
    song_title.id="the_song";
    song_title.innerText=the_song.label;
    song_title.style.color="#359bb7";
    var song_artist=document.createElement('h1');
    song_artist.className="printhit";
    song_artist.innerText="de "+the_song.artist;
    song_artist.style.color="#af82b7";
    song_artist.style.fontSize="1.2em";

    hit_tube_born.appendChild(phrase);
    hit_tube_born.appendChild(song_title);
    hit_tube_born.appendChild(song_artist);


    born_tube.appendChild(nb_w);
    born_tube.appendChild(hit_tube_born);
}
