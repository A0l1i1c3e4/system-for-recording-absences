const loginButton = document.getElementById('loginButton');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
const newPass = document.getElementById('newPass');
const appruv = document.getElementById('appruv');

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
        localStorage.removeItem('role');
        window.location.href = "http://127.0.0.1:5500/pages/login.html"
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
        loginButton.textContent=email; 
        activate(email); 
    } else { 
        window.location.href = 'http://127.0.0.1:5500/pages/login.html'; 
        //loginButton.addEventListener('click', () => { }); 
    } 
    const role = localStorage.getItem('role');
    console.log(role);
    alert(role);
    alert(authToken);
    console.log(authToken);
    if (role != "СТУДЕНТ") { 
        newPass.style.display = 'none';
    }
    if (role != "ДЕКАНАТ" && role != "АДМИН") { 
        appruv.style.display = 'none';
    }
});