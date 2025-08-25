import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  HeartIcon,
  BookmarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  LightBulbIcon,
  CalendarDaysIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// Discovery Item Interface
interface DiscoveryItem {
  id: string;
  title: string;
  description: string;
  category: 'music' | 'film' | 'book' | 'place' | 'idea' | 'activity' | 'food' | 'travel';
  rating: number;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  cost: 'free' | 'low' | 'medium' | 'high';
  location?: string;
  tags: string[];
  image?: string;
  isSaved: boolean;
  isRecommended: boolean;
  author: string;
  reviews: number;
}

// Discovery Card Component
const DiscoveryCard: React.FC<{ 
  item: DiscoveryItem; 
  onSave?: (item: DiscoveryItem) => void; 
  onAddToPlan?: (item: DiscoveryItem) => void;
  onView?: (item: DiscoveryItem) => void;
}> = ({ item, onSave, onAddToPlan, onView }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'music': return 'primary';
      case 'film': return 'secondary';
      case 'book': return 'accent';
      case 'place': return 'success';
      case 'idea': return 'warning';
      case 'activity': return 'primary';
      case 'food': return 'accent';
      case 'travel': return 'secondary';
      default: return 'primary';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'free': return 'success';
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'muted';
    }
  };

  const categoryColor = getCategoryColor(item.category);
  const costColor = getCostColor(item.cost);

  return (
    <motion.div
      className="card overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onView?.(item)}
    >
      {/* Item Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-light to-secondary-light overflow-hidden">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <SparklesIcon className="w-16 h-16 text-primary/30" />
          </div>
        )}
        
        {/* Save Button */}
        <button 
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onSave?.(item);
          }}
        >
          <BookmarkIcon className={`w-5 h-5 ${item.isSaved ? 'text-accent fill-current' : 'text-muted'}`} />
        </button>

        {/* Recommended Badge */}
        {item.isRecommended && (
          <div className="absolute top-3 left-3">
            <span className="badge badge-accent">
              <StarIcon className="w-3 h-3 mr-1" />
              Recommended
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`badge badge-${categoryColor}`}>
            {item.category}
          </span>
        </div>
      </div>

      {/* Item Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-primary line-clamp-1">
            {item.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted">
            <StarIcon className="w-4 h-4 fill-current text-accent" />
            <span>{item.rating}</span>
          </div>
        </div>

        <p className="text-secondary text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <ClockIcon className="w-3 h-3" />
            {item.duration}
          </div>
          {item.location && (
            <div className="flex items-center gap-2 text-xs text-secondary">
              <MapPinIcon className="w-3 h-3" />
              {item.location}
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-secondary">
            <UserGroupIcon className="w-3 h-3" />
            {item.reviews} reviews
          </div>
        </div>

        {/* Tags and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <span className={`badge badge-${costColor} badge-sm`}>
              {item.cost}
            </span>
            {item.tags.slice(0, 1).map((tag) => (
              <span key={tag} className="badge badge-secondary badge-sm">
                {tag}
              </span>
            ))}
          </div>
          
          <button 
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToPlan?.(item);
            }}
          >
            <PlusIcon className="w-4 h-4" />
            Add to Plan
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Discovery Details Modal
const DiscoveryDetailsModal: React.FC<{ 
  item: DiscoveryItem | null; 
  isOpen: boolean; 
  onClose: () => void;
  onSave?: (item: DiscoveryItem) => void;
  onAddToPlan?: (item: DiscoveryItem) => void;
}> = ({ item, isOpen, onClose, onSave, onAddToPlan }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            className="relative bg-surface rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-primary">{item.title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-surface-alt transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Description</h3>
                  <p className="text-secondary">{item.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Category</h3>
                    <span className="badge badge-primary">{item.category}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Rating</h3>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 fill-current text-accent" />
                      <span className="text-secondary">{item.rating}/5</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Duration</h3>
                    <p className="text-secondary">{item.duration}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Cost</h3>
                    <span className="badge badge-success">{item.cost}</span>
                  </div>
                </div>

                {item.location && (
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Location</h3>
                    <p className="text-secondary">{item.location}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-primary mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="badge badge-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={onClose}
                    className="btn btn-ghost flex-1"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => onSave?.(item)}
                    className="btn btn-secondary flex-1"
                  >
                    <BookmarkIcon className="w-4 h-4" />
                    {item.isSaved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={() => onAddToPlan?.(item)}
                    className="btn btn-primary flex-1"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add to Plan
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Discovery Component
const DiscoveryExchangePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCost, setSelectedCost] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedItem, setSelectedItem] = useState<DiscoveryItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Sample discovery items
  const discoveryItems: DiscoveryItem[] = [
    {
      id: '1',
      title: 'Cozy Evening Jazz Playlist',
      description: 'A curated collection of smooth jazz and romantic tunes perfect for intimate evenings together.',
      category: 'music',
      rating: 4.8,
      difficulty: 'easy',
      duration: '2 hours',
      cost: 'free',
      tags: ['Jazz', 'Romantic', 'Evening'],
      isSaved: true,
      isRecommended: true,
      author: 'Music Curator',
      reviews: 127
    },
    {
      id: '2',
      title: 'Romantic Comedy Classics Marathon',
      description: 'A weekend movie marathon featuring the best romantic comedies of all time.',
      category: 'film',
      rating: 4.5,
      difficulty: 'easy',
      duration: '6 hours',
      cost: 'low',
      tags: ['Movies', 'Romance', 'Weekend'],
      isSaved: false,
      isRecommended: true,
      author: 'Film Enthusiast',
      reviews: 89
    },
    {
      id: '3',
      title: 'The Art of Mindful Living',
      description: 'A book about cultivating mindfulness and presence in relationships.',
      category: 'book',
      rating: 4.7,
      difficulty: 'medium',
      duration: '2 weeks',
      cost: 'medium',
      tags: ['Mindfulness', 'Self-Help', 'Relationships'],
      isSaved: true,
      isRecommended: false,
      author: 'Dr. Sarah Johnson',
      reviews: 234
    },
    {
      id: '4',
      title: 'Hidden Gem Waterfall Hike',
      description: 'A beautiful hiking trail leading to a secluded waterfall, perfect for a romantic adventure.',
      category: 'place',
      rating: 4.9,
      difficulty: 'medium',
      duration: '4 hours',
      cost: 'free',
      location: 'Mountain Trail, 30 min from city',
      tags: ['Hiking', 'Nature', 'Adventure'],
      isSaved: false,
      isRecommended: true,
      author: 'Adventure Guide',
      reviews: 156
    },
    {
      id: '5',
      title: 'DIY Date Night Jar',
      description: 'Create a jar filled with creative date ideas that you can randomly select from.',
      category: 'idea',
      rating: 4.6,
      difficulty: 'easy',
      duration: '1 hour setup',
      cost: 'low',
      tags: ['DIY', 'Creative', 'Date Ideas'],
      isSaved: true,
      isRecommended: false,
      author: 'Creative Couple',
      reviews: 67
    },
    {
      id: '6',
      title: 'Cooking Class: Italian Cuisine',
      description: 'Learn to cook authentic Italian dishes together in a fun, interactive cooking class.',
      category: 'activity',
      rating: 4.8,
      difficulty: 'medium',
      duration: '3 hours',
      cost: 'high',
      location: 'Cooking Studio Downtown',
      tags: ['Cooking', 'Italian', 'Learning'],
      isSaved: false,
      isRecommended: true,
      author: 'Chef Marco',
      reviews: 203
    },
    {
      id: '7',
      title: 'Chill Lo-fi Beats for Study',
      description: 'Relaxing lo-fi music perfect for studying, working, or just chilling together.',
      category: 'music',
      rating: 4.3,
      difficulty: 'easy',
      duration: '1 hour',
      cost: 'free',
      tags: ['Lo-fi', 'Study', 'Relaxing'],
      isSaved: false,
      isRecommended: false,
      author: 'Music Curator',
      reviews: 45
    },
    {
      id: '8',
      title: 'Adventure Documentaries',
      description: 'A collection of inspiring adventure documentaries to watch together.',
      category: 'film',
      rating: 4.7,
      difficulty: 'easy',
      duration: '2 hours',
      cost: 'low',
      tags: ['Documentary', 'Adventure', 'Inspiration'],
      isSaved: true,
      isRecommended: false,
      author: 'Film Enthusiast',
      reviews: 78
    }
  ];

  const filteredItems = discoveryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesCost = selectedCost === 'All' || item.cost === selectedCost;
    const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesCost && matchesDifficulty;
  });

  const handleItemView = (item: DiscoveryItem) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleItemSave = (item: DiscoveryItem) => {
    console.log('Saving item:', item);
    // Handle save logic
  };

  const handleAddToPlan = (item: DiscoveryItem) => {
    console.log('Adding to plan:', item);
    // Handle add to plan logic
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Discovery</h1>
          <p className="text-secondary">
            Discover new experiences, activities, and ideas to enrich your relationship
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost">
            <LightBulbIcon className="w-5 h-5" />
            Get Inspired
          </button>
          <button className="btn btn-primary">
            <PlusIcon className="w-5 h-5" />
            Suggest Item
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search discoveries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input"
          >
            <option>All Categories</option>
            <option>music</option>
            <option>film</option>
            <option>book</option>
            <option>place</option>
            <option>idea</option>
            <option>activity</option>
            <option>food</option>
            <option>travel</option>
          </select>
          
          <select
            value={selectedCost}
            onChange={(e) => setSelectedCost(e.target.value)}
            className="input"
          >
            <option>All</option>
            <option>free</option>
            <option>low</option>
            <option>medium</option>
            <option>high</option>
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="input"
          >
            <option>All</option>
            <option>easy</option>
            <option>medium</option>
            <option>hard</option>
          </select>
        </div>
      </div>

      {/* Discovery Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <DiscoveryCard
              key={item.id}
              item={item}
              onSave={handleItemSave}
              onAddToPlan={handleAddToPlan}
              onView={handleItemView}
            />
          ))}
        </div>
      ) : (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <SparklesIcon className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">No discoveries found</h3>
          <p className="text-secondary mb-6">
            {searchQuery || selectedCategory !== 'All Categories' || selectedCost !== 'All' || selectedDifficulty !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Start discovering amazing experiences together'}
          </p>
          {!searchQuery && selectedCategory === 'All Categories' && selectedCost === 'All' && selectedDifficulty === 'All' && (
            <button className="btn btn-primary">
              <LightBulbIcon className="w-5 h-5" />
              Get Recommendations
            </button>
          )}
        </motion.div>
      )}

      {/* Discovery Details Modal */}
      <DiscoveryDetailsModal
        item={selectedItem}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleItemSave}
        onAddToPlan={handleAddToPlan}
      />
    </div>
  );
};

export default DiscoveryExchangePage;
