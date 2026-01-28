import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import homepage from "../../assets/homepage.png";
import "./Home.css";
import Feed from "./Feed";

// homepage

const Home = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <div
        className="Home-container"
        style={{ backgroundImage: `url(${homepage})` }}
      >
        {/* homepage title */}
        {isHomePage && (
          <main className="relative flex flex-col items-center justify-start min-h-screen text-center pt-5 px-4">
            <div className="space-y-2">
              <h1 className="relative px-7 py-2">
                <span className="absolute inset-0 bg-[#5976AC]/30 backdrop-blur-md rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.5)]"></span>
                <span className="text-7xl md:text-8xl font-serif text-[#5173a9] tracking-tighter italic drop-shadow-lg">
                  Daisy
                </span>
              </h1>
            </div>
          </main>
        )}

        {/** feed after homepage at bottom */}
        <Feed />
      </div>
    </>
  );
};

export default Home;
