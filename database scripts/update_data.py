#Import statements
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
for index in indices:   #Loop through each index
    print ("Getting data for", index.upper ())

    ticker_list = []
    for page in pages:  #Loop through each page on eoddata
        #Scrape all tickers on the page. Add .TO to the end if it's on the TSX, and .V if it's on the TSXV (Yahoo Finance Format)
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
    for ticker in ticker_list:  #Loop through tickers
        try:
            print (str ("%.2f" % (ticker_list.index (ticker) / len (ticker_list) * 100)) + "% done")

            #Get the date range for 1 year and download the stock data in that range
            today = datetime.today ()
            last_year = today - timedelta (days=365)
            today, last_year = today.strftime ('%Y-%m-%d'), last_year.strftime ('%Y-%m-%d')
            stock_data = yf.download (ticker[0], last_year, today)["Open"]

            #If the stock meets the requirements for amount of data available, returns, and price
            if len (stock_data) > 120 and np.isnan (stock_data[0]) == False and (stock_data[-1] - stock_data[0]) / stock_data[0] >= 0.2 and stock_data[-1] >= 0.50:
                #Calculate daily returns on the stock
                returns = []
                for n in range (len (stock_data)):
                    if n > 0:
                        if np.isnan ((stock_data[n] - stock_data[n - 1]) / stock_data[n]) == False:
                            returns.append ((stock_data[n] - stock_data[n - 1]) / stock_data[n])

                #Calculate the mean returns and the standard deviation of the returns
                mean_return = statistics.mean (returns)
                stdev_returns = statistics.stdev (returns)

                post = {"_id": ticker[0], "Company": ticker[1], "Mean Return": mean_return, "Standard Deviation": stdev_returns, "Index": index}
                posts.append (post)

        except Exception as e:  #If there was an error, print the ticker and the error
            print (e)
            print ("Experienced error, skipping", ticker)

    #Send the stock data to the database
    cluster = MongoClient ("mongodb+srv://admin:[PASSWORD OMITTED]@cluster0.3wrw8.gcp.mongodb.net/market_data?retryWrites=true&w=majority")
    db = cluster["market_data"]
    collection = db[index]
    collection.delete_many ({})
    collection.insert_many (posts)
