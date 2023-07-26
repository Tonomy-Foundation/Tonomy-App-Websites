// ImageSlider.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../assets/arrow-left.png";
import RightArrow from "../assets/arrow-right.png";
import "./ImageSlider.css";
import CodeSnippetPreview from "./CodeSnippetPreview";

interface ImageSliderProps {
  images: string[];
  linkTexts: { text: string; url: string; code: string }[];
  description: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  linkTexts,
  description,
}) => {
  const navigation = useNavigate();
  const previewImages = images.filter((img) => img.includes("preview"));
  const leftImages = images.filter((img) => img.includes("left"));
  const rightImages = images.filter((img) => img.includes("right"));
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>(previewImages[0]);

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
      <CodeSnippetPreview value={linkTexts[currentPreviewIndex]["code"]} />
    </>
  );
};

export default ImageSlider;
