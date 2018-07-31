const express = require('express');
const router = express.Router();
const pdfHandler = require('../controller/pdfHandler');
router.get('/pdf', (req,res) => {
  pdfHandler.runUpdateData();
  // const request = require('request');
  // request(host+'static/data/pdf/1001100100141193-20180726.html', function (error, response, body) { 
  //   if (!error && response.statusCode == 200) { 
  //     var $ = cheerio.load( body ,{decodeEntities: false});
  //     var praser = $("body").html().toString();
  //     var a = praser.split("買入")
  //     var row = [];
  //     var result = [];
  //     var regPoint = new RegExp( ',' , "g" );
  //     for(var i=0;i < a.length; i++){
  //       if(a[i].indexOf("變動金額小計")>0){
  //         var b = a[i].split("賣出");
  //         for(var j=0;j < b.length; j++){
  //           if(b[j].indexOf("成交金額合計")>0){
  //             var c = b[j].split("成交金額合計");
  //             row.push(c[0]);
  //           }else{
  //             row.push(b[j]);
  //           }
  //         }
  //       }
  //     }

  //     for(var i=0;i<row.length;i++){
  //       row[i] = row[i].split("<br>");
  //       var rowData = {};
  //       var countSubRow = 0;
  //       rowData.isNx = true;
  //       //判断正股或牛熊
  //       if(row[i][7].indexOf("印花稅")>0){
  //         rowData.isNx = false;
  //         var name = row[i][1];
  //         var code = name.split("  ");
  //         rowData.name = code[1]
  //         rowData.code = code[0]
  //       }else{
  //         var name = row[i][1]+row[i][7];
  //         var code = name.split("  ");
  //         rowData.name = code[1]
  //         rowData.code = code[0]
  //       }
  //       for(var j=0;j<row[i].length;j++){
  //         if(row[i][j].indexOf("交易系統使用費")>0){
  //           countSubRow++;
  //         }
  //       }

  //       rowData.time = row[i][3]
  //       rowData.quantity = row[i][4].replace(regPoint,"");
  //       rowData.price = row[i][5].replace(regPoint,"");
  //       rowData.sumAmount = row[i][6].replace(regPoint,""); 

  //       if(countSubRow>1){
  //         //多行结果
  //         var temp =[];
  //         var tempA = 0;
  //         var tempB = 0;
  //         var tempC = 0;
  //         if(rowData.isNx){
  //           for(var j=0;j<row[i].length;j++){
  //             if(row[i][j].indexOf("交易系統使用費")>0 && j==12){
  //               temp.push([row[i][j-8],row[i][j-7],row[i][j-6]])
  //             }else if(row[i][j].indexOf("交易系統使用費")>0 && j > 12){
  //               temp.push([row[i][j-7],row[i][j-6],row[i][j-5]])
  //             }
  //           }
  //         }else{
  //           for(var j=0;j<row[i].length;j++){
  //             if(row[i][j].indexOf("交易系統使用費")>0){
  //               temp.push([row[i][j-7],row[i][j-6],row[i][j-5]])
  //             }
  //           }
  //         }
  //         for(var j=0;j<temp.length;j++){ 
  //           tempA += parseInt(temp[j][0].replace(regPoint,""));
  //           tempB += parseFloat(temp[j][1].replace(regPoint,""));
  //           tempC += parseFloat(temp[j][2].replace(regPoint,""));
  //         } 
  //         rowData.quantity = tempA
  //         rowData.price = (tempB/temp.length).toFixed(3);
  //         rowData.sumAmount = tempC;
  //         for(var j=0;j<row[i].length;j++){
  //           if(row[i][j].indexOf("交易費用小計")>0){
  //             rowData.tradCost = row[i][j+1].replace(regPoint,"")
  //             rowData.commission = row[i][j+3].replace(regPoint,"")
  //             rowData.platformCost = row[i][j+5].replace(regPoint,"")
  //             rowData.moneyChange = row[i][j+7].replace(regPoint,"")
  //           }
  //         }
  //       }else{
  //         //单行结果
  //         if(rowData.isNx){
  //           rowData.tradCost = row[i][16].replace(regPoint,"")
  //           rowData.commission = row[i][18].replace(regPoint,"")
  //           rowData.platformCost = row[i][20].replace(regPoint,"")
  //           rowData.moneyChange = row[i][22].replace(regPoint,"")
  //         }else{
  //           rowData.tradCost = row[i][15].replace(regPoint,"")
  //           rowData.commission = row[i][17].replace(regPoint,"")
  //           rowData.platformCost = row[i][19].replace(regPoint,"")
  //           rowData.moneyChange = row[i][21].replace(regPoint,"")
  //         }
  //       }
  //       if(rowData.moneyChange.indexOf("+")>0){
  //         rowData.tradType = 'sale';
  //       }else{
  //         rowData.tradType = 'buy';
  //       }
  //       result.push(rowData);
  //     }

  //     // res.send(row)
  //     res.send(result)
  //   }else{
  //     console.log(error)
  //   }
  //   
    
  
})
module.exports = router
