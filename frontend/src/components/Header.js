import React from "react"

function Header ()
{
  const header = {
    display: "flex",
    justifyContent: "left",
    alignItems: "left",
    width: "100%",
    height: "80px",
    backgroundColor: "#6E0DD0",
  }

  const header_text = {
    verticalAlign: "middle",
    color: "white",
    marginLeft: "20px"
  }

  return (
    <div style={header}>
      <h1 style={header_text}>Praetorian Trader (Beta)</h1>
    </div>
  )
}

export default Header;
