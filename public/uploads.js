const fileModal = document.getElementById("uploadFileModal");
const folderModal = document.getElementById("uploadFolderModal");

document.body.addEventListener("click", (e) => {
	if (e.target.id === "uploadFileBtn")
		fileModal.showModal();
	else if (e.target.id === "uploadFolderBtn")
		folderModal.showModal();
	else if (e.target.id === "uploadFileModal" || "uploadFolderModal")
		closeModal(e);
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