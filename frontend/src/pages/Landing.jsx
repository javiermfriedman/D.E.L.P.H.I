import { useNavigate } from "react-router-dom";
import WordParticles from "../components/landing/WordParticles";
import TypewriterTitle from "../components/landing/TypewriterTitle";

export default function Landing() {
  const navigate = useNavigate();

  function handleEnter() {
    document.body.classList.add("fade-out");
    setTimeout(() => navigate("/dashboard"), 700);
  }

  return (
    <div className="landing">
      <WordParticles />
      <div className="landing-content">
        <TypewriterTitle onComplete={handleEnter} />
      </div>
    </div>
  );
}
