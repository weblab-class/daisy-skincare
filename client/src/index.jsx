import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import User from "./components/pages/User";
import Product from "./components/pages/Product"
import ProductPage from "./components/pages/ProductPage";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route index element={<Home />}/>
        <Route path="user" element={<User />}/>
        <Route path="product" element={<Product />}/>
        <Route path="product/:productID" element={<ProductPage />}/>
      </Route>

      <Route path="*" element={<NotFound />} />
    </>,
  ),
);

// renders React Component "Root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
