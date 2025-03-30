const loginButton = document.getElementById('loginButton');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
const newPass = document.getElementById('newPass');
const PaginachionContainer = document.getElementById('PaginachionContainer');
let userMenuListenerAttached = false;

let list;
let currentPage = 1; 
let pageSize = 5; 
let pagesCount;

function goLeft(flag){
    if(flag == 0) {
        currentPage = 1;
        }   else if (currentPage - flag > 0){
        currentPage -= flag;
    }
    request()
}
function goRight(flag){
    if(flag == 0) {
        currentPage = pagesCount;
    }   else if (currentPage + flag <= pagesCount){
        currentPage += flag;
    }
    request()
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
    if (currentPage + 1 < pagesCount){
      document.getElementById('button6').textContent=currentPage + 2; 
      document.getElementById('button6').style.display = 'inline-block';
    }else{
      document.getElementById('button6').style.display='none';
    }
    if (currentPage < pagesCount){
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
        localStorage.removeItem('role');
        window.location.href = "http://127.0.0.1:5500/pages/login.html"
        });
        userMenuListenerAttached = true;
    }
}

window.addEventListener('load', async () => { 
    const authToken = localStorage.getItem('token'); 
    
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
    console.log(role);
    if (role != "СТУДЕНТ") { 
        newPass.style.display = 'none';
    }
    paginationBTN();
    editPaginationBTN();

    request()
});

async function printList() {
    list.forEach(user => {
        let g = document.querySelector('.users-list');
        let newElem = document.createElement("div");
        newElem.className = 'user';
        newElem.id = user.id
        newElem.innerHTML = `<div> <span class="name">${user.name}</span>
                             <span class="login">${user.login}</span>
                             <span class="phone">${user.phone}</span>
                             <span class="role">${user.role}</span></div>
                             <div class="buttons"> <button class="approve">Одобрить</button>
                             <button class="decline">Отклонить</button></div>`;
        g.appendChild(newElem);
        
        newElem.querySelector(".decline").addEventListener("click", async () => {
            try {
                const response = await fetch(`http://147.45.161.33:8080/api/account/reject?login=${user.login}`, {
                    method: 'DELETE', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            
                let error
                switch(response.status) {
                    case 200:
                        let data = await response.json()
                        alert(data.message)
                        break
                    case 400:
                        error = await response.json()
                        alert(`Error 400\nstatus: ${error.status}\n message: ${error.message}`)
                        break
                    case 401:
                        error = await response.json()
                        alert(`Error 401\nstatus: ${error.status}\n message: ${error.message}`)
                        localStorage.clear()
                        window.location.replace("/pages/login.html")
                        break
                      case 404:
                        error = await response.json()
                        alert(`Error 404\nstatus: ${error.status}\n message: ${error.message}`)
                        break
                    case 500: 
                        error = await response.json()
                        alert(`InternalServerError\n status: ${error.status}\n message: ${error.message}`)
                        break
                }
              } catch (err) {
                  alert('Произошла ошибка при соединении с сервером.')
              } 
        })

        newElem.querySelector(".approve").addEventListener("click", async () => {
            try {
                const response = await fetch(`http://147.45.161.33:8080/api/account/approve?login=${user.login}&role=${user.role}`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: ''
                })
            
                let error
                switch(response.status) {
                    case 200:
                        let data = await response.json()
                        alert(data.message)
                        break
                    case 400:
                        error = await response.json()
                        alert(`Error 400\nstatus: ${error.status}\n message: ${error.message}`)
                        break
                    case 401:
                        error = await response.json()
                        alert(`Error 401\nstatus: ${error.status}\n message: ${error.message}`)
                        localStorage.clear()
                        window.location.replace("/pages/login.html")
                        break
                      case 404:
                        error = await response.json()
                        alert(`Error 404\nstatus: ${error.status}\n message: ${error.message}`)
                        break
                    case 500: 
                        error = await response.json()
                        alert(`InternalServerError\n status: ${error.status}\n message: ${error.message}`)
                        break
                }
              } catch (err) {
                  alert('Произошла ошибка при соединении с сервером.')
              } 
        })
    });
}

async function request() {
    document.querySelector('.users-list').innerHTML = ""
    try {
        pageSize = document.getElementById('passcount').value;
        const response = await fetch(`http://147.45.161.33:8080/api/account/registerList?page=${currentPage}&size=${pageSize}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },   
        })
    
        let error
        switch(response.status) {
            case 200:
                let data = await response.json()
                pagesCount = data.totalPagesCount
                list = data.list
                
                printList()
                editPaginationBTN();
                break
            case 400:
                error = await response.json()
                alert(`Error 400\nstatus: ${error.status}\n message: ${error.message}`)
                break
            case 401:
                error = await response.json()
                alert(`Error 401\nstatus: ${error.status}\n message: ${error.message}`)
                localStorage.clear()
                window.location.replace("/pages/login.html")
                break
              case 404:
                error = await response.json()
                alert(`Error 404\nstatus: ${error.status}\n message: ${error.message}`)
                break
            case 500: 
                error = await response.json()
                alert(`InternalServerError\n status: ${error.status}\n message: ${error.message}`)
                break
        }
      } catch (err) {
          alert('Произошла ошибка при соединении с сервером.')
      } 
}