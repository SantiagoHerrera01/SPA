// src/components/Card.jsx
import "./Card.css";

const Card = ({ title, description, imageUrl, link, professor }) => {
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
        <p className="study-card-professor">
          👨‍🏫 Profesor: {professor || "No asignado aún"}
        </p>
        <a className="study-card-button" href={link}>
          Inscribirse
        </a>
      </div>
    </div>
  );
};

export default Card;
