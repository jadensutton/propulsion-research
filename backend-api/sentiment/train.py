import nltk
import pickle

import requests, json

from textblob import TextBlob
from textblob.classifiers import NaiveBayesClassifier

train = [
    ("We're up, this is our golden ticket", 1),
    ("It is underhyped", 1),
    ("I will buy more", 1),
    ("It will go up", 1),
    ("It is time to buy", 1),
    ("I am bullish", 1),
    ("This stock is strong", 1),
    ("This stock has good momentum", 1),
    ("Growth has been explosive", 1),
    ("Weak hands will fold, strong hands will hold", 1),
    ("They raised a price target", 1),
    ("This stock is the superior brand", 1),
    ("see you on the other side for many happy returns!", 1),
    ("These returns are sweet", 1),
    ("We are going straight up!", 1),
    ("This company is the future", 1),
    ("Im adding to my position and buying more", 1),
    ("Im in for the future", 1),
    ("This company is highly profitable", 1),
    ("I don't see how this company could be valued less than", 1),
    ("Buy buy buy", 1),
    ("I don’t know why people can be bearish of just because the price seems high to them?? Not comparing companies just price gaps... look at chipotle or restoration hardware, their up there but keep going up", 1),
    ("if gets 2000 stimulus check done Stock market will run like a mad bull and robinhood investors will put that right into so watch out", 1),
    ("if this can break 700 this week and push to 750 We would like see 1000 to 1200 by earning date Again si is cool for a nice push to 800", 1),
    ("Goldman Sachs just bought millions in shares at this price.", 1),
    (" Big firms have done their DD and know that  is the only  maker in China with the vertical integration infrastructure in place to capitalize on the tsunami of EV consumers", 1),
    ("Big bounce coming. Now is the time to buy.", 1),
    ("gold rush", 1),
    ("Virtual gold rush", 1),
    ("This stock is golden", 1),
    ("To the moon", 1),
    ("Moon", 1),


    ("The price could go either way", 0),
    ("I'm not quite certain where the stock is going to go", 0),
    ("There's a lot of uncertainty right now", 0),
    ("The stock is going sideways", 0),
    ("We're in a kangaroo market", 0),

    ("It is overvalued", -1),
    ("It is overhyped", -1),
    ("There is too much hype", -1),
    ("The valuation is stretched", -1),
    ("I will short sell it", -1),
    ("It will go down", -1),
    ("It is time to sell", -1),
    ("I am bearish", -1),
    ("This stock is showing weak growth", -1),
    ("We could see a retracement to lower prices", -1),
    ("I don't see how this company can be valued more than", -1),
    ("Sell sell sell", -1),
    ("putting so much money into shorting this", -1),
    ("with the news out of China this could fall dramatically Ugly story", -1),
    ("about to YOLO $10K on weekly puts. Wish me luck!", -1),
    ("I sold all my shares", -1),
    ("Drop", -1),
    ("Destroyed", -1),
    ("Underperform", -1),
    ("This will drop", -1)
]

cl = NaiveBayesClassifier (train)

f = open ("classifier.pickle", "wb")
pickle.dump (cl, f, -1)
f.close ()
