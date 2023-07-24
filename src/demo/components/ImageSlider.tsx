// ImageSlider.tsx

import React, { useState, useEffect } from "react";
import "./ImageSlider.css"; // Import your CSS file for styling

interface ImageSliderProps {
  images: string[];
}
const linkTexts = [
  "Link Text 1",
  "Link Text 2",
  "Link Text 3",
  // Add more link texts corresponding to the preview images
];
const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
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
      return; // Do nothing when the currentPreviewIndex is 0
    }

    setCurrentPreviewIndex(
      (prevIndex) => (prevIndex + 1) % previewImages.length
    );
  };

  const slidePrevious = () => {
    if (currentPreviewIndex === 0) {
      return; // Do nothing when the currentPreviewIndex is 0
    }

    setCurrentPreviewIndex(
      (prevIndex) =>
        (prevIndex - 1 + previewImages.length) % previewImages.length
    );
  };

  return (
    <div className="slider-container">
      <div
        className={`arrow left ${currentPreviewIndex === 0 ? "disabled" : ""}`}
        onClick={slidePrevious}
      >
        &lt;
      </div>
      <div className="slider">
        <div className="side-image">
          <img
            src={leftImages[currentPreviewIndex]}
            alt={`Image ${currentPreviewIndex - 1}`}
          />
        </div>
        <div className="center-image">
          <img src={imageUrl} alt={`Image ${currentPreviewIndex}`} />
          <p className="centerImageText">{linkTexts[currentPreviewIndex]}</p>
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
        &gt;
      </div>
    </div>
  );
};

export default ImageSlider;
