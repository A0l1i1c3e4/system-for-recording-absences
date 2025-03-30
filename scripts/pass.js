const passContainer = document.getElementById('pass-container'); 
const passTemplate = document.getElementById('pass-template');

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
  
  
  const passID =  localStorage.getItem('selectedPass');
  const params = {};
  params.skippingRequestId  = passID;
  let url = new URL('http://147.45.161.33:8080/api/skipping-requests/skippingRequest');
  
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
    console.log(data);
  
    const passBlock = passTemplate.content.cloneNode(true);
    
    passBlock.querySelector('.author-info').textContent = `От студента: ${data.student.name}`;
    passBlock.querySelector('.description').textContent =  `Причина пропуска: ${data.reason}`;
    passBlock.querySelector('.title').textContent =  `Статус: ${data.status}`;
    passBlock.querySelector('.startDate').value =  data.startDate;
    passBlock.querySelector('.endDate').value =  data.endDate;
    passBlock.querySelector('.lessons').textContent = `Пропущенные пары: ${data.lessons}`;
    if (data.endDate != data.startDate) { 
      passBlock.querySelector('.lessons').style.display = 'none';
    } 
    if (role != "АДМИН" && role != "ДЕКАНАТ") { 
      passBlock.querySelector('.APPROVEDBTN').style.display = 'none';
      passBlock.querySelector('.REJECTEDBTN').style.display = 'none';
    }
    if (role != "СТУДЕНТ") { 
      passBlock.querySelector('.datesBTN').style.display = 'none';
      passBlock.querySelector('.docs').style.display = 'none';
    }
    
    if(data.status== "APPROVED"){ 
      passBlock.querySelector('.pass-block .img .img').src = "https://pngicon.ru/file/uploads/zelenaja-galochka.png"; 
      passBlock.querySelector('.pass-block .img .img').alt = data.id; 
      passBlock.querySelector('.APPROVEDBTN').style.display = 'none';
    } 
    else if(data.status== "REJECTED"){ 
      passBlock.querySelector('.pass-block .img .img').src = "https://img.freepik.com/premium-vector/grunge-stroke-x-cross-grungy-vector-icon-isolated-white-background_833685-877.jpg?semt=ais_hybrid"; 
      passBlock.querySelector('.pass-block .img .img').alt = data.id; 
      passBlock.querySelector('.REJECTEDBTN').style.display = 'none';
    }else{ 
      passBlock.querySelector('.pass-block .img .img').src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe5SEA1HvakMihSee7vRYCjDBb1t18y0RZNg&s"; 
      passBlock.querySelector('.pass-block .img .img').alt = data.id; 
    }
    passContainer.appendChild(passBlock);     
  
  })
  .catch(error => { 
    console.error('Ошибка получения информации о пропуске:', error); 
    alert('Ошибка получения информации о пропуске: ' + error);
  }); 

});

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${day}.${month}.${year}`;
}

$( function() { 
  $( "#date" ).datepicker({ 
    dateFormat: "yy-mm-dd",
    changeMonth: true, 
    changeYear: true, 
    yearRange: "1900:2024",
  }); 
} ); 

function status(stats){
  const passID =  localStorage.getItem('selectedPass');
  const params = {};
  params.skippingRequestId  = passID;
  params.newStatus = stats;
  let url = new URL('http://147.45.161.33:8080/api/skipping-requests/changeStatus');
  
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
    method: 'PUT', 
    headers: { 
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json' 
    },      
  })
  .then(response => { 
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text) }); 
    } 
    window.location.reload();
    return response.json();
  })   
  .catch(error => { 
    console.error('Ошибка смены статуса пропуска:', error); 
    alert('Ошибка смены статуса пропуска: ' + error);
  }); 
  
}
function dates(){
  const passID =  localStorage.getItem('selectedPass');
  const params = {};
  params.skippingRequestId  = passID;
  params.newStartDate  = document.getElementById('startDate').value;
  params.newEndDate  = document.getElementById('endDate').value;
  let url = new URL('http://147.45.161.33:8080/api/skipping-requests/changeDate');
  
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
    method: 'PUT', 
    headers: { 
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json' 
    },      
  })
  .then(response => { 
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text) }); 
    } 
    window.location.reload();
    return response.json();
  })   
  .catch(error => { 
    console.error('Ошибка смены статуса пропуска:', error); 
    alert('Ошибка смены статуса пропуска: ' + error);
  }); 
}


async function Export(){
  try {
    const passID =  localStorage.getItem('selectedPass');
    const params = {};
    params.skippingRequestId  = passID;
    let url = new URL('http://147.45.161.33:8080/api/skipping-requests/getDocument');
    
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

    const response = await fetch(url, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },   
    })

    let error
    switch(response.status) {
        case 200:
            let blob = await response.blob()
            let url = window.URL.createObjectURL(blob)
            let a = document.createElement('a')
            a.href = url
            let contentDisposition = response.headers.get('Content-Disposition')
            let fileName = 'documents.zip'
            if (contentDisposition && contentDisposition.includes('filename=')) {
                fileName = contentDisposition
                    .split('filename=')[1]
                    .split(';')[0]
                    .trim()
            }
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
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