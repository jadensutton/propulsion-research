#Import statements
import flask
import bs4
import statistics
import nltk
import pickle5 as pickle

import requests, json

from flask import request
from flask_cors import CORS, cross_origin
from bs4 import BeautifulSoup
from textblob import TextBlob
from textblob.classifiers import NaiveBayesClassifier

def getSentiment (ticker):  #A function to get the sentiment around a stock.
    nltk.download ('punkt')

    r = requests.get ("https://finance.yahoo.com/quote/"+ticker+"/community")   #Load the community discussion page on Yahoo Finance.
    soup = bs4.BeautifulSoup (r.text, "lxml")
    comments = soup.find_all ('div',{'class':'C($c-fuji-grey-l) Mb(2px) Fz(14px) Lh(20px) Pend(8px)'})  #Find every comment element on the first page.

    if len (comments) > 0:  #If one or more comments were found.
        comments = [comment.text for comment in comments]   #Extract the text from each comment.

        model = open ("classifier.pickle", "rb")
        cl = pickle.load (model)
        model.close ()

        #Define lists to store the classifications for each comment.
        binary_polarities = []
        subjectivities = []
        for comment in comments:    #Loop through comments.
            binary_polarities.append (cl.classify (comment))    #Append the classification value for the current comment to the list of classifications.
            subjectivities.append (TextBlob (comment).subjectivity)     #Append the subjectivity for the current comment to the list of subjectivities.

        len_polarities = len (binary_polarities)
        polarities = [binary_polarities.count (1), binary_polarities.count (0), binary_polarities.count (-1)]
        #Take the mean value of subjectivity
        subjectivity = statistics.mean (subjectivities)

        return ({"Polarity": polarities, "Subjectivity": subjectivity})   #Return market sentiment.

    #If no comments were found, return None.
    else:
        return ({"Polarity": None, "Subjectivity": None})

#Define Flask app.
app = flask.Flask (__name__)
cors = CORS (app)
app.config['CORS_HEADER'] = 'Content-Type'

@app.route ('/', methods=['GET'])
@cross_origin ()
def home ():
    #Define variables for the request arguments.
    ticker = request.args['ticker']
    index = request.args['index']

    #Add the index code if it is required for Yahoo Finance to display the correct stock.
    if (index == "tsx"):
        ticker = str (ticker) + ".TO"
    elif (index == "tsxv"):
        ticker = str (ticker) + ".V"

    #Get statistics and sentiment.
    sentiment = getSentiment (ticker)

    #Format results into a dictionary.
    results = {
        "Sentiment": sentiment
    }

    return results  #Return the results.
