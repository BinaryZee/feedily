import Footer from "../atoms/footer";
import Navbar from "../components/widgetsPage/navbar";
import Widgets from "../components/widgetsPage/widgets";

const Page = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between">
      <Navbar />
      <div className="flex-1 w-full flex justify-center p-4">
        <Widgets/>
      </div>
      <Footer/>
    </div>
  );
};

export default Page;