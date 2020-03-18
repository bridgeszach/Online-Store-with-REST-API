// Admin password protect - *****DISABLED*****
// function password() {
//     var password = "password";
//     var passCheck = prompt("Please enter the password:");
//     if (passCheck == null || passCheck == "") {
//         alert("User has cancelled the prompt.");
//         window.location = "index.html";
//     } else if (passCheck == password) {
//         alert("Welcome.");
//         window.location = "admin.html";
//     } else {
//         while (passCheck != password) {
//             alert("Wrong. Please try again.");
//             passCheck = prompt("Please enter the password:");
//         }

//     }
// }
// window.onload = password();

var serverURL = "http://localhost:8080/API/";
var items = [];

function init() {
    console.log('Admin Page');
}

// initialization

window.load = init();

//object constructor
class Item {
    constructor(code, title, price, description, category, image) {
        this.code = code;
        this.title = title;
        this.price = price;
        this.description = description;
        this.category = category;
        this.image = image;
        this.user = "Zach";
    }
}

function clearForm() {
    $("#code").val("");
    $("#code").focus();
    $("#title").val("");
    $("#price").val("");
    $("#description").val("");
    $("#category").val("");
    $("#image").val("");
}

function register() {
    console.log("Current Items" + items.length);

    var code = $("#code").val();
    var title = $("#title").val();
    var price = $('#price').val();
    var description = $('#description').val();
    var category = $('#category').val();
    var image = $('#image').val();

    if (code != "" && title != "" && price != "" && description != "" && category != "" && image != "") {
        //create an object
        var newItem = new Item(code, title, price, description, category, image);

        //passing the var to the attribute
        items.push(newItem);
        var jsonString = JSON.stringify(newItem);
        console.log(newItem);
        console.log(jsonString);
        alert('New Item Registered');
    }

    // Asyn JS and XML
    // send obj to server (strings, int, bool)
    $.ajax({
        url: serverURL + "items",
        type: "Post",
        contentType: "application/json",
        data: jsonString,
        success: function (response) {
            console.log("It works", response)
            //show the notification
            $('alert-box').removeClass("hidden");
            //hide the alert
            setTimeout(function () {
                $('#alert-box').addClass("hidden");
            }, 3000);
            clearForm();
        },
        error: function (errorDetails) {
            console.log("Error, Something went wrong", errorDetails);
        }
    });
}

$("#register-btn").on('click', function () {
    register();
});