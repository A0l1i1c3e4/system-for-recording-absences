const loginButton = document.getElementById('in');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');

let userMenuListenerAttached = false;

function activate(email){
  if (!userMenuListenerAttached) {
    loginButton.addEventListener('click', () => {
      userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
    });
    loginButton.textContent = email + ' ▾';
    profileButton.style.display = 'inline-block';
    logoutButton.style.display = 'inline-block';

    profileButton.addEventListener('click', () => {
      window.location.href = 'http://127.0.0.1:5500/pages/profile.html'
    });

    logoutButton.addEventListener('click', () => {
      fetch('http://147.45.161.33:8080/api/account/logout', { 
        method: 'GET',  
        headers: {  
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
          'Content-Type': 'application/json'  
        },
      }) 
      .catch(error => { 
        console.error('Ошибка выхода:', error); 
        alert('Ошибка выхода: ' + error.message); 
      }); 
      localStorage.removeItem('token');
      window.location.reload();
    });
    userMenuListenerAttached = true;
  }
}

window.addEventListener('load', () => {
  const authToken = localStorage.getItem('token');
  if (authToken) {
    fetch('http://147.45.161.33:8080/api/account/checkToken', { 
      method: 'GET',  
      headers: {  
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
          'Content-Type': 'application/json'  
      },
    }) 
    .catch(error => { 
      localStorage.removeItem('token');
      window.location.href = 'http://127.0.0.1:5500/pages/login.html'; 
    }); 
    email=localStorage.getItem('email')
    document.getElementById('in').textContent=email;
    activate(email);
  } else {

    loginButton.addEventListener('click', ()=>{
      window.location.href = 'http://127.0.0.1:5500/pages/login.html'
    })
  }
});


function Enter(){ 
  const email = document.getElementById('email').value; 
  const password = document.getElementById('password').value; 

  if (email === '' || password === '') { 
    alert('Пожалуйста, заполните все поля!'); 
    return; 
  } 
 
  fetch('http://147.45.161.33:8080/api/account/login', { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json' 
    }, 
    body: JSON.stringify({ login: email, password: password }) 
  }) 
  .then(response => { 
    if (!response.ok) {   
      return response.text().then(text => { throw new Error(text) }); 
    } 
    return response.json();
  }) 
  .then(data => { 
    const token = data.token; 
    if (token) {  
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      fetch('http://147.45.161.33:8080/api/user/role', { 
        method: 'GET',  
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'},
      }) 
      .then(response => { 
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) }); 
        } 
        return response.json();
      }) 
      .then(data => { 
        const role = data.role; 
        console.log(role);
        
        if (role) {  
          localStorage.setItem('role', role);
        } else {  
          console.error('Роль не найден в заголовке ответа.');  
        }  
      }) 
      .catch(error => { 
        console.error('Ошибка получения роли:', error); 
        alert('Ошибка получения роли: ' + error.message); 
      });
      alert(localStorage.getItem('role')); 
      window.location.href = 'http://127.0.0.1:5500/pages/main.html'; 
      activate(email);
    } else {  
      console.error('Токен не найден в заголовке ответа.');  
    }  
  }) 
  .catch(error => { 
    console.error('Ошибка входа:', error); 
    alert('Ошибка входа: ' + error.message); 
  }); 
}


function CheckIn(){
  window.location.href = 'http://127.0.0.1:5500/pages/register.html';
}