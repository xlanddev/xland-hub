const params = new URLSearchParams(window.location.search);

const file = params.get("file");

document.getElementById("scriptName").textContent =
file.split("/").pop();

function downloadScript(){

    if(!file){

        alert("No script selected.");

        return;

    }

    const a = document.createElement("a");

    a.href = file;

    a.download = "";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

}