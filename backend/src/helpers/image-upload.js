const multer = require("multer");
const path = require("path");

const ImageStore = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, path.resolve(__dirname, "..", "..", "public", "image"));
  },
  filename: (req, file, cd) => {
    const time = new Date().getTime();
    cd(null, `${time}_${file.originalname}`);
  },
});

const Store = multer({ storage: ImageStore });

module.exports = Store;
