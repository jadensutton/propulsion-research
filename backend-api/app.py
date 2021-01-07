#Import statements
import os
import flask
import requests
import math

from pymongo import MongoClient
from flask import request
from flask_cors import CORS, cross_origin

mongo_password = os.environ.get ("MONGO_PASSWORD")

#Initialize Flask app
app = flask.Flask (__name__)
cors = CORS (app)
app.config['CORS_HEADER'] = 'Content-Type'

#Set up routing
@app.route ('/', methods=['GET'])
@cross_origin ()
def home ():
    picks = {}

    #Get arguments
    assets = request.args['assets']
    num_assets = int (request.args['num_assets'])
    risk_level = int (request.args['risk_level'])

    #Check if the API call is for stocks (Planning to implement other asset classes in the future)
    if "stocks_us" in assets or "stocks_ca" in assets:
        #Check risk level
        if risk_level == 0:
            risk_level = 400
        elif risk_level == 1:
            risk_level = 800
        elif risk_level == 2:
            risk_level = 1000

        #Get user-specified indices to check
        indices = []
        if "stocks_us" in assets:
            indices.append ("nyse")
            indices.append ("nasdaq")

        if "stocks_ca" in assets:
            indices.append ("tsx")
            indices.append ("tsxv")

        stocks = []

        #Loop through indices and pull data from database
        for index in indices:
            cluster = MongoClient ("mongodb+srv://admin:"+ mongo_password +"@cluster0.3wrw8.gcp.mongodb.net/market_data?retryWrites=true&w=majority")
            db = cluster["market_data"]
            collection = db[index]
            documents = collection.find ({})
            for document in documents:
                stocks.append (document)

        #Set up default picks to be replaced with real stocks
        stock_picks = {}
        for n in range (num_assets):
            stock_picks[n] = {"Momentum": -9999999999}

        #Loop through the stocks
        for stock in stocks:
            try:
                #Quantify the momentum of the stock and if it beats the worst-performing stock in the dictionary, replace it.
                momentum = (math.copysign (2 ** ((1 + stock["Mean Return"]) * risk_level), stock["Mean Return"]) / stock["Standard Deviation"]) * math.sqrt (250)
                stock["Momentum"] = momentum
                worstStock = min (stock_picks, key=lambda k: stock_picks[k]["Momentum"])
                for stock_pick in stock_picks:
                    if stock_picks[stock_pick]["Momentum"] <= stock_picks[worstStock]["Momentum"]:
                        worstStock = stock_pick

                if momentum > stock_picks[worstStock]["Momentum"]:
                    stock_picks[worstStock] = stock

            except:
                pass

        picks = stock_picks

    return picks    #Return dictionary of recommended stocks
