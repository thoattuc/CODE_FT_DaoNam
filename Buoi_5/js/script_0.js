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

var nextlink = '';

//--- Load Data ---//
function loadData() {
  $("#logoutBtn").hide();
  if (localStorage.getItem("token") && localStorage.getItem("token") != null) {
    $("#loginBtn").hide();
    $("#logoutBtn").show();
    if(nextlink=='') {
      $.ajax({
        type: "get",
        url: url + "home",
        data: {
          apitoken: localStorage.getItem("token"),
        },
        dataType: "JSON",
        success: function (res) {
          var brands = res.brands;
          var categrories = res.categrories;
          const products = res.products.data;
          // console.log(products);
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
  
          if (products.length) {
            var productCard = ``;
            products.forEach(item => {
              productCard += `
              <div class="card col-md m-1" id="" style="width: 18rem;">
              <a href="/chitiet.html?id=`+item['id']+`">
              <img src="https://students.trungthanhweb.com/images/`+item['images']+`" class="card-img-top productImage" alt="">
              </a>
              <div class="card-body">
                  <h5 class="card-title">`+item['name']+`</h5>
                  <p class="card-text">Giá :`+Intl.NumberFormat('en-US').format(item['price'])+`</p>
                  <p class="card-text">Loại sản phẩm :`+item['catename']+`</p>
                  <p class="card-text">Thương hiệu : `+item['brandname']+`</p>
                  <p class="card-text"></p>
                  <a href="/chitiet.html?id=`+item['id']+`" class="btn btn-primary" data-id=`+item['id']+`>Detail</a>
                  <a href="#" class="btn btn-success addToCartBtn" data-id="`+item['id']+`">Add Cart</a>
              </div>
          </div>
              `;
            });
            $("#resultPrd").html(productCard);
          }
          nextlink = res.products.next_page_url;
        },
      });
    } else {
      $.ajax({
        type: "get",
        url: nextlink,
        data: {
          apitoken: localStorage.getItem("token"),
        },
        dataType: "JSON",
        success: function (res) {
          var brands = res.brands;
          var categrories = res.categrories;
          const products = res.products.data;
          // console.log(products);
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
  
          if (products.length) {
            var productCard = ``;
            products.forEach(item => {
              productCard += `
              <div class="card col-md m-1" id="" style="width: 18rem;">
              <a href="/chitiet.html?id=`+item['id']+`">
              <img src="https://students.trungthanhweb.com/images/`+item['images']+`" class="card-img-top productImage" alt="">
              </a>
              <div class="card-body">
                  <h5 class="card-title">`+item['name']+`</h5>
                  <p class="card-text">Giá :`+Intl.NumberFormat('en-US').format(item['price'])+`</p>
                  <p class="card-text">Loại sản phẩm :`+item['catename']+`</p>
                  <p class="card-text">Thương hiệu : `+item['brandname']+`</p>
                  <p class="card-text"></p>
                  <a href="/chitiet.html?id=`+item['id']+`" class="btn btn-primary" data-id=`+item['id']+`>Detail</a>
                  <a href="#" class="btn btn-success addToCartBtn" data-id="`+item['id']+`">Add Cart</a>
              </div>
          </div>
              `;
            });
            $("#resultPrd").html(productCard);
          }
          nextlink = res.products.next_page_url;
        },
      });
    }
  }
}

$("#showmoreBtn").click(function (e) { 
  e.preventDefault();
  loadData();
});

// function loadMore(x, y) {
//   $('#showmoreBtn').click(function (e) { 
//     e.preventDefault();
//     if(x+1<=y) {
//       $.ajax({
//         type: "get",
//         url: url + "home",
//         data: {
//           apitoken: localStorage.getItem('token'),
//           page: x+1,
//         },
//         dataType: "dataType",
//         success: function (res) {
//           const products = res.products.data;
//           if (products.length) {
//             var productCard = ``;
//             products.forEach(item => {
//               productCard += `
//               <div class="card col-md m-1" id="" style="width: 18rem;">
//               <a href="/chitiet.html?id=`+item['id']+`">
//               <img src="https://students.trungthanhweb.com/images/`+item['images']+`" class="card-img-top productImage" alt="">
//               </a>
//               <div class="card-body">
//                   <h5 class="card-title">`+item['name']+`</h5>
//                   <p class="card-text">Giá :`+Intl.NumberFormat('en-US').format(item['price'])+`</p>
//                   <p class="card-text">Loại sản phẩm :`+item['catename']+`</p>
//                   <p class="card-text">Thương hiệu : `+item['brandname']+`</p>
//                   <p class="card-text"></p>
//                   <a href="/chitiet.html?id=`+item['id']+`" class="btn btn-primary" data-id=`+item['id']+`>Detail</a>
//                   <a href="#" class="btn btn-success addToCartBtn" data-id="`+item['id']+`">Add Cart</a>
//               </div>
//           </div>
//               `;
//             });
//             $("#resultPrd").html(productCard);
//           }
//         }
//       });
//     }
//   });
// }
