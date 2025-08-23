$(document).ready(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
  }

  // Apply Leave
  $("#leaveForm").submit(function (e) {
    e.preventDefault();

    $.ajax({
      url: "/api/leaves/apply",
      method: "POST",
      headers: { Authorization: token },
      contentType: "application/json",
      data: JSON.stringify({
        date: $("#date").val(),
        reason: $("#reason").val()
      }),
      success: function (res) {
        alert("Leave Applied");
        loadLeaves();
      },
      error: function () {
        alert("Error applying leave");
      }
    });
  });

  // Load Leaves
  function loadLeaves() {
    $.ajax({
      url: "/api/leaves/list",
      method: "GET",
      headers: { Authorization: token },
      success: function (res) {
        $("#leaveList").empty();
        res.forEach(leave => {
          $("#leaveList").append(`
            <li>${leave.date.split("T")[0]} - ${leave.reason} [${leave.grant}]</li>
          `);
        });
      }
    });
  }

  loadLeaves();

  // Logout
  $("#logoutBtn").click(function () {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
});
