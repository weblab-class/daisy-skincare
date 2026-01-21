import {React,useState} from "react";
import { Outlet, Link, useNavigate} from "react-router-dom";
import "../utilities.css";
import "./App.css";
import homepage from "../assets/homepage.png";

/** Homepage */

const App = () => {
  // search bar for products
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e)=>{
    e.preventDefault();
    if (searchQuery.trim()){
      navigate(`/product?search=${searchQuery}`); // go to product page w search query
    }
  };

  return (
    <>
      <div
        className="App-container"
        style={{ backgroundImage: `url(${homepage})` }}
      >
        <h1 className="text-purple-500">Skincare Website</h1>
        < form onSubmit = {handleSearch} className = 'search-form'>
          <input type = "text"
          placeholder = "Search for products..."
          value = {searchQuery}
          onChange = {(e)=> setSearchQuery(e.target.value)}
          className = "search-input"
          />
          <button type = "submit" className = "search-button">Search</button>
        </form>

        <Link to="/user" className="User-link">
          User Profile
        </Link>
        <Link to="/product" className="Product-link">
          Products
        </Link>
        <div className ="spacer"></div>

        <Outlet />
      </div>
    </>
  );
};

export default App;
