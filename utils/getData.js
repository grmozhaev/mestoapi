const fs = require('fs').promises;

module.exports.getData = (res, filePath, callback) => {
  fs.readFile(filePath, 'utf-8')
    .then((data) => {
      callback(data);
    }).catch(() => {
      res.status(500).send({ message: 'Файл не найден' });
    });
};
