const express = require('express');
const router = express.Router();

const cheerio = require('cheerio')
const request = require('superagent');

const _config = require('../_config/private');

router.get('/mailtest',(req,res) => {
  let nodemailer = require('nodemailer'),
      smtpTransport = require('nodemailer-smtp-transport');
  // SMTP 连接
  let transport = nodemailer.createTransport(smtpTransport({
    // 主机
    host: 'smtp.qq.com',
    // 是否使用 SSL
    secure: true,
    port: 465, 
    auth: {
      // 账号
      user: _config.mailSender, 
      // 授权码(SMTP的授权码设置)，此处非密码
      pass: _config.mailPassword, 
    }
  }));
  // 设置邮件内容
  let mailOptions = {
   from: '1983118176<'+_config.mailSender+'>', 
   to: _config.mailGeter, 
   subject: '数据更新提醒', 
   html: '<strong style="color: red">数据更新提醒</strong>'
  }
  transport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.error(error)
    } else {
      console.log('Message Send Ok')
    }
    // 记得关闭连接
    transport.close();
  })
});

router.get('/moniter_macao', (req,res) => {
  request.get('//targeturl').end((err, res) => {
    if (err) {
      console.log('fail ${err}');
    } else {
      let $ = cheerio.load(res.text,{decodeEntities: false});
      var praser = $("#1 a");
      console.log(praser.html().toString())
    }
  });
})


module.exports = router
