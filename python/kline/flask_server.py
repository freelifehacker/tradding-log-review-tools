from flask import Flask
from futuquant import *
from decimal import Decimal
import pandas as pd
import json
import numpy
import os
import time

app = Flask(__name__)

# watchList = ['HK.800000','HK.00700','HK.00027','US.SPY']
watchList = ['US..INX']

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

# @app.route('/us-option-live')
# def optionlive():
#     # currentDay = pd.datetime.now()
#     quote_ctx = OpenQuoteContext(host='127.0.0.1', port=11111)
#     # print("============")
#     # ret, data, page_req_key = quote_ctx.request_history_kline('US.AMD181019P24500', start='2018-10-16', end='2018-10-16', max_count=1) #请求开头50个数据
#     # print(data.to_html()) 
#     # print(quote_ctx.get_market_snapshot('US.AAPL190621C140000'))

#     # options = quote_ctx.get_option_chain('US.AMD', '2018-10-16', '2018-11-16', OptionType.ALL, OptionCondType.ALL)
#     # print(quote_ctx.request_history_kline('US.AMD', start='2018-01-01', end=currentDay.date())) 

#     handler = StockQuoteTest()
#     quote_ctx.set_handler(handler)
#     quote_ctx.subscribe(['US.AMD181019P24500'], [SubType.QUOTE])
#     time.sleep(15)
#     quote_ctx.close()
#     return 'done'

@app.route('/day') 
def dayline():
    currentDay = pd.datetime.now()
    quote_ctx = OpenQuoteContext(host='127.0.0.1', port=11111)
    for code in watchList:
        tx_kline = quote_ctx.request_history_kline(code, start='2018-01-01', end=currentDay.strftime('%Y-%m-%d'))
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
        print(len(kline_data))
        if(len(kline_data)>0):
            fo = open("../static/kline/"+code+"/day.json", "w")
            fo.write(json.dumps(kline_data,default=defaultDataType)) 
            fo.close()
    quote_ctx.close()
    return "day line done 1"

@app.route('/min')
def minline():
    currentDay = pd.datetime.now()
    quote_ctx = OpenQuoteContext(host='127.0.0.1', port=11111)
    # time_type = ['1M','5M','15M','30M','60M']
    time_type = ['30M','60M']
    for code in watchList:
        time_day_range = pd.date_range(start='2018-01-01', end=currentDay.strftime('%Y-%m-%d'))
        for i in range(0,len(time_day_range)):
            if time_day_range[i].dayofweek == 5 or time_day_range[i].dayofweek == 6 : continue 
            for timeType in time_type:
                dayDate = str(time_day_range[i].strftime('%Y-%m-%d'))
                basePath = "../static/kline/"+code
                klinType = KLType.K_1M
                # if timeType == '1M' : klinType = KLType.K_1M 
                # if timeType == '5M' : klinType = KLType.K_5M 
                # if timeType == '15M' : klinType = KLType.K_15M 
                if timeType == '30M' : klinType = KLType.K_30M
                if timeType == '60M' : klinType = KLType.K_60M
                if os.path.exists(basePath) == False:
                    os.makedirs(basePath)
                if os.path.exists(basePath+"/"+timeType) == False:
                    os.makedirs(basePath+"/"+timeType)
                if os.path.exists(basePath+"/"+timeType+"/"+dayDate+".json") == False:
                    print("======get "+dayDate+" min start======")
                    tx_kline = quote_ctx.request_history_kline(code, start=dayDate,end=dayDate,ktype=klinType)
                    time.sleep(3.2)
                    print("======get "+dayDate+" min end====")
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
                        fo = open(basePath+"/"+timeType+"/"+dayDate+".json", "w")
                        fo.write(json.dumps(kline_data,default=defaultDataType)) 
                        fo.close()
    quote_ctx.close()
    return "min1 done"

@app.route('/strategy')
def strategy():
    current_day = pd.datetime.now()
    base_path = "../static/kline/US..INX/30M/"
    time_day_range = pd.date_range(start='2018-01-01', end=current_day.strftime('%Y-%m-%d'))
    d = {'date': [],'t9:31':[], 't10:01':[],'t10:31':[],'t11:01':[],'t11:31':[],'t12:01':[],'t12:31':[],'t13:01':[],'t13:31':[],'t14:01':[],'t14:31':[],'t15:01':[],'t15:31':[]}
    updown = {'date': [],'t9:31':[], 't10:01':[],'t10:31':[],'t11:01':[],'t11:31':[],'t12:01':[],'t12:31':[],'t13:01':[],'t13:31':[],'t14:01':[],'t14:31':[],'t15:01':[],'t15:31':[]}
    for i in range(0,len(time_day_range)):
        day = str(time_day_range[i].strftime('%Y-%m-%d'))
        if os.path.exists(base_path+day+'.json') == True:
            day_data = pd.read_json(base_path+day+'.json')
            for j in range(0,13): 
                gap_range = float(day_data[3][j])-float(day_data[4][j])
                updown_range = float(day_data[1][j])-float(day_data[2][j])
                if j == 0:
                    d['date'].append(day_data[0][0])
                    d['t9:31'].append(gap_range)
                    updown['date'].append(day_data[0][0])
                    updown['t9:31'].append(updown_range)
                if j == 1:
                    d['t10:01'].append(gap_range)
                    updown['t10:01'].append(updown_range)
                if j == 2:
                    d['t10:31'].append(gap_range)
                    updown['t10:31'].append(updown_range)
                if j == 3:
                    d['t11:01'].append(gap_range)
                    updown['t11:01'].append(updown_range)
                if j == 4:
                    d['t11:31'].append(gap_range)
                    updown['t11:31'].append(updown_range)
                if j == 5:
                    d['t12:01'].append(gap_range)
                    updown['t12:01'].append(updown_range)
                if j == 6:
                    d['t12:31'].append(gap_range)
                    updown['t12:31'].append(updown_range)
                if j == 7:
                    d['t13:01'].append(gap_range)
                    updown['t13:01'].append(updown_range)
                if j == 8:
                    d['t13:31'].append(gap_range)
                    updown['t13:31'].append(updown_range)
                if j == 9:
                    d['t14:01'].append(gap_range)
                    updown['t14:01'].append(updown_range)
                if j == 10:
                    d['t14:31'].append(gap_range)
                    updown['t14:31'].append(updown_range)
                if j == 11:
                    d['t15:01'].append(gap_range)
                    updown['t15:01'].append(updown_range)
                if j == 12:
                    d['t15:31'].append(gap_range)
                    updown['t15:31'].append(updown_range)
    df30MGap = pd.DataFrame(data=d)
    df30MUpdown = pd.DataFrame(data=updown)
    for key in df30MUpdown:
        p = df30MUpdown[key]
        up = 0
        down = 0
        for j in df30MUpdown[key]:
            if key is 'date':
                continue
            if j >=0 :
                up+=1
            else:
                down+=1
        print("============"+key+"==============")
        print("up   count:"+str(up))
        print("down count:"+str(down))
    # print("===== updown mean ======")
    # print(df30MUpdown.mean())
    # print("===== updown std ======")
    # print(df30MUpdown.std()) 
    # print("===== mean ======")
    # print(df30MGap.mean())
    # print("===== std ======")
    # print(df30MGap.std())
    return 'd'













