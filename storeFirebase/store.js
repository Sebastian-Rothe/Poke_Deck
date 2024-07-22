function onloadFunc(){
    console.log('Test');
    loadData();
    // deleteData(path="")
}

const BASE_URL = "https://project20-d27a9-default-rtdb.europe-west1.firebasedatabase.app/";


async function loadData(){
    let response = await fetch(BASE_URL + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
}

async function deleteData(path="") {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "DELETE"
    });
    return responseToJson = await response.json();
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

async function putData(path="", data={}){
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT", 
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
    }
    
function submitData(){
    let input1 = document.getElementById('input1').value;
    let input2 = document.getElementById('input2').value;

    let data = {
        name: input1,
        are: input2
    };

    putData("user/user", data);
}
  