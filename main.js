// Declare API 變數
const BASE_URL = "https://lighthouse-user-api.herokuapp.com/";
const INDEX_URL = BASE_URL + "api/v1/users/";
let originalData = [];
let data = [];

// Display user List
const dataPanel = document.getElementById("data-panel");

// Match Mode 變數
// 共用變數
let operationMode = 'home';
let filterGender = undefined; // filterGenderData 函式使用

// 一般變數
const quickMatch = document.getElementById('quickMatch');
const matchMale = document.getElementById('matchMale');
const matchFemale = document.getElementById('matchFemale');

// 宣告 list 和 refresh 變數
let list;
const refresh = document.querySelectorAll('.refresh');

// Step 0: 清空 sessionStorage 資料
clearStorage()
// clearStorage() 函式
function clearStorage() {
    return list = sessionStorage.removeItem('favoriteUser');
}

// 點擊 refresh 或是 按 F5，讓系統重新開始
for (let i = 0; i < 2; i++) {
    refresh[i].addEventListener("click", catchAPIdata)
    refresh[i].addEventListener("click", clearStorage)
}

// 宣告 home 變數
const homeGroup = document.getElementById('home')

// 綁定 Home 事件，讓資料正確顯示
homeGroup.addEventListener('click', e => {
    operationMode = e.target.textContent.toLowerCase();
    console.log(operationMode);
    autoRefreshDisplay(data);
});

// 宣告 favoriteGroup 變數
const favoriteGroup = document.getElementById('favorite');

// 綁定 favorite 事件，讓資料正確顯示
favoriteGroup.addEventListener('click', e => {
    operationMode = e.target.textContent.toLowerCase();
    if (operationMode == 'favorite') {
        displayFavoriteList(data);
    }
})

// 抓取 API 資料
catchAPIdata()

function catchAPIdata() {
    axios
        .get(INDEX_URL).then(response => {
            originalData = response.data.results
            // 將 data 更新為已 新增 favorite 屬性 black-heart 內容
            data = addFavoriteProperty(originalData);
            // 觸發函式顯示資料
            displayDataList(data);
        })
        .catch(error => console.log(error))
}

// 新增 data 的 favorite 屬性，以便後續資料操作
function addFavoriteProperty(data) {
    let newData = [];
    data.forEach(user => {
        user.favorite = 'black-heart'
        newData.push(user);
    })
    return newData
}

// displayDataList 函式
function displayDataList(data) {
    let htmlContent = "";
    data.forEach(item => {
        // 預設畫面
        htmlContent += `
            <div class="col-12 col-lg-3 col-md-4 my-2 showUserInfo" id="generalStyle"data-id="${item.id}">
                <div class="favorite" data-id="${item.id}">
                <i class="fas fa-heart fz-40 favorite-icon ${item.favorite}" aria-hidden="true"></i>
                </div>
                <div class="card mb-2">
                    <img class="card-img-top btn-show-user" src="${item.avatar}" alt="Card image cap" data-toggle="modal" data-target="#show-user-modal" data-id="${item.id}">
                <div class="card-body user-item-body">
                    <h5 class="card-title">${item.name} ${item.surname}</h5>
                </div>
                <div class="card-footer">
                    <div class="row col-md-12">
                    <button class="btn btn-dark col-md-10 col-lg-8 mr-lg-2" id="card-footer-region">${item.region}</button>
                    <button class="btn btn-danger col-md-10 col-lg-3" id="card-footer-age">${item.age}</button>
                    </div>
                </div>
                </div>
            </div>
        `;
    });
    dataPanel.innerHTML = htmlContent;
}

// 監聽事件，促發 POP-UP 內容 和 加入/移除我的最愛
dataPanel.addEventListener("click", e => {
    if (e.target.matches('.favoite') || e.target.matches('.fas') && operationMode !== "match") {
        let userId = e.target.closest('.favorite').dataset.id;
        heartToggle(e, userId)
    } else if (e.target.matches('#likeInMatch')) {
        let userId = e.target.closest('#likeInMatch').dataset.id;
        console.log('here', userId);
        console.log(userDataInMatch);
        heartToggleInMatch(e, userId, userDataInMatch)
    }

    if (e.target.closest('.showUserInfo')) {
        let userId = e.target.closest('.showUserInfo').dataset.id;
        console.log(userId);
        showuser(userId);
    }
});

