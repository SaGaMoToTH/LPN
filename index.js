const line = require('@line/bot-sdk')
const express = require('express')
const axios = require('axios').default
const dotenv = require('dotenv')

const env = dotenv.config().parsed
const app = express()

const lineConfig = {
    channelAccessToken: env.ACCESS_TOKEN,
    channelSecret: env.SECRET_TOKEN
}
function formatMoney(inum) {
  const s_inum = inum.toString();
  const num2 = s_inum.split(".");
  let n_inum = "";

  if (num2[0]) {
    const l_inum = num2[0].length;

    for (let i = 0; i < l_inum; i++) {
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

const client = new line.Client(lineConfig);

app.post('/webhook', line.middleware(lineConfig), async(req,res) =>{
    try{
      const events = req.body.events;
      // const event = req.body.events[0];
      // console.log("Text.length : ",events.length);
      console.log('event ',events);
      return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send("OK")
    } catch(error) {
      console.log("ERROR : ",error);
      res.status(500).end()
      return null;
    }
});

const handleEvent = async (event) => {
    console.log(event.type); //Show Event Type
    if(event.type === 'unfollow'){
      return null;
    }
    else if(event.type === 'follow'){
      return null;
    }
    else if(event.message.type === 'sticker'){
      return client.replyMessage(event.replyToken,{type:'sticker',packageId: 11537,stickerId: 52002744})
      // return null;
    }
    else if(event.type === 'message' && event.message.text === "สูตรคำนวณ" || event.message.text === "สูตร" || event.message.text === "คำนวณ" || event.message.text === "สูตรคำนวณน้ำหนักเหล็กแผ่น" || event.message.text === "เหล็กแผ่น"){
      return client.replyMessage(event.replyToken,{type:'text',text:"สูตรคำนวณน้ำหนักเหล็กแผ่น\nคือความหนา(มิลลิเมตร) x กว้าง(มิลลิเมตร) x ยาว(มิลลิเมตร) x 7.85\nผลลัพธ์ที่ได้เป็น หน่วยตัน \nตัน x 1000 ผลลัพธ์ที่ได้เป็น หน่วย กก.(กิโลกรัม)"})
    }
    else if(event.type === 'message' && event.message.text === "quickReply" || event.message.text === "quick" || event.message.text === "Quick" || event.message.text === "quickreply" || event.message.text === "QuickReply"){
      return client.replyMessage(event.replyToken,{type:'text',text:"ลองดูฟังก์ชันตรงแป้นพิมพ์ดูสิ(เฉพาะมือถือ)\nมีอะไรให้เล่นเยอะเลยนะ",
      "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "uri",
                "label": "URI",
                "uri": "https://www.google.com/"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "cameraRoll",
                "label": "Camera Roll"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "camera",
                "label": "Camera"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "location",
                "label": "Location"
              }
            },
            {
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
            }
          ]
      }})
    }
    else if(event.type === 'message' && event.message.type === 'text'){
        console.log("Message : "+event.message.text); //Show message
        var Message = event.message.text
        const myArray = Message.split("_",4);
        // const myArray2 = Message.split("_",2);
        // .split("*",3).split("x",3).split("X",3)
        console.log("Message Array : "+myArray);
        // console.log("Message Array2 : "+myArray2);
        // var formatMoney(Weight) = parseFloat(myArray[0]).toFixed(2) * parseFloat(myArray[1]).toFixed(2) * parseFloat(myArray[2]).toFixed(2)
        // var formatMoney(Weight) = parseFloat(formatMoney(Weight) * 7.85).toFixed(2)
        if(myArray[2] === "2438"){
          console.log("Width = 2438");
          var Width = (myArray[2]/1000).toFixed(4);var Length = (myArray[1]/1000).toFixed(4);
        }else{
          console.log("Other");
          var Width = (myArray[1]/1000).toFixed(4);var Length = (myArray[2]/1000).toFixed(4);
        }
        var Thick = (myArray[0]/1000).toFixed(4);var Amount = myArray[3];
        console.log("Thick : " + Thick +" mm.\nWidth : " + Width + " mm.\nLength : " + Length + " mm.\nAmount : " + Amount + " Pcs.");
        var ton = (Thick * Width * Length * 7.85 * Amount).toFixed(2);
        var Weight = parseFloat(ton * 1000).toFixed(2);
        console.log("Weight : "+Weight + " Kg.");
        console.log("NaN : " , Weight === "NaN");
        if(Weight === "NaN" || Weight === "0.00"){
          return client.replyMessage(event.replyToken,{type:'text',text:"คุณใส่ตัวเลขไม่ถูกต้องตามรูปแบบที่กำหนด\nกรุณากรอกข้อมูลใหม่อีกครั้งตามรูปแบบดังนี้ ความหนา(มิลลิเมตร)_กว้าง(มิลลิเมตร)_ยาว(มิลลิเมตร)_จำนวน(ชิ้น) \nเช่น 12.00_1524_6096_5 เท่านั้น\n***หมายเหตุ ทศนิยม 2 ตำแหน่ง***"})
        }else if(Thick === "0.0090" && Width === "1.5240" && Length === "6.0960"){ //Start Length 6096
          if(Amount >= 7){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"})
        }else if(Thick === "0.0100" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 7){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"})
        }else if(Thick === "0.0120" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 5){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"})
        }else if(Thick === "0.0127" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 5){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"})
        }else if(Thick === "0.0130" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 5){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
          return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"})
        }else if(Thick === "0.0150" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 5){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"})
        }else if(Thick === "0.0160" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 4){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"})
        }else if(Thick === "0.0190" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 4){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"})
        }else if(Thick === "0.0200" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.0220" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.0250" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.0280" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.0300" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.0320" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.0360" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.0350" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.0380" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.0400" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.0450" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.0500" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.0550" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.0600" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.0650" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.0700" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.0750" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.0800" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.0850" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.0900" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.0950" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.1000" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.1050" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.1100" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.1150" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.1200" && Width === "1.5240" && Length === "6.0960"){
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.1300" && Width === "1.5240" && Length === "6.0960"){ //End Length 6096
          if(Amount >= 1){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 1 Pcs***"})
        }else if(Thick === "0.0090" && Width === "1.5240" && Length === "3.0480"){ //Start Length 3048
          if(Amount >= 13){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 13 Pcs***"})
        }else if(Thick === "0.0100" && Width === "1.5240" && Length === "3.0480"){ 
          if(Amount >= 12){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
          return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 12 Pcs***"})
        }else if(Thick === "0.0120" && Width === "1.5240" && Length === "3.0480"){ 
          if(Amount >= 11){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 11 Pcs***"})
        }else if(Thick === "0.0127" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 10){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 10 Pcs***"})
        }else if(Thick === "0.0130" && Width === "1.5240" && Length === "3.0480"){ 
          if(Amount >= 10){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 10 Pcs***"})
        }else if(Thick === "0.0150" && Width === "1.5240" && Length === "3.0480"){ 
          if(Amount >= 10){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 10 Pcs***"})
        }else if(Thick === "0.0160" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 8){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 8 Pcs***"})
        }else if(Thick === "0.0190" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 7){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"})
        }else if(Thick === "0.0200" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 6){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else 
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"})
        }else if(Thick === "0.0220" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 6){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 6 Pcs***"})
        }else if(Thick === "0.0250" && Width === "1.5240" && Length === "3.0480"){ 
          if(Amount >= 6){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 6 Pcs***"})
        }else if(Thick === "0.0280" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 5){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"})
        }else if(Thick === "0.0300" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 5){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"})
        }else if(Thick === "0.0320" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 5){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"})
        }else if(Thick === "0.0360" && Width === "1.5240" && Length === "3.0480"){ 
          if(Amount >= 4){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"})
        }else if(Thick === "0.0350" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 4){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"})
        }else if(Thick === "0.0380" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 4){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"})
        }else if(Thick === "0.0400" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 4){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"})
        }else if(Thick === "0.0450" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 4){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"})
        }else if(Thick === "0.0500" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 4){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"})
        }else if(Thick === "0.0550" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.0600" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.0650" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.0700" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.0750" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.0800" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.0850" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.0900" && Width === "1.5240" && Length === "3.0480"){
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.0950" && Width === "1.5240" && Length === "3.0480"){ 
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.1000" && Width === "1.5240" && Length === "3.0480"){ 
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.1050" && Width === "1.5240" && Length === "3.0480"){ 
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.1100" && Width === "1.5240" && Length === "3.0480"){ 
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.1150" && Width === "1.5240" && Length === "3.0480"){ 
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.1200" && Width === "1.5240" && Length === "3.0480"){ 
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.1300" && Width === "1.5240" && Length === "3.0480"){ //End Length 3048
          if(Amount >= 2){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 2 Pcs***"})
        }else if(Thick === "0.0090" && Width === "2.4380" && Length === "1.2190"){ //Start Length 2438
          if(Amount >= 21){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 21 Pcs***"})
        }else if(Thick === "0.0100" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 19){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 19 Pcs***"})
        }else if(Thick === "0.0120" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 16){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 16 Pcs***"})
        }else if(Thick === "0.0127" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 15){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 15 Pcs***"})
        }else if(Thick === "0.0130" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 13){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 13 Pcs***"})
        }else if(Thick === "0.0150" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 12){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 12 Pcs***"})
        }else if(Thick === "0.0160" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 10){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 10 Pcs***"})
        }else if(Thick === "0.0190" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 10){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 10 Pcs***"})
        }else if(Thick === "0.0200" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 9){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 9 Pcs***"})
        }else if(Thick === "0.0220" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 8){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 8 Pcs***"})
        }else if(Thick === "0.0250" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 7){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"})
        }else if(Thick === "0.0280" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 7){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"})
        }else if(Thick === "0.0300" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 7){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 7 Pcs***"})
        }else if(Thick === "0.0320" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 6){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 6 Pcs***"})
        }else if(Thick === "0.0360" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 6){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 6 Pcs***"})
        }else if(Thick === "0.0350" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 5){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"})
        }else if(Thick === "0.0380" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 5){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"})
        }else if(Thick === "0.0400" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 5){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"})
        }else if(Thick === "0.0450" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 5){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 5 Pcs***"})
        }else if(Thick === "0.0500" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 4){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"})
        }else if(Thick === "0.0550" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 4){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"})
        }else if(Thick === "0.0600" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 4){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"})
        }else if(Thick === "0.0650" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 4){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"})
        }else if(Thick === "0.0700" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 4){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 4 Pcs***"})
        }else if(Thick === "0.0750" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.0800" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 pcs***"})
        }else if(Thick === "0.0850" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.0900" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.0950" && Width === "2.4380" && Length === "1.2190"){
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.1000" && Width === "2.4380" && Length === "1.2190"){ //End Length 2438
          if(Amount >= 3){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 3 Pcs***"})
        }else if(Thick === "0.0060" && Width === "1.5240" && Length === "6.0960"){ //Start Double Min 12
          if(Amount >= 12){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 12 Pcs***"})
        }else if(Thick === "0.0060" && Width === "1.5240" && Length === "3.0480"){ //Start Double Min 21
          if(Amount >= 21){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 21 Pcs***"})
        }else if(Thick === "0.0060" && Width === "2.4380" && Length === "1.2190"){ //Start Double Min 36
          if(Amount >= 36){
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept***"})
          }else
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น\n***Accept Min Q'ty 36 Pcs***"})
        }else{
            return client.replyMessage(event.replyToken,{type:'text',text:"น้ำหนัก : "+formatMoney(Weight)+" กก.(กิโลกรัม)\nคิดเป็นตันจะได้ : " + ton + " ตัน\nจำนวน : " + Amount + " ชิ้น"})
        }
    }
    else if(event.type === 'message' && event.message.type === 'image'){
        // console.log(event.message);
        // console.log("Event : "+event);
        // const urls = await upload(event);
        // console.log("urls : "+urls);
        console.log(event.message.contentProvider);
        return client.replyMessage(event.replyToken,{type:'text',text:"รูปภาพ"})
        // return null;
    }
}

app.listen(80, () => {
    console.log('listening on 80');
})


//10 x 1524 x 6096 x 10   *****
//10 x 1524 x 6096 x 9     
//10 x 1524 x 3048 x 18   *****
//...x 1219 x 2438 x ...  *****
//10 x 1524 x 9144 x 9

//10 x 1524 x .........
//10 x 1524 x .........

//รีดตรง รีดสลับ

//หา Min ของทุกไซด์ (เฉพาะ size standard)