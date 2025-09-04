import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  CameraIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useMemories } from '../../hooks/useMemories';
import { toast } from 'react-hot-toast';
import { exportData, generateExportData, exportFormats } from '../../utils/exportUtils';

// Memory Card Component
interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  tags: string[];
  image?: string;
  author: string;
  isFavorite: boolean;
}

const MemoryCard: React.FC<{ memory: Memory; onEdit?: (memory: Memory) => void }> = ({ memory, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="card overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onEdit?.(memory)}
    >
      {/* Memory Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-light to-secondary-light overflow-hidden">
        {memory.image ? (
          <img 
            src={memory.image} 
            alt={memory.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HeartIcon className="w-16 h-16 text-primary/30" />
          </div>
        )}
        
        {/* Overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-black/20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button className="btn btn-primary btn-sm">
                View Details
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
          <StarIcon className={`w-5 h-5 ${memory.isFavorite ? 'text-accent fill-current' : 'text-muted'}`} />
        </button>

        {/* Tags */}
        <div className="absolute bottom-3 left-3 flex gap-1">
          {memory.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="badge badge-primary badge-sm">
              {tag}
            </span>
          ))}
          {memory.tags.length > 2 && (
            <span className="badge badge-secondary badge-sm">
              +{memory.tags.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Memory Content */}
      <div className="p-4">
        <h3 className="font-semibold text-primary mb-2 line-clamp-1">
          {memory.title}
        </h3>
        <p className="text-secondary text-sm mb-3 line-clamp-2">
          {memory.description}
        </p>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <CalendarDaysIcon className="w-4 h-4" />
              {memory.date}
            </div>
            <div className="flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              {memory.location}
            </div>
          </div>
          <span className="text-xs">By {memory.author}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Add Memory Modal Component
const AddMemoryModal: React.FC<{ isOpen: boolean; onClose: () => void; coupleId: string }> = ({ isOpen, onClose, coupleId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    tags: [] as string[],
    image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addMemoryMutation } = useMemories({ coupleId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addMemoryMutation.mutateAsync({
        couple_id: coupleId,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        tags: formData.tags,
        image_url: formData.image || null
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        tags: [],
        image: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to create memory:', error);
      toast.error('Failed to create memory. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="relative bg-surface rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-primary">Add New Memory</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-surface-alt transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Memory Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="What's this memory about..."
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Share the details of this special moment..."
                    className="input resize-none h-24"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Where did this happen?"
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="Add tags separated by commas..."
                    className="input"
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                      setFormData({ ...formData, tags });
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Memory'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Memory Timeline Component
const MemoryTimelinePage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // For demo purposes, using a mock couple ID
  // In production, this would come from the user's partner connection
  const coupleId = 'demo-couple-id';

  const handleExport = async () => {
    if (!user) {
      toast.error('You must be logged in to export data');
      return;
    }

    setIsExporting(true);
    try {
      // Generate export data
      const exportDataObj = generateExportData(
        memories, // In production, this would come from the database
        [], // Daily connections - would come from database
        [], // Activities - would come from database
        {
          name: user.full_name || 'User',
          email: user.email || '',
        }
      );

      // Export as HTML (most user-friendly format)
      await exportData(exportDataObj, exportFormats.HTML);
      toast.success('Memory album exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export memory album. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Sample memories data
  const memories: Memory[] = [
    {
      id: '1',
      title: 'Sunset at Santorini',
      description: 'That breathtaking evening in Santorini, watching the sun dip below the horizon while holding hands. The colors were absolutely magical.',
      date: 'July 15, 2023',
      location: 'Oia, Santorini, Greece',
      tags: ['Travel', 'Romantic', 'Europe'],
      author: 'Nasser',
      isFavorite: true
    },
    {
      id: '2',
      title: 'Our First Home Cooked',
      description: 'Remember that culinary adventure? We managed to make a surprisingly delicious pasta dish together, even though neither of us knew what we were doing!',
      date: 'October 22, 2022',
      location: 'Our Apartment, City Centre',
      tags: ['Home', 'Cooking', 'Milestone'],
      author: 'Partner',
      isFavorite: false
    },
    {
      id: '3',
      title: 'Camping Under the Stars',
      description: 'The stars in Yosemite were unreal. We stayed up late by the campfire, sharing stories and dreams. It was the perfect escape from the city.',
      date: 'August 10, 2023',
      location: 'Yosemite National Park',
      tags: ['Nature', 'Adventure', 'Camping'],
      author: 'Nasser',
      isFavorite: true
    },
    {
      id: '4',
      title: 'Birthday Surprise',
      description: 'You really outdid yourself with the birthday surprise! The cafe, the cake, and most importantly, the look on your face when I walked in.',
      date: 'December 05, 2023',
      location: 'Our Favourite Cafe',
      tags: ['Celebration', 'Surprise', 'Friends'],
      author: 'Partner',
      isFavorite: false
    },
    {
      id: '5',
      title: 'Autumn Hike',
      description: 'The colours on our autumn hike were breathtaking. Every leaf felt like a painting, and the crisp air made everything feel so alive.',
      date: 'November 12, 2023',
      location: 'Maple Forest Trail',
      tags: ['Nature', 'Hiking', 'Autumn'],
      author: 'Nasser',
      isFavorite: true
    },
    {
      id: '6',
      title: 'Concert Night Out',
      description: 'That concert was electric! Singing along to all our favourite songs, surrounded by music and each other. Pure magic.',
      date: 'September 28, 2023',
      location: 'The Grand Arena',
      tags: ['Music', 'Night Out', 'Fun'],
      author: 'Partner',
      isFavorite: false
    }
  ];

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All Types' || memory.tags.includes(selectedType);
    const matchesFilter = selectedFilter === 'All' || 
                         (selectedFilter === 'Favorites' && memory.isFavorite) ||
                         (selectedFilter === 'Recent' && memory.date.includes('2023'));
    
    return matchesSearch && matchesType && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Memory Timeline</h1>
          <p className="text-secondary">
            Cherish your shared moments and create lasting memories together
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className="btn btn-dark"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Exporting...
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="w-5 h-5" />
                Export Album
              </>
            )}
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusIcon className="w-5 h-5" />
            Add Memory
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
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="input"
          >
            <option>All Types</option>
            <option>Travel</option>
            <option>Romantic</option>
            <option>Adventure</option>
            <option>Home</option>
            <option>Celebration</option>
          </select>
          
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="input"
          >
            <option>All</option>
            <option>Favorites</option>
            <option>Recent</option>
          </select>
        </div>
      </div>

      {/* Memories Grid */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {filteredMemories.map((memory, index) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onEdit={(memory) => {
                console.log('Edit memory:', memory);
                // Handle memory editing
              }}
            />
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredMemories.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <HeartIcon className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">No memories found</h3>
          <p className="text-secondary mb-6">
            {searchQuery || selectedType !== 'All Types' || selectedFilter !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Start creating beautiful memories together'}
          </p>
          {!searchQuery && selectedType === 'All Types' && selectedFilter === 'All' && (
            <button 
              className="btn btn-primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              <PlusIcon className="w-5 h-5" />
              Add Your First Memory
            </button>
          )}
        </motion.div>
      )}

      {/* Add Memory Modal */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        coupleId={coupleId}
      />
    </div>
  );
};

export default MemoryTimelinePage;
