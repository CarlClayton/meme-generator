import React from "react";
import "./Meme.scss";

const Meme = ({ template, onClick, selected }) => {
  return (
    <img
      className={selected && "selected"}
      key={template.id}
      src={template.url}
      alt={template.name}
      onClick={onClick}
    />
  );
};

export default Meme;
