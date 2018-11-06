from flask import Flask
from futuquant import *
from decimal import Decimal
import pandas as pd
import json
import numpy
import os
import time

watchList = ['HK.800000','HK.00700','HK.00027']

def defaultDataType(o):
  if isinstance(o, numpy.int64): return int(o)  
  raise TypeError


class StockQuoteTest(StockQuoteHandlerBase):
  def on_recv_rsp(self, rsp_str):
    ret_code, data = super(StockQuoteTest,self).on_recv_rsp(rsp_str)
    if ret_code != RET_OK:
      print("StockQuoteTest: error, msg: %s" % data)
      return RET_ERROR, data
    print("StockQuoteTest ", data.to_html()) # StockQuoteTest自己的处理逻辑
    return RET_OK, data
app = Flask(__name__)


@app.route('/us-option-live')
def optionlive():
  # currentDay = pd.datetime.now()
  quote_ctx = OpenQuoteContext(host='127.0.0.1', port=11111)
  # print("============")
  # ret, data, page_req_key = quote_ctx.request_history_kline('US.AMD181019P24500', start='2018-10-16', end='2018-10-16', max_count=1) #请求开头50个数据
  # print(data.to_html()) 
  # print(quote_ctx.get_market_snapshot('US.AAPL190621C140000'))

  # options = quote_ctx.get_option_chain('US.AMD', '2018-10-16', '2018-11-16', OptionType.ALL, OptionCondType.ALL)
  # print(quote_ctx.request_history_kline('US.AMD', start='2018-01-01', end=currentDay.date())) 

  handler = StockQuoteTest()
  quote_ctx.set_handler(handler)
  quote_ctx.subscribe(['US.AMD181019P24500'], [SubType.QUOTE])
  time.sleep(15)
  quote_ctx.close()
  return 'done'

@app.route('/day')
def dayline():
  currentDay = pd.datetime.now()
  quote_ctx = OpenQuoteContext(host='127.0.0.1', port=11111)
  for code in watchList:
    tx_kline = quote_ctx.get_history_kline(code, start='2018-01-01', end=currentDay.date())   
    kline_data = []
    for i in range(0,len(tx_kline[1]['time_key'])):
      row = [];
      row.append(tx_kline[1]['time_key'][i])
      row.append(tx_kline[1]['open'][i])
      row.append(tx_kline[1]['close'][i])
      row.append(tx_kline[1]['high'][i])
      row.append(tx_kline[1]['low'][i])
      row.append(tx_kline[1]['pe_ratio'][i])
      row.append(tx_kline[1]['turnover_rate'][i])
      row.append(tx_kline[1]['volume'][i])
      row.append(tx_kline[1]['turnover'][i])
      row.append(tx_kline[1]['change_rate'][i])
      row.append(tx_kline[1]['last_close'][i])
      kline_data.append(row)
    if(len(kline_data)>0):
      fo = open("../static/kline/"+code+"/day.json", "w")
      fo.write(json.dumps(kline_data,default=defaultDataType)) 
      fo.close()
  quote_ctx.close()
  return "day line done"

@app.route('/min1')
def min1line():
  currentDay = pd.datetime.now()
  quote_ctx = OpenQuoteContext(host='127.0.0.1', port=11111)
  for code in watchList:
    time_day_range = pd.date_range(start='2018-01-01', end=currentDay.date())
    for i in range(0,len(time_day_range)):
      dayDate = str(time_day_range[i].date());
      if os.path.exists("../static/kline/"+code+"/min1/"+dayDate+".json") == False:
        tx_kline = quote_ctx.get_history_kline(code, start=dayDate, end=dayDate,ktype=KLType.K_1M)
        kline_data = []
        for i in range(0,len(tx_kline[1]['time_key'])):
          row = [];
          row.append(tx_kline[1]['time_key'][i])
          row.append(tx_kline[1]['open'][i])
          row.append(tx_kline[1]['close'][i])
          row.append(tx_kline[1]['high'][i])
          row.append(tx_kline[1]['low'][i])
          row.append(tx_kline[1]['pe_ratio'][i])
          row.append(tx_kline[1]['turnover_rate'][i])
          row.append(tx_kline[1]['volume'][i])
          row.append(tx_kline[1]['turnover'][i])
          row.append(tx_kline[1]['change_rate'][i])
          row.append(tx_kline[1]['last_close'][i])
          kline_data.append(row)
        if(len(kline_data)>0):
          fo = open("../static/kline/"+code+"/min1/"+dayDate+".json", "w")
          fo.write(json.dumps(kline_data,default=defaultDataType)) 
          fo.close()
  quote_ctx.close()
  return "min1 done"