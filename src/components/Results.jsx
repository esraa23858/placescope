import React from "react";

function Results({ placeData }) {

  return (
    <div>

      <h2>{placeData.name}</h2>

      <p>⭐ Rating: {placeData.rating}</p>

      <h3>Reviews:</h3>

      {placeData.reviews?.map((review, index) => (
        <div key={index}>
          <p>{review.text}</p>
          <hr />
        </div>
      ))}

    </div>
  );
}

export default Results;