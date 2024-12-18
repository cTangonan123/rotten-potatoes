document.querySelector('#loginForm').addEventListener('submit', async(e) => {
  e.preventDefault()
  let user_name = document.querySelector('#user_name').value
  let password = document.querySelector('#password').value
  await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user_name: user_name, password: password })
  })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      else if (response.redirected) {
        document.location.href = response.url;
      }
      else return response.json();
    }).then(data => {
      if (data.message) {
        document.querySelector(".alert").classList.remove('d-none')
        document.querySelector(".alert").innerHTML = data.message
      }
      else {
        document.querySelector(".alert").classList.add('d-none')
        document.querySelector(".alert").innerHTML = ''
      }
      // document.querySelector('#loginForm').reset()
      
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    
});