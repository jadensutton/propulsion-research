import React, { useState } from "react";

import Loading from "./Loading"
import Results from "./Results"

import axios from "axios";

var assets_counter_value = 20;

var loading = false;
var loaded = false;

var results = []

function findAssets (forceUpdate)
{
  loading = true;
  forceUpdate ();

  var assets = []
  if (document.getElementById ("checkbox_stocks_us").checked == true)
  {
    assets.push ("stocks_us");
  }

  if (document.getElementById ("checkbox_stocks_ca").checked == true)
  {
    assets.push ("stocks_ca");
  }

  var riskLevel = document.getElementById ("risk_slider").value
  var numAssets = document.getElementById ("assets_slider").value

  axios.get ("https://praetorian-trader-api.herokuapp.com/?assets="+String (assets)+"&num_assets="+String (numAssets)+"&risk_level="+String (riskLevel))
  .then (response => {
    sortAssets (response, forceUpdate)
  }).catch (error => {
    loaded = false
    forceUpdate ()
  })
}

function sortAssets (response, forceUpdate)
{
  if (Object.keys (response).length > 0)
  {
    results = []
    for (var item in response["data"])
    {
      results.push ([item, response["data"][item]])
    }

    loaded = true
    loading = false
    forceUpdate ()
  }
}

function useForceUpdate()
{
    const [value, setValue] = useState(0)
    return () => setValue(value => ++value)
}

function handleSliderChange (slider_id, forceUpdate)
{
  assets_counter_value = document.getElementById (slider_id).value
  forceUpdate ()
}

function Find ()
{
  const forceUpdate = useForceUpdate ();

  const formText = {
    color: "white"
  };

  const assets = {

  };

  const icons = {
    display: "inline-flex",
    width: "160px",
    justifyContent: "space-between",
    marginTop: "5px"
  };

  const icon = {
    width: "50px",
    height: "50px",
    verticalAlign: "middle"
  };

  const riskCaptions = {
    display: "inline-flex",
    width: "500px",
    justifyContent: "space-between"
  };

  const assetCounter = {
    color: "#6E0DD0",
    fontSize: "32px"
  };

  const assetList = {

  }

  return (
    <fieldset class="form">
      <h1 style={formText}>High Momentum Stock Screener</h1>

      <h2 style={formText}>Index</h2>
      <div style={icons}>
        <img src="https://i.ibb.co/jWt0nKX/US-Stocks.png" style={icon} />
        <img src="https://i.ibb.co/XpgNYSs/Canadian-Stocks.png" style={icon} />
      </div>
      <div style={assets}>
        <input class="checkbox" type="checkbox" id="checkbox_stocks_us" name="asset" value="stocks_us" />
        <input class="checkbox" type="checkbox" id="checkbox_stocks_ca" name="asset" value="stocks_ca" />
      </div>

      <h2 style={formText}>Risk Tolerance</h2>
      <div class="slider-container">
        <input class="slider" type="range" placeholder={2} min={0} max={2} step={1} id="risk_slider"></input>
      </div>
      <br />
      <div style={riskCaptions}>
        <h3 style={{color: "#6E0DD0"}}>Low</h3>
        <h3 style={{color: "#6E0DD0"}}>Medium</h3>
        <h3 style={{color: "#6E0DD0"}}>High</h3>
      </div>

      <h2 style={formText}>Number of Stocks to Show</h2>
      <div class="slider-container">
        <input class="slider" type="range" placeholder={20} min={3} max={20} step={1} id="assets_slider" onChange={() => handleSliderChange ("assets_slider", forceUpdate)}></input>
      </div>
      <p style={assetCounter} id="assets_counter">{assets_counter_value}</p>

      <button class="button" onClick={() => findAssets (forceUpdate)}>GO</button>

      <br />

      <div style={assetList}>
        {loading ? (<Loading />) : (loaded ? (<Results results={results} />) : (null))}
      </div>
    </fieldset>
  )
}

export default Find;
