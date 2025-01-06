const { mkdir } = require("node:fs/promises");
const multer = require("multer");
const query = require("#db/queries.js");

// Need to implement a check for files that have the same name in the same folder 
const storage = multer.diskStorage({
	destination: async function (req, file, cb) {
		try {
			const folders = await query.getAllParentFolders(req.params.id);
			let uploadPath = `./uploads/${req.user.id}`;
			for (let i = folders.length - 1; i > -1; i--)
				uploadPath += `/${folders[i].name}`;
			let folderId = req.params.id.id
			await query.postFile(file, req.user, folderId);
			await mkdir(uploadPath, { recursive: true });
			cb(null, uploadPath);
		} catch (error) {
			cb(error);
		}
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, `${uniqueSuffix}-${file.originalname}`);
	}
});

function filter(req, file, cb) {
	const promise = req.params.id ? query.getFolderId(req.params.id, req.user.id) : query.getFolderId("storage", req.user.id);
	promise.then((value) => {
		if (!value)
			return cb(null, false);
		req.params.id = value;
		return cb(null, true);
	}).catch((error) => {
		console.error(error);
		return cb(error);
	});
}

const upload = multer({ storage: storage, fileFilter: filter, });

module.exports = upload;