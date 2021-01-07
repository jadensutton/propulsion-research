import React, { useState } from "react";

import Loading from "./Loading"
import Results from "./Results"

import axios from "axios";

var assets_counter_value

var loading = false;
var loaded = false;

var results = []
var icons = {"US": "https://i.ibb.co/Prf2pKM/US-Stocks.png", "US Checked": "https://i.ibb.co/wzJgVcm/US-Stocks-Checked.png", "CA": "https://i.ibb.co/XZ8XHVx/Canadian-Stocks.png", "CA Checked": "https://i.ibb.co/wJg6tk8/Canadian-Stocks-Checked.png"}
var currIcon = ["US", "CA"]

function findAssets (forceUpdate)
{
  loading = true;
  forceUpdate ();

  var assets = []
  if (currIcon[0] == "US Checked")
  {
    assets.push ("stocks_us");
  }

  if (currIcon[1] == "CA Checked")
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

function handleIconChange (index, forceUpdate)
{
  if (currIcon[index] == "US")
  {
    currIcon[index] = "US Checked"
  }

  else if (currIcon[index] == "US Checked")
  {
    currIcon[index] = "US"
  }

  else if (currIcon[index] == "CA")
  {
    currIcon[index] = "CA Checked"
  }

  else if (currIcon[index] == "CA Checked")
  {
    currIcon[index] = "CA"
  }

  forceUpdate ()
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
    display: "inline-flex",
    width: "200px",
    justifyContent: "space-between",
    marginTop: "5px"
  };

  const icon = {
    width: "75px",
    height: "75px",
    verticalAlign: "middle",
    cursor: "pointer"
  };

  const riskCaptions = {
    display: "inline-flex",
    width: "500px",
    justifyContent: "space-between"
  };

  const assetCounter = {
    color: "#506aef",
    fontSize: "32px"
  };

  const assetList = {

  }

  return (
    <fieldset class="form">
      <h1 style={formText}>Propulsion Screener</h1>

      <h2 style={formText}>Index</h2>
      <div style={assets}>
        <img src={icons[currIcon[0]]} style={icon} onClick={() => handleIconChange (0, forceUpdate)} />
        <img src={icons[currIcon[1]]} style={icon} onClick={() => handleIconChange (1, forceUpdate)} />
      </div>

      <h2 style={formText}>Risk Tolerance</h2>
      <div class="slider-container">
        <input class="slider" type="range" placeholder={2} min={0} max={2} step={1} id="risk_slider"></input>
      </div>
      <br />
      <div style={riskCaptions}>
        <h3 style={{color: "#506aef"}}>Low</h3>
        <h3 style={{color: "#506aef"}}>Medium</h3>
        <h3 style={{color: "#506aef"}}>High</h3>
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
