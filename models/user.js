const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    match: /^((https?):\/\/)?(www\.)?([\w-]+\.){1,}\w+((\/[\w-]+)+)?(\.\w+)?$/,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
