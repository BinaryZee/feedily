import Footer from "../atoms/footer";
import Navbar from "../components/widgetsPage/navbar";
import Widgets from "../components/widgetsPage/widgets";

const Page = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-between">
      <Navbar />
      <Widgets/>
      <Footer/>
    </div>
  );
};

export default Page;
