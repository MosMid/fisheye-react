import React, { useEffect, useState } from "react";

type Media = {
  id: number;
  photographerId: number;
  title: string;
  image: string;
  likes: number;
  date: string;
  price: number;
  video?: string;
};

type MediaProp = {
  media: Media[] | null;
  index: number | undefined;
};

const previous = "<";
const next = ">";

export default function Carousel(props: MediaProp) {
  const [media, setMedia] = useState<Media[] | null>(null);
  const [index, setIndex] = useState<number | undefined>(undefined);
  const [previousStyle, setPreviousStyle] = useState<any>();
  const [nextStyle, setNextStyle] = useState<any>();
  const grey = {
    color: "grey",
  };
  const brick = {
    color: "#901C1C",
  };

  useEffect(() => {
    setMedia(props.media);
  }, [props.media]);

  useEffect(() => {
    setIndex(props.index);
  }, [props.index]);

  useEffect(() => {
    if (media && index !== undefined && media[index]) {
      if (index === media.length - 1) {
        setNextStyle(grey);
      } else {
        setNextStyle(brick);
      }
      if (index === 0) {
        setPreviousStyle(grey);
      } else {
        setPreviousStyle(brick);
      }
    }
  }, [index, media]);

  const handlePrevious = () => {
    if (index !== undefined && index > 0) {
      setIndex(index - 1);
    }
  };

  const handleNext = () => {
    if (index !== undefined && media && index < media.length - 1) {
      setIndex(index + 1);
    }
  };

  return (
    <div>
      {media !== null && index !== undefined && media[index] ? (
        <div id="carousel">
          <div id="diapoContainer">
            <img src={media[index].image} alt={media[index].title} />
          </div>
          <p id="diapoTitle">{media[index].title}</p>
          <p id="previous" onClick={handlePrevious} style={previousStyle}>
            {previous}
          </p>
          <p id="next" onClick={handleNext} style={nextStyle}>
            {next}
          </p>
        </div>
      ) : null}
    </div>
  );
}