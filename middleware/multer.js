const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Diretório de upload
const uploadDir = path.join(__dirname, 'uploads');

// Verifica se o diretório de upload existe, caso contrário, cria
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de armazenamento do `multer`
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

// Inicializa o `multer` com a configuração de armazenamento
const upload = multer({ storage: storage });

module.exports = upload;
