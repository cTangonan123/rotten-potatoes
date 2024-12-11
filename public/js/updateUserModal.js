let users = document.querySelectorAll(".user");
for (user of users) {
  user.addEventListener("click", editUser);
}

async function editUser() {
    let url = `/api/getUsers/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    document.querySelector("#userId").value = data.id;
    document.querySelector("#userName").value = data.user_name;
    document.querySelector("#isAdmin").checked = data.is_admin;

    var myModal = new bootstrap.Modal(document.getElementById('userModal'));
    myModal.show();
}