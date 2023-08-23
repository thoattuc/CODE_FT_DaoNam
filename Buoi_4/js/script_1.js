//--- Script: jquery + alert + CRUD Todolist---//
$(document).ready(function () {
  showTodoList();
  login();
  createTodo();
  searchTodo();
  finishTodo();
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
                position: "top",
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
                position: "top",
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

//--- Logout --//
function Logout() {
  $("#logoutBtn").click(function (e) {
    e.preventDefault();
    if (
      localStorage.getItem("token") &&
      localStorage.getItem("token") !== null
    ) {
      localStorage.removeItem("token");
      Swal.fire({
        position: "top",
        icon: "success",
        title: "Logout Done!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.reload();
      });
    }
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
        },
      });
    }
  });
}

//--- Show Todo ---//
function showTodoList() {
  $("#tableTodo").hide();
  $("#deleteManyBtn").hide();
  $("#logoutBtn").hide();
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    $("#loginBtn").hide();
    $("#logoutBtn").show();
    $.ajax({
      type: "GET",
      url: "https://students.trungthanhweb.com/api/todo",
      data: {
        apitoken: localStorage.getItem("token"),
      },
      dataType: "JSON",
      success: function (res) {
        // console.log(res);
        const todoList = res.todo;
        if (todoList.length > 0) {
          var html = ``;
          var count = 1;
          todoList.forEach((item, key) => {
            if (item.status == 0) {
              html +=
                `<tr>
                <th scope="row">` +
                count++ +
                `</th>
                <td><p class=todo>${item.note}</p></td>
                <td>
                    <input class="form-check-input finish" type="checkbox" value="` +
                item.status +
                `" data-id="` +
                item.id +
                `">
                </td>
                <td>
                    <div class="d-flex">
                        <button type="button" class="btn-sm btn-danger p-0 deleteOneBtn" data-id="` +
                item.id +
                `">Del</button>
                        <button type="button" class="btn-sm btn-warning ms-1 p-0 editTodoBtn" data-id="` +
                item.id +
                `" data-key="` +
                key +
                `">Edit</button>
                    </div>
                </td>
              </tr>`;
            } else {
              html +=
                `<tr>
                <th scope="row">` +
                count++ +
                `</th>
                <td><p class=todo>${item.note}</p></td>
                <td>
                    <input class="form-check-input finish" disabled checked type="checkbox" value="` +
                item.status +
                `" data-id="` +
                item.id +
                `">
                </td>
                <td>
                    <div class="d-flex">
                        <button type="button" class="btn-sm btn-danger p-0 deleteOneBtn" data-id="` +
                item.id +
                `">Del</button>
                        <button type="button" class="btn-sm btn-warning ms-1 p-0 editTodoBtn" data-id="` +
                item.id +
                `" data-key="` +
                key +
                `">Edit</button>
                    </div>
                </td>
              </tr>`;
            }
          });
          $("#result").html(html);
          $("#tableTodo").show();
        }
        deleteTodo();
        editTodo();
        finishTodo();
        Logout();
      },
    });
  }
}

//--- finishTodo --//
function finishTodo() {
  $(".finish").change(function (e) {
    e.preventDefault();
    var id = $(this).attr("data-id");
    Swal.fire({
      icon: "question",
      text: "Did you finish todo?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $.ajax({
          type: "post",
          url: "https://students.trungthanhweb.com/api/statusTodo",
          data: {
            apitoken: localStorage.getItem("token"),
            id: id,
          },
          dataType: "JSON",
          success: function (res) {
            if (res.check == true) {
              Swal.fire({
                position: "top",
                icon: "success",
                title: "Task Completed ^^",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                window.location.reload();
              });
            } else if (res.msg.id) {
              Swal.fire({
                position: "top",
                icon: "error",
                title: res.msg.id,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          },
        });
      } else if (result.isDenied) {
        window.location.reload();
      }
    });
  });
}

