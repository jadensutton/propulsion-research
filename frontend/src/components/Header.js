import React, { useState } from "react"

var tickerInput = ""
var indexDropdown = "NYSE"

function useForceUpdate()
{
    const [value, setValue] = useState(0)
    return () => setValue(value => ++value)
}

function handleSearchbarChange (forceUpdate)
{
  tickerInput = document.getElementById ("ticker_input").value
  forceUpdate ()
}

function handleDropdownChange (forceUpdate)
{
  indexDropdown = document.getElementById ("index_dropdown").value
  forceUpdate ()
}

function Header ()
{
  const forceUpdate = useForceUpdate ()
  const header = {
    display: "flex",
    justifyContent: "left",
    alignItems: "left",
    width: "100%",
    height: "80px",
    backgroundColor: "#080a0e",
  };

  const search = {
    display: "inline-flex",
    marginLeft: "400px",
    marginTop: "18px"
  };

  const header_text = {
    verticalAlign: "middle",
    color: "white",
    marginLeft: "20px",
    textAlign: "left"
  };

  const option_text = {
    color: "black"
  };

  return (
    <div style={header}>
      <h1 style={header_text}><a href="/">Tradata (Beta)</a></h1>

      <div style={search}>
        <input class="searchbar" type="text" placeholder="Ticker" id="ticker_input" onChange={() => handleSearchbarChange (forceUpdate)} />
        <select class="dropdown" id="index_dropdown" onChange={() => handleDropdownChange (forceUpdate)} >
          <option value="NYSE" style={option_text}>NYSE</option>
          <option value="NASDAQ" style={option_text}>NASDAQ</option>
          <option value="TSX" style={option_text}>TSX</option>
          <option value="TSXV" style={option_text}>TSXV</option>
        </select>
        <a href={"/analysis/"+ indexDropdown + '/' + tickerInput} class="button" type="button" style={{padding: "3px 20px", height: "50%"}}>Go</a>
      </div>
    </div>
  )
}

export default Header;
