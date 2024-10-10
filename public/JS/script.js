// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

//   document.querySelector('form').addEventListener('submit', function (e) {
//     const courseCheckboxes = document.querySelectorAll('input[name="Employee[course]"]');
//     const courseFeedback = document.getElementById('courseFeedback');
//     let isChecked = false;

//     // Check if any checkbox is selected
//     courseCheckboxes.forEach(checkbox => {
//         if (checkbox.checked) {
//             isChecked = true;
//         }
//     });

//     if (!isChecked) {
//         e.preventDefault();  // Prevent form submission
//         courseFeedback.style.display = 'block';  // Show validation feedback
//         courseCheckboxes.forEach(checkbox => checkbox.classList.add('is-invalid'));
//     } else {
//         courseFeedback.style.display = 'none';  // Hide validation feedback
//         courseCheckboxes.forEach(checkbox => checkbox.classList.remove('is-invalid'));
//     }
// });