//--- deleteTodo ---//
function deleteTodo() {
  $(".deleteOneBtn").click(function (e) {
    e.preventDefault();
    var id = $(this).attr("data-id");
    Swal.fire({
      title: "Do you want to delete todo?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: ``,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $.ajax({
          type: "post",
          url: "https://students.trungthanhweb.com/api/deletetodo",
          data: {
            apitoken: localStorage.getItem("token"),
            id: id,
          },
          dataType: "JSON",
          success: function (res) {
            if (res.check == true) {
              Swal.fire({
                position: "top",
                icon: "success",
                title: "Deleted todo",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                window.location.reload();
              });
            } else if (res.check == false) {
              if (res.msg.apitoken) {
                Swal.fire({
                  position: "top",
                  icon: "error",
                  title: "Invalid api! :/",
                  showConfirmButton: false,
                  timer: 1500,
                });
              } else if (res.msg.id) {
                Swal.fire({
                  position: "top",
                  icon: "error",
                  title: "Invalid id! :/",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            }
          },
        });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  });
}

//--- editTodo ---//
function editTodo() {
  $(".editTodoBtn").click(function (e) {
    e.preventDefault();
    var key = $(this).attr("data-key");
    var id = $(this).attr("data-id");
    const todo = $(".todo");
    var old = todo[key].innerText;
    $("#editTodo").val(old); //truyen text-old vao input
    $("#editModal").modal("show");
    $("#submitEditBtn").click((e) => {
      e.preventDefault();
      var todo = $("#editTodo").val().trim();
      if (todo == "") {
        Swal.fire("Empty Todo! :/", "", "warning");
      } else if (todo == old) {
        Swal.fire("Do not change Todo! :/", "", "warning");
      } else {
        $.ajax({
          type: "post",
          url: "https://students.trungthanhweb.com/api/updatetodo",
          data: {
            apitoken: localStorage.getItem("token"),
            todo: todo,
            id: id,
          },
          dataType: "JSON",
          success: function (res) {
            if (res.check == true) {
              Swal.fire({
                position: "top",
                icon: "success",
                title: "Todo Updated ^^",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                window.location.reload();
              });
            } else if (res.msg.apitoken || res.msg.todo || res.msg.id) {
              Swal.fire({
                position: "top",
                icon: "error",
                title: "Update fail! :/",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          },
        });
      }
    });
  });
}

//--- searchTodo ---//
function searchTodo() {
  $("#searchInp").keyup(function (e) { 
    var todoSearch = $(this).val().trim();
    if(todoSearch != '') {
      $.ajax({
        type: "post",
        url: "https://students.trungthanhweb.com/api/searchtodo",
        data: {
          apitoken: localStorage.getItem('token'),
          todo: todoSearch,
        },
        dataType: "JSON",
        success: function (res) {
          const todoResult = res.todo;
          if (todoResult.length > 0) {
            var html = ``;
            var count = 1;
            todoResult.forEach((item, key) => {
              if (item.status == 0) {
                html +=
                  `<tr>
                  <th scope="row">` +
                  count++ +
                  `</th>
                  <td><p class=todo>${item.note}</p></td>
                  <td>
                      <input class="form-check-input finish" type="checkbox" value="` +
                  item.status +
                  `" data-id="` +
                  item.id +
                  `">
                  </td>
                  <td>
                      <div class="d-flex">
                          <button type="button" class="btn-sm btn-danger p-0 deleteOneBtn" data-id="` +
                  item.id +
                  `">Del</button>
                          <button type="button" class="btn-sm btn-warning ms-1 p-0 editTodoBtn" data-id="` +
                  item.id +
                  `" data-key="` +
                  key +
                  `">Edit</button>
                      </div>
                  </td>
                </tr>`;
              } else {
                html +=
                  `<tr>
                  <th scope="row">` +
                  count++ +
                  `</th>
                  <td><p class=todo>${item.note}</p></td>
                  <td>
                      <input class="form-check-input finish" disabled checked type="checkbox" value="` +
                  item.status +
                  `" data-id="` +
                  item.id +
                  `">
                  </td>
                  <td>
                      <div class="d-flex">
                          <button type="button" class="btn-sm btn-danger p-0 deleteOneBtn" data-id="` +
                  item.id +
                  `">Del</button>
                          <button type="button" class="btn-sm btn-warning ms-1 p-0 editTodoBtn" data-id="` +
                  item.id +
                  `" data-key="` +
                  key +
                  `">Edit</button>
                      </div>
                  </td>
                </tr>`;
              }
            });
            $("#result").html(html);
          }
          deleteTodo();
          editTodo();
          finishTodo();
          Logout();
        },
      });
    } else {
      showTodoList();
    }
  });
}