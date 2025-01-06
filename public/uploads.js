const fileModal = document.getElementById("uploadFileModal");
const folderModal = document.getElementById("uploadFolderModal");

document.body.addEventListener("click", async (e) => {
	if (e.target.id === "uploadFileBtn")
		fileModal.showModal();
	else if (e.target.id === "uploadFolderBtn")
		folderModal.showModal();
	else if (e.target.id === "uploadFileModal" || e.target.id === "uploadFolderModal")
		closeModal(e);
	else if (e.target.id === "deleteFolderBtn")
		await deleteFolder(e);
});

function closeModal(e) {
	const modal = document.getElementById(e.target.id);
	const modalDimension = modal.getBoundingClientRect();
	if (
		e.clientX < modalDimension.left ||
		e.clientX > modalDimension.right ||
		e.clientY < modalDimension.top ||
		e.clientY > modalDimension.bottom
	)
		modal.close();
}

async function deleteFolder(e) {
	const body = new URLSearchParams();
	const path = window.location.pathname.split("/");
	body.append("id", path[path.length - 1]);
	const response = await fetch(`/storage/${path[path.length - 1]}/deleteFolder`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: body.toString(),
	});
	const data = await response.json();
	alert(data.message);
	window.location.href = "/";
}