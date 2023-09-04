$(document).ready(function () {
    login();
    loadData();
});

//--- Global const ---//
const url = "https://students.trungthanhweb.com/api/";

const params = new URLSearchParams(window.location.search);

var id = params.get("id");

console.log("id:", typeof id);

var imageURL = "https://students.trungthanhweb.com/images/";

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

        if (!params.has("id")) {
            window.location.replace("index.html");
        }
        showMenu();
        showDetail();
        owl();
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
function showDetail() {
    $.ajax({
        type: "get",
        url: url + "single",
        data: {
            apitoken: localStorage.getItem("token"),
            id: id,
        },
        dataType: "json",
        success: function (res) {
            const products = res.products[0];
            var image = imageURL + products.images;
            $("#productImage").attr("src", image);

            const name = products.name;
            const price = Intl.NumberFormat("en-US").format(
                products.price * ((100 - products.discount) / 100)
            );
            const discount = products.discount + `%`;
            const brand = products.brandname;
            const category = products.catename;
            $("#productName").text(name);
            $("#discount").text(discount);
            $("#price").text(price);
            $("#categoryName").text(category);
            $("#brandName").text(brand);

            var prd = [
                id,
                products.name,
                products.discount + `%`,
                products.price * ((100 - products.discount) / 100),
            ];
            console.log("prd", prd);

            const content = products.content;
            $("#content").html(content);

            //--- Add to like ---//
            $("#addToLikeBtn").click(function (e) {
            });

            sliderImageChange()
            addToCart();

            //-----------slide_gallery:
            // const gallery = res.gallery;
            // console.log(gallery);
            // var galleryImg = ``;
            // gallery.forEach((item) => {
            //   galleryImg =
            //     `<div class="item">
            //       <img class="pointer" src="` +
            //     item +
            //     `" alt="" id="">
            //       </img>
            //     </div>
            //     `;
            //   $("#carousel").append(galleryImg);
            // });

            //------------same_producct:
            const cateProducts = res.cateproducts;
            console.log(cateProducts);
            var str = ``;
            cateProducts.forEach((el) => {
                str =
                    `
        <div class="item">
                <div class="card" style="width: 100%">
                <a href="detail.html?id=` +
                    el.id +
                    `">    
                    <img class="pt-2" style="height: auto;
                    width: 100%;
                    margin: 0px auto;" src="` +
                    (imageURL + el.image) +
                    `" alt="">
                    </a>
                    <div class="card-body">
                    <div class="card-content">
                    <h5 class="card-title">` +
                    el.name +
                    `</h5>
                    <p class="card-text">` +
                    Intl.NumberFormat("en-US").format(el.price) +
                    `</p>
                    </div>
                    <a href="detail.html?id=` +
                    el.id +
                    `" class="btn btn-primary">Detail</a>
                    </div>
                  </div>
        </div>
        `;
                $("#sameCateProduct").append(str);
            });


            const brandProducts = res.brandproducts;
            console.log(brandProducts);
            brandProducts.forEach((el) => {
                str =
                    `
        <div class="item">
                <div class="card" style="width: 100%;">
                <a href="detail.html?id=` +
                    el.id +
                    `">    
                <img class="pt-2" style="height: auto;
                width: 100%;
                margin: 0px auto;" src="` +
                    (imageURL + el.image) +
                    `" alt="">
                </a>
                    <div class="card-body">
                      <div class="card-content">
                      <h5 class="card-title">` +
                    el.name +
                    `</h5>
                      <p class="card-text">` +
                    Intl.NumberFormat("en-US").format(el.price) +
                    `</p>
                      <a href="detail.html?id=` +
                    el.id +
                    `" class="btn btn-primary">Detail</a>
                      </div>
                    </div>
                  </div>
        </div>
        `;
                $("#sameBrandProduct").append(str);
            });
            owl();
            addToCart();
        },
    });
}

//---Slide image Change ---//
function sliderImageChange() {
    $(".sliderimage").click(function (e) {
        e.preventDefault();
        var src = $(this).attr("src");
        $("#productImage").attr("src", src);
    });
}

function owl() {
    $("#carousel").owlCarousel({
        loop: true,
        margin: 20,
        nav: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 3,
                nav: false,
            },
            1200: {
                items: 4,
                nav: true,
                loop: false,
            },
        },
    });

    $("#sameCateProduct").owlCarousel({
        loop: true,
        margin: 20,

        responsiveClass: true,
        items: 6,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 3,
            },
            1000: {
                items: 5,
            },
        },
    });

    $("#sameBrandProduct").owlCarousel({
        loop: true,
        margin: 20,
        responsiveClass: true,
        items: 6,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 3,
            },
            1000: {
                items: 5,
            },
        },
    });
}

//--- Add to cart ---//
function addToCart() {
    $("#addToCartBtn").click(function (e) {
        e.preventDefault();
        if (localStorage.getItem("cart") && localStorage.getItem("cart") != null) {
            var cart = localStorage.getItem("cart");
            var arrCart = JSON.parse(cart);
        } else {
            var arrCart = [];
        }
        var check = false;
        arrCart.forEach((item) => {
            if (item[0] == id) {
                item[1]++;
                check = true;
            }
        });
        if (check == false) {
            var item = [id, 1];
            arrCart.push(item);
        }
        localStorage.setItem("cart", JSON.stringify(arrCart));
        Toast.fire({
            icon: "success",
            title: "Add to success ^^",
        });
    });
}

//--- Add to like ---//
