const loginButton = document.getElementById('loginButton');
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
      window.location.href = 'http://127.0.0.1:5500/pages/login.html'
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
    //console.log('Токен не найден в localStorage.');
  }
});

$( function() { 
  $( "#birthdate" ).datepicker({ 
    dateFormat: "dd.mm.yy",
    changeMonth: true, 
    changeYear: true, 
    yearRange: "1900:2024",
  }); 
} ); 

$(function() { 
  $("#phone").keyup(function() { 
    let phone = $(this).val().replace(/\D/g, "");
    phone = phone.substring(0, 12);
    let formattedPhone = ""; 
  
    if (phone.length > 0) { 
      formattedPhone += "+7 ("; 
    }
    if (phone.length >= 4) { 
      formattedPhone += phone.substring(1, 4) + ") "; 
    } else { 
      formattedPhone += phone.substring(1, phone.length); 
    } 
    if (phone.length >= 7) { 
      formattedPhone += phone.substring(4, 7) + "-"; 
    } else if (phone.length > 4) { 
        formattedPhone += phone.substring(4, phone.length); 
    } 
    if (phone.length >= 9) { 
      formattedPhone += phone.substring(7, 9) + "-"; 
    } else if (phone.length > 7) { 
        formattedPhone += phone.substring(7, phone.length) ; 
    } 
    if (phone.length >= 11) { 
      formattedPhone += phone.substring(9, 11); 
    } else if (phone.length > 9) { 
        formattedPhone += phone.substring(9, phone.length); 
    } 
    $(this).val(formattedPhone); 
  }); 
});

function formatDate(dateString) {
  const parts = dateString.split('.');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const date = new Date(year, month, day, 12, 0, 0, 0); 
  const isoDateString = date.toISOString(); 
  return isoDateString;
}
function register(){ 
  const name = document.getElementById('fio').value;
  //const birthdate = formatDate(document.getElementById('birthdate').value);
  const role = document.getElementById('role').value; 
  const phone = document.getElementById('phone').value;  
  const email = document.getElementById('email').value; 
  const password = document.getElementById('password').value; 

  if (email === '' || password === '') { 
    alert('Пожалуйста, заполните все поля!'); 
    return; 
  } 
  
    fetch('http://147.45.161.33:8080/api/account/register', { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json' 
    }, 
    body: JSON.stringify({ name: name, password: password, login: email, phone: phone, role: role}) 
  }) 
  .then(response => { 
    if (!response.ok) { 
      return response.text().then(text => { throw new Error(text) }); 
    } 
    return response.json();
  }) 
  .then(data => { 
    
    console.log('Успешный вход:', data); 
    const message = data.message; 
    if (message) {  
      window.location.href = 'http://127.0.0.1:5500/pages/post.html';
      alert(message); 
    } else {    
      console.error('message не найден в заголовке ответа.');  
    }  
  }) 
  .catch(error => { 
    console.error('Ошибка входа:', error); 
    alert('Ошибка входа: ' + error.message); 
  }); 
}

function a(){
  window.location.href = 'http://127.0.0.1:5500/pages/login.html'
}