import "./App.css";
import HeroSection from "./components/HeroSection";
import { Landing } from "./components/landing";

function App() {
  return (
    <div className="bg-gray-900">
      <header className=" text-white py-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold shadow-text">Swift Stack</h1>
        </div>
      </header>
      <HeroSection />
      <Landing />
    </div>
  );
}

export default App;
