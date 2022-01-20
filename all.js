//放指定[縣市]的公共自行車租借站位資料
let stationData =[];

//放重組後的資料 
//資料格式為物件 { availableRentBikes: 23 , availableReturnBikes: 46, stationName: "iBike1.0_逢甲大學" , stationUID: "TXG3001" }
let filterData =[];

//初始化
function init(){
    getStationData();
}
//init();

//取得指定[縣市]的公共自行車租借站位資料
function getStationData(){
    axios.get("https://ptx.transportdata.tw/MOTC/v2/Bike/Station/Taichung?%24format=JSON" , 
    {
        headers: getAuthorizationHeader()
    }).then(function(response){
        stationData = response.data;
        getAvailableData();
})
}

//取得動態指定[縣市]的公共自行車即時車位資料
function getAvailableData(){
    axios.get("https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/Taichung?%24format=JSON" ,{
        headers: getAuthorizationHeader()
    }).then(function (response){
        const availableData = response.data;
        //比對兩個api取得的資料並重組成要用的資料
        availableData.forEach(function(availableItem){
            stationData.forEach(function(stationItem){
                if(availableItem.StationUID == stationItem.StationUID){
                    let obj ={};
                    //站點ID
                    obj.stationUID = availableItem.StationUID;
                    //站點名稱
                    obj.stationName = stationItem.StationName.Zh_tw;
                    //可借單車數量
                    obj.availableRentBikes = availableItem.AvailableRentBikes;
                    //可還單車數量
                    obj.availableReturnBikes = availableItem.AvailableReturnBikes;
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
        str+=`<li>${item.stationName}，可租:${item.availableRentBikes}，可還:${item.availableReturnBikes}</li>`
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
  
  



