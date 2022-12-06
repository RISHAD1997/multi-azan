import React, { useEffect, useRef } from "react";
import { useState } from "react";
import logo from "./logo/prayer.png";
import "./index.css";
import axios from "axios";

const Azan = () => {
  const [prayerTime, setPrayertime] = useState([]);
  const [temp, setTemp] = useState("");
  var [date, setDate] = useState(new Date());
  const [arabmonth, setArabmonth] = useState("");
  const [arabyear, setArabyear] = useState("");

  const day = (date.getDate() < 10 ? "0" : "") + date.getDate();
  const month = (date.getMonth() < 10 ? "0" : "") + (date.getMonth() + 1);
  const year = date.getFullYear();

  const Fajar = useRef(null);
  const Dhuhr = useRef(null);
  const Asr = useRef(null);
  const Maghrib = useRef(null);
  const Isha = useRef(null);

  // };

  const animation = async () => {
    var currentTime = date.toLocaleTimeString();
    var totalMinutes =
      parseInt(currentTime.split(":")[0] * 60) +
      parseInt(currentTime.split(":")[1]);
    console.log(totalMinutes);
  };

  useEffect(() => {
    axios
      .get(
        `https://api.aladhan.com/v1/calendarByCity?city=kozhikode&country=india&method=1&month=${month}&year=${year}`
      )
      .then((res) => {
        var Length = res.data.data.length;

        for (var i = 0; i < Length; i++) {
          if (day === res.data.data[i].date.gregorian.day) {
            setArabmonth(res.data.data[i].date.hijri.month.ar);
            setArabyear(res.data.data[i].date.hijri.year);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(`https://prayer-api.onrender.com/api/prayerData`)
      .then((res) => {
        setPrayertime(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=11.2588&lon=75.7804&appid=d5585182e54fc20c0ba1a8ea4b72bd36`
      )
      .then((res) => {
        const temp = res.data.main.temp;
        const celcius = Math.floor(temp - 273.15);
        setTemp(celcius);
      })
      .catch(function (error) {
        console.log(error);
      });

    setInterval(() => {
      animation();
    }, 1000);

    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="azan">
      <div className="displaybox">
        <div style={{ paddingBottom: "30px" }}>
          <div className="time">
            <img src={logo} alt="logo" />
            <p className="d-font l-space f-16">{date.toLocaleTimeString()}</p>
            <p className="d-font f-8">
              {date.toLocaleTimeString().split(" ")[1]}
            </p>
          </div>
          <div style={{ paddingTop: "20px" }}>
            <div className="date-E">
              <p className="d-font f-8">{arabyear}</p>

              <p className="d-font l-space f-8">
                Temp :<span className="d-font l-space f-8">{temp + "°C"}</span>
              </p>
            </div>

            <div className="date-A">
              <p className="demo d-font f-8">{arabmonth}</p>
              <p className="d-font l-space f-8">{date.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        {prayerTime.map((item) => (
          <table style={{ position: "relative" }} key={item.Id}>
            <tbody>
              <tr>
                <td></td>
                <td className="text-center m-font pd-10">ബാങ്ക് </td>
                <td className="text-center m-font">ഇക്കാമത് </td>
                <td></td>
              </tr>
              <tr>
                <td className="m-font">സുബ്ഹി </td>
                <td className="text-center d-font" ref={Fajar}>
                  {item.Fajar}
                </td>
                <td className="text-center d-font">{item.Fajarikamath}</td>
                <td className="text-right a-font">الفجر</td>
              </tr>
              <tr>
                <td className="m-font">ളുഹ്റ് </td>
                <td className="text-center d-font" ref={Dhuhr}>
                  {item.Dhuhar}
                </td>
                <td className="text-center d-font">{item.Dhuharikamath}</td>
                <td className="text-right a-font">الظهر</td>
              </tr>
              <tr>
                <td className="m-font">അസർ </td>
                <td className="text-center d-font">{item.Asr}</td>
                <td className="text-center d-font">{item.Asrikamath}</td>
                <td className="text-right a-font">العصر</td>
              </tr>
              <tr>
                <td className="m-font">മഗ്‌രിബ്‌ </td>
                <td className="text-center d-font ">{item.Maghrib}</td>
                <td className="text-center d-font">{item.Maghribikamath}</td>
                <td className="text-right a-font">المغرب</td>
              </tr>
              <tr>
                <td className="m-font">ഇഷ്ഹാ </td>
                <td className="text-center d-font">{item.Isha}</td>
                <td className="text-center d-font">{item.Ishaikamath}</td>
                <td className="text-right a-font">العشاء</td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
};

//https://api.aladhan.com/v1/calendarByCity?city=kozhikode&country=india&method=1&month=11&year=2022

export default Azan;
