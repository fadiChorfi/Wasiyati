import { Metadata } from "next";
import AboutWillClient from "./AboutWillClient";
export const metadata: Metadata = {
  title: "عن الوصية | وصيتي",
  description:
    "الدليل الشامل للوصية في القانون الجزائري، الشروط، الأركان، الشكلية القانونية والحدود المسموح بها.",
};

export default function AboutWillPage() {
  return <AboutWillClient />;
}
