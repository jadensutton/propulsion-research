import bs4
import requests
import statistics

import pandas as pd
import yfinance as yf
import numpy as np

from bs4 import BeautifulSoup
from pymongo import MongoClient
from datetime import datetime
from datetime import timedelta

from time import sleep

pages = list ("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
indices = ["tsx", "tsxv"]
for index in indices:
    print ("Getting data for", index.upper ())

    ticker_list = []
    for page in pages:
        r = requests.get ("http://eoddata.com/stocklist/"+index+"/"+page+".htm")
        soup = bs4.BeautifulSoup (r.text, "lxml")
        tickers = soup.find_all ('tr',{'class':'ro'})

        if index == "tsx":
            for ticker in tickers:
                ticker_list.append ([str (ticker.find_all ("td")[0].find ("a").text) + ".TO", ticker.find_all ("td")[1].text])

            tickers = soup.find_all ('tr',{'class':'re'})
            for ticker in tickers:
                ticker_list.append ([str (ticker.find_all ("td")[0].find ("a").text) + ".TO", ticker.find_all ("td")[1].text])

        elif index == "tsxv":
            for ticker in tickers:
                ticker_list.append ([str (ticker.find_all ("td")[0].find ("a").text) + ".V", ticker.find_all ("td")[1].text])

            tickers = soup.find_all ('tr',{'class':'re'})
            for ticker in tickers:
                ticker_list.append ([str (ticker.find_all ("td")[0].find ("a").text) + ".V", ticker.find_all ("td")[1].text])

        else:
            for ticker in tickers:
                ticker_list.append ([str (ticker.find_all ("td")[0].find ("a").text), ticker.find_all ("td")[1].text])

            tickers = soup.find_all ('tr',{'class':'re'})
            for ticker in tickers:
                ticker_list.append ([str (ticker.find_all ("td")[0].find ("a").text), ticker.find_all ("td")[1].text])

        print (str ("%.2f" % (pages.index (page) / len (pages) * 100)) + "% done")

    print ("Done")
    print ("\nRefining data")

    posts = []
    for ticker in ticker_list:
        try:
            print (str ("%.2f" % (ticker_list.index (ticker) / len (ticker_list) * 100)) + "% done")

            today = datetime.today ()
            last_year = today - timedelta (days=365)
            today, last_year = today.strftime ('%Y-%m-%d'), last_year.strftime ('%Y-%m-%d')
            stock_data = yf.download (ticker[0], last_year, today)["Open"]

            if len (stock_data) > 120 and np.isnan (stock_data[0]) == False and (stock_data[-1] - stock_data[0]) / stock_data[0] >= 0.2 and stock_data[-1] >= 0.50:
                returns = []
                for n in range (len (stock_data)):
                    if n > 0:
                        if np.isnan ((stock_data[n] - stock_data[n - 1]) / stock_data[n]) == False:
                            returns.append ((stock_data[n] - stock_data[n - 1]) / stock_data[n])

                meanReturn = statistics.mean (returns)
                stdevReturns = statistics.stdev (returns)

                post = {"_id": ticker[0], "Company": ticker[1], "Mean Return": meanReturn, "Standard Deviation": stdevReturns, "Index": index}
                posts.append (post)

        except Exception as e:
            print (e)
            print ("Experienced error, skipping",ticker)

    cluster = MongoClient ("mongodb+srv://admin:hW#5d7eK@cluster0.3wrw8.gcp.mongodb.net/market_data?retryWrites=true&w=majority")
    db = cluster["market_data"]
    collection = db[index]
    collection.delete_many ({})
    collection.insert_many (posts)
