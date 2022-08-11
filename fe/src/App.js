import React, {useEffect, useState} from "react";
import "./App.css";
const URL_BASE = 'https://gateway.pinata.cloud/ipfs/';
const Card = () => {
  const [imgUrl, setImgUrl] = useState('');
  useEffect(() => {
    // Fetch pinned data
    fetch('https://gateway.pinata.cloud/ipfs/QmQ5pt4GTqzwXRKniwsdJc1RM3cTkG5tyVcXzsuwZ1USWi')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setImgUrl(`${URL_BASE}${data.image.substring(7)}`);
      }).catch(console.log);
  }, []);
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <div className="card">
        <img src={imgUrl || "img.jpeg"} alt="John" style={{ width: "100%" }} />
        <h1>Dr.Strangelove</h1>
        <p className="title">CTO &amp; Founder, Mad Scientist</p>
        <p>Harvard University</p>
        <a href="#">
          <i className="fa fa-dribbble" />
        </a>
        <a href="#">
          <i className="fa fa-twitter" />
        </a>
        <a href="#">
          <i className="fa fa-linkedin" />
        </a>
        <a href="#">
          <i className="fa fa-facebook" />
        </a>
        <p>
          <button>Contact</button>
        </p>
      </div>
    </div>
  );
};
export default Card;
