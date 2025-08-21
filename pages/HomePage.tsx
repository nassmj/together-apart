import React from 'react';

const features = [
  {
    icon: '📅',
    title: 'Memory Timeline',
    description: 'Capture and cherish your journey together with shared memories.',
  },
  {
    icon: '🎯',
    title: 'Activity Planner',
    description: 'Plan virtual dates and shared experiences to keep the spark alive.',
  },
  {
    icon: '🌱',
    title: 'Growth Hub',
    description: 'Grow together through engaging challenges and shared goals.',
  },
  {
    icon: '🎵',
    title: 'Discovery Exchange',
    description: 'Share music, books, and new discoveries to learn about each other.',
  },
  {
    icon: '💝',
    title: 'Daily Connection',
    description: 'Stay connected with daily check-ins, questions, and messages.',
  },
];

const DiamondIcon = () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current" strokeWidth="0.5">
        <path d="M12 2L2 8.5L12 22L22 8.5L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const HeroSection = () => (
  <section className="bg-gray-50 dark:bg-black">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Stay Close When You're <span className="text-pink">Apart</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
            Transform distance into deeper connection through meaningful activities and shared experiences.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="#/signup" className="inline-block px-8 py-3 text-lg font-bold text-black bg-green rounded-lg shadow-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black">
              Get Started
            </a>
            <a href="#features" className="inline-block px-8 py-3 text-lg font-semibold text-green bg-black/5 dark:bg-white/5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black">
              Learn More
            </a>
          </div>
        </div>
        <div className="hidden lg:flex justify-center items-center">
          <div className="relative w-full max-w-sm">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute -top-20 -left-20 w-80 h-80 text-pink/10 opacity-70">
              <path fill="currentColor" d="M60.6,-57.5C74,-44.1,77.2,-22.1,75,-3.1C72.8,15.8,65.2,31.6,53,44.9C40.8,58.2,24.1,69,6,69.9C-12.1,70.8,-30.2,61.9,-45.3,49.2C-60.4,36.5,-72.5,19.9,-75.6,-0.4C-78.7,-20.7,-72.8,-43.3,-58.8,-57C-44.8,-70.7,-22.4,-75.5,-1.9,-74.2C18.6,-72.9,37.2,-70.9,60.6,-57.5Z" transform="translate(100 100)" />
            </svg>
            <div className="relative z-10 text-pink w-64 h-64 mx-auto">
              <DiamondIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);


const FeaturesSection = () => (
    <section id="features" className="py-20 sm:py-24 bg-white dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Everything You Need to Connect
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                    Tools designed to strengthen your bond, no matter the distance.
                </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                 {features.map((feature) => (
                    <div key={feature.title} className="bg-gray-50 dark:bg-white/5 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-pink/10 hover:-translate-y-1 transition-all duration-300 ease-in-out">
                        <div className="text-4xl" role="img" aria-label={feature.title}>{feature.icon}</div>
                        <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CtaSection = () => (
    <section className="bg-gray-50 dark:bg-black">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                Ready to strengthen your relationship?
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Join thousands of couples staying connected, growing together, and creating lasting memories.
            </p>
            <a href="#/signup" className="mt-8 w-full inline-flex items-center justify-center px-8 py-4 border border-transparent rounded-md shadow-md text-base font-bold text-black bg-green hover:bg-opacity-90 sm:w-auto transition-colors">
                Start Your Journey
            </a>
        </div>
    </section>
);


const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </>
  );
};

export default HomePage;