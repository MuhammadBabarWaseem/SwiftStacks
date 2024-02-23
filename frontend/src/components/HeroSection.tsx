import HeroImage from '../assets/heroImage.png'

const HeroSection = () => {
  return (
    <section className="w-full">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between text-center px-12">
          <div className="text-justify">
            <h1 className="text-green-500 font-mono text-[45px]">Easiest Way</h1>
            <h1 className="text-white font-mono text-[45px]">to deploy your <br /> WebApp Code</h1>
          </div>
          <div>
            <img src={HeroImage} alt="hero image" className="mx-auto max-w-[700px]" />
          </div>
          {/* <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Acme Inc.
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              The leading provider of innovative solutions for your business.
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
