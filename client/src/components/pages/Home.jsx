import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { NewReview } from "../modules/NewInput.jsx";

import homepage from "../../assets/homepage.png";
import "./Home.css";
import Feed from "./Feed";


// homepage

const Home = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const submitNewReview = (reviewObj) => {
    handleClose;
  };

  return (
    <>
      <div className="Home-container">
        <div className="Home-main"
        style={{ backgroundImage: `url(${homepage})` }}>
          {/* homepage title and subtitle*/}
          {isHomePage && (
            <main className="relative flex flex-col items-center justify-center min-h-screen text-center px-4">
              <div className="w-full max-w-3xl space-y-10">
                <h1 className="relative px-7 py-2 mb-4">
                  <span className="absolute inset-0 backdrop-blur-sm rounded-xl"></span>
                  <span className="text-9xl md:text-15xl font-serif text-white tracking-tighter italic drop-shadow-lg">
                    Daisy
                  </span>
                </h1>

                <p className="text-[#5976ac] inline font-black text-xl md:text-3xl uppercase tracking-[0.4em]
                drop-shadow-sm antialiased tracking-tight text-shadow">
                  <span className="absolute inset-0 rounded-xl backdrop-blur-sm"></span>
                  Your social network for skincare sidequests
                </p>

                <div className="mx-auto bg-white/90 p-8 rounded-3xl shadow-2xl border border-white/20">
                  <h2 className="text-2xl font-sans-serif font-bold text-[#a1cdd7] mb-4 text-center">
                    Write a Review!
                  </h2>
                  <NewReview addNewReview={submitNewReview} />
                </div>
              </div>
            </main>

          )}
        </div>
        {/** feed after homepage at bottom */}
        <Feed />
      </div>
    </>
  );
};

export default Home;
