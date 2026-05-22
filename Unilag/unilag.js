var isConfirmed = false;
var selectedDept = null;

function isHistoryNavigation() {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
        return navEntries[0].type === 'back_forward';
    }
    return performance.navigation && performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD;
}

function shouldPreserveCourseState() {
    return sessionStorage.getItem('preserveCourseOnReturn') === 'true' || isHistoryNavigation();
}

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
      localStorage.setItem('selectedCourse', selectedCourse);
      localStorage.setItem('readableCourseName', readableCourseName);
      document.getElementById("change").style.display = "block";
      document.getElementById("change").innerHTML =
      '✅ Great choice! You have selected <span class="highlight-course">' +
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
      sessionStorage.setItem('preserveCourseOnReturn', 'true');
      window.location.href = "unilag-olevel.html";
    }
    else {
      alert('Please confirm your selected course before continuing.');
    }

    

    
  };

  function loadCourseData() {
    if (!shouldPreserveCourseState()) {
      localStorage.removeItem('selectedCourse');
      localStorage.removeItem('readableCourseName');
      isConfirmed = false;
      return;
    }

    const savedCourse = localStorage.getItem('selectedCourse');
    const savedCourseName = localStorage.getItem('readableCourseName');
    
    if (savedCourse) {
      document.getElementById('course-select').value = savedCourse;
      isConfirmed = true;
      
      if (savedCourseName) {
        document.getElementById("change").style.display = "block";
        document.getElementById("change").innerHTML =
        'You have selected <span class="highlight-course">' +
          savedCourseName +
          '</span>. This course falls under the <span class="highlight-dept">Department</span> department.';
        scrollToBottom();
      }
    }

    sessionStorage.removeItem('preserveCourseOnReturn');
  }

  window.addEventListener('pageshow', function(event) {
    if (!shouldPreserveCourseState()) {
      isConfirmed = false;
      document.getElementById("course-select").value = "";
      document.getElementById("change").style.display = "none";
      localStorage.removeItem('selectedCourse');
      localStorage.removeItem('readableCourseName');
    } else {
      loadCourseData();
    }
  });

