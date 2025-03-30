const passContainer = document.getElementById('pass-container'); 
const passTemplate = document.getElementById('pass-template');
const paginationContainer = document.getElementById('pagination'); 
const authorFilter = document.getElementById('author-filter'); 
const sortingSelect = document.getElementById('sorting-select'); 
const applyFilterButton = document.getElementById('filter-button'); 
const newPass = document.getElementById('newPass');
const userBTM = document.getElementById('users');
const exportbtn = document.getElementById('Export');

const topicSelector = document.getElementById('topicSelector');
const authorInput = document.getElementById('author-search');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const sortingInput = document.getElementById('sort-by');
const onlyAppruved = document.getElementById('isAppruved');
const PaginachionContainer = document.getElementById('PaginachionContainer');

const loginButton = document.getElementById('loginButton');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
let userMenuListenerAttached = false;

let currentPage = 1; 
let pageSize = 5; 
let pagecount;
let currentFilters = {}; 
let currentSorting = ''; 



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

function goLeft(flag){
  if(flag == 0){
    currentPage = 1;
    applyFilterButton.click(); 
  }else if (currentPage - flag > 0){
    currentPage -= flag;
    applyFilterButton.click(); 
  }
}
function goRight(flag){
  if(flag == 0){
    currentPage = pagecount;
    applyFilterButton.click(); 
  }else if (currentPage + flag <= pagecount){
    currentPage += flag;
    applyFilterButton.click(); 
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

window.addEventListener('load', () => { 
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
  if (role != "АДМИН" && role != "ДЕКАНАТ") { 
    userBTM.style.display = 'none';
    exportbtn.style.display = 'none';
  }
  paginationBTN();
  editPaginationBTN();
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

applyFilterButton.addEventListener('click', () => {
  console.log(topicSelector.value);

  passContainer.innerHTML = '';
  const params = {};
  pageSize = document.getElementById('passcount').value;

  
  if (authorInput.value.trim() !== '') {
    params.studentName = authorInput.value;
  }
  if (startDateInput.value.trim() !== '') {
    params.startDate = startDateInput.value;
  }
  if (endDateInput.value.trim() !== '') {
    params.endDate = endDateInput.value;
  }
  if (sortingInput.value.trim() !== '') {
    params.sortSetting = sortingInput.value;
  }
  if (topicSelector.value.trim() !== '') {
    params.lessonNumber = topicSelector.value;
  }
  params.isAppruved = onlyAppruved.checked; 
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

  let url = new URL('http://147.45.161.33:8080/api/skipping-requests/skippingRequestList');
  
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
    pagecount = data.totalPagesCount;
    const passes = data.list;
    passes.forEach(pass => {
      const passBlock = passTemplate.content.cloneNode(true);
      //---------------
      
      passBlock.querySelector('.author-info').textContent = `От студента: ${pass.student.name}`;
      passBlock.querySelector('.title').textContent =  `Статус: ${pass.status}`;
      passBlock.querySelector('.description').textContent =  `Причина пропуска: ${pass.reason}`;
      passBlock.querySelector('.startDate').textContent =  `Дата начала: ${pass.startDate}`;
      passBlock.querySelector('.endDate').textContent =  `Дата окончания: ${pass.endDate}`;
      passBlock.querySelector('.lessons').textContent = `Пропущенные пары: ${pass.lessons}`;
      if (pass.endDate != pass.startDate) { 
        passBlock.querySelector('.lessons').style.display = 'none';
      } 
      if(pass.status== "APPROVED"){ 
        passBlock.querySelector('.pass-block .img .img').src = "https://pngicon.ru/file/uploads/zelenaja-galochka.png"; 
        passBlock.querySelector('.pass-block .img .img').alt = pass.id; 
      } 
      else if(pass.status== "REJECTED"){ 
        passBlock.querySelector('.pass-block .img .img').src = "https://img.freepik.com/premium-vector/grunge-stroke-x-cross-grungy-vector-icon-isolated-white-background_833685-877.jpg?semt=ais_hybrid"; 
        passBlock.querySelector('.pass-block .img .img').alt = pass.id; 
      }else{ 
        passBlock.querySelector('.pass-block .img .img').src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe5SEA1HvakMihSee7vRYCjDBb1t18y0RZNg&s"; 
        passBlock.querySelector('.pass-block .img .img').alt = pass.id; 
      }
      passBlock.querySelector('.pass-block').addEventListener('click', () => { 
        localStorage.setItem('selectedPass', pass.id); 
        window.location.href = 'http://127.0.0.1:5500/pages/pass.html'; 
      });
      passContainer.appendChild(passBlock);     
      editPaginationBTN();
    });
  })
  .catch(error => { 
    console.error('Ошибка получения листа:', error); 
    alert('Ошибка получения листа: ' + error);
  }); 
})

async function Export(){
  try {
    const response = await fetch(`http://147.45.161.33:8080/api/skipping-requests/export`, {
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
            let fileName = 'skipping_requests.xlsx'
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