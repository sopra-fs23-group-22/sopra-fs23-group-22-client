import { useState } from "react";
import { useEffect } from "react";
import { Button } from "./Button";
import "../../styles/ui/Joke.scss";

const Joke = () => {
  const [joke, setJoke] = useState("");
  const [punchline, setPunchline] = useState("");
  const [punchlinePlaceholder, setPunchlinePlaceholder] = useState("");
  const [language, setLanguage] = useState("english");
  const [categories, setCategories] = useState([]);
  const [catChoice, setCatChoice] = useState([categories[0]]);

  let baseURL = "https://v2.jokeapi.dev/joke/";
  const [languageChoice, setLanguageChoice] = useState("");

  useEffect(() => {
    getJoke();
  }, []);

  useEffect(() => {
    async function fetchCat() {
      try {
        const cat = await fetch("https://v2.jokeapi.dev/categories");
        if (cat.ok) {
          const data = await cat.json();
          console.log(data.categories);
          setCategories(data.categories);
          setCatChoice("Programming");
        } else {
          console.error("Request failed", cat.status);
        }
      } catch (error) {
        console.error("An error occurred while fetching categories", error);
      }
    }
    fetchCat();
  }, []);

  async function getJoke() {
    setPunchlinePlaceholder("");
    try {
      const url =
        baseURL +
        catChoice +
        "?" +
        languageChoice +
        "blacklistFlags=religious,political,racist,sexist&type=twopart";
      console.log(url);
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setJoke(data.setup);
        setPunchline(data.delivery);
      } else {
        console.error("Request failed:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  function showPunchline() {
    setPunchlinePlaceholder(punchline);
  }

  function changeLanguage() {
    if (language === "english") {
      setLanguage("german");
      setLanguageChoice("lang=de&");
    } else {
      setLanguage("english");
      setLanguageChoice("");
    }
  }

  function changeCat() {
    if (categories.length !== 0) {
      for (let i = 0; i < categories.length; i++) {
        if (catChoice === categories[i]) {
          console.log(i);
          if (i === categories.length - 1) {
            setCatChoice(categories[0]);
          } else {
            setCatChoice(categories[i + 1]);
          }
        }
      }
    } else {
      console.log(categories);
    }
  }

  return (
    <div className="joke">
      <div className="joke box">
        <div className="joke setup">{joke}</div>
        <div className="joke punchline">{punchlinePlaceholder}</div>
        <div className="joke buttons">
          <div className="joke btn-instruction">
            <Button onClick={getJoke}> Change a joke</Button>
          </div>
          <div className="joke btn-instruction">
            <Button onClick={showPunchline}> show punchline</Button>
          </div>
        </div>
        <div className="joke buttons">
          <div className="joke btn-instruction">
            <Button onClick={changeLanguage}> {language}</Button>
            <p>click here to change language</p>
          </div>
          <div className="joke btn-instruction">
            <Button onClick={changeCat}> {catChoice} </Button>
            <p>click here to change categories</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Joke;
