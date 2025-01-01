const { mkdir } = require("node:fs/promises");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: async function(req, file, cb) {
		const route = `./uploads/${req.user.id}`;
		try {
			await mkdir(route, { recursive: true });
			cb(null, route);
		} catch (error) {
			cb(error);
		}
	},
	filename: function(req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, `${uniqueSuffix}-${file.originalname}`);
	}
});

const upload = multer({ storage: storage});

module.exports = upload;