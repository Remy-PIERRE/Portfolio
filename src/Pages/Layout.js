import { useState, useEffect, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { ToggleLoadingContext } from "../Context/ToggleLoadingContext";

function Layout() {
  /* first loading handle */
  // const { toggleIsOpenLoading, isReady } = useContext(ToggleLoadingContext);
  // const [firstLoading, setFirstLoading] = useState(true);

  // const location = useLocation();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!firstLoading || !isReady) return;

  //   toggleIsOpenLoading(false);
  //   setFirstLoading(false);
  // }, [isReady]);

  return (
    <>
      <Loading />
      {/* {!firstLoading && ( */}
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
      {/* )} */}
    </>
  );
}

export default Layout;
