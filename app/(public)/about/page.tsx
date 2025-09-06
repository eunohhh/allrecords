import { Metadata } from "next";
import AboutTemplate from "@/templates/about-template";

export const metadata: Metadata = {
  title: "About",
  description: "내 소개",
};

function AboutPage() {
  return <AboutTemplate />;
}

export default AboutPage;
