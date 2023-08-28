//--- Script: jquery + alert + CRUD Todolist ---//
$(document).ready(function () {
    login();
    loadData();
  });
  
  //--- Global const ---//
  
  const url = "https://students.trungthanhweb.com/api/";
  
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
    $("#loginBtn").click(function (e) {
      e.preventDefault();
      $("#loginModal").modal("show");
      $("#submitLoginBtn").click(function (e) {
        e.preventDefault();
        var emailLogin = $("#email").val().trim();
        console.log(emailLogin);
        if (emailLogin == "") {
          alert("empty email!");
        } else {
          $.ajax({
            type: "post",
            url: "https://students.trungthanhweb.com/api/checkLoginhtml",
            data: {
              email: emailLogin,
            },
            dataType: "JSON",
            success: function (res) {
              if (res.check == true) {
                console.log(res.apitoken);
                localStorage.setItem("token", res.apitoken);
                // alert("Login success ^^");
                Toast.fire({
                  icon: "success",
                  title: "Signed in success [<-",
                }).then(() => {
                  window.location.reload();
                });
              } else {
                // alert("Invalid email! :/");
                Toast.fire({
                  icon: "error",
                  title: "Invalid email! :/",
                });
              }
            },
          });
        }
      });
    });
  }
  
  //--- Logout ---//
  function Logout() {
    $("#logoutBtn").click(function (e) {
      e.preventDefault();
      if (
        localStorage.getItem("token") &&
        localStorage.getItem("token") !== null
      ) {
        localStorage.removeItem("token");
        Toast.fire({
          icon: "success",
          title: "Logout Done [->",
        }).then(() => {
          window.location.reload();
        });
      }
    });
  }

  //--- Menu ---//
function loadData() {
    $("#logoutBtn").hide();
    if (localStorage.getItem("token") && localStorage.getItem("token") != null) {
      $("#loginBtn").hide();
      $("#logoutBtn").show();
      showCart();
    }
}

function showCart() {
    $.ajax({
        type: "get",
        url: "url",
        data: "data",
        dataType: "dataType",
        success: function (response) {
            
        }
    });
}  