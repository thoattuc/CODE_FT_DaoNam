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
    toast.addEventListener("mousitemeave", Swal.resumeTimer);
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
                window.location.ritemoad();
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
        window.location.ritemoad();
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

//---Show Bill---//
function billDetail() {
  $(".billDetailSitemect").click(function (e) {
    e.preventDefault();
    $(".list-group-item").removeClass("active");
    $(this).attr("active");
    var id = $(this).attr("data-id");
    $.ajax({
      type: "GET",
      url: url + "singlebill",
      data: {
        apitoken: localStorage.getItem("token"),
        id: id,
      },
      dataType: "JSON",
      success: function (res) {
        const bill = res.result;
        if(bill.length>0) {
            var sum=0;
            var billTable=``;
            bill.forEach((item, index) => {
                billTable += `
                <tr class="">
                        <td scope="row">`+(++index)+`</td>
                            <td class="text-center"><img style="height: 140px;
                            width: auto;" src="`+image+item.image+`" alt=""></td>
                            <td>`+item.productname+`</td>
                            <td>`+Intl.NumberFormat('en-US').format(item.price)+`</td>
                            <td>`+item.qty+`</td>
                            <td>`+Intl.NumberFormat('en-US').format(Number(item.price)*Number(item.qty))+`</td>
                        </tr>
                `;
                sum+=(Number(item.price)*Number(item.qty));
            });
            billTable = `
            <tr class="table-dark">
                    <td colspan="5" scope="row">Total</td>
                    <td scope="row">`+Intl.NumberFormat('en-US').format(sum)+`</td>
                    </tr>
            `
            $("#resultBillDetail").html(billTable);
            $("#billDetailTable").removeClass('hideclass');
        }
      },
    });
  });
}
