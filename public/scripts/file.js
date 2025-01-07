const deleteBtn = document.getElementById("deleteBtn");

deleteBtn.addEventListener("click", async () => {
	const path = `${window.location.href}/delete`;
	const response = await fetch(path, {
		method: "DELETE",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
	});
	const data = await response.json();
	alert(data.message);
	window.location.href = data.location;
});