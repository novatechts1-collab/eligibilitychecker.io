 
function isHistoryNavigation() {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
        return navEntries[0].type === 'back_forward';
    }
    return performance.navigation && performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD;
}

function shouldPreserveOLevelState() {
    return sessionStorage.getItem('preserveOLevelOnReturn') === 'true' || isHistoryNavigation();
}

function saveOLevelData() {
    const rows = Array.from(document.querySelectorAll('.subject-row'));
    const olevelData = [];
    
    rows.forEach(row => {
        const subject = row.querySelector('.subject-select').value;
        const grade = row.querySelector('.grade-select').value;
        olevelData.push({ subject, grade });
    });
    
    localStorage.setItem('olevelData', JSON.stringify(olevelData));
}

function loadOLevelData() {
    const savedData = localStorage.getItem('olevelData');
    if (savedData) {
        try {
            const olevelData = JSON.parse(savedData);
            const rows = Array.from(document.querySelectorAll('.subject-row'));
            
            olevelData.forEach((item, index) => {
                if (index < rows.length) {
                    rows[index].querySelector('.subject-select').value = item.subject;
                    rows[index].querySelector('.grade-select').value = item.grade;
                }
            });
        } catch (e) {
            console.error('Error loading O\'Level data:', e);
        }
    }
}

function generateRows() {
  
  const btn = document.getElementById('btn');
  const beforeBtn = document.querySelector('.beforebtn');
  const numSubjectsInput = document.getElementById('subjects');
  let numSubjects = parseInt(numSubjectsInput.value, 10);
  const numSittingsInput = document.getElementById('sittings');
  let numSittings = parseInt(numSittingsInput.value, 10);

  if (isNaN(numSubjects) || isNaN(numSittings)) {
    btn.disabled = true;
    beforeBtn.style.display = 'none';
    return; // Exit if either input is not a valid number
  }
 

  if (numSubjects > 9) {
    numSubjects = 9;
    numSubjectsInput.value = 9; // Update the input to reflect the max limit
  }
  if (numSubjects < 5) {
    numSubjects = 5;
    numSubjectsInput.value = 5; // Update the input to reflect the min limit
  }
  if (numSittings > 3) {
    numSittings = 3;
    numSittingsInput.value = 3; // Update the input to reflect the max limit
  }
  if (numSittings < 1) {
    numSittings = 1;
    numSittingsInput.value = 1; // Update the input to reflect the min limit
  }

  const container = document.querySelector('.subjectsandgrade');

  // 1. Clear out any rows that were generated previously
  container.innerHTML = "";

  // 2. Validate that the number is within your min="5" and max="9" boundaries
  if (numSubjects < 5 || numSubjects > 9 || numSittings < 1 || numSittings > 3) {
    beforeBtn.style.display = 'none';
    btn.disabled = true;
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
      updateProceedButtonState();
      scrollToNextField(select);
      saveOLevelData();
    });
  });

  gradeSelects.forEach(select => {
    select.addEventListener('change', () => {
      updateProceedButtonState();
      scrollToNextField(select);
      saveOLevelData();
    });
  });

  document.querySelector('.beforebtn').style.display = 'block';
  updateSubjectOptions();
  updateProceedButtonState();
  scrollToLastGeneratedField();
  loadOLevelData();
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

function handleEnterKey(event) {
  if (event.key !== 'Enter') {
    return;
  }

  const target = event.target;
  const interactiveTags = ['BUTTON', 'SELECT', 'TEXTAREA'];
  if (interactiveTags.includes(target.tagName) || (target.tagName === 'INPUT' && target.id !== 'subjects' && target.id !== 'sittings')) {
    return;
  }

  event.preventDefault();
  generateRows();
}

window.addEventListener('keydown', handleEnterKey);

function resetGeneratedRows() {
  const btn = document.getElementById('btn');
  const beforeBtn = document.querySelector('.beforebtn');
  // Keep Proceed enabled so users can click it and receive helpful alerts
  btn.disabled = false;
  beforeBtn.style.display = 'none';
  const container = document.querySelector('.subjectsandgrade');
  if (container) {
    container.innerHTML = '';
  }
}

function scrollToBottom() {
  scrollToLastGeneratedField();
}

function updateProceedButtonState() {
  const btn = document.getElementById('btn');
  const rows = Array.from(document.querySelectorAll('.subject-row'));
  // Always keep Proceed enabled so `tounilagutme()` can show
  // specific validation alerts even when rows haven't been generated yet.
  btn.disabled = false;
}

function tounilagutme() {
  const numSubjectsInput = document.getElementById('subjects');
  const numSittingsInput = document.getElementById('sittings');
  const examSelect = document.getElementById('exam-select');
  const numSubjects = parseInt(numSubjectsInput.value, 10);
  const numSittings = parseInt(numSittingsInput.value, 10);
  const examValue = examSelect.value;

  if (examValue === '') {
    alert('Please select an examination (WAEC, NECO, NABTEB, or GCE) before proceeding.');
    return;
  }

  if (isNaN(numSubjects) || isNaN(numSittings)) {
    alert('Please enter both the number of subjects and number of sittings, then press Enter to generate the fields.');
    return;
  }

  const rows = Array.from(document.querySelectorAll('.subject-row'));

  if (rows.length === 0 || rows.length !== numSubjects) {
    alert('Please click Enter after entering the number of subjects and number of sittings to generate the fields before proceeding.');
    return;
  }

  const firstMissing = rows.find(row => {
    const subject = row.querySelector('.subject-select').value;
    const grade = row.querySelector('.grade-select').value;
    return subject === '' || grade === '';
  });

  if (firstMissing) {
    alert('Please complete every subject and grade field before proceeding.');
    const subject = firstMissing.querySelector('.subject-select');
    const grade = firstMissing.querySelector('.grade-select');
    if (subject.value === '') {
      scrollToElement(subject);
      return;
    }
    if (grade.value === '') {
      scrollToElement(grade);
      return;
    }
    return;
  }

  saveOLevelData();
  sessionStorage.setItem('preserveOLevelOnReturn', 'true');
  window.location.href = 'unilagutme.html';
}

function initializeOLevelPage() {
  if (!shouldPreserveOLevelState()) {
    localStorage.removeItem('olevelData');
    document.getElementById("exam-select").value = "";
    document.getElementById("subjects").value = "";
    document.getElementById("sittings").value = "";
    const container = document.querySelector('.subjectsandgrade');
    if (container) {
      container.innerHTML = '';
    }
  }
  sessionStorage.removeItem('preserveOLevelOnReturn');
}

window.addEventListener('pageshow', initializeOLevelPage);

function back() {
  window.location.href = "unilag.html";
}
