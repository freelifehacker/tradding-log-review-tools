from flask import Flask
from futuquant import *
from decimal import Decimal
import pandas as pd
import json
import numpy

def defaultDataType(o):
  if isinstance(o, numpy.int64): return int(o)  
  raise TypeError

app = Flask(__name__)

@app.route('/')
def hello():
  quote_ctx = OpenQuoteContext(host='127.0.0.1', port=11111)
  # tx_kline = quote_ctx.get_history_kline('HK.800000', start='2018-01-01', end='2018-09-07')
  time_day_range = pd.date_range(start='2018-01-01', end='2018-09-07')
  for i in range(0,len(time_day_range)):
    dayDate = str(time_day_range[i].date());
    tx_kline = quote_ctx.get_history_kline('HK.800000', start=dayDate, end=dayDate,ktype=KLType.K_1M)
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
      fo = open("../static/kline/HK.800000/min1/"+dayDate+".json", "w")
      fo.write(json.dumps(kline_data,default=defaultDataType)) 
      fo.close()
  # print("===========")
  quote_ctx.close()
  # kline_data = []
  # for i in range(0,len(tx_kline[1]['time_key'])):
  #   row = [];
  #   row.append(tx_kline[1]['time_key'][i])
  #   row.append(tx_kline[1]['open'][i])
  #   row.append(tx_kline[1]['close'][i])
  #   row.append(tx_kline[1]['high'][i])
  #   row.append(tx_kline[1]['low'][i])
  #   row.append(tx_kline[1]['pe_ratio'][i])
  #   row.append(tx_kline[1]['turnover_rate'][i])
  #   row.append(tx_kline[1]['volume'][i])
  #   row.append(tx_kline[1]['turnover'][i])
  #   row.append(tx_kline[1]['change_rate'][i])
  #   row.append(tx_kline[1]['last_close'][i])
  #   kline_data.append(row)
  # fo = open("../static/kline/HK.800000/min1.json", "w")
  # fo.write(json.dumps(kline_data,default=defaultDataType)) 
  # fo.close()
  return "xxx"