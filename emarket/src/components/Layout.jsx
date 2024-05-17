import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";

const Layout = () => {
  return (
    <section>
      <Header />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </section>
  );
};

export { Layout };



// import { Link, Outlet } from "react-router-dom";
// import Header from "./header/Header";
// import Footer from "./footer/Footer";
// const Layout =()=>{
// return(
// <>
// <Header />
// <main className="container">
// <Outlet />
// </main>

// <Footer />


// </>


// )

// }
// export {Layout}