import PublicWidget from "../../components/publicWidget/publicWidget";
import Footer from "../../atoms/footer";
import Navbar from "../../components/widgetsPage/navbar";
import React from "react";

const Page = async({ params }) => {
  const { slug } = await params;

  return (
    <div className="w-screen h-screen flex flex-col  items-stretch">
      <Navbar />
      <PublicWidget link = {slug}/>
      <Footer />
    </div>
  );
};

export default Page;
