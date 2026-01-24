import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import homepage from "../../assets/homepage.png";
import "./Home.css";
import Feed from "./Feed"

/** Homepage */

const Home = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
        <div className="Home-container"
        style={{ backgroundImage: `url(${homepage})` }}>

        {/* homepage title */}
        {/* could class names be renamed to be more concise? thanks! */}
        {isHomePage && (
          <main className="relative flex flex-col items-center justify-start min-h-screen text-center px-4">
            <div className="space-y-2">
              <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter italic drop-shadow-lg">
                Skincare Website{" "}
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
