//--- Start ---//
$(document).ready(function () {
    login();
    loadData();
    showmore();
    searchProducts();
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
var link = url + "home";
var page = "";

function loadData() {
    $("#logoutBtn").hide();
    if (localStorage.getItem("token") && localStorage.getItem("token") != null) {
        $("#loginBtn").hide();
        $("#logoutBtn").show();
        $("#showmoreBtn").click(function (e) {
            e.preventDefault();
            showmore();
        });
    }
}

function showmore() {
    $.ajax({
        type: "GET",
        url: link,
        data: {
            apitoken: localStorage.getItem("token"),
        },
        dataType: "JSON",
        success: function (res) {
            var brands = res.brands;
            var categrories = res.categrories;
            const products = res.products.data;
            link = res.products.next_page_url;

            if (brands.length) {
                var brandsLi = ``;
                brands.forEach((item) => {
                    brandsLi +=
                        `<li><a class="dropdown-item" href="brands.html?id=` +
                        item.id +
                        `" data-id="` +
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
                        `<li><a class="dropdown-item" href="categrories.html?id=` +
                        item.id +
                        `" data-id="` +
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
                products.forEach((item) => {
                    productCard +=
                        `
          <div class="col-md-3 mb-3">
          <div class="card" style="width: 100%;" id="" style="width: 18rem;">
          <a href="/chitiet.html?id=` +
                        item["id"] +
                        `">
          <img src="https://students.trungthanhweb.com/images/` +
                        item["images"] +
                        `" class="card-img-top productImage" alt="">
          </a>
          <div class="card-body">
              <h5 class="card-title">` +
                        item["name"] +
                        `</h5>
              <p class="card-text">Giá :` +
                        Intl.NumberFormat("en-US").format(item["price"]) +
                        `</p>
              <p class="card-text">Loại sản phẩm :` +
                        item["catename"] +
                        `</p>
              <p class="card-text">Thương hiệu : ` +
                        item["brandname"] +
                        `</p>
              <p class="card-text"></p>
              <a href="detail.html?id=` +
                        item["id"] +
                        `" class="btn btn-primary" data-id=` +
                        item["id"] +
                        `>Detail</a>
              <a href="#" class="btn btn-success addToCartBtn" data-id="` +
                        item["id"] +
                        `">Add Cart</a>
          </div>
      </div>
      </div>
          `;
                });
                $("#groupPrd").text("All Product");
                $("#resultPrd").append(productCard);
            }
            console.log();
            if (link == null) {
                $("#showmoreBtn").hide();
            }
            addToCart();
        },
    });
}

//---Search Products---//
function searchProducts() {
    $("#searchBtn").click(function (e) {
        e.preventDefault();
        var name = $("#searchProduct").val().trim();
        if (name != "") {
            $.ajax({
                type: "GET",
                url: url + "getSearchProducts",
                data: {
                    apitoken: localStorage.getItem("token"),
                    name: name,
                },
                dataType: "JSON",
                success: function (res) {
                    if (res.check == true) {
                        if (res.result.length > 0) {
                            var products = res.result;
                            var str = ``;
                            products.forEach((el) => {
                                str +=
                                    `
                                      <div class="col-md-3 mb-3">
                                          <div class="card" style="width: 100%;">
                                              <img class="productImage"  src="https://students.trungthanhweb.com/images/` +
                                    el["image"] +
                                    `">
                                              <div class="card-body">
                                                  <a href="#">
                                                  <h5 class="card-title">` +
                                    el.name +
                                    `</h5></a>
                                                  <p class="card-text">
                                                      Price : ` +
                                    Intl.NumberFormat("en-US").format(el.price) +
                                    `    
                                                  </p>
                                                  <p>Categrory : ` +
                                    el.catename +
                                    `</p>
                                                  <p>Brand : ` +
                                    el.brandname +
                                    `</p>
                                                  <a href="detail.html?id=` +
                                    el.id +
                                    `" class="btn btn-primary detailBtn"
                                                  data-id="` +
                                    el.id +
                                    `">Detail</a>
                                    <a href="#" class="btn btn-success addToCartBtn" data-id="` +
                                    el["id"] +
                                    `">Add Cart</a>
                                              </div>
                                          </div>
                                      </div>
                                      `;
                            });
                            $("#resultPrd").html(str);
                            $("#showmoreBtn").hide();
                        } else {
                            var str = ``;
                            str += `
                              <h4 class="text-center text-danger ">None Product!</h4>
                              `;
                            $("#resultPrd").html(str);
                            $("#showmoreBtn").hide();
                        }
                    } else {
                        $.ajax({
                            type: "GET",
                            url: url + "getSearchProducts",
                            data: {
                                apitoken: localStorage.getItem("token"),
                            },
                            dataType: "JSON",
                            success: function (res) {
                                if (res.check == true) {
                                    console.log(res);
                                    if (res.result.data && res.result.data.length > 0) {
                                        const products = res.result.data;
                                        var str = ``;
                                        products.forEach((el) => {
                                            str +=
                                                `
                                                      <div class="col-md-3 mb-3">
                                                          <div class="card" style="width: 100%;">
                                                              <img class="productImage"  src="https://students.trungthanhweb.com/images/` +
                                                el["image"] +
                                                `">
                                                              <div class="card-body">
                                                                  <a href="#">
                                                                  <h5 class="card-title">` +
                                                el.name +
                                                `</h5></a>
                                                                  <p class="card-text">
                                                                      Price : ` +
                                                Intl.NumberFormat("en-US").format(el.price) +
                                                `    
                                                                  </p>
                                                                  <p>Categrory : ` +
                                                el.catename +
                                                `</p>
                                                                  <p>Brand : ` +
                                                el.brandname +
                                                `</p>
                                                                  <a href="detail.html?id=` +
                                                el.id +
                                                `" class="btn btn-primary detailBtn"
                                                                  data-id="` +
                                                el.id +
                                                `">Detail</a>
                                                <a href="#" class="btn btn-success addToCartBtn" data-id="` +
                                                el["id"] +
                                                `">Add Cart</a>
                                                              </div>
                                                          </div>
                                                      </div>
                                                      `;
                                        });
                                        $("#resultPrd").html(str);
                                        $("#showmoreBtn").show();
                                    }
                                }
                            },
                        });
                    }
                    addToCart();
                },
            });
        }
    });
}

function addToCart() {
    if (!localStorage.getItem("cart") || localStorage.getItem("cart") == null) {
        var arrCart = [];
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
        arrCart.forEach((item) => {
            if (item[0] == id) {
                item[1]++;
                check = 1;
            }
        });
        if (check == 0) {
            arrCart.push(productItem);
        }
        localStorage.setItem("cart", JSON.stringify(arrCart));
        Toast.fire({
            icon: "success",
            title: "Add To success ^^",
        });
    });
}
