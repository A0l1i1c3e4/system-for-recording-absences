const loginButton = document.getElementById('loginButton');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
const newPass = document.getElementById('newPass');

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
    } 
    const role = localStorage.getItem('role');
    console.log(role);
});

let requestID = localStorage.getItem("selectedPass")
document.getElementById("send").addEventListener("click", async () => {
    try {
        let formData = new FormData()   
        let fileInput = document.getElementById('file')
    
        for (const file of fileInput.files) {
            formData.append('files', file)
        }
        console.log(formData)
        const response = await fetch(`http://147.45.161.33:8080/api/skipping-requests/addDocument?request=${requestID}`, {
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }, 
            body: formData
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