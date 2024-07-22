function onloadFunc(){
    console.log('Test');
    loadData("/name");
}

const BASE_URL = "https://project20-d27a9-default-rtdb.europe-west1.firebasedatabase.app/";


async function loadData(path=""){
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
}