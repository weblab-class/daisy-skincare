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
        {/* homepage title and subtitle*/}
        {isHomePage && (
          <main className="relative flex flex-col items-center justify-start min-h-screen text-center pt-5 px-4">
            <div className="space-y-5">
              <h1 className="relative px-7 py-2">
                <span className="absolute inset-0 bg-[#a3d0c9]/30 backdrop-blur-md rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.5)]"></span>
                <span className="text-7xl md:text-15xl font-serif text-white tracking-tighter italic drop-shadow-lg">
                  Daisy
                </span>
              </h1>
              <p className="text-white/90 font-black text-sm md:text-lg uppercase tracking-[0.4em] drop-shadow-sm antialiased tracking-tight text-shadow">
                Your social network <br /> for skincare sidequests
              </p>
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
