const express = require('express')
const exec = require('child_process').exec;
const _rootPath = process.cwd();
const cheerio = require('cheerio')
const host = 'http://localhost:8080/';
const _config = require('../_config/private');
const fs = require('fs');
const request = require('request');
const util = require('../util/util');
const TraddingItem = require('../models/traddingItem');
const TraddingDate = require('../models/traddingDate');

pdfHandler = {
  runUpdateData(){
    this._pdf2html();
  },
  _pdf2html(){
    var pdfPath = _rootPath+'/static/data/pdf';
    var htmlPath = _rootPath+'/static/data/html';
    var _self = this;
    if( fs.existsSync(pdfPath) ) {
      fs.readdirSync(pdfPath).forEach(function(file,index){
        if(file == '.DS_Store')return;
        var curPdfFilePath = pdfPath + "/" + file;
        var htmlCheck = htmlPath + "/" + file+'.html';
        if( !fs.existsSync(htmlCheck) ) {
          exec('pdftohtml -opw '+_config.pdf_password+' -p -noframes -enc UTF-8 '+curPdfFilePath+' '+htmlCheck, function(err, stdout, stderr) {
            if (err) {
                console.log(err.stack);
                console.log('Error code: ' + err.code);
                console.log('Signal received: ' + err.signal);
            }else{
              _self._traddingDataCheck(file+'.html');
              _self._traddingDayMoneyCheck(file+'.html');
            }
            console.log('data : ' + stdout);
          }).on('exit', function (code) {
              console.log('子进程已退出, 退出码 ' + code);
          });
        }
      });
    }
  },

  _getTraddingDate(fileName){
    var t = fileName.split("-");
    var s = t[1].split(".");
    return s[0];
  },
  //当日交易资金变动记录
  _moneyPraser(htmlFileName,traddigDate){
    request(host+'static/data/html/'+htmlFileName, function (error, response, body) { 
      if (!error && response.statusCode == 200) { 
        var $ = cheerio.load( body ,{decodeEntities: false});
        var regPoint = new RegExp( ',' , "g" );
        var praser = $("body").html().toString();
        var a = praser.split("<br>");
        var rusult = [];
        var dayMoneyData = {};
        dayMoneyData.dayDate = traddigDate;
        for(var i=0;i < a.length; i++){
          var row = util.trim(a[i].replace(regPoint,""));
          if(row.indexOf("盤前證券市值")!=-1){
            //盤前證券市值
            dayMoneyData.startMarketValue = parseFloat(util.trim(a[i+1].replace(regPoint,"")));
            //盤前現金結餘
            dayMoneyData.startCash = parseFloat(util.trim(a[i+3].replace(regPoint,"")));
            //盤前資產淨值
            dayMoneyData.startNetAssets = dayMoneyData.startMarketValue+dayMoneyData.startCash;
          }
          if(row.indexOf("盤後證券市值")!=-1){
            //盤後證券市值
            dayMoneyData.endMarketValue = parseFloat(util.trim(a[i+1].replace(regPoint,"")));
            //盤後現金結餘
            dayMoneyData.endCash = parseFloat(util.trim(a[i+3].replace(regPoint,"")));
            //盤後資產淨值
            dayMoneyData.endNetAssets = dayMoneyData.endMarketValue+dayMoneyData.endCash;
          }
        }
        let traddingMoneyData = new TraddingDate(dayMoneyData)
        traddingMoneyData.save( (err,item) => {
          if (err) {
            console.log("=========AAAAA========");
            console.log(dayMoneyData);
            console.log("=========BBBBB========");
            console.log("Row Data Save Error"+err);
            console.log("=================");
          } else {
            console.log(htmlFileName+'traddigMoneyDate saved');
          }
        })
      }else{

      }
    });
  },

  //交易详情记录
  _traddingDataPraser(htmlFileName,traddigDate){
    request(host+'static/data/html/'+htmlFileName, function (error, response, body) { 
      if (!error && response.statusCode == 200) { 
        var $ = cheerio.load( body ,{decodeEntities: false});
        var praser = $("body").html().toString();
        var a = praser.split("買入")
        var row = [];
        var result = [];
        var regPoint = new RegExp( ',' , "g" );
        for(var i=0;i < a.length; i++){
          if(a[i].indexOf("變動金額小計")>0){
            var b = a[i].split("賣出");
            for(var j=0;j < b.length; j++){
              if(b[j].indexOf("成交金額合計")>0){
                var c = b[j].split("成交金額合計");
                row.push(c[0]);
              }else{
                row.push(b[j]);
              }
            }
          }
        }

        for(var i=0;i<row.length;i++){
          row[i] = row[i].split("<br>");
          var rowData = {};
          var countSubRow = 0;
          rowData.isNx = true;
          rowData.isCall = true;//做多

          // console.log(row[i][1])
          if(row[i][1].indexOf("年")>0){
            //过滤初始信息 2018年
            continue;
          }

          //判断正股或牛熊
          if(row[i][7].indexOf("印花稅")>0){
            rowData.isNx = false;
            var name = util.trim(row[i][1]);
            var scode = name;
            var sname = name;            
            rowData.scode = scode.substr(0,5);
            rowData.sname = sname.slice(5);
          }else{
            var name = util.trim(row[i][1]+row[i][7]);
            var scode = name;
            var sname = name;            
            rowData.scode = scode.substr(0,5);
            rowData.sname = sname.slice(5);
            if(rowData.sname.indexOf("熊")>0){
              rowData.isCall = false;//做空
            }
          }
          for(var j=0;j<row[i].length;j++){
            if(row[i][j].indexOf("交易系統使用費")>0){
              countSubRow++;
            }
          }

          rowData.date = traddigDate;
          rowData.time = util.trim(row[i][3]);
          rowData.quantity = util.trim(row[i][4].replace(regPoint,""));
          rowData.price = util.trim(row[i][5].replace(regPoint,""));
          rowData.sumAmount = util.trim(row[i][6].replace(regPoint,"")); 

          if(countSubRow>1){
            //多行结果
            var temp =[];
            var tempA = 0;
            var tempB = 0;
            var tempC = 0;
            if(rowData.isNx){
              for(var j=0;j<row[i].length;j++){
                if(row[i][j].indexOf("交易系統使用費")>0 && j==12){
                  temp.push([row[i][j-8],row[i][j-7],row[i][j-6]])
                }else if(row[i][j].indexOf("交易系統使用費")>0 && j > 12){
                  temp.push([row[i][j-7],row[i][j-6],row[i][j-5]])
                }
              }
            }else{
              for(var j=0;j<row[i].length;j++){
                if(row[i][j].indexOf("交易系統使用費")>0){
                  temp.push([row[i][j-7],row[i][j-6],row[i][j-5]])
                }
              }
            }
            for(var j=0;j<temp.length;j++){ 
              tempA += parseInt(util.trim(temp[j][0].replace(regPoint,"")));
              tempB += parseFloat(util.trim(temp[j][1].replace(regPoint,"")));
              tempC += parseFloat(util.trim(temp[j][2].replace(regPoint,"")));
            } 
            rowData.quantity = tempA
            rowData.price = (tempB/temp.length).toFixed(3);
            rowData.sumAmount = tempC;
            for(var j=0;j<row[i].length;j++){
              if(row[i][j].indexOf("交易費用小計")>0){
                rowData.tradCost = util.trim(row[i][j+1].replace(regPoint,""))
                rowData.commission = util.trim(row[i][j+3].replace(regPoint,""))
                rowData.platformCost = util.trim(row[i][j+5].replace(regPoint,""))
                rowData.moneyChange = util.trim(row[i][j+7].replace(regPoint,""))
              }
            }
          }else{
            //单行结果
            if(rowData.isNx){
              rowData.tradCost = util.trim(row[i][16].replace(regPoint,""))
              rowData.commission = util.trim(row[i][18].replace(regPoint,""))
              rowData.platformCost = util.trim(row[i][20].replace(regPoint,""))
              rowData.moneyChange = util.trim(row[i][22].replace(regPoint,""))
            }else{
              rowData.tradCost = util.trim(row[i][15].replace(regPoint,""))
              rowData.commission = util.trim(row[i][17].replace(regPoint,""))
              rowData.platformCost = util.trim(row[i][19].replace(regPoint,""))
              rowData.moneyChange = util.trim(row[i][21].replace(regPoint,""))
            }
          }
          if(rowData.moneyChange.indexOf("+")>=0){
            rowData.isBuy = false;
          }else{
            rowData.isBuy = true;
          }

          let traddomgRowData = new TraddingItem(rowData)
          traddomgRowData.save( (err,item) => {
            if (err) {
              console.log("=========AAAAA========");
              console.log(rowData);
              console.log("=========BBBBB========");
              console.log("Row Data Save Error"+err);
              console.log("=================");
            } else {
              console.log(traddigDate+"-row-"+i+" saved");
            }
          })
          // result.push(rowData);
        }
        // res.send("done");
        // res.send(row)
        // res.send(result)
      }else{
        console.log(error)
      }
    });
  },
  _traddingDayMoneyCheck(htmlFileName){
    var _self = this;
    var traddigDate = this._getTraddingDate(htmlFileName);
    TraddingDate.find({date:traddigDate})
       .then(items => {
          if(items.length == 0){
            _self._moneyPraser(htmlFileName,traddigDate);
          }
       })
       .catch(err => {
          console.log("TraddingDateDayMoneyFinderError");
       });
  },
  _traddingDataCheck(htmlFileName){
    var _self = this;
    var traddigDate = this._getTraddingDate(htmlFileName);
    TraddingItem.find({date:traddigDate})
       .then(items => {
          if(items.length == 0){
            _self._traddingDataPraser(htmlFileName,traddigDate);
          }
       })
       .catch(err => {
          console.log("TraddingDateFinderError");
       });
  },
};

module.exports = pdfHandler;
