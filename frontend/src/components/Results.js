import React from "react"

function Results (props)
{
    const textStyle = {
      color: "white"
    }

    const results = props.results
    var maxReturn = 0
    var maxRisk = 0
    for (var stock in results)
    {
      if (results[stock][1]["Mean Return"] > maxReturn)
      {
        maxReturn = results[stock][1]["Mean Return"]
      }

      if (results[stock][1]["Standard Deviation"] > maxRisk)
      {
        maxRisk = results[stock][1]["Standard Deviation"]
      }
    }
    return (
        <div>
          <h1 style={{color: "white"}}>Results</h1>
          <table class="table">
            <tr>
              <th style={textStyle}><h3>Company</h3></th>
              <th style={textStyle}><h3>Ticker</h3></th>
              <th style={textStyle}><h3>Index</h3></th>
              <th style={textStyle}><h3>Relative Growth</h3></th>
              <th style={textStyle}><h3>Relative Risk</h3></th>
              <th style={textStyle}><h3>Full Analysis</h3></th>
            </tr>
            {results.map ((result)=> {
              return (
                <tr style={{textAlign: "center"}}>
                  <td style={textStyle}>{result[1]["Company"]}</td>
                  <td><p style={textStyle} target="_blank">{result[1]["_id"]}</p></td>
                  <td style={textStyle}>{result[1]["Index"].toUpperCase ()}</td>
                  {console.log (result[1]["Mean Return"] / maxReturn)}
                  <td><input class="growth-bar" type="range" min={0} max={1} step={0.01} value={result[1]["Mean Return"] / maxReturn} /></td>
                  <td><input class="risk-bar" type="range" min={0} max={1} step={0.01} value={result[1]["Standard Deviation"] / maxRisk} /></td>
                  <td><a href={"/analysis/" + result[1]["Index"] + "/" + result[1]["_id"]} class="button" style={{padding: "3px 12px", fontWeight: "normal"}}>View</a></td>
                </tr>
              )
            })}
          </table>
        </div>

    )
}

export default Results
