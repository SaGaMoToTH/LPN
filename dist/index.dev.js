"use strict";

var line = require('@line/bot-sdk');

var express = require('express');

var axios = require('axios')["default"];

var dotenv = require('dotenv');

var env = dotenv.config().parsed;
var app = express();
var lineConfig = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN
};

function formatMoney(inum) {
  var s_inum = inum.toString();
  var num2 = s_inum.split(".");
  var n_inum = "";

  if (num2[0]) {
    var l_inum = num2[0].length;

    for (var i = 0; i < l_inum; i++) {
      if ((l_inum - i) % 3 === 0) {
        if (i === 0) {
          n_inum += s_inum[i];
        } else {
          n_inum += "," + s_inum[i];
        }
      } else {
        n_inum += s_inum[i];
      }
    }
  } else {
    n_inum = inum.toString();
  }

  if (num2[1]) {
    n_inum += "." + num2[1];
  }

  return n_inum;
}

var client = new line.Client(lineConfig);
app.post('/webhook', line.middleware(lineConfig), function _callee(req, res) {
  var events;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          events = req.body.events; // const event = req.body.events[0];
          // console.log("Text.length : ",events.length);

          console.log('event ', events);

          if (!(events.length > 0)) {
            _context.next = 9;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(events.map(function (item) {
            return handleEvent(item);
          }));

        case 6:
          _context.t0 = _context.sent;
          _context.next = 10;
          break;

        case 9:
          _context.t0 = res.status(200).send("OK");

        case 10:
          return _context.abrupt("return", _context.t0);

        case 13:
          _context.prev = 13;
          _context.t1 = _context["catch"](0);
          console.log("ERROR : ", _context.t1);
          res.status(500).end();
          return _context.abrupt("return", null);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
});

var handleEvent = function handleEvent(event) {
  var Message, myArray, Width, Length, Thick, Amount, ton, Weight;
  return regeneratorRuntime.async(function handleEvent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(event.type); //Show Event Type

          if (!(event.type === 'unfollow')) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", null);

        case 5:
          if (!(event.type === 'follow')) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", null);

        case 9:
          if (!(event.message.type === 'sticker')) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'sticker',
            packageId: 11537,
            stickerId: 52002744
          }));

        case 13:
          if (!(event.type === 'message' && event.message.text === "สูตรคำนวณ" || event.message.text === "สูตร" || event.message.text === "คำนวณ" || event.message.text === "สูตรคำนวณน้ำหนักเหล็กแผ่น" || event.message.text === "เหล็กแผ่น")) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "สูตรคำนวณน้ำหนักเหล็กแผ่น\nคือความหนา(มิลลิเมตร) x กว้าง(มิลลิเมตร) x ยาว(มิลลิเมตร) x 7.85\nผลลัพธ์ที่ได้เป็น หน่วยตัน \nตัน x 1000 ผลลัพธ์ที่ได้เป็น หน่วย กก.(กิโลกรัม)"
          }));

        case 17:
          if (!(event.type === 'message' && event.message.text === "quickReply" || event.message.text === "quick" || event.message.text === "Quick" || event.message.text === "quickreply" || event.message.text === "QuickReply")) {
            _context2.next = 21;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "ลองดูฟังก์ชันตรงแป้นพิมพ์ดูสิ(เฉพาะมือถือ)\nมีอะไรให้เล่นเยอะเลยนะ",
            "quickReply": {
              "items": [{
                "type": "action",
                "action": {
                  "type": "uri",
                  "label": "URI",
                  "uri": "https://www.google.com/"
                }
              }, {
                "type": "action",
                "action": {
                  "type": "cameraRoll",
                  "label": "Camera Roll"
                }
              }, {
                "type": "action",
                "action": {
                  "type": "camera",
                  "label": "Camera"
                }
              }, {
                "type": "action",
                "action": {
                  "type": "location",
                  "label": "Location"
                }
              }, {
                "type": "action",
                "imageUrl": "https://icla.org/wp-content/uploads/2018/02/blue-calendar-icon.png",
                "action": {
                  "type": "datetimepicker",
                  "label": "Datetime Picker",
                  "data": "storeId=12345",
                  "mode": "datetime",
                  "initial": "2022-08-10t00:00",
                  "max": "2022-12-31t23:59",
                  "min": "2022-08-01t00:00"
                }
              }]
            }
          }));

        case 21:
          if (!(event.type === 'message' && event.message.type === 'text')) {
            _context2.next = 865;
            break;
          }

          console.log("Message : " + event.message.text); //Show message

          Message = event.message.text;
          myArray = Message.split("_", 4); // const myArray2 = Message.split("_",2);
          // .split("*",3).split("x",3).split("X",3)

          console.log("Message Array : " + myArray); // console.log("Message Array2 : "+myArray2);
          // var formatMoney(Weight) = parseFloat(myArray[0]).toFixed(2) * parseFloat(myArray[1]).toFixed(2) * parseFloat(myArray[2]).toFixed(2)
          // var formatMoney(Weight) = parseFloat(formatMoney(Weight) * 7.85).toFixed(2)

          if (myArray[2] === "2438") {
            console.log("Width = 2438");
            Width = (myArray[2] / 1000).toFixed(4);
            Length = (myArray[1] / 1000).toFixed(4);
          } else {
            console.log("Other");
            Width = (myArray[1] / 1000).toFixed(4);
            Length = (myArray[2] / 1000).toFixed(4);
          }

          Thick = (myArray[0] / 1000).toFixed(4);
          Amount = myArray[3];
          console.log("Thick : " + Thick + " mm.\nWidth : " + Width + " mm.\nLength : " + Length + " mm.\nAmount : " + Amount + " Pcs.");
          ton = (Thick * Width * Length * 7.85 * Amount).toFixed(2);
          Weight = parseFloat(ton * 1000).toFixed(2);
          console.log("Weight : " + Weight + " Kg.");
          console.log("NaN : ", Weight === "NaN");

          if (!(Weight === "NaN" || Weight === "0.00")) {
            _context2.next = 38;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "คุณใส่ตัวเลขไม่ถูกต้องตามรูปแบบที่กำหนด\nกรุณากรอกข้อมูลใหม่อีกครั้งตามรูปแบบดังนี้ ความหนา(มิลลิเมตร)_กว้าง(มิลลิเมตร)_ยาว(มิลลิเมตร)_จำนวน(ชิ้น) \nเช่น 12.00_1524_6096_5 เท่านั้น\n***หมายเหตุ ทศนิยม 2 ตำแหน่ง***"
          }));

        case 38:
          if (!(Thick === "0.0090" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 46;
            break;
          }

          if (!(Amount >= 7)) {
            _context2.next = 43;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 43:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"
          }));

        case 44:
          _context2.next = 863;
          break;

        case 46:
          if (!(Thick === "0.0100" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 54;
            break;
          }

          if (!(Amount >= 7)) {
            _context2.next = 51;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 51:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"
          }));

        case 52:
          _context2.next = 863;
          break;

        case 54:
          if (!(Thick === "0.0120" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 62;
            break;
          }

          if (!(Amount >= 5)) {
            _context2.next = 59;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 59:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"
          }));

        case 60:
          _context2.next = 863;
          break;

        case 62:
          if (!(Thick === "0.0127" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 70;
            break;
          }

          if (!(Amount >= 5)) {
            _context2.next = 67;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 67:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"
          }));

        case 68:
          _context2.next = 863;
          break;

        case 70:
          if (!(Thick === "0.0130" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 78;
            break;
          }

          if (!(Amount >= 5)) {
            _context2.next = 75;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 75:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"
          }));

        case 76:
          _context2.next = 863;
          break;

        case 78:
          if (!(Thick === "0.0150" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 86;
            break;
          }

          if (!(Amount >= 5)) {
            _context2.next = 83;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 83:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"
          }));

        case 84:
          _context2.next = 863;
          break;

        case 86:
          if (!(Thick === "0.0160" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 94;
            break;
          }

          if (!(Amount >= 4)) {
            _context2.next = 91;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 91:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"
          }));

        case 92:
          _context2.next = 863;
          break;

        case 94:
          if (!(Thick === "0.0190" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 102;
            break;
          }

          if (!(Amount >= 4)) {
            _context2.next = 99;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 99:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"
          }));

        case 100:
          _context2.next = 863;
          break;

        case 102:
          if (!(Thick === "0.0200" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 110;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 107;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 107:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 108:
          _context2.next = 863;
          break;

        case 110:
          if (!(Thick === "0.0220" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 118;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 115;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 115:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 116:
          _context2.next = 863;
          break;

        case 118:
          if (!(Thick === "0.0250" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 126;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 123;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 123:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 124:
          _context2.next = 863;
          break;

        case 126:
          if (!(Thick === "0.0280" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 134;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 131;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 131:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 132:
          _context2.next = 863;
          break;

        case 134:
          if (!(Thick === "0.0300" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 142;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 139;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 139:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 140:
          _context2.next = 863;
          break;

        case 142:
          if (!(Thick === "0.0320" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 150;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 147;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 147:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 148:
          _context2.next = 863;
          break;

        case 150:
          if (!(Thick === "0.0360" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 158;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 155;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 155:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 156:
          _context2.next = 863;
          break;

        case 158:
          if (!(Thick === "0.0350" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 166;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 163;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 163:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 164:
          _context2.next = 863;
          break;

        case 166:
          if (!(Thick === "0.0380" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 174;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 171;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 171:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 172:
          _context2.next = 863;
          break;

        case 174:
          if (!(Thick === "0.0400" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 182;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 179;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 179:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 180:
          _context2.next = 863;
          break;

        case 182:
          if (!(Thick === "0.0450" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 190;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 187;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 187:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 188:
          _context2.next = 863;
          break;

        case 190:
          if (!(Thick === "0.0500" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 198;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 195;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 195:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 196:
          _context2.next = 863;
          break;

        case 198:
          if (!(Thick === "0.0550" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 206;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 203;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 203:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 204:
          _context2.next = 863;
          break;

        case 206:
          if (!(Thick === "0.0600" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 214;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 211;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 211:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 212:
          _context2.next = 863;
          break;

        case 214:
          if (!(Thick === "0.0650" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 222;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 219;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 219:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 220:
          _context2.next = 863;
          break;

        case 222:
          if (!(Thick === "0.0700" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 230;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 227;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 227:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 228:
          _context2.next = 863;
          break;

        case 230:
          if (!(Thick === "0.0750" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 238;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 235;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 235:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 236:
          _context2.next = 863;
          break;

        case 238:
          if (!(Thick === "0.0800" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 246;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 243;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 243:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 244:
          _context2.next = 863;
          break;

        case 246:
          if (!(Thick === "0.0850" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 254;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 251;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 251:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 252:
          _context2.next = 863;
          break;

        case 254:
          if (!(Thick === "0.0900" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 262;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 259;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 259:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 260:
          _context2.next = 863;
          break;

        case 262:
          if (!(Thick === "0.0950" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 270;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 267;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 267:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 268:
          _context2.next = 863;
          break;

        case 270:
          if (!(Thick === "0.1000" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 278;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 275;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 275:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 276:
          _context2.next = 863;
          break;

        case 278:
          if (!(Thick === "0.1050" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 286;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 283;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 283:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 284:
          _context2.next = 863;
          break;

        case 286:
          if (!(Thick === "0.1100" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 294;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 291;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 291:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 292:
          _context2.next = 863;
          break;

        case 294:
          if (!(Thick === "0.1150" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 302;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 299;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 299:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 300:
          _context2.next = 863;
          break;

        case 302:
          if (!(Thick === "0.1200" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 310;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 307;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 307:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 308:
          _context2.next = 863;
          break;

        case 310:
          if (!(Thick === "0.1300" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 318;
            break;
          }

          if (!(Amount >= 1)) {
            _context2.next = 315;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 315:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"
          }));

        case 316:
          _context2.next = 863;
          break;

        case 318:
          if (!(Thick === "0.0090" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 326;
            break;
          }

          if (!(Amount >= 13)) {
            _context2.next = 323;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 323:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 13 Pcs***"
          }));

        case 324:
          _context2.next = 863;
          break;

        case 326:
          if (!(Thick === "0.0100" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 334;
            break;
          }

          if (!(Amount >= 12)) {
            _context2.next = 331;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 331:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 12 Pcs***"
          }));

        case 332:
          _context2.next = 863;
          break;

        case 334:
          if (!(Thick === "0.0120" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 342;
            break;
          }

          if (!(Amount >= 11)) {
            _context2.next = 339;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 339:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 11 Pcs***"
          }));

        case 340:
          _context2.next = 863;
          break;

        case 342:
          if (!(Thick === "0.0127" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 350;
            break;
          }

          if (!(Amount >= 10)) {
            _context2.next = 347;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 347:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 10 Pcs***"
          }));

        case 348:
          _context2.next = 863;
          break;

        case 350:
          if (!(Thick === "0.0130" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 358;
            break;
          }

          if (!(Amount >= 10)) {
            _context2.next = 355;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 355:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 10 Pcs***"
          }));

        case 356:
          _context2.next = 863;
          break;

        case 358:
          if (!(Thick === "0.0150" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 366;
            break;
          }

          if (!(Amount >= 10)) {
            _context2.next = 363;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 363:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 10 Pcs***"
          }));

        case 364:
          _context2.next = 863;
          break;

        case 366:
          if (!(Thick === "0.0160" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 374;
            break;
          }

          if (!(Amount >= 8)) {
            _context2.next = 371;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 371:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 8 Pcs***"
          }));

        case 372:
          _context2.next = 863;
          break;

        case 374:
          if (!(Thick === "0.0190" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 382;
            break;
          }

          if (!(Amount >= 7)) {
            _context2.next = 379;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 379:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"
          }));

        case 380:
          _context2.next = 863;
          break;

        case 382:
          if (!(Thick === "0.0200" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 390;
            break;
          }

          if (!(Amount >= 6)) {
            _context2.next = 387;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 387:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"
          }));

        case 388:
          _context2.next = 863;
          break;

        case 390:
          if (!(Thick === "0.0220" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 398;
            break;
          }

          if (!(Amount >= 6)) {
            _context2.next = 395;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 395:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 6 Pcs***"
          }));

        case 396:
          _context2.next = 863;
          break;

        case 398:
          if (!(Thick === "0.0250" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 406;
            break;
          }

          if (!(Amount >= 6)) {
            _context2.next = 403;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 403:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 6 Pcs***"
          }));

        case 404:
          _context2.next = 863;
          break;

        case 406:
          if (!(Thick === "0.0280" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 414;
            break;
          }

          if (!(Amount >= 5)) {
            _context2.next = 411;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 411:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"
          }));

        case 412:
          _context2.next = 863;
          break;

        case 414:
          if (!(Thick === "0.0300" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 422;
            break;
          }

          if (!(Amount >= 5)) {
            _context2.next = 419;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 419:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"
          }));

        case 420:
          _context2.next = 863;
          break;

        case 422:
          if (!(Thick === "0.0320" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 430;
            break;
          }

          if (!(Amount >= 5)) {
            _context2.next = 427;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 427:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"
          }));

        case 428:
          _context2.next = 863;
          break;

        case 430:
          if (!(Thick === "0.0360" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 438;
            break;
          }

          if (!(Amount >= 4)) {
            _context2.next = 435;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 435:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"
          }));

        case 436:
          _context2.next = 863;
          break;

        case 438:
          if (!(Thick === "0.0350" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 446;
            break;
          }

          if (!(Amount >= 4)) {
            _context2.next = 443;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 443:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"
          }));

        case 444:
          _context2.next = 863;
          break;

        case 446:
          if (!(Thick === "0.0380" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 454;
            break;
          }

          if (!(Amount >= 4)) {
            _context2.next = 451;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 451:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"
          }));

        case 452:
          _context2.next = 863;
          break;

        case 454:
          if (!(Thick === "0.0400" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 462;
            break;
          }

          if (!(Amount >= 4)) {
            _context2.next = 459;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 459:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"
          }));

        case 460:
          _context2.next = 863;
          break;

        case 462:
          if (!(Thick === "0.0450" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 470;
            break;
          }

          if (!(Amount >= 4)) {
            _context2.next = 467;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 467:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"
          }));

        case 468:
          _context2.next = 863;
          break;

        case 470:
          if (!(Thick === "0.0500" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 478;
            break;
          }

          if (!(Amount >= 4)) {
            _context2.next = 475;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 475:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"
          }));

        case 476:
          _context2.next = 863;
          break;

        case 478:
          if (!(Thick === "0.0550" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 486;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 483;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 483:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 484:
          _context2.next = 863;
          break;

        case 486:
          if (!(Thick === "0.0600" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 494;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 491;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 491:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 492:
          _context2.next = 863;
          break;

        case 494:
          if (!(Thick === "0.0650" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 502;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 499;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 499:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 500:
          _context2.next = 863;
          break;

        case 502:
          if (!(Thick === "0.0700" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 510;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 507;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 507:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 508:
          _context2.next = 863;
          break;

        case 510:
          if (!(Thick === "0.0750" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 518;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 515;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 515:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 516:
          _context2.next = 863;
          break;

        case 518:
          if (!(Thick === "0.0800" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 526;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 523;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 523:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 524:
          _context2.next = 863;
          break;

        case 526:
          if (!(Thick === "0.0850" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 534;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 531;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 531:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 532:
          _context2.next = 863;
          break;

        case 534:
          if (!(Thick === "0.0900" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 542;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 539;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 539:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 540:
          _context2.next = 863;
          break;

        case 542:
          if (!(Thick === "0.0950" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 550;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 547;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 547:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 548:
          _context2.next = 863;
          break;

        case 550:
          if (!(Thick === "0.1000" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 558;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 555;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 555:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 556:
          _context2.next = 863;
          break;

        case 558:
          if (!(Thick === "0.1050" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 566;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 563;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 563:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 564:
          _context2.next = 863;
          break;

        case 566:
          if (!(Thick === "0.1100" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 574;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 571;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 571:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 572:
          _context2.next = 863;
          break;

        case 574:
          if (!(Thick === "0.1150" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 582;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 579;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 579:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 580:
          _context2.next = 863;
          break;

        case 582:
          if (!(Thick === "0.1200" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 590;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 587;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 587:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 588:
          _context2.next = 863;
          break;

        case 590:
          if (!(Thick === "0.1300" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 598;
            break;
          }

          if (!(Amount >= 2)) {
            _context2.next = 595;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 595:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"
          }));

        case 596:
          _context2.next = 863;
          break;

        case 598:
          if (!(Thick === "0.0090" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 606;
            break;
          }

          if (!(Amount >= 21)) {
            _context2.next = 603;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 603:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 21 Pcs***"
          }));

        case 604:
          _context2.next = 863;
          break;

        case 606:
          if (!(Thick === "0.0100" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 614;
            break;
          }

          if (!(Amount >= 19)) {
            _context2.next = 611;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 611:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 19 Pcs***"
          }));

        case 612:
          _context2.next = 863;
          break;

        case 614:
          if (!(Thick === "0.0120" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 622;
            break;
          }

          if (!(Amount >= 16)) {
            _context2.next = 619;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 619:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 16 Pcs***"
          }));

        case 620:
          _context2.next = 863;
          break;

        case 622:
          if (!(Thick === "0.0127" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 630;
            break;
          }

          if (!(Amount >= 15)) {
            _context2.next = 627;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 627:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 15 Pcs***"
          }));

        case 628:
          _context2.next = 863;
          break;

        case 630:
          if (!(Thick === "0.0130" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 638;
            break;
          }

          if (!(Amount >= 13)) {
            _context2.next = 635;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 635:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 13 Pcs***"
          }));

        case 636:
          _context2.next = 863;
          break;

        case 638:
          if (!(Thick === "0.0150" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 646;
            break;
          }

          if (!(Amount >= 12)) {
            _context2.next = 643;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 643:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 12 Pcs***"
          }));

        case 644:
          _context2.next = 863;
          break;

        case 646:
          if (!(Thick === "0.0160" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 654;
            break;
          }

          if (!(Amount >= 10)) {
            _context2.next = 651;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 651:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 10 Pcs***"
          }));

        case 652:
          _context2.next = 863;
          break;

        case 654:
          if (!(Thick === "0.0190" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 662;
            break;
          }

          if (!(Amount >= 10)) {
            _context2.next = 659;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 659:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 10 Pcs***"
          }));

        case 660:
          _context2.next = 863;
          break;

        case 662:
          if (!(Thick === "0.0200" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 670;
            break;
          }

          if (!(Amount >= 9)) {
            _context2.next = 667;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 667:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 9 Pcs***"
          }));

        case 668:
          _context2.next = 863;
          break;

        case 670:
          if (!(Thick === "0.0220" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 678;
            break;
          }

          if (!(Amount >= 8)) {
            _context2.next = 675;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 675:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 8 Pcs***"
          }));

        case 676:
          _context2.next = 863;
          break;

        case 678:
          if (!(Thick === "0.0250" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 686;
            break;
          }

          if (!(Amount >= 7)) {
            _context2.next = 683;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 683:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"
          }));

        case 684:
          _context2.next = 863;
          break;

        case 686:
          if (!(Thick === "0.0280" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 694;
            break;
          }

          if (!(Amount >= 7)) {
            _context2.next = 691;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 691:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"
          }));

        case 692:
          _context2.next = 863;
          break;

        case 694:
          if (!(Thick === "0.0300" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 702;
            break;
          }

          if (!(Amount >= 7)) {
            _context2.next = 699;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 699:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"
          }));

        case 700:
          _context2.next = 863;
          break;

        case 702:
          if (!(Thick === "0.0320" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 710;
            break;
          }

          if (!(Amount >= 6)) {
            _context2.next = 707;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 707:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 6 Pcs***"
          }));

        case 708:
          _context2.next = 863;
          break;

        case 710:
          if (!(Thick === "0.0360" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 718;
            break;
          }

          if (!(Amount >= 6)) {
            _context2.next = 715;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 715:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 6 Pcs***"
          }));

        case 716:
          _context2.next = 863;
          break;

        case 718:
          if (!(Thick === "0.0350" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 726;
            break;
          }

          if (!(Amount >= 5)) {
            _context2.next = 723;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 723:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"
          }));

        case 724:
          _context2.next = 863;
          break;

        case 726:
          if (!(Thick === "0.0380" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 734;
            break;
          }

          if (!(Amount >= 5)) {
            _context2.next = 731;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 731:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"
          }));

        case 732:
          _context2.next = 863;
          break;

        case 734:
          if (!(Thick === "0.0400" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 742;
            break;
          }

          if (!(Amount >= 5)) {
            _context2.next = 739;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 739:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"
          }));

        case 740:
          _context2.next = 863;
          break;

        case 742:
          if (!(Thick === "0.0450" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 750;
            break;
          }

          if (!(Amount >= 5)) {
            _context2.next = 747;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 747:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"
          }));

        case 748:
          _context2.next = 863;
          break;

        case 750:
          if (!(Thick === "0.0500" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 758;
            break;
          }

          if (!(Amount >= 4)) {
            _context2.next = 755;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 755:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"
          }));

        case 756:
          _context2.next = 863;
          break;

        case 758:
          if (!(Thick === "0.0550" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 766;
            break;
          }

          if (!(Amount >= 4)) {
            _context2.next = 763;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 763:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"
          }));

        case 764:
          _context2.next = 863;
          break;

        case 766:
          if (!(Thick === "0.0600" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 774;
            break;
          }

          if (!(Amount >= 4)) {
            _context2.next = 771;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 771:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"
          }));

        case 772:
          _context2.next = 863;
          break;

        case 774:
          if (!(Thick === "0.0650" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 782;
            break;
          }

          if (!(Amount >= 4)) {
            _context2.next = 779;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 779:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"
          }));

        case 780:
          _context2.next = 863;
          break;

        case 782:
          if (!(Thick === "0.0700" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 790;
            break;
          }

          if (!(Amount >= 4)) {
            _context2.next = 787;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 787:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"
          }));

        case 788:
          _context2.next = 863;
          break;

        case 790:
          if (!(Thick === "0.0750" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 798;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 795;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 795:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 796:
          _context2.next = 863;
          break;

        case 798:
          if (!(Thick === "0.0800" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 806;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 803;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 803:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 pcs***"
          }));

        case 804:
          _context2.next = 863;
          break;

        case 806:
          if (!(Thick === "0.0850" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 814;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 811;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 811:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 812:
          _context2.next = 863;
          break;

        case 814:
          if (!(Thick === "0.0900" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 822;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 819;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 819:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 820:
          _context2.next = 863;
          break;

        case 822:
          if (!(Thick === "0.0950" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 830;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 827;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 827:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 828:
          _context2.next = 863;
          break;

        case 830:
          if (!(Thick === "0.1000" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 838;
            break;
          }

          if (!(Amount >= 3)) {
            _context2.next = 835;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 835:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"
          }));

        case 836:
          _context2.next = 863;
          break;

        case 838:
          if (!(Thick === "0.0060" && Width === "1.5240" && Length === "6.0960")) {
            _context2.next = 846;
            break;
          }

          if (!(Amount >= 12)) {
            _context2.next = 843;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 843:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 12 Pcs***"
          }));

        case 844:
          _context2.next = 863;
          break;

        case 846:
          if (!(Thick === "0.0060" && Width === "1.5240" && Length === "3.0480")) {
            _context2.next = 854;
            break;
          }

          if (!(Amount >= 21)) {
            _context2.next = 851;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 851:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 21 Pcs***"
          }));

        case 852:
          _context2.next = 863;
          break;

        case 854:
          if (!(Thick === "0.0060" && Width === "2.4380" && Length === "1.2190")) {
            _context2.next = 862;
            break;
          }

          if (!(Amount >= 36)) {
            _context2.next = 859;
            break;
          }

          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"
          }));

        case 859:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 36 Pcs***"
          }));

        case 860:
          _context2.next = 863;
          break;

        case 862:
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "น้ำหนัก : " + formatMoney(Weight) + " กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น"
          }));

        case 863:
          _context2.next = 868;
          break;

        case 865:
          if (!(event.type === 'message' && event.message.type === 'image')) {
            _context2.next = 868;
            break;
          }

          // console.log(event.message);
          // console.log("Event : "+event);
          // const urls = await upload(event);
          // console.log("urls : "+urls);
          console.log(event.message.contentProvider);
          return _context2.abrupt("return", client.replyMessage(event.replyToken, {
            type: 'text',
            text: "รูปภาพ"
          }));

        case 868:
        case "end":
          return _context2.stop();
      }
    }
  });
};

app.listen(80, function () {
  console.log('listening on 80');
}); //10 x 1524 x 6096 x 10   *****
//10 x 1524 x 6096 x 9     
//10 x 1524 x 3048 x 18   *****
//...x 1219 x 2438 x ...  *****
//10 x 1524 x 9144 x 9
//10 x 1524 x .........
//10 x 1524 x .........
//รีดตรง รีดสลับ
//หา Min ของทุกไซด์ (เฉพาะ size standard)