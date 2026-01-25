import React, { useState, useContext } from "react";
import { Routes, Route, Outlet, Link, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { get, post } from "../../utilities";
import { UserContext } from "../context/UserContext";

// navigation bar

const NavBar = (props) => {
  {/** grace added userID */}
  const userID = useContext(UserContext);

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
        <nav className="Navbar-container">

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


            {/** grace created new route to home */}
            <Link to="/" className="hover:text-purple-400">
              Home
            </Link>
            {/** grace modified to accept users */}
            {userID && (
              <Link
                to={`/user/${userID}`}
                onClick={() => setIsOpen(false)}
                className="hover:text-purple-400"
              >
                Profile
              </Link>
            )}
            {/** grace function additions for navbar from catbook */}
            {/** feel free to move the google button around :) */}
            {userID ? (
              <button className="hover:text-purple-400" onClick={props.handleLogout}>
                Sign out
              </button>
            ) : (
              <GoogleLogin
                text="signin_with"
                onSuccess={props.handleLogin}
                onFailure={(err) => console.log(err)}
                containerProps={{ className: "hover:text-purple-400" }}
              />
            )}


            <Link
              to="product"
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
        </nav>
    </>
  );
};

export default NavBar;
