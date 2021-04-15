const request = require("request");
const config = require("../config");

const notify = (body) => {
  const { message } = body;
  request(
    {
      method: "POST",
      uri: "https://notify-api.line.me/api/notify",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        bearer: config.LINE_NOTI, //token
      },
      form: {
        message: message, //ข้อความที่จะส่ง
      },
    },
    (err, httpResponse, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log(body);
      }
    }
  );
};

//EXPORTS
module.exports = {
  notify,
};
