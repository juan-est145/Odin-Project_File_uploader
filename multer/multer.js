const { mkdir } = require("node:fs/promises");
const multer = require("multer");
const query = require("#db/queries.js");

const homeFolder = "home";
const storage = multer.diskStorage({
	destination: async function (req, file, cb) {
		// TO DO: When folders are operational, the variable below must contain the entire tree of folders
		let pathOfFolderIds = "/home";
		const route = `./uploads/${req.user.id}${pathOfFolderIds}`;
		try {
			let folderId = req.params.id.id
			await query.registerFile(file, req.user, folderId);
			await mkdir(route, { recursive: true });
			cb(null, route);
		} catch (error) {
			cb(error);
		}
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, `${uniqueSuffix}-${file.originalname}`);
	}
});

//TO DO: This later shoudl check that the folder id route is correct and belongs to the user
function filter(req, file, cb) {
	if (!req.params.id) {
		const promise = query.getFolderId("storage", req.user.id);
		promise.then((value) => {
			req.params.id = value;
			cb(null, true);
		}).catch((error) => {
			console.error(error);
			cb(error);
		});
	} else {
		cb(null, true);
	}
}

const upload = multer({ storage: storage, fileFilter: filter, });

module.exports = upload;