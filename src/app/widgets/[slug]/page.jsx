import PublicWidget from "../../components/publicWidget/publicWidget";
import Footer from "../../atoms/footer";
import Navbar from "../../components/widgetsPage/navbar";
import React from "react";
import TextFeedbacks from "../../components/publicWidget/textFeedbacks";

const Page = async({ params }) => {
  const { slug } = await params;

  return (
    <div className="w-screen h-screen flex flex-col relative items-stretch">
      <Navbar />
      <PublicWidget link = {slug}/>
      <Footer />

    </div>
  );
};

export default Page;
