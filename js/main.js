var url = "http://gateway.marvel.com/v1/public/characters"
var PRIV_KEY = "f4bfb463cf8722cb8036977c6d2036b95fea9ba4";
var PUBLIC_KEY = "ba34f220e4a579113118da90426971b2";
var heroName;
var heroID;
var urlWithID;
var ts;
var hash;
var offset = 1;

$(".hover-exception").hover(function(){
   $(".hero10").toggleClass("hover-on");
});

$("#heroes").hover(function(){
  $(".hero-in-comic").toggleClass("gray-scale");
});

$("#heroes li").on("click",function(){
  $(".seach-results").show();
  heroName = $(this).text();
  GetHero(heroName);
});

function GetHero(heroName){

  console.log("loading Starts");
  $("body").addClass("loading");//Loading Animation Starts

  offset = 1;
  var urlWithName = url + "?name=" + heroName;
  ts = new Date().getTime();
  hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
  //Getting Hero's main data
  console.log(urlWithName);
  $.getJSON(urlWithName, {
    ts: ts,
    apikey: PUBLIC_KEY,
    hash: hash
  },function(json){
    heroID = json.data.results[0].id;
      var description = json.data.results[0].description;
      var thumbnail = json.data.results[0].thumbnail.path;
      var extension = json.data.results[0].thumbnail.extension;
      var charactorURL = json.data.results[0].urls[0].url;
      thumbnail = thumbnail + "." + extension;
      $("#hero-name").html("<a href='" + charactorURL + " target='_blank ' >" + heroName
        + "<span class='slider'></span>" + "</a>"
        );
      $("#hero-description").text(description);
      $('#chosen-hero-img-jump').remove();
      $heroImg = "<a id='chosen-hero-img-jump' class='chosen-hero-img-jump'target='_blank' href='" + charactorURL + " target='_blank ' >"
                 + "<div class='hero-img-border' ></div>"
                 + "<img id='hero-img' src='" + thumbnail + "' >"
                 + "</a>";
      $("#hero-img-wrapper").append($heroImg);

      $("#comics-h3").text("Comics");
      $("#comic-list").empty();
      $("body").removeClass("loading");//Loading animation finish
      GetComics();

      ScrollToHero();

    })
    .done(function(data){
      console.log("Success");
      $("body").removeClass("loading");//Loading animation finish
    })
    .fail(function(err){
      console.log(err);
      $("body").removeClass("loading");//Loading animation finish
    });
}

function GetComics(){
  $("#see-more-comic").remove();
  $("#chosen-hero").append("<div id='comics-loading' class='comics-loading'></div>");
  urlWithID = url + "/" + heroID + "/comics?offset=" + offset;
  ts = new Date().getTime();
  hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
  $.getJSON(urlWithID, {
    ts: ts,
    apikey: PUBLIC_KEY,
    hash: hash
    },function(json){
      var count = json.data.count;
      var comicTitle;
      var comicPath;
      var comicExtension;
      var comicImgURL;
      var comicExternalUrl;

      for(i = 0; i < count ; i++){
        comicTitle = json.data.results[i].title;
        comicPath = json.data.results[i].thumbnail.path;
        comicExtension = json.data.results[i].thumbnail.extension;
        comicImgURL = comicPath + "." + comicExtension;
        comicExternalUrl = json.data.results[i].urls[0].url;
        $("#comic-list").append(
          "<li class='comic' >" +
            "<a class='img-jump' href='" + comicExternalUrl + "' target='_blank'>" +
              "<img src='" + comicImgURL + "' >" +
            "</a>" +
            "<a href='" + comicExternalUrl + "' target='_blank'>" +
            "<h4 class='comic-title'>" + comicTitle + "</h4>" +
            "</a>" +
          "</li>");
    }
    offset += 20;
    $("#comics-loading").remove();
    $("#chosen-hero").append("<div id='see-more-comic' class='see-more-comic abc'><span class='see-more-comic-span'>See More</span></div>");

    $("#see-more-comic").on("click",function(){
      GetComics();
    });
  });
}

function ScrollToHero(){
  var offset = $('#search-results').offset();
  offset.top -= 20;
  $('html, body').animate({
    scrollTop: offset.top
  });
}