// HeartToggle 函式，讓使用者點擊 heart-icon，促發其他不同函式
function heartToggle(e, userId, operationMode) {
    const heartIcon = e.target.parentElement.querySelector('.fas');
    console.log(heartIcon);

    if (operationMode !== 'match') {
        console.log(operationMode)
        if (heartIcon.classList.contains('black-heart')) {
            // 先更新原始資料的 favorite 資料
            data[userId - 1].favorite = 'red-heart';
            // 再更新 sessionStorage
            addItemToFavorite(data, 'favoriteUser', userId);
            autoRefreshDisplay(data);
        } else {
            // 再更新 sessionStorage
            removeItemfromFavorite('favoriteUser', userId);
            // 先更新原始資料的 favorite 資料
            data[userId - 1].favorite = 'black-heart';
            displayDataList(data)
            autoRefreshDisplay(data);
        }
    }
}

// HeartToggleInMatch 函式，讓使用者在 match mode 中點擊 heart-icon，收藏卡片
function heartToggleInMatch(e, userId, userDataInMatch) {
    const heartIcon = e.target.parentElement.querySelector('.fas');
    console.log(heartIcon);

    if (heartIcon.classList.contains('black-heart')) {
        // 先更新原始資料的 favorite 資料
        userDataInMatch.favorite = 'red-heart';
        // 再更新 sessionStorage
        addItemToFavorite(data, 'favoriteUser', userId);
        if (operationMode == 'match') {
            autoRefreshDisplayInMatch(userDataInMatch)
        }
    } else {
        // 再更新 sessionStorage
        removeItemfromFavorite('favoriteUser', userId);
        // 先更新原始資料的 favorite 資料
        userDataInMatch.favorite = 'black-heart';

        if (operationMode == 'match') {
            autoRefreshDisplayInMatch(userDataInMatch)
        }
    }
}

