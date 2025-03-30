const loginButton = document.getElementById('in');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
const useremail = document.getElementById('email');
const fio = document.getElementById('fio');
const phone = document.getElementById('phone');
const role = document.getElementById('role');
const savebutton = document.getElementById('save');
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
    fetch('http://147.45.161.33:8080/api/account/profile', {  
      method: 'GET',  
      headers: {  
        Authorization: `Bearer ${localStorage.getItem('token')}`, 
        'Content-Type': 'application/json'  
      },  
    })  
    .then(response => {  
      if (!response.ok) {  
        return response.text().then(text => { throw new Error(text) });  
      }  
      return response.json(); 
    }) 
    .then(data => {  
      useremail.value=data.login; 
      fio.value=data.name; 
      phone.value=data.phone; 
      if(data.role=="СТУДЕНТ"){ 
        const matchingOption = Array.from(role.options).find(option => option.textContent === "Студент"); 
        matchingOption.selected = true; 
      }
      else if(data.role=="ПРЕПОДАВАТЕЛЬ"){ 
        const matchingOption = Array.from(role.options).find(option => option.textContent === "Преподаватель"); 
        matchingOption.selected = true; 
      } 
      else { 
        const matchingOption2 = Array.from(role.options).find(option => option.textContent === "Деканат"); 
        matchingOption2.selected = true;
      } 
      /*
      savebutton.addEventListener('click',()=>{ 
        let resGen=""; 
        if(role.selectedOptions[0].textContent=="Мужчина"){ 
          resGen="Male"; 
        } 
        else{resGen="Female"} 
        fetch('https://blog.kreosoft.space/api/account/profile', {  
          method: 'PUT',  
          headers: {  
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
            'Content-Type': 'application/json' 
          },  
          body: JSON.stringify({ email: useremail.value, fullName: fio.value, gender: resGen, phoneNumber: phone.value})  
        })  
        .then(response => {  
          if (!response.ok) {  
              
            return response.text().then(text => { throw new Error(text) });  
          } 
        })  
      });
      */ 
    })  
    .catch(error => {  
      console.error('Ошибка получения параметров профиля:', error);  
      alert('Ошибка получения параметров профиля: ' + error.message);  
    });  
  } else { 
    console.log('Токен не найден в localStorage.'); 
    loginButton.addEventListener('click', () => { 
      window.location.href = 'http://127.0.0.1:5500/pages/login.html'; 
    }); 
  } 
  
}); 

$(function() {  
  $("#phone").keyup(function() {  
    let phone = $(this).val().replace(/\D/g, "");  
    let formattedPhone = "";  
    phone = phone.substring(0, 12); 
      
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

function b(){ 
  window.location.href = 'http://127.0.0.1:5500/pages/register.html'; 
}