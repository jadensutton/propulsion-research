import React, { useState } from "react"

import TradingViewWidget, { Themes } from "react-tradingview-widget"
import { Chart } from "react-google-charts"
import axios from "axios"

import Header from "../components/Header"

var bullPercent = 1
var neutralPercent = 1
var bearPercent = 1
var subjectivity = 1

var firstRun = true

function getSentiment (ticker, index, forceUpdate)
{
  axios.get ("https://praetorian-trader-stats-api.herokuapp.com/?ticker="+ ticker + "&index=" + index.toLowerCase ())
  .then (response => {
    bullPercent = response["data"]["Sentiment"]["Polarity"][0] * 100
    neutralPercent = response["data"]["Sentiment"]["Polarity"][1] * 100
    bearPercent = response["data"]["Sentiment"]["Polarity"][2] * 100
    subjectivity = response["data"]["Sentiment"]["Subjectivity"]

    forceUpdate ()
  }).catch (error => {
    console.log (error)
  })

  firstRun = false
}

function useForceUpdate()
{
    const [value, setValue] = useState(0)
    return () => setValue(value => ++value)
}

function Analysis (props)
{
  const forceUpdate = useForceUpdate ()

  var fullTicker = String (props.match.params.ticker)
  var ticker = fullTicker
  if (ticker.includes (".TO"))
  {
    ticker = ticker.split (".TO")[0]
  }
  else if (ticker.includes (".V"))
  {
    ticker = ticker.split (".V")[0]
  }

  var index = String (props.match.params.index)
  const symbol = index.toUpperCase () + ':' + ticker

  var polarities = [
    ["Opinion", "Number of Occurences"],
    ["Bullish", bullPercent],
    ["Neutral", neutralPercent],
    ["Bearish", bearPercent]
  ];

  var subjectivities = [
    ["Driving Force", "%"],
    ["Emotional", subjectivity],
    ["Logical", 1 - subjectivity]
  ];

  const options1 = {
    pieHole: 0.4,
    is3D: false,
    colors: ["#26a69a", "#efed50", "#ef5350"],
    backgroundColor: "none",
    legend: "none"
  };

  const options2 = {
    pieHole: 0.4,
    is3D: false,
    colors: ["#ef5350", "26a69a"],
    backgroundColor: "none",
    legend: "none",
    width: "0px"
  };

  if (firstRun == true)
  {
    getSentiment (ticker, index, forceUpdate)
  }
  return (
    <div class="body">
      <Header />
      <TradingViewWidget
        symbol={symbol}
        theme={Themes.DARK}
        locale="en"
        width="100%"
        height="400px"
      />
      <div class="sentiment">
        <h1 style={{color: "white"}}>Market Sentiment</h1>

        <h2 style={{color: "white"}}>Investor Perspectives</h2>
        <Chart
          chartType="PieChart"
          width="100%"
          height="400px"
          data={polarities}
          options={options1}
        />

        <h2 style={{color: "white"}}>Perspective Driving Force</h2>
        <Chart
          chartType="PieChart"
          width="100%"
          height="400px"
          data={subjectivities}
          options={options2}
        />
      </div>
    </div>
  )
}

export default Analysis
