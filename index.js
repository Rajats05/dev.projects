
const usertab = document.querySelector("[data-userWeather]");
const searchtab = document.querySelector("[data-searchWeather]");
const usercontainer = document.querySelector(".weather-container");

const grantaccesscontainer = document.querySelector(".grant-location-container");
const searchform = document.querySelector("[data-searchForm]");
const loadingscreen = document.querySelector(".loading-container");
const userinfocontainer = document.querySelector(".user-info-container");

const errorpage=document.querySelector(".error");



const api = "d1e5ae794b0882c3f8114f22db756081";
let currentTab = usertab;
currentTab.classList.add("current-tab");

getfromSessionStorage();  //this function is called initially to take the current location 



function switchTab(newtab) {
    //jab current tab aur new tab alag h iska matlab humne dusre wale tab ko click kiya h, to "current-tab" class ko current tab se hata
    //do aur new tab me wo class add kar do
    if (newtab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = newtab;
        currentTab.classList.add("current-tab");

        //ab hume pata karna h ki hum filhal kis page pe khade h

        //agar searchform me "active" class nahi h iska matlab wo visible nahi h, to use visible kardo baki sabko invivisible kardo
        //NOTE: jaha pe bhi active class added hoga wo visible hoga warna invisible 
        if (!searchform.classList.contains("active")){
            searchform.classList.add("active");
            userinfocontainer.classList.remove("active");
            grantaccesscontainer.classList.remove("active");
        }

        //pehle search wale tab par tha, ab your weather tab ko visible karna h 
        else{
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active");
            //ab hum your weather wale tab par aaye h, to weather bhi display karna padega, so let's check local storage first
            //for coordinates, if we have saved them there.
            getfromSessionStorage(); 

        }
    }
}

usertab.addEventListener("click", () => {
    switchTab(usertab);
});

searchtab.addEventListener("click", () => {
    switchTab(searchtab);
});








function getfromSessionStorage(){
    //"localcoordinates" me user ke latitude ar longitude stored rhenge jo ki "user-coordinates" attribute me already saved h 
    const localcoordinates=sessionStorage.getItem("user-coordinates");

    //agar "localcoordinates" me user ke coordinates stored nahi h to "grant location" wala page active kardo,
    //nahi to use "coordinates" me save karlo aur UI me dikha do 
    if(!localcoordinates){
        grantaccesscontainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localcoordinates);
        fetchuserweatherinfo(coordinates);
    }
}


async function fetchuserweatherinfo(coordinates){
    const {lat, lon}=coordinates;

    //ab Hume lat aur long mil gaya h to hum "grant location" wale page ko remove kar denge 
    grantaccesscontainer.classList.remove("active");

    //ab humko API call karna h weather data fetch karne ke liye to jab tak API call hota h tab tak hum loading page ko active karte h 

    loadingscreen.classList.add("active");

    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}&units=metric`);
        const data=await response.json();

        //agar hum yaha tak aa gaye h iska matlab hamara weather data api ke through fetch ho gaya h to hum loading screen ko hata denge
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data); //this function will render data in UI 
    }
    catch(err){
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.remove("active");
        grantaccesscontainer.classList.remove("active");
    }
}

function renderweatherinfo(weatherinfo){

    //atfirst hum log html attributes ko control me lenge phir uske data ko update ko karenge
    const cityname= document.querySelector("[data-cityName]");
    const countryicon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weathericon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const feels=document.querySelector("[data-feelslike]");

    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloud]");

    console.log(weatherinfo);

    //now put in the data in the required html attribute 

    //"weatherinfo" argument ke under sara info weather ke bare me pada hua h jo ki Json ke form me h 
    //ab "weatherinfo" ke ander city ka name ko access karne ke liye hum '?' opertor use karte h 
    //e.g-> weatherinfo?.name ka matlab weatherinfo ke under name ka value 
    cityname.innerText=weatherinfo?.name;

    //"countryicon" attribute html image ka attribute h to uske img src ke under data jayega
    //below link is the link which provide certain flag icon by providing country name 
    //"weatherinfo?.sys?.country" ka matlab weatherinfo ke under sys ke under country ka value
    countryicon.src=`https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    //countryicon.src=`https://flagcdn.com/144x108/in.png`;

    desc.innerText=weatherinfo?.weather?.[0]?.description;

    weathericon.src=`http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    //weathericon.src=`http://openweathermap.org/img/w/50n.png`;

    temp.innerText=`${weatherinfo?.main?.temp}°C`;
    feels.innerText=`${weatherinfo?.main?.feels_like}°C`;
    windspeed.innerText=`${weatherinfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherinfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherinfo?.clouds?.all}%`;


    
    //hume kaise pata lag raha h ki weatherinfo ke under sys ke under hi country ka value h? [line 119]
    //ye sari information hum json formator ke through jaan sakte jo ki API link run karne ke baad uske output ko json formator me 
    //dalne ke baad milta h [json formator is an website]

}








function getlocation(){
    //"navigator.geolocation" finds if the location access is provided and "navigator.geolocation.getCurrentPosition" finds the current lat and lon  
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition); //showposition is stored with lat and lon value 
    }
    else{
        alert("PLEASE PROVIDE LOCATION ACCESS!!!");
    }
}

function showposition(position){
    
    const usercoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    //ye usercoordinates value ko kahi to save karna hoga uske liye hum session storage ka use karte h and sessionStorage.setItem ka 
    //matlab sessionstorage me "user-coordinates" naam ka variable set karo jiske ander usercoordinates value string ke form me saved h
    sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinates));
    fetchuserweatherinfo(usercoordinates);
}


//agar hume grant location access ka page dikhta h iska matlab humne location permit nahi kiya 
//hume grant access wale button pe ek listener lagana hoga jo ki jab bhi user click kare ek location access ka pop-up aaye 

const grantaccessbutton=document.querySelector("[data-grantAccess]");
grantaccessbutton.addEventListener("click",getlocation);






//AGAR USER SEARCH form par KOI BHI CITY search kare TO humko US CITY KA NAAM USE KARKE API CALL KARNA HOGA
const searchinput=document.querySelector("[data-searchInput]"); 

searchform.addEventListener("submit",(e)=>{
    e.preventDefault(); //this will prevent default operation of button
    let cityname=searchinput.value;  //"searchinput" will contain the input city typed by user which is transferred to "cityname"
    
    if(cityname===""){
        return;
    }
    else{
        fetchsearchweatherinfo(cityname);
    }
})

async function fetchsearchweatherinfo(city){

    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`);
        const data=await response.json();

        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");

        renderweatherinfo(data); //this will render all the data we have got using city in UI 
    }
    catch(err){
        loadingscreen.classList.remove("active"); 
        userinfocontainer.classList.remove("active");
        grantaccesscontainer.classList.remove("active");
        errorpage.classList.add("active");

    }
}
