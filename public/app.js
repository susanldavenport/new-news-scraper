$(document).ready(function(){

  // $('.parallax').parallax();

  // click home, clear scrape
  $('#home').on('click', function() {
    $(".articles").empty(); 
    $(".articles").html(`<h5 class="noArt cyan darken-3 white-text center">You do not have any articles...<br>Click the <i>Scrape News</i>  button above to view articles</h5>`); 
  }); 

  //article scrape button & append cards with articles

  $('a#scrapeBtn').on("click", function() {
    $(".articles").empty(); 
    $.ajax({
      method: "GET", 
      url: "/scrape", 
    }).then(function(data) { 
      let reducedData = [];
      for (i=10; i < 20; i++) {
        reducedData.push(data[i]);
      };
      reducedData.forEach((article) => {
        let row = $(`<div class="row">`); 
        let col = $(`<div class="col l12 m12 s12">`); 
        let card = $(`<div class="card blue darken-3 white-text">`); 
        let cardContent = $(`<div class="card-content">`); 
        let cardAction = $(`<div class="card-action blue accent-1">`); 

        cardContent.append(`
          <span class="card-title">${article.title}</span>
          <p>${article.summary}</p>
        `);

        cardAction.append(`
          <a class="red-text" href="${article.link}" target="_blank">Read More</a>
          <a id="save" class="waves-effect waves-light btn cyan accent-4"><i class="material-icons right">save</i>Save Article</a>
        `);

        card.append(cardContent, cardAction); 
        col.append(card);
        row.append(col); 
        $(".articles").append(row); 
      });
    });
  }); 

  //add articles to saved page
  $('.articles').on("click", 'a#save', function() {
    let addTitle = $(this).parent().siblings().children('span').text(); 
    let addSummary = $(this).parent().siblings().children('p').text(); 
    let addLink = $(this).siblings().attr('href'); 
    let addArticle = {
      title: addTitle, 
      summary: addSummary,
      link: addLink
    };
    console.log("Article Added", addArticle); 
    
    $.ajax({
      method: "POST", 
      url: "/articles",
      data: addArticle
    }).then(function(data) { 
       }).catch(function(err) {
      return res.json(err);
    });
  }); 

  // Saved articles page
  $('#savedArticles').on('click', function() {
    loadSavedArticles();
  })
  
  function loadSavedArticles() {
    console.log('inside saved article function');
    $(".articles").empty(); 
    $.ajax({
      method: "GET", 
      url: "/articles"
    }).then(function(data) { 
      data.forEach((article) => {
        let row = $(`<div class="row">`); 
        let col = $(`<div class="col l12 m12 s12">`); 
        let card = $(`<div class="card blue darken-3 white-text">`); 
        let cardContent = $(`<div class="card-content">`); 
        let cardAction = $(`<div class="card-action blue accent-14">`); 

        cardContent.append(`
          <span class="card-title">${article.title}</span>
          <p>${article.summary}</p>
        `);

        cardAction.append(`
          <a class="orange-text" href="${article.link}" target="_blank">Read More</a>
          <a id="note" data-id="${article._id}" class="waves-effect waves-light btn cyan accent-4 white-text"><i class="material-icons right">note_add
          </i>Add Note</a>
          <a id="delete" data-id="${article._id}" class="waves-effect waves-light btn red darken-2 white-text"><i class="material-icons right">delete
          </i>Delete Article</a>
        `);
        
        card.append(cardContent, cardAction); 
        col.append(card);
        row.append(col); 
        $(".articles").append(row); 
      });
    }).catch(function(err) {
      return res.json(err);
    });
  };

   // Delete saved article
   $('.articles').on("click", 'a#delete', function() {
    console.log('click'); 
    let thisId = $(this).attr("data-id");
    $.ajax({
      method: "DELETE",
      url: "/articles/" + thisId
    }).then(function(data) {
      loadSavedArticles();
    }); 
  }); 
});