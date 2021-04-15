module.exports = {
  async show(body) {
    //Liquility Pool

    //intitial
    var primary = {
      price: 287,
      supplied: 100,
    };

    var second = {
      price: 1,
      supplied: 28700,
    };

    //add pool
    var sec_amount_lp = 10000;
    primary.supplied = primary.supplied + sec_amount_lp / primary.price;
    second.supplied = second.supplied + sec_amount_lp;

    var check = {};
    var primary_supplied = primary.supplied;
    var second_supplied = second.supplied;
    var primary_price = primary.price;
    var second_price = second.price;

    function buy(amount_sec) {
      primary_supplied = primary_supplied - amount_sec / primary_price;
      second_supplied = second_supplied + amount_sec;
      primary_price = second_supplied / primary_supplied;

      check = {
        pri_to_sec: primary_price / second_price,
        sec_to_pri: second_price / primary_price,
        price_pri: primary_price,
        price_sec: second_price,
        primary_supplied: primary_supplied,
        second_supplied: second_supplied,
        value_pri: primary_price * primary_supplied,
        value_sec: second_price * second_supplied,
      };
    }

    function sell(amount_pri) {
      primary_supplied = primary_supplied + amount_pri;
      second_supplied = second_supplied - amount_pri * primary_price;
      primary_price = second_supplied / primary_supplied;

      check = {
        pri_to_sec: primary_price / second_price,
        sec_to_pri: second_price / primary_price,
        price_pri: primary_price,
        price_sec: second_price,
        primary_supplied: primary_supplied,
        second_supplied: second_supplied,
        value_pri: primary_price * primary_supplied,
        value_sec: second_price * second_supplied,
      };
    }

    sell(0.1);
    console.log(check);
  },
};
