function onloadFunc(){
    console.log('Test');
    // loadData("");
    postData("/name", {"basti-data": "basti-basti-dsihgiweh"})
}

const BASE_URL = "https://project20-d27a9-default-rtdb.europe-west1.firebasedatabase.app/";


async function loadData(path=""){
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
}

async function postData(path="", data={}){
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST", 
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

