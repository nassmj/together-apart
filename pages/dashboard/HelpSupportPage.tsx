import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

// FAQ Item Component
const FAQItem: React.FC<{
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <motion.div
      className="border border-border rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-surface-alt transition-colors"
      >
        <span className="font-medium text-primary">{question}</span>
        <XMarkIcon 
          className={`w-5 h-5 text-muted transition-transform ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`} 
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-4">
          <p className="text-secondary leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Contact Method Component
const ContactMethod: React.FC<{
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}> = ({ icon: Icon, title, description, action, onClick }) => {
  return (
    <motion.div
      className="card hover:shadow-md transition-all duration-200 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-primary mb-1">{title}</h4>
          <p className="text-sm text-secondary mb-3">{description}</p>
          <button className="btn btn-primary btn-sm">{action}</button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Help & Support Component
const HelpSupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I connect with my partner?",
      answer: "To connect with your partner, go to the Connect section and generate an invitation code. Share this code with your partner, who can then accept the invitation to establish the connection."
    },
    {
      question: "Can I export my memories and data?",
      answer: "Yes! You can export your memories as an album from the Memory Timeline page. Go to the timeline, click the 'Export Album' button, and choose your preferred format."
    },
    {
      question: "How do daily connections work?",
      answer: "Daily connections are AI-generated questions designed to help you and your partner stay connected. Each day, you'll receive a new question to answer, and you can see each other's responses."
    },
    {
      question: "What are quests and how do I complete them?",
      answer: "Quests are relationship challenges and activities designed to help you grow together. You can find them in the Growth Hub. Start a quest, track your progress, and celebrate achievements together."
    },
    {
      question: "How do I customize my notification preferences?",
      answer: "Go to Settings > Notifications to customize which notifications you receive and when. You can enable or disable specific types of notifications and set your preferred timing."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely! We take your privacy seriously. All data is encrypted, and we never share your personal information with third parties. You can review our privacy policy in Settings."
    },
    {
      question: "How do I reset my password?",
      answer: "If you've forgotten your password, click 'Forgot Password' on the login page. You'll receive an email with instructions to reset your password securely."
    },
    {
      question: "Can I use the app offline?",
      answer: "Some features are available offline, but for the best experience, we recommend using the app with an internet connection to sync data with your partner in real-time."
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactEmail = () => {
    window.location.href = 'mailto:support@togetherapart.com?subject=Help Request';
  };

  const handleContactPhone = () => {
    window.location.href = 'tel:+1-555-0123';
  };

  const handleLiveChat = () => {
    alert('Live chat feature coming soon! For now, please use email support.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Help & Support</h1>
        <p className="text-secondary">
          Find answers to common questions and get the help you need
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          placeholder="Search for help topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ContactMethod
          icon={EnvelopeIcon}
          title="Email Support"
          description="Get help via email within 24 hours"
          action="Send Email"
          onClick={handleContactEmail}
        />
        <ContactMethod
          icon={PhoneIcon}
          title="Phone Support"
          description="Call us for immediate assistance"
          action="Call Now"
          onClick={handleContactPhone}
        />
        <ContactMethod
          icon={ChatBubbleLeftRightIcon}
          title="Live Chat"
          description="Chat with our support team"
          action="Start Chat"
          onClick={handleLiveChat}
        />
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <QuestionMarkCircleIcon className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">No results found</h3>
              <p className="text-secondary">
                Try adjusting your search terms or contact our support team directly.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Resources Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="card bg-gradient-to-r from-primary-light to-secondary-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">User Guide</h3>
              <p className="text-secondary mb-4">
                Learn how to make the most of Together Apart with our comprehensive user guide.
              </p>
              <button className="btn btn-primary btn-sm">
                Read Guide
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card bg-gradient-to-r from-secondary-light to-accent-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
              <GlobeAltIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">Community</h3>
              <p className="text-secondary mb-4">
                Join our community forum to connect with other couples and share experiences.
              </p>
              <button className="btn btn-secondary btn-sm">
                Join Community
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Status Section */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-success flex items-center justify-center">
            <CheckCircleIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-primary mb-1">System Status</h3>
            <p className="text-secondary">
              All systems are operating normally. No known issues at this time.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpSupportPage;
