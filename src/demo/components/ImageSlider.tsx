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
  const [open, setOpen] = React.useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>(images[0]);
  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setImageUrl(images[currentPreviewIndex]);
  }, [currentPreviewIndex, images]);

  const slideNext = () => {
    const nextIndex = (currentPreviewIndex + 1) % images.length;

    setImageUrl(images[nextIndex]);
    setCurrentPreviewIndex(nextIndex);
  };

  const slidePrevious = () => {
    const previousIndex =
      (currentPreviewIndex - 1 + images.length) % images.length;

    setImageUrl(images[previousIndex]);
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
          <div className="side-image left-side-image">
            <img
              src={
                images[
                  (currentPreviewIndex - 1 + images.length) % images.length
                ]
              }
              alt={`Image ${currentPreviewIndex - 1}`}
            />
            <p className="sideImageText">
              {linkTexts[(currentPreviewIndex + 1) % images.length]["text"]}
            </p>
          </div>
          <div
            className="center-image"
            onClick={() => navigation(linkTexts[currentPreviewIndex]["url"])}
          >
            <img
              src={imageUrl}
              alt={`Image ${currentPreviewIndex}`}
              style={{ height: "340px" }}
            />
            <p className="centerImageText">
              {linkTexts[currentPreviewIndex]["text"]}
            </p>
          </div>
          <div className="side-image right-side-image">
            <img
              src={images[(currentPreviewIndex + 1) % images.length]}
              alt={`Image ${currentPreviewIndex + 1}`}
            />
            <p className="sideImageText">
              {linkTexts[(currentPreviewIndex + 1) % images.length]["text"]}
            </p>
          </div>
        </div>{" "}
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
      <CodeSnippetPreview value={linkTexts[currentPreviewIndex]["code"]} />
    </>
  );
};

export default ImageSlider;
