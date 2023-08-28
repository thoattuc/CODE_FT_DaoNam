//--- Script: jquery + alert + CRUD Todolist ---//
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
    showCart();
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

//--- Show Cart ---//
function showCart() {
  if (localStorage.getItem("cart") && localStorage.getItem("cart") != null) {
    var cart = localStorage.getItem("cart");
    var id = JSON.parse(cart);
    console.log(cart);
  }
  $.ajax({
    type: "GET",
    url: url + "getCart",
    data: {
      apitoken: localStorage.getItem("token"),
      id: id,
    },
    dataType: "JSON",
    success: function (res) {
      console.log(res.result);
      if (res.result.length > 0) {
        var cartTable = ``;
        var sum = 0;
        res.result.forEach((item, index) => {
          cartTable +=
            `<tr class = "">
          <th scope="row">` +
            ++index +
            `</th>
          <td><img src="` +
            item[3] +
            `" alt="` +
            item[1] +
            `" class="" style="width: 150px; height: auto;">
          </td>
          <td>` +
            item[1] +
            `</td>
          <td>` +
            Intl.NumberFormat("en-US").format(item[5]) +
            `</td>
          <td>` +
            item[4] +
            `</td>
          <td>` +
            Intl.NumberFormat("en-US").format(item[6]) +
            `</td>
          <td></td>
        </tr>`;
          sum += item[6];
        });
        cartTable +=
          `
        <tr class="">
          <td colspan="5" scope="row"><b>Total:</b></td>
          <td scope="row">` +
          Intl.NumberFormat("en-US").format(sum) +
          `</td>
          <td></td>
        </tr>
        `;
        $("#cartResult").html(cartTable);
      }
    },
  });
}