// Declare API 變數
const BASE_URL = "https://lighthouse-user-api.herokuapp.com/";
const INDEX_URL = BASE_URL + "api/v1/users/";
const data = [];

// Catch API Data
(function () {
    axios.get(INDEX_URL).then(response => {
            data.push(...response.data.results);
            console.log(data);
            // 觸發函式顯示
            displayDataList(data);
        })
        .catch(error => console.log(error));
})();

// Display user List
const dataPanel = document.getElementById("data-panel");

// 監聽事件，促發 POP-UP 內容
dataPanel.addEventListener("click", e => {
    // 當使用者點擊 card-footer 中的 button
    if (e.target.matches(".btn-show-user")) {
        // dataset 抓出特定資料，以利後續操作
        console.log(e.target.dataset.id);
        let id = e.target.dataset.id;
        showuser(id);
    }
});

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
    console.log(url);

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
}

// displayDataList 函式
function displayDataList(data) {
    let htmlContent = "";
    data.forEach(item => {
        htmlContent += `
            <div class="col-md-3">
                <div class="card mb-2">
                    <img class="card-img-top btn-show-user" src="${item.avatar}" alt="Card image cap" data-toggle="modal" data-target="#show-user-modal" data-id="${item.id}">
                <div class="card-body user-item-body">
                    <h5 class="card-title text-left">${item.name} ${item.surname}</h5>
                </div>
                <div class="card-footer">
                    <div class="row col-md-12">
                    <button class="btn btn-dark col-md-12 col-lg-8" id="card-footer-region">${item.region}</button>
                    <button class="btn btn-danger col-md-12 col-lg-4" id="card-footer-age">${item.age}</button>
                    </div>
                </div>
                </div>
            </div>
        `;
    });
    dataPanel.innerHTML = htmlContent;
}

// get element
const maleId = document.getElementById("maleId");
const femaleId = document.getElementById("femaleId");

// 事件綁定
maleId.addEventListener("click", filterGenderData);
femaleId.addEventListener("click", filterGenderData);

// filterGengerData 函式
function filterGenderData(e) {
    e.preventDefault();
    var filterValue = e.target.textContent.toLowerCase();

    let filterData = data.filter(item => {
        return item.gender == filterValue;
    });
    displayDataList(filterData);
}