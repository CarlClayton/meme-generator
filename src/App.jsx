import { useState, useEffect } from "react";
import "./App.scss";
import Meme from "./components/meme/Meme";
import "./components/meme/Meme.scss";

const objectToQueryParams = (obj) => {
  const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
  return "?" + params.join("&");
};

function App() {
  const [allTemplates, setAllTemplates] = useState([]);
  const [templates, setTemplates] = useState(allTemplates);
  const [template, setTemplate] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [meme, setMeme] = useState(null);

  useEffect(() => {
    fetch("/get_memes").then((x) =>
      x.json().then((response) => setAllTemplates(response.data.memes))
    );
  }, []);

  useEffect(() => {
    setTemplates(allTemplates);
  }, [allTemplates]);

  const searchTemplates = (e) => {
    e.preventDefault();
    const result = allTemplates.filter((template) => {
      return template.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setTemplates(result);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const params = {
      template_id: template.id,
      text0: topText,
      text1: bottomText,
      username: process.env.REACT_APP_IMGFLIP_USERNAME,
      password: process.env.REACT_APP_IMGFLIP_PASSWORD,
    };
    const url = `/caption_image${objectToQueryParams(params)}`;
    const res = await fetch(url);
    const json = await res.json();
    setMeme(json.data.url);
  };

  if (meme) {
    return (
      <div className="result">
        <button type="button" onClick={() => setMeme(null)}>
          Back
        </button>
        <img src={meme} alt="custom meme" />
      </div>
    );
  }

  return (
    <div className="App">
      {template && (
        <form onSubmit={(e) => handleOnSubmit(e)}>
          <button type="button" onClick={() => setTemplate(null)}>
            Back
          </button>
          <input
            placeholder="top text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
          />
          <Meme template={template} />
          <input
            placeholder="bottom text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
          />
          <button type="submit">Create meme</button>
        </form>
      )}
      {!template && (
        <>
          <div className="headline">
            <h1>Pick a template</h1>
            <input
              placeholder="search templates"
              onChange={(e) => searchTemplates(e)}
            />
          </div>
          <div className="meme-grid">
            {templates
              .sort((a, b) => a.box_count - b.box_count)
              .map((template) => (
                <Meme
                  template={template}
                  onClick={() => setTemplate(template)}
                  key={template.id}
                  selected
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
