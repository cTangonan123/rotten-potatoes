// instantiation of bootstrap message modal
const msgModal = new bootstrap.Modal(document.querySelector('#messageModal'));

document.querySelector("#messageModal").addEventListener('submit', async(e) => {
  e.preventDefault()
  console.log("clicked")
  // get all values from the form
  let el_sender_id = document.querySelector("#mSenderId")
  let el_receiver_id = document.querySelector("#mReceiverId")
  let el_title = document.querySelector("#mTitle")
  let el_message = document.querySelector("#mMessage")
  if (el_title.value == "" || el_message.value == "") {
    alert("Please fill out all fields")
    return
  }
  await fetch('/api/submitMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      sender_id: el_sender_id.value, 
      receiver_id: el_receiver_id.value, 
      title: el_title.value, 
      message: el_message.value 
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // clear the form
      el_title.value = ""
      el_message.value = ""
      alert(data.message)

      // close the modal
      msgModal.hide();
      location.reload();
    })
    .catch((error) => {
      console.error('Error:', error);
  });

  // POST request to insert message into Messages table
});