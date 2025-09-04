import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon, SparklesIcon } from '@heroicons/react/24/solid';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg">
                <HeartIcon className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl lg:text-6xl font-bold text-black mb-6"
            >
              Together Apart
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Building meaningful connections, one conversation at a time
              <SparklesIcon className="inline-block w-6 h-6 text-primary ml-2" />
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/signup"
                className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
              >
                I already have an account
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">
              Stay connected, no matter the distance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform helps couples maintain their bond through meaningful interactions, shared memories, and daily connections.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-8 text-center hover:scale-105 transition-transform rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Daily Connections</h3>
              <p className="text-gray-300">
                Answer thoughtful questions together and discover new aspects of your relationship every day.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-8 text-center hover:scale-105 transition-transform rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <SparklesIcon className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Shared Memories</h3>
              <p className="text-gray-300">
                Capture and cherish your special moments together with photos, stories, and milestones.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-8 text-center hover:scale-105 transition-transform rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Growth Together</h3>
              <p className="text-gray-300">
                Set relationship goals, track your progress, and celebrate your journey together.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-6">
              Ready to strengthen your connection?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Join thousands of couples who are already building stronger relationships with Together Apart.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Your Journey
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;