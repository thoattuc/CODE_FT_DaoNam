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
      if (res.result != undefined && res.result.length > 0) {
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
          <td><input type="number" class="form-control  w-50 quantityInp" value="` +
            item[4] +
            `" data-id="` +
            item[0] +
            `" ></td>
          <td>` +
            Intl.NumberFormat("en-US").format(item[6]) +
            `</td>
          <td>
          <button class="btn-sm btn-danger deleteCartItem" data-id="` +
            Number(item[0]) +
            `">Del</button>
          </td>
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
      } else {
        window.location.replace("index_0.html").then(Toast.fire({
          icon: "warning",
          title: "Empty Cart!",
        }));
      }
      editQuantity();
      deleteCart();
      checkout();
    },
  });
}

//--- Edit Cart ---//
function editQuantity() {
  $(".quantityInp").change(function (e) {
    e.preventDefault();
    var id = $(this).attr("data-id");
    var newQuantity = $(this).val();
    console.log(id, newQuantity);
    var cart = JSON.parse(localStorage.getItem("cart"));
    if (newQuantity == 0) {
      Swal.fire({
        icon: "warning",
        text: "Remove product?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          var arr = [];
          cart.forEach((item) => {
            if (item[0] != id) {
              arr.push(item);
            }
          });
          if (arr.length == 0) {
            localStorage.removeItem("cart");
          } else {
            localStorage.setItem("cart", JSON.stringify(arr));
          }
          Toast.fire({
            icon: "success",
            title: "Removed !",
          }).then(() => {
            showCart();
          });
        } else if (result.isDenied) {
          showCart();
        }
      });
    } else {
      cart.forEach((item) => {
        if (item[0] == id) {
          item[1] = newQuantity;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    showCart();
  });
}

//--- Delete cart ---//
function deleteCart() {
  $(".deleteCartItem").click(function (e) {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      text: "Delete item?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Delete",
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var id = $(this).attr("data-id");
        var arr = [];
        console.log(id);
        var cart = JSON.parse(localStorage.getItem("cart"));
        cart.forEach((item) => {
          if (item[0] != id) {
            arr.push(item);
          }
        });
        if (arr.length == 0) {
          localStorage.removeItem("cart");
        } else {
          localStorage.setItem("cart", JSON.stringify(arr));
        }
        Toast.fire({
          icon: "success",
          title: "Removed",
        }).then(() => {
          showCart();
        });
      } else if (result.isDenied) {
      }
    });
  });
}

//--- Checkout ---//
function checkout() {
  $("#checkoutBtn").click(function (e) {
    e.preventDefault();
    $("#checkoutModal").modal("show");
    const format = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
    $("#submitCheckoutBtn").click(function (e) {
      e.preventDefault();
      var name = $("#nameInp").val().trim();
      var phone = $("#phoneInp").val().trim();
      var address = $("#addressInp").val().trim();

      console.log(name, phone, address);

      if(name == '') {
        Toast.fire({
          icon: "warning",
          title: "Empty name!",
        });
      } else if(phone == '') {
        Toast.fire({
          icon: "warning",
          title: "Empty phone!",
        });
      } else if (address == '') {
        Toast.fire({
          icon: "warning",
          title: "Empty address!",
        });
      } else if (!phone.match(format)) {
        Toast.fire({
          icon: "warning",
          title: "Invalid phone!",
        });
      } else {
        $("#submitCheckoutBtn").attr("disabled", "disabled");
        var cart = JSON.parse(localStorage.getItem("cart"));
        console.log(cart);
        $.ajax({
          type: "POST",
          url: url + "createBill",
          data: {
            tenKH: name,
            phone: phone,
            address: address,
            cart: cart,
            api_token: localStorage.getItem("token"),
          },
          dataType: "JSON",
          success: function (res) {
            if (res.check == true){
              console.log(res.check);
              Toast.fire({
                icon: "success",
                title: "Order success ^^",
              }).then(() => {
                localStorage.removeItem("cart");
                window.location.replace("index_0.html");
              });
            }
          }
        });
      }
    });
  });
}
