const config = require("../config");
const axios = require("axios");

//EXPORTS
module.exports = {
  sendMessage(msg) {
    //find chat id with this link
    //https://api.telegram.org/bot1362328658:AAFoNMVz-hzt0vtNzWGlfhRODFQs3gHWrEY/getUpdates?offset=0
    var options = {
      url: `https://api.telegram.org/bot${config.TELEGRAM_TOKEN}/sendMessage`,
      data: {
        chat_id: 1072072082,
        text: msg,
      },
    };

    var resp = axios(options);
    return resp;
  },
};
