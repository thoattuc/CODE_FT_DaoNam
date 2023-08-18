//--- Script: jquery + alert + CRUD Todolist---//
$(document).ready(function () {
  login();
  createTodo();
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

              Toast.fire({
                icon: "success",
                title: "Signed in success ^^",
              }).then(() => {
                window.location.reload();
              });
            } else {
              // alert("Invalid email! :/");
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener("mouseenter", Swal.stopTimer);
                  toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
              });

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

//--- Create Todo---//
function createTodo() {
  if (!localStorage.getItem("token") || localStorage.getItem("token") == null) {
    $("#createBtn").attr("disabled", "disabled");
  }
  $("#createBtn").click(function (e) {
    e.preventDefault();
    var todo = $("#todo").val().trim();
    //console.log(todo);
    if (todo == "") {
      Swal.fire("Empty Todo! :/", "", "warning");
    } else {
      $.ajax({
        type: "post",
        url: "https://students.trungthanhweb.com/api/todo",
        data: {
          apitoken: localStorage.getItem("token"),
          todo: todo,
        },
        dataType: "JSON",
        success: function (res) {
            if (res.check === true) {
            Swal.fire("Create Success ^^", "", "success").then(() => {
              window.location.reload();
            });
          }
          if (res.msg.apitoken) {
            Swal.fire("API token invalid! :/", "", "error");
          }
          // else if (res.msg.todo) {
          //   Swal.fire("Empty todo :/", "", "error");
          // }
        },
      });
    }
  });
}

//--- Show Todo ---//
function showTodoList() {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    $.ajax({
      type: "GET",
      url: "https://students.trungthanhweb.com/api/todo",
      data: {
        apitoken: localStorage.getItem("token"),
      },
      dataType: "JSON",
      success: function (res) {
        console.log(res);
        const todoList = res.todo;
        if (todoList.length > 0) {
          var html = ``;
          var count = 1;
          todoList.forEach((item) => {
            html +=
              `<tr>
                <th scope="row">` +
              count++ +
              `</th>
                <td>${item.note}</td>
                <td>
                    <input class="form-check-input finish" type="checkbox" value="${item.status}" id="${item.id}">
                </td>
                <td>
                    <div class="d-flex">
                        <button type="button" class="btn-sm btn-danger p-0" id="">Del</button>
                        <button type="button" class="btn-sm btn-warning ms-1 p-0" id="">Edit</button>
                    </div>
                </td>
              </tr>`;
          });
          $("#result").html(html);
        }
      },
    });
  }
}