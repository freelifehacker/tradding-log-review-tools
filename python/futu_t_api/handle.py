import time
from futu import *
# from py_vollib import black_scholes
# print(implied_volatility)
class OrderBookTest(OrderBookHandlerBase):
    def on_recv_rsp(self, rsp_str):
        ret_code, data = super(OrderBookTest,self).on_recv_rsp(rsp_str)
        if ret_code != RET_OK:
            print("OrderBookTest: error, msg: %s" % data)
            return RET_ERROR, data
        
        print("Option Bid", data['Bid'][0][0]) # OrderBookTest自己的处理逻辑
        print("Option Ask", data['Ask'][0][0]) # OrderBookTest自己的处理逻辑

        return RET_OK, data

# quote_ctx = OpenQuoteContext(host='127.0.0.1', port=11111)
# handler = OrderBookTest()
# quote_ctx.set_handler(handler)
# quote_ctx.subscribe(['US.AMZN190118C1700000'], [SubType.ORDER_BOOK])
# time.sleep(15)
# quote_ctx.close()

class StockQuoteTest(StockQuoteHandlerBase):
    def on_recv_rsp(self, rsp_str):
        ret_code, data = super(StockQuoteTest,self).on_recv_rsp(rsp_str)
        if ret_code != RET_OK:
            print("StockQuoteTest: error, msg: %s" % data)
            return RET_ERROR, data

        print("AMAZON:", data.data_time[0],' | ',data.last_price[0]) # StockQuoteTest自己的处理逻辑

        return RET_OK, data

quote_ctx = OpenQuoteContext(host='127.0.0.1', port=11111)
handler = StockQuoteTest()
quote_ctx.set_handler(handler)
quote_ctx.subscribe(['US.AMZN'], [SubType.QUOTE])
optionsHandler = OrderBookTest()
quote_ctx.set_handler(optionsHandler)
quote_ctx.subscribe(['US.AMZN190118C1700000'], [SubType.ORDER_BOOK])
time.sleep(5)
quote_ctx.close()