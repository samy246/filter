import React,{useState} from "react"

const Dot=({ banner, title, data, catid,arrivalsplit2,trendsplit2,arrshow,setarrshow})=>{
//   console.log("<><><><><><>>",arrivalsplit2);
// console.log("data");
    // const [trendsplit1, settrendsplit1] = useState([]);
    // const [trendsplit2, settrendsplit2] = useState([]);
    const [trending, settrending] = useState([]);
    const [arrival, setarrival] = useState([]);
  const [trendshow, settrendshow] = useState(false);
//  const [arrshow, setarrshow] = useState(false);

  // const [arrivalsplit1, setarrivalsplit1] = useState([]);
  // const [arrivalsplit2, setarrivalsplit2] = useState([]);
return(
    <>
<div className="dots">
{arrivalsplit2 > 1 && (
  <>
    <p
      className={`${!arrshow && "dots__selected"}`}
      onClick={() => setarrshow(false)}
    ></p>
    <p
      className={`${arrshow && "dots__selected"}`}
      onClick={() => setarrshow(true)}
    ></p>
  </>
)}



</div>



 <div className="dots">
{trendsplit2 > 1 && (
  <>
    <p
      className={`${!trendshow && "dots__selected"}`}
      onClick={() => settrendshow(false)}
    />
    <p
      className={`${trendshow && "dots__selected"}`}
      onClick={() => settrendshow(true)}
    />
  </>
)}
</div> 
</>
)

}

export  default Dot


