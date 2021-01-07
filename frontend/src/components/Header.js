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
    display: "inline-block",
    width: "100%",
    height: "5%",
    backgroundColor: "#161a25",
    borderBottom: "2px groove #506aef"
  };

  const search = {
    float: "middle",
    marginRight: "210px",
    marginTop: "1%"
  };

  const header_logo = {
    color: "white",
    width: "400px",
    marginLeft: "20px",
    float: "left"
  };

  const option_text = {
    color: "black"
  };

  return (
    <div style={header}>
      <a href="/"><img src="https://i.ibb.co/f9L2nNf/Darkmode.png" style={header_logo} /></a>

      <div style={search}>
        <input class="searchbar" type="text" placeholder="Ticker" id="ticker_input" onChange={() => handleSearchbarChange (forceUpdate)} />
        <select class="dropdown" id="index_dropdown" onChange={() => handleDropdownChange (forceUpdate)} >
          <option value="NYSE" style={option_text}>NYSE</option>
          <option value="NASDAQ" style={option_text}>NASDAQ</option>
          <option value="TSX" style={option_text}>TSX</option>
          <option value="TSXV" style={option_text}>TSXV</option>
        </select>
        <a href={"/analysis/"+ indexDropdown + '/' + tickerInput} class="button" type="button" style={{padding: "7px 20px"}}>Go</a>
      </div>
    </div>
  )
}

export default Header;
