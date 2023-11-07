// ImageSlider.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../assets/arrow-left.png";
import RightArrow from "../assets/arrow-right.png";
import "./ImageSlider.css";

interface ImageSliderProps {
  images: string[];
  linkTexts: { text: string; url: string }[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, linkTexts }) => {
  const navigation = useNavigate();
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>(images[0]);
  const sliderRef = useRef<HTMLDivElement>(null);

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
      <div className="slider-container" ref={sliderRef}>
        <div
          className={`arrow left display-none ${
            currentPreviewIndex === 0 ? "disabled" : ""
          }`}
          onClick={slidePrevious}
        >
          <img src={LeftArrow} alt="left-arrow" />
        </div>
        <div className="slider web-view">
          <div className="side-image left-side-image">
            <img
              src={
                images[
                  (currentPreviewIndex - 1 + images.length) % images.length
                ]
              }
              alt={`Image ${currentPreviewIndex - 1}`}
            />
            <p className="side-image-text">
              {
                linkTexts[
                  (currentPreviewIndex - 1 + images.length) % images.length
                ]["text"]
              }
            </p>
          </div>
          <div
            className="center-image"
            onClick={() => navigation(linkTexts[currentPreviewIndex]["url"])}
          >
            <img src={imageUrl} alt={`Image ${currentPreviewIndex}`} />
            <p className="center-image-text ">
              {linkTexts[currentPreviewIndex]["text"]}
            </p>
          </div>
          <div className="side-image right-side-image">
            <img
              src={images[(currentPreviewIndex + 1) % images.length]}
              alt={`Image ${currentPreviewIndex + 1}`}
            />
            <p className="side-image-text">
              {linkTexts[(currentPreviewIndex + 1) % images.length]["text"]}
            </p>
          </div>
        </div>
        <div className="mobile-slider mobile-view">
          {images.map((image, index) => (
            <div className="center-image" key={index}>
              <img src={image} alt={`Image ${index}`} />
              <p
                className="center-image-text"
                onClick={() => navigation(linkTexts[index].url)}
              >
                {linkTexts[index].text}
              </p>
            </div>
          ))}
        </div>
        <div
          className={`arrow right display-none ${
            currentPreviewIndex === images.length - 1 ? "disabled" : ""
          }`}
          onClick={slideNext}
        >
          <img src={RightArrow} alt="right-arrow" />
        </div>
      </div>
      <div className="ellipse-container">
        <div
          onClick={slidePrevious}
          className={`ellipse ${
            currentPreviewIndex === 2 ? "active-ellipse" : ""
          }`}
        ></div>
        <div
          className={`ellipse ${
            currentPreviewIndex === 0 ? "active-ellipse" : ""
          }`}
        ></div>
        <div
          onClick={slideNext}
          className={`ellipse ${
            currentPreviewIndex === 1 ? "active-ellipse" : ""
          }`}
        ></div>
      </div>
    </>
  );
};

export default ImageSlider;
