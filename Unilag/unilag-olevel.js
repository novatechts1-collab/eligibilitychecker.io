 
function generateRows() {
  
  let numSubjectsInput = document.getElementById('subjects');
  let numSubjects = parseInt(numSubjectsInput.value);
  let numSittingsInput = document.getElementById('sittings');
  let numSittings = parseInt(numSittingsInput.value);
  
  if (isNaN(numSubjects)) {
    return; // Exit if the input is not a valid number
  }
  if (isNaN(numSittings)) {
    return; // Exit if the input is not a valid number
  }
 

  if (numSubjects > 9) {
    numSubjects = 9;
    numSubjectsInput.value = 9; // Update the input to reflect the max limit
  } else if (numSubjects < 5) {
    numSubjects = 5;
    numSubjectsInput.value = 5; // Update the input to reflect the min limit
  }
    else if (numSittings > 3) {
    numSittings = 3;
    numSittingsInput.value = 3; // Update the input to reflect the max limit
  } else if (numSittings < 1) {
    numSittings = 1;
    numSittingsInput.value = 1; // Update the input to reflect the min limit
  }

  const container = document.querySelector('.subjectsandgrade');

  // 1. Clear out any rows that were generated previously
  container.innerHTML = "";

  // 2. Validate that the number is within your min="5" and max="9" boundaries
  if (numSubjects < 5 || numSubjects > 9 && numSittings < 1 || numSittings > 3 ) {
    return; // Don't generate anything if the input is invalid
  }

  // 3. Define our primary subjects for the dropdown
  const primarySubjects = [
    "Mathematics", "English Language", "Physics", "Chemistry",
    "Biology", "Further Mathematics", "Economics",
    "Financial Accounting", "Geography", "Literature-in-English",
    "Government", "CRS / IRS", "Technical Drawing", "Commerce", "Agricultural Science",
    "French", "Music", "Fine Art", "Data Processing", "Yoruba","Civic Education","Literature in English"
  ];

  // 4. Loop to build the exact number of rows requested
  for (let i = 0; i < numSubjects; i++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'subject-row';
    rowDiv.style.marginBottom = "10px";

    let subjectOptions = `<option value="" disabled selected>Select Subject ${i + 1}</option>`;
    primarySubjects.forEach(sub => {
      subjectOptions += `<option value="${sub}">${sub}</option>`;
    });

    const gradeOptions = `
      <option value="" disabled selected>Grade</option>
      <option value="A1">A1</option>
      <option value="B2">B2</option>
      <option value="B3">B3</option>
      <option value="C4">C4</option>
      <option value="C5">C5</option>
      <option value="C6">C6</option>
      <option value="D7">D7</option>
      <option value="E8">E8</option>
      <option value="F9">F9</option>
    `;

    rowDiv.innerHTML = `
      <select class="subject-select" style="margin-right: 10px; padding: 5px;" required>
        ${subjectOptions}
      </select>
      <select class="grade-select" style="padding: 5px;" required>
        ${gradeOptions}
      </select>
    `;

    container.appendChild(rowDiv);
  }

  const subjectSelects = Array.from(container.querySelectorAll('.subject-select'));
  const gradeSelects = Array.from(container.querySelectorAll('.grade-select'));

  subjectSelects.forEach(select => {
    select.addEventListener('change', () => {
      updateSubjectOptions();
      scrollToNextField(select);
    });
  });

  gradeSelects.forEach(select => {
    select.addEventListener('change', () => {
      scrollToNextField(select);
    });
  });

  updateSubjectOptions();
  scrollToLastGeneratedField();
}

function updateSubjectOptions() {
  const subjectSelects = Array.from(document.querySelectorAll('.subject-select'));
  const selectedValues = subjectSelects
    .map(select => select.value)
    .filter(value => value !== '');

  subjectSelects.forEach(select => {
    const currentValue = select.value;
    Array.from(select.options).forEach(option => {
      if (!option.value) {
        return;
      }
      option.disabled = false;
      if (option.value !== currentValue && selectedValues.includes(option.value)) {
        option.disabled = true;
      }
    });
  });
}

function scrollToElement(element) {
  if (!element) {
    return;
  }
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function scrollToLastGeneratedField() {
  const rows = document.querySelectorAll('.subject-row');
  if (rows.length === 0) {
    return;
  }
  const lastRow = rows[rows.length - 1];
  const lastField = lastRow.querySelector('.subject-select');
  scrollToElement(lastField);
}

function scrollToNextField(current) {
  const allFields = Array.from(document.querySelectorAll('.subject-select, .grade-select'));
  const currentIndex = allFields.indexOf(current);
  if (currentIndex >= 0 && currentIndex < allFields.length - 1) {
    scrollToElement(allFields[currentIndex + 1]);
  }
}

function scrollToBottom() {
  scrollToLastGeneratedField();
}

window.addEventListener('pageshow', function (event) {
  document.getElementById("subjects").value = "";
  document.getElementById("sittings").value = "";
});
