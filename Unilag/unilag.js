var isConfirmed = false;
    var selectedDept = null;
  function confirmcourse() {
    
    var courseSelect = document.getElementById('course-select');
    var selectedCourse = courseSelect.value;
 var readableCourseName = courseSelect.options[courseSelect.selectedIndex].text;
    if (selectedCourse === '') {
      alert('Please select a course before continuing.');
      return;
    }
 
    // Define arrays for each course by department
    var coursesByDepartment = {
      architecture: {
        dept: 'Environmental Sciences',
        courses: ['Architecture', 'Urban and Regional Planning', 'Estate Management']
      },
      medicine: {
        dept: 'Clinical Sciences',
        courses: ['Medicine', 'Nursing', 'Medical Laboratory Science']
      },
      engineering: {
        dept: 'Engineering',
        courses: ['Computer Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering']
      },
      law: {
        dept: 'Law',
        courses: ['Law']
      },
      business_administration: {
        dept: 'Social Sciences',
        courses: ['Business Administration', 'Economics', 'Political Science']
      }
    };

    // Get the department and courses for the selected option
    var selectedDept = coursesByDepartment[selectedCourse];
    
    

    if (selectedDept) {
      isConfirmed = true;
      document.getElementById("change").style.display = "block";
      document.getElementById("change").innerHTML =
      'You have selected <span class="highlight-course">' +
        readableCourseName +
        '</span>. This course falls under the <span class="highlight-dept">' +
        selectedDept.dept +
        ' </span> department. The courses in this department include: ' +
        selectedDept.courses.join(', ') +
        '.';
      scrollToBottom();
    }
  }

  function scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }

  function unilagolevel() {
    var SelectedCourse = document.getElementById('course-select').value;
    
    if (SelectedCourse && isConfirmed) {
      window.location.href = "unilag-olevel.html";
    }
    else {
      alert('Please confirm your selected course before continuing.');
    }

    

    
  };
  window.addEventListener('pageshow', function(event)
{
  isConfirmed = false;
  document.getElementById("course-select").value = "";
  
}
);
