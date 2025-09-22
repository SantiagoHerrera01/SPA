// src/components/StudyCard.jsx

import "./Card.css"; // Importamos el CSS

const Card = ({ title, description, imageUrl, link }) => {
  return (
    <div className="study-card">
      <a href={link}>
        <img className="study-card-image" src={imageUrl} alt={title} />
      </a>
      <div className="study-card-content">
        <a href={link}>
          <h5 className="study-card-title">{title}</h5>
        </a>
        <p className="study-card-description">{description}</p>
        <a className="study-card-button" href={link}>
          Inscribirse
        </a>
      </div>
    </div>
  );
};

export default Card;
