function checkschool() {
  var terms = document.getElementById('terms');
  if (!terms.checked) {
    alert('Please agree to the terms and conditions before continuing.');
    return;
  }

  var selects = [
    document.getElementById('university'),
    document.getElementById('polytechnic'),
    document.getElementById('college-edu'),
    document.getElementById('iei')
  ];

  var selectedOptions = selects.filter(function(select) {
    return select.value !== '';
  });

  if (selectedOptions.length === 0) {
    alert('Please select one institution before continuing.');
    return;
  }

  if (selectedOptions.length > 1) {
    alert('Please select only one institution before continuing.');
    return;
  }

  var destinations = {
    unilag: 'Unilag/unilag.html',
    ui: 'ui.html',
    abu: 'abu.html',
    yabatech: 'yabatech.html',
    fedpoly_ilaro: 'fedpoly_ilaro.html',
    aoce: 'aoce.html',
    fce_akoka: 'fce_akoka.html',
    niit: 'niit.html',
    aptech: 'aptech.html'
  };

  var selectedValue = selectedOptions[0].value;
  var destinationPage = destinations[selectedValue];

  if (!destinationPage) {
    alert('No page found for this selection.');
    return;
  }

  window.location.href = destinationPage;
}

function enforceSingleSelection(changedSelect) {
  var selects = [
    document.getElementById('university'),
    document.getElementById('polytechnic'),
    document.getElementById('college-edu'),
    document.getElementById('iei')
  ];

  selects.forEach(function(select) {
    if (select !== changedSelect) {
      select.value = '';
    }
  });
}

window.addEventListener('DOMContentLoaded', function() {
  var selects = [
    document.getElementById('university'),
    document.getElementById('polytechnic'),
    document.getElementById('college-edu'),
    document.getElementById('iei')
  ];

  selects.forEach(function(select) {
    select.addEventListener('change', function() {
      if (select.value !== '') {
        enforceSingleSelection(select);
        // Scroll to the Continue button
        document.getElementById('continuebtn').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Trigger the Continue button when Enter is pressed
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      document.getElementById('continuebtn').click();
    }
  });
});
window.addEventListener('pageshow', function(event)
{
  
  document.getElementById("university").value = "";
  document.getElementById("polytechnic").value = "";
  document.getElementById("college-edu").value = "";
  document.getElementById("iei").value = "";
  terms.checked = false;
}
);