// showuser 函式
function showuser(id) {
    // get element
    const modalName = document.getElementById("show-user-name");
    const modalAvatar = document.getElementById("show-user-avatar");
    const modalRegion = document.getElementById("show-user-region");
    const modalAge = document.getElementById("show-user-age");
    const modalBday = document.getElementById("show-user-birthday");
    const modalEamil = document.getElementById("show-user-email");

    // set request url
    const url = INDEX_URL + id;
    // console.log(url);

    // send request to show api
    axios.get(url).then(response => {
        const data = response.data;
        console.log(data);

        // insert data to modal ui
        modalName.textContent = `${data.name} ${data.surname}`;
        modalAvatar.innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="Responsive image">`;
        modalRegion.textContent = `From：${data.region}`;
        modalAge.textContent = `Age：${data.age}`;
        modalBday.textContent = `Birthday： ${data.birthday}`;
        modalEamil.textContent = `Email： ${data.email}`;
    });
};

// 加入最愛 addItemToFavorite() 函式
function addItemToFavorite(data, listName, userId) {
    list = JSON.parse(sessionStorage.getItem(listName)) || [];
    const user = data.find(item => {
        return item.id == userId;
    })

    // 判斷式，若 list 中已有 id 相同的值，則終止
    if (list.some(item => item.id == Number(userId))) {
        return
    } else {
        // 反之，則將 特定 id 的 user 加入 list 中
        list.push(user)
    }

    // 最後，再將 list 資料轉為 string 存入 favoriteUser 屬性中
    sessionStorage.setItem('favoriteUser', JSON.stringify(list))
}

// 移除最愛 removeItemfromFavorite() 函式
function removeItemfromFavorite(listName, userId) {
    list = JSON.parse(sessionStorage.getItem(listName));
    const userIndex = list.map(item => item.id).indexOf(Number(userId))

    // 將 user 從 list 中移除
    list.splice(userIndex, 1);

    // 最後，再將 list 資料轉為 string 存入 favoriteUser 屬性中
    sessionStorage.setItem('favoriteUser', JSON.stringify(list))
}

// autoRefreshDisplay() 函式，讓Home / Favorite 欄位中自動更新資料
function autoRefreshDisplay(data) {
    if (operationMode == 'home') {
        displayDataList(data)
    } else if (operationMode == 'favorite') {
        displayFavoriteList(data)
    }
}

// displayFavoriteList() 函式，讓 favorite 清單依照 sessionStorage 資料顯示
function displayFavoriteList() {
    // 先引入解析成陣列
    let favoriteList = JSON.parse(sessionStorage.getItem('favoriteUser')) || []
    console.log(favoriteList);
    displayDataList(favoriteList)
}


//////////  Match Mode  //////////

// Match Mode - 綁定模式選擇事件
quickMatch.addEventListener('click', quickMatchMode);

// Match Mode - 綁定性別選擇事件
matchMale.addEventListener('click', filterByGender);
matchFemale.addEventListener('click', filterByGender);

// Match Mode - 綁定card Like Icom
dataPanel.addEventListener('click', e => {
    if (e.target.classList.contains('nextOne')) {
        filterGenderData()
    }
});

// Step 1: 選擇 Mode，quickMatch() 函式
function quickMatchMode(e) {
    // 清空資料
    htmlContent = '';
    dataPanel.innerHTML = htmlContent;

    // 選擇模式
    operationMode = 'match'
    console.log(operationMode);
}

// Step 2: 選擇 Gender， filterByGender() 函式
function filterByGender(e) {
    if (filterGender == undefined || filterGender == 'male' ||
        filterGender == 'female') {
        filterGender = e.target.textContent.toLowerCase();
    }
    console.log('選定之性別', filterGender);
    filterGenderData(filterGender);
}

// Step 3: 將 filterGender 放入 filterGengerData 函式執行
function filterGenderData(filterGender) {
    // 將符合 使用者所選擇的 gender 資料送出  
    let filterData = data.filter(item => {
        return item.gender == filterGender;
    });

    console.log(filterData);

    // 點擊後，將 modal 關閉隱藏
    $('.modal').modal('hide')
    // $(".modal").modal("hide");
    // $(".modal-backdrop").hide();

    referUsertoMatch(filterData);

    // 暫不使用
    // displayDataList(filterData);
}

let userDataInMatch = '';

// step 4: 依照使用者行為，再次推薦新的用戶 referUsertoMatch() 推薦函式
function referUsertoMatch(data) {
    // 檢查目前 data 資料內容
    // console.log('所選擇的Gender的資料', data);

    // 隨機取出一數字，以便讀取 user 資料
    let userIndex = Math.floor(Math.random() * 200) + 1
    // console.log('資料 index', userIndex);

    // 抓出 data 中符合 item.id == userIndex 的資料
    userDataInMatch = data.find(item => {
        return item.id == userIndex
    })

    console.log('單一用戶', userDataInMatch)

    autoRefreshDisplayInMatch(userDataInMatch)

}

// step 5: match mode 畫面更新模式
function autoRefreshDisplayInMatch(userDataInMatch) {
    // 檢查 userIndex 能找到相對應的 item.id
    // 若不符合， 則顯示為 undefined，再重新執行函式，反之，則會正常顯示資料
    if (userDataInMatch == undefined) {
        filterGenderData(filterGender);
    } else {
        dataPanel.innerHTML = `
            <div class="col-md-8 mx-auto showUserInfo" id='matchStyle'data-id="${userDataInMatch.id}">
                <div class="favorite" data-id="${userDataInMatch.id}">
                    <i class="fas fa-heart fz-40 favorite-icon ${userDataInMatch.favorite}" id="likeInMatch" aria-hidden="true" data-id="${userDataInMatch.id}"></i>
                </div>
                <div class="next nextOne">
                    <i class ="fas fa-arrow-right fz-40 next-icon nextOne"></i>
                </div>
                <div class="card mb-2">
                    <img class="card-img-top btn-show-user" src="${userDataInMatch.avatar}" alt="Card image cap" data-toggle="modal" data-target="#show-user-modal" data-id="${userDataInMatch.id}">
                <div class="card-body user-item-body">
                    <h5 class="card-title">${userDataInMatch.name} ${userDataInMatch.surname}</h5>
                </div>
                <div class="card-footer">
                    <div class="row col-md-10 col-lg-12">
                    <button class="btn btn-dark col-md-4 col-lg-4 mx-2" id="card-footer-region">${userDataInMatch.region}</button>
                    <button class="btn btn-danger col-md-4 col-lg-4 mx-2" id="card-footer-age">${userDataInMatch.age}</button>
                    </div>
                </div>
                </div>
            </div>
        `;
    }
}