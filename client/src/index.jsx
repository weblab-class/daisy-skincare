import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import Feed from "./components/pages/Feed";
import NotFound from "./components/pages/NotFound";
import Profile from "./components/pages/User";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate
} from 'react-router-dom'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<NotFound />} element={<App />}>
      <Route path="/" element={<Feed />}/>
      <Route path="/profile" element={<Profile />}/>
    </Route>
  )
)

// renders React Component "Root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
