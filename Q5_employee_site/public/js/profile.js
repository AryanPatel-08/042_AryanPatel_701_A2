$(document).ready(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
  }

  $.ajax({
    url: "/api/employees/profile",
    method: "GET",
    headers: { Authorization: token },
    success: function (res) {
      $("#profile").html(`
        <p><b>Employee ID:</b> ${res.empId}</p>
        <p><b>Name:</b> ${res.name}</p>
        <p><b>Email:</b> ${res.email}</p>
        <p><b>Salary:</b> ${res.salary}</p>
      `);
    },
    error: function () {
      alert("Session expired, please login again");
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }
  });

  $("#logoutBtn").click(function () {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
});
