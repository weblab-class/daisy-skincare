import React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import User from "./components/pages/User";
import ProductSearch from "./components/pages/ProductSearch";
import ProductPage from "./components/pages/ProductPage";
import Feed from "./components/pages/Feed";
import Review from "./components/pages/Review";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

//  identifies web application to Google's authentication service
const GOOGLE_CLIENT_ID =
  "652128607404-rkv0o9ma7cqrlf75vlums1ga44ha59d9.apps.googleusercontent.com";

// page routing configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="user/:userID" element={<User />} />
        <Route path="product" element={<ProductSearch />} />
        <Route path="product/:productID" element={<ProductPage />} />
        <Route path="feed" element={<Feed />} />
        <Route path="newReview" element={<Review />} />
      </Route>

      {/** error page routing */}
      <Route path="*" element={<NotFound />} />
    </>,
  ),
);

// renders React Component "Root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <RouterProvider router={router} />
  </GoogleOAuthProvider>,
);
