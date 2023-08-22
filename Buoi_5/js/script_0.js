//--- Script: jquery + alert + CRUD Todolist ---//
$(document).ready(function () {
  login();
});

//--- Global const ---//
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

//--- Login ---//
function login() {

}