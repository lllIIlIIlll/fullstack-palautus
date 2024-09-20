import { useState, useEffect } from "react";
import axios from "axios";
import { getAllDiaries, addNewDiary } from "./services/diaryService";
import { Diary } from "./types";

const App = () => {
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("");
  const [comment, setComment] = useState("");
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const addDiary = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      await addNewDiary({
        date: date,
        weather: weather,
        visibility: visibility,
        comment: comment,
      }).then((data) => {
        setDiaries(diaries.concat(data));
      });
      setDate("");
      setWeather("");
      setVisibility("");
      setComment("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMsg(
          `error: incorrect ${error.response?.data.error[0].path[0]} ${
            error.response?.data.error[0].received
              ? error.response?.data.error[0].received
              : ""
          }`
        );
      } else {
        console.log(error);
      }
    }
  };

  return (
    <>
      <h3>add new entry</h3>
      {errorMsg ? <p>{errorMsg}</p> : null}
      <form onSubmit={addDiary}>
        <label>date </label>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <br />
        <label>weather: </label>
        <label htmlFor="sunny">sunny </label>
        <input
          id="sunny"
          name="weather"
          type="radio"
          checked={weather === "sunny"}
          onChange={() => setWeather("sunny")}
        />
        <label htmlFor="rainy">rainy </label>
        <input
          id="rainy"
          name="weather"
          type="radio"
          checked={weather === "rainy"}
          onChange={() => setWeather("rainy")}
        />
        <label htmlFor="cloudy">cloudy </label>
        <input
          id="cloudy"
          name="weather"
          type="radio"
          checked={weather === "cloudy"}
          onChange={() => setWeather("cloudy")}
        />
        <label htmlFor="stormy">stormy </label>
        <input
          id="stormy"
          name="weather"
          type="radio"
          checked={weather === "stormy"}
          onChange={() => setWeather("stormy")}
        />
        <label htmlFor="windy">windy </label>
        <input
          id="windy"
          name="weather"
          type="radio"
          checked={weather === "windy"}
          onChange={() => setWeather("windy")}
        />
        <br />
        <label>visibility: </label>
        <label htmlFor="great">great </label>
        <input
          id="great"
          name="visibility"
          type="radio"
          checked={visibility === "great"}
          onChange={() => setVisibility("great")}
        />
        <label htmlFor="good">good </label>
        <input
          id="good"
          name="visibility"
          type="radio"
          checked={visibility === "good"}
          onChange={() => setVisibility("good")}
        />
        <label htmlFor="ok">ok </label>
        <input
          id="ok"
          name="visibility"
          type="radio"
          checked={visibility === "ok"}
          onChange={() => setVisibility("ok")}
        />
        <label htmlFor="poor">poor </label>
        <input
          id="poor"
          name="visibility"
          type="radio"
          checked={visibility === "poor"}
          onChange={() => setVisibility("poor")}
        />
        <br />
        <label>comment </label>
        <input
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <br />
        <button type="submit">add</button>
      </form>
      <h3>diary entries</h3>
      <ul>
        {diaries.map((diary) => (
          <li key={diary.id}>
            <h5>{diary.date}</h5>
            <p>weather: {diary.weather}</p>
            <p>visibility: {diary.visibility}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default App;
