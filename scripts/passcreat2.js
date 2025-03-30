let userMenuListenerAttached = false;
const loginButton = document.getElementById('in');
let addBtn = document.getElementById("create-pass")
let modalWindow = document.getElementById("modal")
let windowName = modalWindow.querySelector('.modal-title label')
let cancelBtn = document.querySelector(".cancel")
let saveBtn = document.querySelector(".save")
let overlay = document.getElementById("modal-overlay")
let startDate = document.getElementById("modal-start-date")
let endDate = document.getElementById("modal-end-date")
let reason = document.getElementById("modal-reason-field")
let pickedClasses = document.querySelector(".pick-classes")
let selectedClasses

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
  }
}); 

addBtn.addEventListener("click", function() {
  event.preventDefault()  
  windowName.textContent = "Создание пропуска"
  modalWindow.style.display = "block"
  overlay.style.display = "block"
});

[overlay, cancelBtn].forEach(elem => {
  elem.addEventListener('click', function() {
      event.preventDefault()
      modalWindow.style.display = overlay.style.display = "none"
      startDate.value = endDate.value = ""
  })
})

let isVisible
function updateVisibility() {
  if (startDate.value == endDate.value) {
    pickedClasses.style.display = "flex"
    isVisible = true
  } else {
    pickedClasses.style.display = "none"
    isVisible = false
  }
}

startDate.addEventListener("input", updateVisibility);
endDate.addEventListener("input", updateVisibility);

function setError(field, message) {
  field.style.borderColor = "#ea6769"
  field.nextElementSibling.style.color = "#ea6769"
  field.nextElementSibling.textContent = message
}

function clearError(field) {
  field.style.borderColor = ""
  field.nextElementSibling.textContent = ""
}

document.addEventListener('DOMContentLoaded', function() {
  [startDate,endDate,reason,].forEach(field => {
      field.addEventListener('focus', function () {
          clearError(field)
      })
  })
})

saveBtn.addEventListener('click', async function() {
  event.preventDefault()
  let valid = true

  if(!startDate.value) {
    setError(startDate, 'Начальная дата не может быть пустой')
    valid = false
  } else {
      let selectedDate = new Date(startDate.value).setHours(0,0,0,0)
      
      if (selectedDate < new Date().setHours(0,0,0,0)) {
        setError(startDate, 'Начальная дата  не может быть в прошлом')
        valid = false
      } else {
        clearError(startDate)
    }
  }

  if(!endDate.value) {
    setError(endDate, 'Конечная дата не может быть пустой')
    valid = false
  } else {
      let selectedDate = new Date(endDate.value).setHours(0,0,0,0)
      
      if (selectedDate < new Date().setHours(0,0,0,0)) {
        setError(endDate, 'Конечная дата не может быть в прошлом')
        valid = false
      } else if (selectedDate < new Date(startDate.value).setHours(0,0,0,0)){
        setError(endDate, 'Конечная дата не может быть раньше начальной')
        valid = false
      } else {
        clearError(endDate)
    }
  }

  if (reason.value.length < 1) {
    setError(reason, "Причина не может быть пустой")
    valid = false
  } else {
    clearError(reason)
  }

  if (isVisible) {
    let selectedCheckboxes = document.querySelectorAll('input[name="classes"]:checked')

    if (selectedCheckboxes.length < 1) {
      let alert = document.getElementById("classes-alert")
      alert.textContent = "Выберите пары, которые пропустите"
      alert.style.color = "#ea6769"
      valid = false
    } else {
      selectedClasses = []

      selectedCheckboxes.forEach(checkbox => {
        selectedClasses.push(parseInt(checkbox.value))
      })
      console.log(JSON.stringify(selectedClasses))
    }
  }

  if (!valid) {
    return
  }

  try {
    const response = await fetch('http://147.45.161.33:8080/api/skipping-requests/create', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            startDate: startDate.value,
            endDate: endDate.value,
            reason: reason.value,
            lessons: isVisible ? selectedClasses : []
        }),    
    })

    let error
    switch(response.status) {
        case 200:
            alert("Заявка на пропуск успешно отправлена, ожидайте вердикта")
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
