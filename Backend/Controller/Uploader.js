const multer = require('multer');
const fs = require('fs');
const path = require('path');

const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });  
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './Public/images';
        ensureDirExists(dir); 
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        let name = Date.now() + file.originalname;
        cb(null, name); 
    }
});

let upload = multer({ 
    storage: storage, 
    limits: { fileSize: 1024 * 1024 * 5 }
});

module.exports = upload;
