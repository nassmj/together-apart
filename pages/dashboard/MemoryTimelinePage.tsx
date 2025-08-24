import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    HeartIcon,
    PlusIcon,
    ArrowLeftIcon,
    PhotoIcon,
    MapPinIcon,
    CalendarIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { usePartner } from '../../contexts/PartnerContext';
import BottomNav from '../../components/dashboard/BottomNav';

const MemoryTimelinePage: React.FC = () => {
    const { user } = useAuth();
    const { partner } = usePartner();
    const [showAddMemory, setShowAddMemory] = useState(false);

    // Sample memories (in real app, these would come from database)
    const memories = [
        {
            id: 1,
            title: "Our First Coffee Date",
            description: "The way you smiled when you tried that new pastry. I'll never forget how your eyes lit up when you talked about your dreams.",
            date: "March 15, 2024",
            location: "Downtown Coffee Shop",
            type: "date",
            author: user?.user_metadata?.full_name || "You"
        },
        {
            id: 2,
            title: "Sunset Walk by the Beach",
            description: "Walking hand in hand, watching the sunset. You said it was the most beautiful evening you'd ever had. I felt the same way.",
            date: "February 28, 2024",
            location: "Beach Promenade",
            type: "romantic",
            author: partner?.full_name || "Partner"
        },
        {
            id: 3,
            title: "Cooking Disaster Turned Fun",
            description: "When we tried to make pasta together and everything went wrong. We ended up laughing so hard we cried. Best dinner ever!",
            date: "February 10, 2024",
            location: "Your Kitchen",
            type: "funny",
            author: user?.user_metadata?.full_name || "You"
        }
    ];

    const AddMemoryModal: React.FC = () => {
        const [memoryData, setMemoryData] = useState({
            title: '',
            description: '',
            location: '',
            date: new Date().toISOString().split('T')[0]
        });

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            // Here you would save to database
            console.log('New memory:', memoryData);
            setShowAddMemory(false);
            setMemoryData({ title: '', description: '', location: '', date: new Date().toISOString().split('T')[0] });
        };

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 w-full max-w-md">
                    <h3 className="text-xl font-bold text-charcoal dark:text-white mb-4">Add New Memory</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                                Memory Title
                            </label>
                            <input
                                type="text"
                                value={memoryData.title}
                                onChange={(e) => setMemoryData({...memoryData, title: e.target.value})}
                                className="w-full p-3 rounded-xl border border-rose/20 bg-soft-white dark:bg-white/10 text-charcoal dark:text-white"
                                placeholder="What's this memory about?"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                                Description
                            </label>
                            <textarea
                                value={memoryData.description}
                                onChange={(e) => setMemoryData({...memoryData, description: e.target.value})}
                                rows={4}
                                className="w-full p-3 rounded-xl border border-rose/20 bg-soft-white dark:bg-white/10 text-charcoal dark:text-white"
                                placeholder="Share the details of this special moment..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                value={memoryData.location}
                                onChange={(e) => setMemoryData({...memoryData, location: e.target.value})}
                                className="w-full p-3 rounded-xl border border-rose/20 bg-soft-white dark:bg-white/10 text-charcoal dark:text-white"
                                placeholder="Where did this happen?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={memoryData.date}
                                onChange={(e) => setMemoryData({...memoryData, date: e.target.value})}
                                className="w-full p-3 rounded-xl border border-rose/20 bg-soft-white dark:bg-white/10 text-charcoal dark:text-white"
                                required
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowAddMemory(false)}
                                className="flex-1 p-3 rounded-xl border border-rose/20 text-rose hover:bg-rose/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 p-3 rounded-xl bg-rose text-white hover:bg-rose/90 transition-colors"
                            >
                                Save Memory
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-md mx-auto bg-soft-white dark:bg-gray-900 min-h-screen">
            <div className="p-4 pb-24">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="p-2 rounded-full bg-white dark:bg-white/5 hover:bg-rose/10 transition-colors">
                            <ArrowLeftIcon className="h-6 w-6 text-charcoal dark:text-white" />
                        </Link>
                        <h1 className="text-2xl font-bold text-charcoal dark:text-white">Memory Timeline</h1>
                    </div>
                    <button
                        onClick={() => setShowAddMemory(true)}
                        className="p-3 rounded-full bg-rose text-white hover:bg-rose/90 transition-colors"
                    >
                        <PlusIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Memories */}
                <div className="space-y-6">
                    {memories.map((memory) => (
                        <div key={memory.id} className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-rose/10">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-rose/20 flex items-center justify-center border-2 border-rose/30">
                                    <HeartIcon className="h-6 w-6 text-rose" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-charcoal dark:text-white mb-1">
                                        {memory.title}
                                    </h3>
                                    <p className="text-sm text-cool-gray dark:text-gray-400">
                                        By {memory.author}
                                    </p>
                                </div>
                            </div>
                            
                            <p className="text-charcoal dark:text-white leading-relaxed mb-4">
                                {memory.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-cool-gray dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>{memory.date}</span>
                                </div>
                                {memory.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPinIcon className="h-4 w-4" />
                                        <span>{memory.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {memories.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">💕</div>
                        <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-2">
                            No Memories Yet
                        </h3>
                        <p className="text-cool-gray dark:text-gray-400 mb-6">
                            Start building your shared memories together
                        </p>
                        <button
                            onClick={() => setShowAddMemory(true)}
                            className="px-6 py-3 bg-rose text-white rounded-xl font-medium hover:bg-rose/90 transition-colors"
                        >
                            Add Your First Memory
                        </button>
                    </div>
                )}
            </div>
            
            {showAddMemory && <AddMemoryModal />}
            <BottomNav />
        </div>
    );
};

export default MemoryTimelinePage;
