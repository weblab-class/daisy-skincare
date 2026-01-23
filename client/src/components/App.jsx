import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "../utilities.css";
import "./App.css";
import homepage from "../assets/homepage.png";


/** Homepage */

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <div className="App-container">
        {/* Background Image Wrapper */}
        <div className="fixed inset-0 -z-10">
          <img
            src={homepage}
            className="w-full h-full object-cover"
            alt="background"
          ></img>
        </div>
        {/* Hamburger Icon Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-6 left-6 z-50 flex flex-col justify-between w-8 h-6 cursor-pointer"
        >
          {/* Top Bar - Rotates when open */}
          <span
            className={`h-1 w-full bg-purple-500 rounded transition-all duration-300 origin-left ${isOpen ? "rotate-[42deg]" : ""}`}
          ></span>
          {/* Middle Bar - Fades out when open */}
          <span
            className={`h-1 w-full bg-purple-500 rounded transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}
          ></span>
          {/* Bottom Bar - Rotates when open */}
          <span
            className={`h-1 w-full bg-purple-500 rounded transition-all duration-300 origin-left ${isOpen ? "-rotate-[42deg]" : ""}`}
          ></span>
        </button>

        {/* 3. Collapsing Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white/10 backdrop-blur-lg border-r border-white/20 transition-transform duration-300 ease-in-out z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <nav className="flex flex-col gap-6 mt-24 px-8 text-purple-600 font-bold text-xl">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="hover:text-purple-400"
            >
              Profile
            </Link>
            <Link
              to="products"
              onClick={() => setIsOpen(false)}
              className="hover:text-purple-400"
            >
              Products
            </Link>
            <a href="#shop" className="hover:text-purple-400">
              Blah
            </a>
            <a href="#contact" className="hover:text-purple-400">
              Blah
            </a>
          </nav>
        </div>

        {/* Overlay for nav bar; collapses when user clicks anywhere*/}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* White cursive title */}
        <main className="relative flex flex-col items-center justify-start min-h-screen text-center px-4">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter italic drop-shadow-lg">
              Skincare Website{" "}
            </h1>
          </div>
        </main>
        <Outlet />
      </div>
    </>
  );
};

export default App;
