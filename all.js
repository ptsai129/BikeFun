

//放指定[縣市]的公共自行車租借站位資料
let stationData =[];

//放重組後的資料 
//資料格式為物件 { availableRentBikes: 23 , availableReturnBikes: 46, stationName: "iBike1.0_逢甲大學" , stationUID: "TXG3001" }
let filterData =[];

//初始化
function init(){
    getCurrentLocation();
}
//init();


//取得目前位置
function getCurrentLocation(){
    //https://developer.mozilla.org/zh-TW/docs/Web/API/Geolocation_API
    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        //將目前位置參數帶到取得站點函式內執行
        getAllStationData(lat, lon);      
      });
}



//取得指定[位置,範圍]的全台自行車租借站位資訊
function getAllStationData(lat ,lon){
    axios.get(`https://ptx.transportdata.tw/MOTC/v2/Bike/Station/NearBy?%24spatialFilter=nearby(${lat}%2C%20${lon}%2C%201000)&%24format=JSON` , 
    {
        headers: getAuthorizationHeader()
    }).then(function(response){
        stationData = response.data;
        getAllAvailableData(lat,lon);
})
}

//取得指定[位置,範圍]的全台公共自行車即時車位資料
function getAllAvailableData(lat,lon){
    axios.get(`https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/NearBy?%24spatialFilter=nearby(${lat}%2C%20${lon}%2C%201000)&%24format=JSON`,{
        headers: getAuthorizationHeader()
    }).then(function (response){
        const availableData = response.data;
        //比對兩個api取得的資料並重組成要用的資料
        availableData.forEach(function(availableItem){
            stationData.forEach(function(stationItem){
                if(availableItem.StationUID == stationItem.StationUID && availableItem.ServiceStatus == 1 ){
                    let obj ={};
                    //站點ID
                    obj.stationUID = availableItem.StationUID;
                    //站點名稱
                    obj.stationName = stationItem.StationName.Zh_tw;
                    //可借單車數量
                    obj.availableRentBikes = availableItem.AvailableRentBikes;
                    //可還單車數量
                    obj.availableReturnBikes = availableItem.AvailableReturnBikes;
                    //站點位置
                    obj.lon = stationItem.StationPosition.PositionLon;
                    obj.lat = stationItem.StationPosition.PositionLat;
                    filterData.push(obj);
                    //渲染畫面
                    renderFilterData();
                }

            })
        })

    })
}

const searchList = document.querySelector(".searchList");


//渲染資料
function renderFilterData(){
    let str ="";
    filterData.forEach(function(item){
        str+=`<li> <a href="https://www.google.com/maps/place/${item.lat},${item.lon}" target="_blank">路線導航</a>
        ${item.stationName}，可租:${item.availableRentBikes}，可還:${item.availableReturnBikes}</li>`
    })
    searchList.innerHTML = str; 

}


//依據城市搜尋探索路線
let cityList = document.querySelector('.cityList');
let searchBtn = document.querySelector('.searchRouteBtn');
//存放依據縣市篩選出的路線資料
let cityRouteData = [];

cityList.addEventListener('change', function(e){
    //取得目前選取城市的值
    let selectedCity = e.target.value;
    console.log(selectedCity);
    searchBtn.addEventListener('click',function(e){
        axios.get(`https://ptx.transportdata.tw/MOTC/v2/Cycling/Shape/${selectedCity}?%24format=JSON`, {
            headers:getAuthorizationHeader()
        }).then((res)=>{
            cityRouteData = res.data;
            renderCityRoute();
        })
    })


})

//渲染城市篩選路線資料

function renderCityRoute(){
    let str=""
    cityRouteData.forEach((item)=>{
        str+= `<li>路線名稱:${item.RouteName} , ${item.Direction} ,路線長度:${item.CyclingLength /1000}公里, 路線起點: ${item.RoadSectionStart} ,路線終點: ${item.RoadSectionEnd}
        </li>`
    })
    searchList.innerHTML = str; 

}

//取得header內容
function getAuthorizationHeader() {
    let AppID = 'c90e7fb7fd154cf9b4856fb906edd27e';
    let AppKey = 'HpHO3DVdPB_6MNKonn5qQF_qkOo';

    let GMTString = new Date().toGMTString();
    let ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    let HMAC = ShaObj.getHMAC('B64');
    let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
    return { 'Authorization': Authorization, 'X-Date': GMTString };
  }
  
  



