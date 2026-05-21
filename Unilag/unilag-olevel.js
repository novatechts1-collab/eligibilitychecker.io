 
function generateRows() {
    const numSubjects = document.getElementById('subjects').value;
    const container = document.querySelector('.subjectsandgrade');
    
    // 1. Clear out any rows that were generated previously
    container.innerHTML = "";
    
    // 2. Validate that the number is within your min="5" and max="9" boundaries
    if (numSubjects < 5 || numSubjects > 9) {
        return; // Don't generate anything if the input is invalid
    }
    
    // 3. Define our primary 12 subjects for the dropdown
    const primarySubjects = [
        "Mathematics", "English Language", "Physics", "Chemistry", 
        "Biology", "Further Mathematics", "Economics", 
        "Financial Accounting", "Geography", "Literature-in-English", 
        "Government", "CRS / IRS"
    ];
    
    // 4. Loop to build the exact number of rows requested
    for (let i = 0; i < numSubjects; i++) {
        // Create a wrapper div for each row
        const rowDiv = document.createElement('div');
        rowDiv.className = 'subject-row';
        rowDiv.style.marginBottom = "10px"; // Clean spacing
        
        // Build the Subject Dropdown string
        let subjectOptions = `<option value="" disabled selected>Select Subject ${i + 1}</option>`;
        primarySubjects.forEach(sub => {
            subjectOptions += `<option value="${sub}">${sub}</option>`;
        });
        
        // Build the Grade Dropdown string
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
        
        // Assemble the row layout with matching class names for easy selection later
        rowDiv.innerHTML = `
            <select class="subject-select" style="margin-right: 10px; padding: 5px;" required>
                ${subjectOptions}
            </select>
            <select class="grade-select" style="padding: 5px;" required>
                ${gradeOptions}
            </select>
        `;
        
        // Inject the completed row into the container
        container.appendChild(rowDiv);
    }

    // When any subject changes, update all subject dropdowns so selected items cannot be reused
    const subjectSelects = container.querySelectorAll('.subject-select');
    subjectSelects.forEach(select => {
        select.addEventListener('change', updateSubjectOptions);
    });
    updateSubjectOptions();
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
