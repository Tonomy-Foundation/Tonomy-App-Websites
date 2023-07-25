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
  const previewImages = images.filter((img) => img.includes("preview"));
  const leftImages = images.filter((img) => img.includes("left"));
  const rightImages = images.filter((img) => img.includes("right"));
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>(previewImages[0]);
  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setImageUrl(previewImages[currentPreviewIndex]);
  }, [currentPreviewIndex, previewImages]);

  const slideNext = () => {
    if (currentPreviewIndex === previewImages.length - 1) {
      return;
    }

    setCurrentPreviewIndex(
      (prevIndex) => (prevIndex + 1) % previewImages.length
    );
  };

  const slidePrevious = () => {
    if (currentPreviewIndex === 0) {
      return;
    }

    setCurrentPreviewIndex(
      (prevIndex) =>
        (prevIndex - 1 + previewImages.length) % previewImages.length
    );
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
              src={leftImages[currentPreviewIndex]}
              alt={`Image ${currentPreviewIndex - 1}`}
            />
          </div>
          <div
            className="center-image"
            onClick={() => navigation(linkTexts[currentPreviewIndex]["url"])}
          >
            <img src={imageUrl} alt={`Image ${currentPreviewIndex}`} />
            <p className="centerImageText">
              {linkTexts[currentPreviewIndex]["text"]}
            </p>
          </div>
          <div className="side-image">
            <img
              src={rightImages[currentPreviewIndex]}
              alt={`Image ${currentPreviewIndex + 1}`}
            />
          </div>
        </div>
        <div
          className={`arrow right ${
            currentPreviewIndex === previewImages.length - 1 ? "disabled" : ""
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
