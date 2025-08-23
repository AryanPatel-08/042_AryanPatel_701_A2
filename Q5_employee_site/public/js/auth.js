$("#loginForm").submit(function (e) {
  e.preventDefault();

  $.ajax({
    url: "/api/auth/login",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      email: $("#email").val(),
      password: $("#password").val()
    }),
    success: function (res) {
      localStorage.setItem("token", res.token); // Save JWT
      window.location.href = "profile.html"; // Redirect
    },
    error: function (err) {
      $("#message").text(err.responseJSON.message);
    }
  });
});
