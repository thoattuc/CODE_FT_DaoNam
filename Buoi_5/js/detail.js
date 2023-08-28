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

//--- Load Data ---//
function loadData() {
  $("#logoutBtn").hide();
  if (localStorage.getItem("token") && localStorage.getItem("token") != null) {
    $("#loginBtn").hide();
    $("#logoutBtn").show();
    const params = new URLSearchParams(window.location.search);
    if(!params.has('id')){
      window.location.replace('index.html');
    }       
    var id=params.get('id');  
    console.log(id);
     
    showMenu();
  }
}

//---Menu---//
function showMenu() {
  $.ajax({
    type: "GET",
    url: url + "home",
    data: {
      apitoken: localStorage.getItem("token"),
    },
    dataType: "JSON",
    success: function (res) {
      var brands = res.brands;
      var categrories = res.categrories;

      if (brands.length) {
        var brandsLi = ``;
        brands.forEach((item) => {
          brandsLi +=
            `<li><a class="dropdown-item" href="#" data-id="` +
            item.id +
            `">` +
            item.name +
            `</a></li>`;
        });
        $("#brandsUl").html(brandsLi);
      }

      if (categrories.length) {
        var categroriesLi = ``;
        categrories.forEach((item) => {
          categroriesLi +=
            `<li><a class="dropdown-item" href="#" data-id="` +
            item.id +
            `">` +
            item.name +
            `</a></li>`;
        });
        $("#categroriesUl").html(categroriesLi);
      }
      Logout();
    },
  });
}

//--- Show detail ---//
function showDetail () {
  $.ajax({
    type: "GET",
    url: url + "single",
    data: "data",
    dataType: "dataType",
    success: function (response) {
      
    }
  });
}