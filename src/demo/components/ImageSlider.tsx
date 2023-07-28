// ImageSlider.tsx

import React, { useState, useEffect } from "react";
import HighlightedPageView from "../components/TPageHighlighted";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../assets/arrow-left.png";
import RightArrow from "../assets/arrow-right.png";
import "./ImageSlider.css";

interface ImageSliderProps {
  images: string[];
  linkTexts: { text: string; url: string; code: string }[];
  description: string;
  code: boolean;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  linkTexts,
  description,
  code,
}) => {
  const navigation = useNavigate();
  const [open, setOpen] = React.useState(false);
  // const previewImages = images.filter((img) => img.includes("preview"));
  // const leftImages = images.filter((img) => img.includes("left"));
  // const rightImages = images.filter((img) => img.includes("right"));
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState<number>(0);
  const handleOpen = () => {
    setOpen(!open);
  };

  // useEffect(() => {
  //   setImageUrl(previewImages[currentPreviewIndex]);
  // }, [currentPreviewIndex, previewImages]);

  const slideNext = () => {
    // Calculate the next index for preview image
    const nextIndex = (currentPreviewIndex + 1) % images.length;

    setCurrentPreviewIndex(nextIndex);
  };

  const slidePrevious = () => {
    // Calculate the previous index for preview image
    const previousIndex =
      (currentPreviewIndex - 1 + images.length) % images.length;

    setCurrentPreviewIndex(previousIndex);
  };

  return (
    <>
      <div className="slider-container">
        <div
          className={`arrow left ${
            currentPreviewIndex === 0 ? "disabled" : ""
          }`}
          onClick={slidePrevious}
        >
          <img src={LeftArrow} alt="left-arrow" />
        </div>
        <div className="slider">
          <div className="side-image">
            <img
              src={images[currentPreviewIndex - 1]}
              alt={`Image ${currentPreviewIndex - 1}`}
            />
          </div>
          <div
            className="center-image"
            onClick={() => navigation(linkTexts[currentPreviewIndex]["url"])}
          >
            <img
              src={images[currentPreviewIndex]}
              alt={`Image ${currentPreviewIndex}`}
            />
            <p className="centerImageText">
              {linkTexts[currentPreviewIndex]["text"]}
            </p>
          </div>
          <div className="side-image">
            <img
              src={images[currentPreviewIndex + 1]}
              alt={`Image ${currentPreviewIndex + 1}`}
            />
          </div>
        </div>
        <div
          className={`arrow right ${
            currentPreviewIndex === images.length - 1 ? "disabled" : ""
          }`}
          onClick={slideNext}
        >
          <img src={RightArrow} alt="right-arrow" />
        </div>
      </div>
      {description && <p className="description">{description}</p>}{" "}
      {code && (
        <div className="documentation">
          <p>Documentation {`->`} </p>
          <div>
            <button onClick={handleOpen}>
              Code Snippet<span className="dropdown-arrow">v</span>
            </button>
            {open && (
              <div className="dropdown-content">
                <HighlightedPageView
                  highlighterText={linkTexts[currentPreviewIndex]["code"]}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageSlider;
