import React from "react";

function TestimonialCard({ data }) {
  /* parse date from data.timestamp */
  let msgDate;
  if (data.timestamp) {
    const date = new Date(data.timestamp.seconds * 1000);
    msgDate = `${
      date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    } / ${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    } / ${date.getFullYear()}`;
  }

  return (
    <>
      {data && (
        <div className="testimonials__card__body flexColCC">
          <div className="testimonials__card__wrapper flexColCC">
            <h3>{data.user}</h3>
            <div className="testimonials__card__text flexColSpaceBetween">
              <p>{data.msg}</p>
              <span>{msgDate ? msgDate : null}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TestimonialCard;
