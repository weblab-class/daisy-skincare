import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { NewReview } from "../modules/NewInput.jsx";

const Review = () => {
  const navigate = useNavigate();
  const { addNewReview } = useOutletContext();

  //   Logic for reviews
  const submitNewReview = (reviewObj) => {
    addNewReview(reviewObj);
    navigate("/feed");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => navigate("/")}></div>
      <div className="bg-white/90 p-8 rounded-3xl shadow-2xl relative max-w-lg w-full border border-white/20">
        <button
          onClick={() => navigate("/feed")}
          className="absolute top-4 right-4 text-purple-600 hover:scale-110 transition-transform font-bold"
        >
          ✕
        </button>
        <h2 className="text-2xl font-serif italic text-purple-700 mb-4 text-center">
          Write a Review!
        </h2>
        <NewReview addNewReview={submitNewReview} />
      </div>
    </div>
  );
};

export default Review;
