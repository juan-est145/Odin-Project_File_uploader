const downloadBtn = document.getElementById("downloadBtn");
const deleteBtn = document.getElementById("deleteBtn");

/*async function request(e) {
	const path = `${window.location.href}/download`;
	const response = await fetch(path);
	const blob = await response.blob();
	const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
	document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}*/

deleteBtn.addEventListener("click", (e) => {
	alert("You clicked delete button");
});