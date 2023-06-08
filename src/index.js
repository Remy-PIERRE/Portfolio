import React from "react";
import ReactDOM from "react-dom/client";
import "./mini-style.css";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Skills from "./Pages/Skills";
import Gallery from "./Pages/Gallery";
import Testimonials from "./Pages/Testimonials";
import Contact from "./Pages/Contact";
import Error from "./Pages/Error";

/* create router */
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/a-propos",
        element: <About />,
      },
      {
        path: "competences",
        element: <Skills />,
      },
      {
        path: "galerie",
        element: <Gallery />,
      },
      {
        path: "livre-dor",
        element: <Testimonials />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RouterProvider router={router}>
    <App />
  </RouterProvider>
);
