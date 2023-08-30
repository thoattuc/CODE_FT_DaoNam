$(document).ready(function () {
    login();
    Logout();
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
      showMenu();
      showLike();
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
  
  //--- Show Like ---//
  function showLike() {
    if (localStorage.getItem("Like") && localStorage.getItem("Like") != null) {
      var Like = localStorage.getItem("Like");
      console.log(Like);
    }
    
  }

  function addToCart() {
    if(localStorage.getItem("cart")||localStorage.getItem("cart")==null) {
      var arrCart = []
    } else {
      var cart = localStorage.getItem("cart");
      arrCart = JSON.parse(cart);
    }
    $(".addToCartBtn").click(function (e) { 
      e.preventDefault();
      var id = $(this).attr("data-id");
      // console.log(id);
      var quantity = 1;
      var productItem = [id, quantity];
      var check = 0;
      arrCart.forEach(item => {
        if(item[0]==id){
          item[1]++;
          check=1;
        }       
      });
      if (check == 0) {
        arrCart.push(productItem);
      }
      localStorage.setItem("cart",JSON.stringify(arrCart));
      Toast.fire({
        icon: 'success',
        title: 'Add To success ^^'
      });
    });
  }