import React from 'react';
import './anatomyviewer.css';
import anatomyImg from '../images/Anatomy_Image_May_27_2025-removebg-preview 1.png';

const AnatomyViewer = () => (
  <div className="anatomy_section">
    <img src={anatomyImg} alt="Human Anatomy" className="anatomy_img" />
    <div className="tooltip heart">❤️ Healthy Heart</div>
    <div className="tooltip leg">🦵 Healthy Leg</div>
  </div>
);

export default AnatomyViewer;
