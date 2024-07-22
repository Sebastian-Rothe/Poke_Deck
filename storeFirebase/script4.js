function onloadFunc() {
  console.log("Test");
  loadData();
  deleteData("/name/-O2OQqbflt7GdAIIqtwW");
}

const BASE_URL =
  "https://project20-d27a9-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  console.log(responseToJson);
}

async function deleteData(path="") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE"
  });
  return responseToJson = await response.json();
}
