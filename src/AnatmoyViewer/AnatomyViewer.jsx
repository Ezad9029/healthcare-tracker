import React from 'react';
import './anatomyviewer.css';
// import anatomyImg from '../assets/anatomy.png';

const AnatomyViewer = () => (
  <div className="anatomy_section">
    {/* <img src={anatomyImg} alt="Human Anatomy" className="anatomy_img" /> */}
    <div className="tooltip heart">❤️ Healthy Heart</div>
    <div className="tooltip leg">🦵 Healthy Leg</div>
  </div>
);

export default AnatomyViewer;
