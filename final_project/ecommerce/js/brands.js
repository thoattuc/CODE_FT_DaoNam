$(document).ready(function () {
    checkLogin();
    loadData();
  });
  
  //--- Global const ---//
  const api = "https://students.trungthanhweb.com/api/";
  
  const image = "https://students.trungthanhweb.com/images/";
  
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
  
  //--- Check Login ---//
  function checkLogin() {
    if (!localStorage.getItem("token") || localStorage.getItem("token") == null) {
      window.location.replace("index.html");
    }
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
      getProducts();
    }
  }
  
  function getProducts() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("id")) {
      window.location.replace("index.html");
    }
    var id = params.get("id");
    var page = 1;
    if (params.has("page")) {
      page = params.get("page");
    }
    $.ajax({
      type: "GET",
      url: api + "getBrandProducts",
      data: {
        apitoken: localStorage.getItem("token"),
        id: id,
        page: page,
      },
      dataType: "JSON",
      success: function (res) {
        console.log(res);
  
        if (res.check == true) {
          const brands = res.brands;
          const categrories = res.categrories;
  
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
  
          const products = res.products.data;
  
          if (products.length > 0) {
            var str = ``;
            products.forEach((item) => {
              str +=
                `
                          <div class="col-md-4">
                          <div class="card w-100 pt-3">
                              <img style="width:300px;height:auto;margin:0px auto" src="` +
                image +
                item.image +
                `" class="card-img-top" alt="...">
                              <div class="card-body ps-3">
                                <h5 class="card-title">` +
                item.name +
                `</h5>
                                <p class="card-text">Price : ` +
                Intl.NumberFormat("en-US").format(item.price) +
                `</p>
                <a href="detail.html?id=` +
                item["id"] +
                `" class="btn btn-primary" data-id=` +
                item["id"] +
                `>Detail</a>
                                <a href="#" class="btn btn-success addToCartBtn" data-id="` +
                item.id +
                `">Add To Cart</a>
                              </div>
                            </div>
                      </div>
                          `;
            });
  
            $("#groupPrd").text(res.brands[id - 1].name);
  
            $("#resultProducts").html(str);
            
            var pages = res.products.last_page;
            str = ``;
            var i = 1;
            while (i <= pages) {
              if (i == res.products.current_page) {
                str +=
                  `
                              <li class="page-item active"><a class="page-link" href="categrories.html?id=` +
                  id +
                  `&page=` +
                  i +
                  `">` +
                  i +
                  `</a></li>
                              `;
              } else {
                str +=
                  `
                              <li class="page-item"><a class="page-link" href="categrories.html?id=` +
                  id +
                  `&page=` +
                  i +
                  `">` +
                  i +
                  `</a></li>
                              `;
              }
              i++;
            }
            $("#pagination").html(str);
            $("#searchPriceBtn").click(function (e) {
              e.preventDefault();
              searchPrice(id);
              addToCart();
            });
            addToCart();
          }
        }
      },
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
  
  //---SearchPrice---//
  function searchPrice(id) {
    var lowPrice = $("#lowPrice").val();
    var maxPrice = $("#maxPrice").val();
    var option = "";
    if (lowPrice == "" && maxPrice != "") {
      option = "maxPrice";
    } else if (lowPrice != "" && maxPrice == "") {
      option = "minPrice";
    } else if (lowPrice != "" && maxPrice != "") {
      option = "priceBetween";
    }
    switch (option) {
      case "maxPrice":
        {
          $.ajax({
            type: "GET",
            url: api + "searchCatePrice",
            data: {
              apitoken: localStorage.getItem("token"),
              price2: maxPrice,
              id: id,
            },
            dataType: "JSON",
            success: function (res) {
              if (res.check == true && res.products.length > 0) {
                var str = ``;
                res.products.forEach((item) => {
                  str +=
                    `
                                  <div class="col-md-4 mb-3">
                                  <div class="card w-100 pt-3">
                                      <img style="width:300px;height:auto;margin:0px auto" src="` +
                    image +
                    item.image +
                    `" class="card-img-top" alt="...">
                                      <div class="card-body ps-3">
                                          <h5 class="card-title">` +
                    item.name +
                    `</h5>
                                          <p class="card-text">Price : ` +
                    Intl.NumberFormat("en-US").format(item.price) +
                    `</p>
                    <a href="detail.html?id=` +
                    item["id"] +
                    `" class="btn btn-primary" data-id=` +
                    item["id"] +
                    `>Detail</a>
                                          <a href="#" class="btn btn-success addToCartBtn" data-id="` +
                    item.id +
                    `">Add to cart</a>
                                      </div>
                                      </div>
                                  </div>
                                  `;
                });
                $("#resultProducts").html(str);
                addToCart();
              }
            },
          });
        }
        break;
  
      case "minPrice":
        {
          $.ajax({
            type: "GET",
            url: api + "searchCatePrice",
            data: {
              apitoken: localStorage.getItem("token"),
              price1: lowPrice,
              id: id,
            },
            dataType: "JSON",
            success: function (res) {
              if (res.check == true && res.products.length > 0) {
                var str = ``;
                res.products.forEach((item) => {
                  str +=
                    `
                              <div class="col-md-4 mb-3">
                              <div class="card w-100 pt-3">
                                  <img style="width:300px;height:auto;margin:0px auto" src="` +
                    image +
                    item.image +
                    `" class="card-img-top" alt="...">
                                  <div class="card-body ps-3">
                                      <h5 class="card-title">` +
                    item.name +
                    `</h5>
                                      <p class="card-text">Price : ` +
                    Intl.NumberFormat("en-US").format(item.price) +
                    `</p>
                    <a href="detail.html?id=` +
                    item["id"] +
                    `" class="btn btn-primary" data-id=` +
                    item["id"] +
                    `>Detail</a>
                                      <a href="#" class="btn btn-success addToCartBtn" data-id="` +
                    item.id +
                    `">Add to cart</a>
                                  </div>
                                  </div>
                              </div>
                              `;
                });
                console.log(str);
                $("#resultProducts").html(str);
                addToCart();
              }
            },
          });
        }
        break;
  
      case "priceBetween":
        {
          $.ajax({
            type: "GET",
            url: api + "searchCatePrice",
            data: {
              apitoken: localStorage.getItem("token"),
              price1: lowPrice,
              price2: maxPrice,
              id: id,
            },
            dataType: "JSON",
            success: function (res) {
              if (res.check == true) {
                var str = ``;
                res.products.forEach((item) => {
                  str +=
                    `
                              <div class="col-md-4 mb-3">
                              <div class="card w-100 pt-3">
                                  <img style="width:300px;height:auto;margin:0px auto" src="` +
                    image +
                    item.image +
                    `" class="card-img-top" alt="...">
                                  <div class="card-body ps-3">
                                      <h5 class="card-title">` +
                    item.name +
                    `</h5>
                                      <p class="card-text">Price : ` +
                    Intl.NumberFormat("en-US").format(item.price) +
                    `</p>
                    <a href="detail.html?id=` +
                    item["id"] +
                    `" class="btn btn-primary" data-id=` +
                    item["id"] +
                    `>Detail</a>
                                      <a href="#" class="btn btn-success addToCartBtn" data-id="` +
                    item.id +
                    `">Add to cart</a>
                                  </div>
                                  </div>
                              </div>
                              `;
                });
                $("#resultProduct").html(str);
                addToCart();
              }
            },
          });
        }
        break;
  
      default:
        break;
    }
    $("#pagination").hide();
  }