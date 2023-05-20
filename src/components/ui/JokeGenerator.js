import { useState } from "react";
import { useEffect } from "react";
import { Button } from "./Button";
import CustomPopUp from "./CustomPopUp";

const JokeGenerator = () => {
  const [joke, setJoke] = useState("");
  const [punchline, setPunchline] = useState("");
  const [punchlinePlaceholder, setPunchlinePlaceholder] = useState("");
  const [language, setLanguage] = useState("english");
  const [categories, setCategories] = useState([]);
  const [catChoice, setCatChoice] = useState([categories[0]]);

  let baseURL = "https://v2.jokeapi.dev/";
  const [languageChoice, setLanguageChoice] = useState("");

  useEffect(async () => {
    await fetchCat();
  }, []);

  useEffect(async () => {
    console.log(catChoice);
    await getJoke();
  }, [language, catChoice]);

  async function fetchCat() {
    try {
      const url = baseURL + "categories";
      const cat = await fetch(url);
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

  async function getJoke() {
    console.log(catChoice);
    setPunchlinePlaceholder("");
    try {
      const url =
        baseURL +
        "joke/" +
        catChoice +
        "?" +
        languageChoice +
        "blacklistFlags=religious,political,racist,sexist&type=twopart";
      console.log(url);
      //   ("https://v2.jokeapi.dev/joke/?blacklistFlags=religious,political,racist,sexist&type=twopart");
      console.log(
        url ===
          "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=religious,political,racist,sexist&type=twopart"
      );
      const response = await fetch(url);
      //   console.log(response.json());
      if (response.ok) {
        // console.log(await response.json());
        const data = await response.json();
        if (data.error === false) {
          console.log(data);
          setJoke(data.setup);
          setPunchline(data.delivery);
        } else {
          alert(
            "There's no such joke found in this language and category combination :( Try other category!"
          );
        }
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

  const waitingMessage = "Your opponent is not ready yet";
  return (
    <CustomPopUp open={true}>
      <h2>{waitingMessage}</h2>
      <p>
        You will automatically enter the game once your opponent is ready.
        <br /> Here are some jokes we prepared for you:
      </p>
      <div className="joke joke-container">
        <div className="joke setup">{joke}</div>
        <div className="joke punchline">{punchlinePlaceholder}</div>
        <div className="joke button-container">
          <div className="joke btn">
            <Button onClick={getJoke} width={"160px"} className="small-font">
              {" "}
              Change a joke
            </Button>
          </div>
          <div className="joke btn">
            <Button
              onClick={showPunchline}
              width={"160px"}
              className="small-font"
            >
              {" "}
              show punchline
            </Button>
          </div>
        </div>
        <div className="joke button-container">
          <div className="joke button-container btn">
            <Button
              onClick={changeLanguage}
              width={"160px"}
              className="small-font"
            >
              {language}
            </Button>
            <p className="joke button-container instruction">
              click here to change language
            </p>
          </div>
          <div className="joke button-container btn">
            <Button onClick={changeCat} width={"160px"} className="small-font">
              {" "}
              {catChoice}{" "}
            </Button>
            <p className="joke button-container instruction">
              click here to change categories
            </p>
          </div>
        </div>
      </div>
    </CustomPopUp>
  );
};
export default JokeGenerator;
