import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  StarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { useActivities } from '../../hooks/useActivities';
import { useAuth } from '../../contexts/AuthContext';

// Plan Interface
interface Plan {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'date' | 'activity' | 'travel' | 'celebration' | 'casual';
  status: 'upcoming' | 'completed' | 'cancelled';
  participants: string[];
  isFavorite: boolean;
  tags: string[];
}

// Plan Card Component
const PlanCard: React.FC<{ plan: Plan; onEdit?: (plan: Plan) => void }> = ({ plan, onEdit }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'date': return 'primary';
      case 'activity': return 'secondary';
      case 'travel': return 'accent';
      case 'celebration': return 'primary';
      case 'casual': return 'secondary';
      default: return 'primary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'success';
      case 'completed': return 'muted';
      case 'cancelled': return 'error';
      default: return 'muted';
    }
  };

  const typeColor = getTypeColor(plan.type);
  const statusColor = getStatusColor(plan.status);

  return (
    <motion.div
      className="card hover:shadow-md transition-all duration-200 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onEdit?.(plan)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-${typeColor}-light rounded-lg flex items-center justify-center`}>
            <CalendarDaysIcon className={`w-5 h-5 text-${typeColor}`} />
          </div>
          <div>
            <h3 className="font-semibold text-primary">{plan.title}</h3>
            <p className="text-secondary text-sm">{plan.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {plan.isFavorite && (
            <StarIcon className="w-5 h-5 text-accent fill-current" />
          )}
          <span className={`badge badge-${statusColor}`}>
            {plan.status}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-secondary">
          <CalendarDaysIcon className="w-4 h-4" />
          {plan.date}
        </div>
        <div className="flex items-center gap-2 text-sm text-secondary">
          <ClockIcon className="w-4 h-4" />
          {plan.time}
        </div>
        {plan.location && (
          <div className="flex items-center gap-2 text-sm text-secondary">
            <MapPinIcon className="w-4 h-4" />
            {plan.location}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserGroupIcon className="w-4 h-4 text-muted" />
          <span className="text-sm text-secondary">
            {plan.participants.length} participants
          </span>
        </div>
        <div className="flex gap-1">
          {plan.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="badge badge-primary badge-sm">
              {tag}
            </span>
          ))}
          {plan.tags.length > 2 && (
            <span className="badge badge-secondary badge-sm">
              +{plan.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Add Plan Modal Component
const AddPlanModal: React.FC<{ isOpen: boolean; onClose: () => void; coupleId: string }> = ({ isOpen, onClose, coupleId }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    location: '',
    type: 'date' as Plan['type'],
    participants: [] as string[],
    tags: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addActivity, isAdding } = useActivities({ coupleId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      addActivity({
        couple_id: coupleId,
        user_id: user?.id || '',
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        category: formData.type,
        completed: false
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        location: '',
        type: 'date' as Plan['type'],
        participants: [],
        tags: []
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to create activity:', error);
      alert('Failed to create activity. Please try again.');
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
                <h2 className="text-xl font-semibold text-primary">Create New Plan</h2>
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
                    Plan Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Romantic Dinner Date"
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
                    placeholder="Add some details about the plan..."
                    className="input resize-none h-20"
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
                      Time
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., The Italian Place, Main Street"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Plan['type'] })}
                    className="input"
                  >
                    <option value="date">Date</option>
                    <option value="activity">Activity</option>
                    <option value="travel">Travel</option>
                    <option value="celebration">Celebration</option>
                    <option value="casual">Casual</option>
                  </select>
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
                    disabled={isAdding}
                  >
                    {isAdding ? 'Creating...' : 'Create Plan'}
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

// Main Activity Planner Component
const ActivityPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All Types');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // For demo purposes, using a mock couple ID
  // In production, this would come from the user's partner connection
  const coupleId = 'demo-couple-id';

  // Sample plans data
  const plans: Plan[] = [
    {
      id: '1',
      title: 'Romantic Dinner Date',
      description: 'A special evening at our favorite Italian restaurant with candlelight and great conversation.',
      date: '2024-08-10',
      time: '19:00',
      location: 'The Italian Place, Main Street',
      type: 'date',
      status: 'upcoming',
      participants: ['Nasser', 'Partner'],
      isFavorite: true,
      tags: ['Romantic', 'Dinner', 'Date Night']
    },
    {
      id: '2',
      title: 'Weekend Hiking Adventure',
      description: 'Exploring the beautiful trails at the national park, enjoying nature and fresh air together.',
      date: '2024-08-15',
      time: '09:00',
      location: 'National Park Trails',
      type: 'activity',
      status: 'upcoming',
      participants: ['Nasser', 'Partner'],
      isFavorite: false,
      tags: ['Outdoor', 'Adventure', 'Nature']
    },
    {
      id: '3',
      title: 'Movie Night at Home',
      description: 'Cozy evening watching our favorite movies with popcorn and blankets.',
      date: '2024-08-08',
      time: '20:00',
      location: 'Home',
      type: 'casual',
      status: 'completed',
      participants: ['Nasser', 'Partner'],
      isFavorite: false,
      tags: ['Home', 'Movie', 'Relax']
    },
    {
      id: '4',
      title: 'Beach Vacation',
      description: 'A week-long getaway to the beautiful coastal town, enjoying sun, sand, and sea.',
      date: '2024-09-01',
      time: '10:00',
      location: 'Coastal Paradise Resort',
      type: 'travel',
      status: 'upcoming',
      participants: ['Nasser', 'Partner'],
      isFavorite: true,
      tags: ['Travel', 'Beach', 'Vacation']
    },
    {
      id: '5',
      title: 'Anniversary Celebration',
      description: 'Celebrating our special day with a fancy dinner and dancing.',
      date: '2024-08-20',
      time: '18:30',
      location: 'Grand Hotel Ballroom',
      type: 'celebration',
      status: 'upcoming',
      participants: ['Nasser', 'Partner'],
      isFavorite: true,
      tags: ['Anniversary', 'Celebration', 'Special']
    }
  ];

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || plan.status === selectedStatus;
    const matchesType = selectedType === 'All Types' || plan.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const upcomingPlans = filteredPlans.filter(plan => plan.status === 'upcoming');
  const completedPlans = filteredPlans.filter(plan => plan.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Shared Plans</h1>
          <p className="text-secondary">
            Plan, track, and get inspired for your next adventure together
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost">
            <LightBulbIcon className="w-5 h-5" />
            Inspire Me
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusIcon className="w-5 h-5" />
            Add Plan
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
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input"
          >
            <option>All</option>
            <option>upcoming</option>
            <option>completed</option>
            <option>cancelled</option>
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="input"
          >
            <option>All Types</option>
            <option>date</option>
            <option>activity</option>
            <option>travel</option>
            <option>celebration</option>
            <option>casual</option>
          </select>
        </div>
      </div>

      {/* Plans Tabs */}
      <div className="flex gap-1 p-1 bg-surface-alt rounded-lg">
        <button className="flex-1 py-2 px-4 rounded-md bg-primary text-white font-medium">
          Upcoming ({upcomingPlans.length})
        </button>
        <button className="flex-1 py-2 px-4 rounded-md text-secondary hover:text-primary transition-colors">
          Completed ({completedPlans.length})
        </button>
        <button className="flex-1 py-2 px-4 rounded-md text-secondary hover:text-primary transition-colors">
          Idea Bin (0)
        </button>
      </div>

      {/* Plans Grid */}
      {upcomingPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingPlans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={(plan) => {
                console.log('Edit plan:', plan);
                // Handle plan editing
              }}
            />
          ))}
        </div>
      ) : (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <CalendarDaysIcon className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">No upcoming plans</h3>
          <p className="text-secondary mb-6">
            {searchQuery || selectedStatus !== 'All' || selectedType !== 'All Types'
              ? 'Try adjusting your search or filters'
              : 'Start planning your next adventure together'}
          </p>
          {!searchQuery && selectedStatus === 'All' && selectedType === 'All Types' && (
            <button 
              className="btn btn-primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              <PlusIcon className="w-5 h-5" />
              Create Your First Plan
            </button>
          )}
        </motion.div>
      )}

      {/* Add Plan Modal */}
      <AddPlanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        coupleId={coupleId}
      />
    </div>
  );
};

export default ActivityPlannerPage;
