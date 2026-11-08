import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";
import SpaceBackground from "./SpaceBackground";

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <SpaceBackground />
      <div className="relative flex min-h-svh justify-center">
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-full max-w-[43.2rem] -translate-x-1/2 rounded-[2rem] border border-panel-border/60 bg-bg/25 backdrop-blur-md sm:max-w-[50.4rem] sm:rounded-[2.5rem]" />
        <div className="relative z-10 w-full max-w-[43.2rem] px-6 sm:max-w-[50.4rem] sm:px-8">
          <Header />
          <Outlet />
          <Footer />
        </div>
      </div>
    </>
  );
}
