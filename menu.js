$(document).on('click', '.copy-btn', function () {
  copyName(this);
});

$(document).on('click', '.grid-3 article .btn-primary', function () {
  addToCart(this, 2500);
});

const products = ['Classic Margherita', 'Pepperoni Feast', 'Veggie Garden'];
let highlightedElements = [];

$('#search-bar').on('keyup', function() {
  const query = $(this).val().toLowerCase();
  
  $('#products-grid article').each(function() {
    const $item = $(this);
    const title = $item.find('h3').text().toLowerCase();
    
    if (title.includes(query)) {
      $item.show();
      highlightSearchTerms($item, query);
    } else {
      $item.hide();
    }
  });
  
  if (query.length > 0) {
    showAutocomplete(query);
  } else {
    $('#autocomplete').hide().empty();
    removeHighlights();
  }
});

function showAutocomplete(query) {
  const matches = products.filter(p => p.toLowerCase().includes(query));
  const $autocomplete = $('#autocomplete');
  
  if (matches.length > 0) {
    $autocomplete.empty();
    matches.forEach(match => {
      const $suggestion = $('<div class="autocomplete-item"></div>').text(match);
      $suggestion.on('click', function() {
        $('#search-bar').val(match);
        $('#autocomplete').hide().empty();
        $('#products-grid article').each(function() {
          const $item = $(this);
          const title = $item.find('h3').text();
          if (title === match) {
            $item.show();
          }
        });
      });
      $autocomplete.append($suggestion);
    });
    $autocomplete.show();
  } else {
    $autocomplete.hide().empty();
  }
}

function highlightSearchTerms($element, query) {
  removeHighlights();
  
  $element.find('h3, p').each(function() {
    const $target = $(this);
    let html = $target.html();
    
    if (query.length > 0) {
      const regex = new RegExp(`(${query})`, 'gi');
      html = html.replace(regex, '<mark class="highlight">$1</mark>');
      $target.html(html);
      highlightedElements.push($target);
    }
  });
}

function removeHighlights() {
  highlightedElements.forEach($el => {
    $el.find('mark.highlight').each(function() {
      const $mark = $(this);
      $mark.replaceWith($mark.text());
    });
  });
  highlightedElements = [];
}

$('#search-bar').on('blur', function() {
  setTimeout(() => $('#autocomplete').hide(), 200);
});

$('#search-bar').on('focus', function() {
  if ($(this).val().length > 0) {
    $('#autocomplete').show();
  }
});