import React from "react"

function Results (props)
{
    const textStyle = {
      color: "white"
    }

    const results = props.results
    return (
        <div>
          <h1 style={{color: "white"}}>Results</h1>
          <table class="table">
            <tr>
              <th style={textStyle}><h3>Company</h3></th>
              <th style={textStyle}><h3>Ticker</h3></th>
              <th style={textStyle}><h3>Index</h3></th>
              <th style={textStyle}><h3>Full Analysis</h3></th>
            </tr>
            {results.map ((result)=> {
              return (
                <tr style={{textAlign: "center"}}>
                  <td style={textStyle}>{result[1]["Company"]}</td>
                  <td><p style={textStyle} target="_blank">{result[1]["_id"]}</p></td>
                  <td style={textStyle}>{result[1]["Index"].toUpperCase ()}</td>
                  <td><a href={"/analysis/" + result[1]["Index"] + "/" + result[1]["_id"]} class="button" style={{padding: "3px 12px", fontWeight: "normal"}}>View</a></td>
                </tr>
              )
            })}
          </table>
        </div>

    )
}

export default Results
