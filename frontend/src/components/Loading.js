import React from "react"
import MoonLoader from "react-spinners/ClipLoader"

function Loading ()
{
    return (
        <div>
            <h1 style={{color: "white"}}>Loading...</h1>
            <MoonLoader
                size={150}
                color={"#6E0DD0"}
                loading={true}
            />
        </div>
    )
}

export default Loading
