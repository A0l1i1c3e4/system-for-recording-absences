const userContainer = document.getElementById('user-container');
const userTemplate = document.getElementById('user-template');

const loginButton = document.getElementById('in');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
let userMenuListenerAttached = false;

const PaginachionContainer = document.getElementById('PaginachionContainer');
let currentPage = 1; 
let pageSize = 5; 
let pagecount;

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}.${month}.${year}`;
}

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

function goLeft(flag){
  if(flag == 0){
    currentPage = 1;
    usersLoad(); 
  }else if (currentPage - flag > 0){
    currentPage -= flag;
    usersLoad(); 
  }
}
function goRight(flag){
  if(flag == 0){
    currentPage = pagecount;
    usersLoad(); 
  }else if (currentPage + flag <= pagecount){
    currentPage += flag;
    usersLoad(); 
  }
  
}

function paginationBTN(){
  const button1 = document.createElement('button');
  button1.textContent = '<<';
  button1.id = 'button1';
  button1.addEventListener("click", ()=>{goLeft(0)});
  const button2 = document.createElement('button');
  button2.textContent = currentPage - 2;
  button2.id = 'button2';
  button2.addEventListener("click", ()=>{goLeft(2)});
  const button3 = document.createElement('button');
  button3.textContent = currentPage - 1;
  button3.id = 'button3';
  button3.addEventListener("click", ()=>{goLeft(1)});
  const button4 = document.createElement('button');
  button4.textContent = currentPage;
  button4.id = 'button4';
  const button5 = document.createElement('button');
  button5.textContent = currentPage +1;
  button5.id = 'button5';
  button5.addEventListener("click", ()=>{goRight(1)});
  const button6 = document.createElement('button');
  button6.textContent = currentPage + 2;
  button6.id = 'button6';
  button6.addEventListener("click", ()=>{goRight(2)});
  const button7 = document.createElement('button');
  button7.textContent = '>>';
  button7.id = 'button7';
  button7.addEventListener("click", ()=>{goRight(0)});
  PaginachionContainer.appendChild(button1);
  PaginachionContainer.appendChild(button2);
  PaginachionContainer.appendChild(button3);
  PaginachionContainer.appendChild(button4);
  PaginachionContainer.appendChild(button5);
  PaginachionContainer.appendChild(button6);
  PaginachionContainer.appendChild(button7);
}

function editPaginationBTN(){
  if (currentPage + 1 < pagecount){
    document.getElementById('button6').textContent=currentPage + 2; 
    document.getElementById('button6').style.display = 'inline-block';
  }else{
    document.getElementById('button6').style.display='none';
  }
  if (currentPage < pagecount){
    document.getElementById('button5').textContent=currentPage + 1; 
    document.getElementById('button5').style.display = 'inline-block';
  }else{
    document.getElementById('button5').style.display='none';
  }
  document.getElementById('button4').textContent=currentPage; 
  if (currentPage > 1){
    document.getElementById('button3').textContent=currentPage - 1; 
    document.getElementById('button3').style.display = 'inline-block';
  }else{
    document.getElementById('button3').style.display='none';
  }
  if (currentPage > 2){
    document.getElementById('button2').textContent=currentPage - 2; 
    document.getElementById('button2').style.display = 'inline-block';
  }else{
    document.getElementById('button2').style.display='none';

  }
}

function usersLoad(){
  
  userContainer.innerHTML = '';
  const params = {};
  pageSize = document.getElementById('passcount').value;
  if (currentPage != 1){
    params.page =currentPage;
  } else {
    params.page = 1;
  }
  if (pageSize != 5 && pageSize > 0){
    params.size = pageSize;
  } else {
    params.size = 5;
  }

  let url = new URL('http://147.45.161.33:8080/api/user/list');
  
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      let value = params[key];
      if (Array.isArray(value)) {
        value = value.join(',');
      } else if (typeof value === 'number' && isNaN(value)) {
        continue;
      }
      url.searchParams.append(key, value);
    }
  }

  console.log(url);
  fetch(url, { 
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
    pagecount = data.totalPagesCount;
    console.log(data);
    let Users = data.list;
    Users.forEach(user => { 
      const userBlock = userTemplate.content.cloneNode(true); 
      if(user.role=="ДЕКАНАТ")        {
        userBlock.querySelector('img').src = 'https://sun9-80.userapi.com/impg/ABAM2rjROlJJKMK5fNiiKxoLtroQKf2K49-Hwg/Di0hQkgh318.jpg?size=387x387&quality=95&sign=4e3618501c6833a9798a101cb313e3d5&type=album';
      }
      else {userBlock.querySelector('img').src = 'https://sun9-80.userapi.com/impg/msquQVKiPuvj-EEPAo3v1-rj4kptEnmZYVJ24Q/86f_6d-bfFM.jpg?size=386x383&quality=95&sign=ef97469c6ae92fbca9d459007d3bfa75&type=album';}
      
      userBlock.querySelector('.name').textContent = user.name;  
      userBlock.querySelector('.phone').textContent = `Телефон: ${user.phone}`; 
      userBlock.querySelector('.user-stats .login').textContent = user.login; 
      userBlock.querySelector('.user-stats .password').textContent = user.password; 
      userBlock.querySelector('img').addEventListener('click', () => { 
        localStorage.setItem('selectedUser', user.id); 
        window.location.href = 'http://127.0.0.1:5500/pages/main.html'; 
      });
      userContainer.appendChild(userBlock); 
      editPaginationBTN();
    });
  }) 
  .catch(error => { 
    console.error('Ошибка получения параметров user:', error); 
    if (error.message.includes('401')) {
      window.location.href = 'http://127.0.0.1:5500/pages/login.html'
    }
    alert('Ошибка получения параметров user: ' + error.message); 
  })
}


window.addEventListener('load', () => { 

  const authToken = localStorage.getItem('token'); 
  //alert(authToken);
  if (authToken) { 
    //console.log(authToken);
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
    loginButton.textContent=email; 
    activate(email); 
  } else { 
    window.location.href = 'http://127.0.0.1:5500/pages/login.html'; 
  } 
  const role = localStorage.getItem('role');
  
  paginationBTN();
  editPaginationBTN();
  if (role != "АДМИН") { 
    console.log("bad role");
    alert(authToken);
    window.location.href = 'http://127.0.0.1:5500/pages/main.html';
  }else{
    usersLoad();   
  }
});