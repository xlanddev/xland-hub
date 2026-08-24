function generateKey(){

    return "XLAND-" + crypto.randomUUID();

}

let key = localStorage.getItem("xlandApiKey");

if(!key){

    key = generateKey();

    localStorage.setItem("xlandApiKey",key);

}

const input = document.getElementById("apiKey");

input.value = key;

document.getElementById("copyBtn").onclick=()=>{

    navigator.clipboard.writeText(input.value);

    alert("API Key Copied!");

}

document.getElementById("generateBtn").onclick=()=>{

    const newKey = generateKey();

    localStorage.setItem("xlandApiKey",newKey);

    input.value = newKey;

}