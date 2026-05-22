// Check if navigation was back/forward or return from a page ahead
function isHistoryNavigation() {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
        return navEntries[0].type === 'back_forward';
    }
    return performance.navigation && performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD;
}

function shouldPreserveState() {
    return sessionStorage.getItem('preserveUtmeOnReturn') === 'true' || isHistoryNavigation();
}

function getSubjectSelects() {
    return Array.from(document.querySelectorAll('.subject-input')).filter(select => !select.classList.contains('locked'));
}

function updateSubjectOptions() {
    const selects = getSubjectSelects();
    const selectedValues = selects
        .map(select => select.value)
        .filter(value => value && value !== '');

    selects.forEach(select => {
        Array.from(select.options).forEach(option => {
            if (option.value === '') {
                option.disabled = false;
                return;
            }

            if (option.value === select.value) {
                option.disabled = false;
                return;
            }

            option.disabled = selectedValues.includes(option.value);
        });
    });
}

function scrollToRow(element) {
    const gridItem = element.closest('.grid-item');
    if (!gridItem) return;

    const gridContainer = gridItem.parentElement;
    const allGridItems = Array.from(gridContainer.querySelectorAll('.grid-item'));
    const itemIndex = allGridItems.indexOf(gridItem);
    
    // Each row has 2 items (subject and score), so row index is itemIndex / 2
    const rowStartIndex = Math.floor(itemIndex / 2) * 2;
    const firstItemInRow = allGridItems[rowStartIndex];
    
    firstItemInRow.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

function attachSubjectChangeHandlers() {
    getSubjectSelects().forEach(select => {
        select.addEventListener('change', () => {
            updateSubjectOptions();
            scrollToRow(select);
        });
    });

    document.querySelectorAll('.score-input').forEach(input => {
        input.addEventListener('input', () => {
            scrollToRow(input);
        });
        input.addEventListener('change', () => {
            scrollToRow(input);
        });
    });
}

// Function to validate and save UTME data
function saveUTMEData() {
    const subjectInputs = document.querySelectorAll('.subject-input');
    const scoreInputs = document.querySelectorAll('.score-input');
    
    let allFieldsFilled = true;
    let utmeData = [];
    
    const englishScore = scoreInputs[0].value;
    if (!englishScore) {
        alert('Please enter a score for English Language');
        return;
    }
    utmeData.push({
        subject: 'English Language',
        score: englishScore
    });
    
    for (let i = 1; i < subjectInputs.length; i++) {
        const subject = subjectInputs[i].value;
        const score = scoreInputs[i].value;
        
        if (!subject || subject === '') {
            alert(`Please select Subject ${i + 1}`);
            allFieldsFilled = false;
            break;
        }
        
        if (!score || score === '') {
            alert(`Please enter a score for Subject ${i + 1}`);
            allFieldsFilled = false;
            break;
        }
        
        if (score < 0 || score > 100) {
            alert(`Score for ${subject} must be between 0 and 100`);
            allFieldsFilled = false;
            break;
        }
        
        utmeData.push({
            subject: subject,
            score: score
        });
    }
    
    if (!allFieldsFilled) {
        return;
    }
    
    const subjects = utmeData.map(item => item.subject);
    const uniqueSubjects = new Set(subjects);
    if (uniqueSubjects.size !== subjects.length) {
        alert('You cannot select the same subject more than once');
        return;
    }
    
    localStorage.setItem('utmeData', JSON.stringify(utmeData));
    sessionStorage.setItem('preserveUtmeOnReturn', 'true');
    console.log('UTME Data Saved:', utmeData);
    
    // Show success message
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
      successDiv.textContent = '✅ All UTME data saved successfully! Your eligibility assessment is complete.';
      successDiv.classList.add('show');
    }
    
    alert('✅ Your UTME data has been saved successfully! Your eligibility assessment is complete.');
    // If you have a next page, redirect here and keep the flag set for return navigation
    // window.location.href = 'next-page.html';
}

function resetUTMEForm() {
    document.querySelectorAll('.subject-input').forEach((input, index) => {
        if (index === 0) {
            input.value = 'English Language';
        } else {
            input.value = '';
        }
    });
    document.querySelectorAll('.score-input').forEach(input => {
        input.value = '';
    });
    updateSubjectOptions();
}

function loadUTMEData() {
    const savedData = localStorage.getItem('utmeData');
    if (savedData) {
        const utmeData = JSON.parse(savedData);
        const subjectInputs = document.querySelectorAll('.subject-input');
        const scoreInputs = document.querySelectorAll('.score-input');
        
        utmeData.forEach((item, index) => {
            if (index < subjectInputs.length) {
                subjectInputs[index].value = item.subject;
                scoreInputs[index].value = item.score;
            }
        });
    }
    updateSubjectOptions();
};

function initializeUTMEForm() {
    attachSubjectChangeHandlers();

    if (!shouldPreserveState()) {
        localStorage.removeItem('utmeData');
        resetUTMEForm();
    } else {
        loadUTMEData();
    }
    sessionStorage.removeItem('preserveUtmeOnReturn');
}

window.addEventListener('DOMContentLoaded', initializeUTMEForm);
window.addEventListener('pageshow', initializeUTMEForm);
 
function back(){
  window.location.href = "unilag-olevel.html";
};





