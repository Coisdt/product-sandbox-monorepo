
import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import CarDetails from "./CarDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/car/:id",
    element: <CarDetails />,
  },
]);

export default router;
