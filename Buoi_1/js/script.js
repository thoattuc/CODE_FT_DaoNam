//Page onload:
// alert("Hello Alien!");
// var name = prompt("Input name...");
// alert("I am " + name);

var name = "";

var arr_name = [];

function inputName() {
    name = document.getElementById("name").value;
    arr_name.push(name);
    // console.log(name);
    console.log(arr_name);

    //Print HTML:
    var str_name_list = ``;
    var div = document.getElementsByClassName("div");
    arr_name.forEach(Index => {
        str_name_list = ` ` + Index + ` `;
    });
    div[1].innerHTML = str_name_list;
    console.log(str_name_list);
}



// const a = 1;
// a = 2;
// console.log(a);
// error

// var b = 1;
// b = 2;
// console.log(b);
// 2
