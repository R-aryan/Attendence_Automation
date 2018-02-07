var logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', () => {
  axios
    .get('/logout')
    .then(res => {
      window.location.href = "http://localhost:3000/login"
    })
    .catch(error => {
      console.log(error);
    });
});