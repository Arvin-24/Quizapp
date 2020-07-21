var user_name = sessionStorage.getItem("userName");

$("h5.name").html(user_name);

$("form.logout").submit(function(){

    sessionStorage.removeItem("userName");
});