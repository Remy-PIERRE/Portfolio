import React from "react";

function TestimonialCard({ data }) {
  return (
    <div className="testimonials__card__body">
      <div className="testimonials__card__wrapper">
        <h3>{data.user}</h3>
        <div className="testimonials__card__text">
          <p>{data.msg}</p>
          <span>{data.date}</span>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
