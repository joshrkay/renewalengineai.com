import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseLanding from "./pages/CourseLanding";
import CourseLesson from "./pages/CourseLesson";
import Mastermind from "./pages/Mastermind";
import TeamLicenses from "./pages/TeamLicenses";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseSlug" element={<CourseLanding />} />
          <Route
            path="/courses/:courseSlug/:moduleSlug/:lessonSlug"
            element={<CourseLesson />}
          />
          <Route path="/mastermind" element={<Mastermind />} />
          <Route path="/team-licenses" element={<TeamLicenses />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
