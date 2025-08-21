import React, { useState, useEffect, Fragment, FormEvent, ChangeEvent } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { PlusIcon, LightBulbIcon, SparklesIcon, XMarkIcon, TrashIcon, CheckCircleIcon, PhotoIcon, MapPinIcon, ChatBubbleBottomCenterTextIcon, PencilIcon, PaperAirplaneIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { useToast } from '../../components/ToastProvider';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { DropdownMenu, DropdownMenuItem } from '../../components/DropdownMenu';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { config } from '../../lib/config';
import { useAuth } from '../../contexts/AuthContext';
import { usePartner } from '../../contexts/PartnerContext';
import type { Database } from '../../lib/supabaseClient';

// --- TYPES ---
type Activity = Database['public']['Tables']['activities']['Row'];

interface Idea {
    category: string;
    title: string;
    description: string;
}


// --- STYLING & COMPONENTS ---
const categoryStyles: { [key: string]: string } = {
    'Movie Night': 'bg-pink-500/10 text-pink-500',
    'Creative': 'bg-green-500/10 text-green-500',
    'Cultural': 'bg-pink-500/20 text-pink-500',
    'Planning': 'bg-white/5 text-gray-300',
    'Learning': 'bg-green-500/20 text-green-500',
    'Game Night': 'bg-pink-500/10 text-pink-500',
    'Default': 'bg-white/10 text-gray-300'
};

const AddEditActivityModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (activity: Partial<Activity>, id?: string, imageFile?: File | null) => void;
    activityToEdit?: Partial<Activity> | null;
}> = ({ isOpen, onClose, onSave, activityToEdit }) => {
    const [activity, setActivity] = useState<Partial<Activity>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            const initialActivity = activityToEdit || { date: null, category: 'Creative', title: '', description: '', location: '' };
            setActivity(initialActivity);
            setImagePreview(initialActivity.image_url || null);
            setImageFile(null);
        } else {
            setActivity({});
            setImagePreview(null);
            setImageFile(null);
        }
    }, [isOpen, activityToEdit]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setActivity({ ...activity, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!activity.title || !activity.title.trim()) return;
        const finalActivityData = { ...activity, image_url: imagePreview };
        onSave(finalActivityData, activity.id, imageFile);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex justify-center items-center p-4">
            <motion.div initial={{opacity:0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.95}} className="relative bg-[#2f2828] rounded-xl shadow-xl max-w-2xl w-full transform transition-all duration-300 border border-white/10">
                <div className="flex justify-between items-center p-5 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white">{activityToEdit?.id ? 'Edit Activity' : 'Add Activity'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-white/10"><XMarkIcon className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-300">Activity Title</label>
                            <div className="mt-2">
                                <input type="text" name="title" id="title" value={activity.title || ''} onChange={handleChange} placeholder="e.g., Virtual Coffee Date" required className="block w-full rounded-md border-0 py-1.5 bg-black/50 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-300">Date</label>
                                <div className="mt-2">
                                    <input type="date" name="date" id="date" value={activity.date || ''} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 bg-black/50 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-green sm:text-sm sm:leading-6" />
                                    <p className="mt-2 text-xs text-gray-500">Leave empty to add to your Idea Bin.</p>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-300">Category</label>
                                <div className="mt-2">
                                    <select name="category" id="category" value={activity.category || 'Creative'} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 bg-black/50 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-green sm:text-sm sm:leading-6">
                                       {Object.keys(categoryStyles).filter(c => c !== 'Default').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-300">Location</label>
                            <div className="relative mt-2">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input type="text" name="location" id="location" value={activity.location || ''} onChange={handleChange} placeholder="e.g., Discord, Kitchen" className="block w-full rounded-md border-0 py-1.5 pl-10 bg-black/50 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-300">Description</label>
                            <div className="relative mt-2">
                                 <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3">
                                    <PencilIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                 </div>
                                <textarea name="description" id="description" value={activity.description || ''} onChange={handleChange} placeholder="Add some details about the plan..." rows={3} className="block w-full rounded-md border-0 py-1.5 pl-10 bg-black/50 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-300">Cover Photo</label>
                            {imagePreview ? (
                                <div className="mt-2 relative">
                                    <img src={imagePreview} alt="Activity preview" className="w-full h-48 object-cover rounded-md" />
                                    <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-60 rounded-full hover:bg-opacity-100">
                                        <TrashIcon className="h-5 w-5 text-pink"/>
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600/25 px-6 py-10 bg-black/20 hover:border-gray-500">
                                    <div className="text-center">
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-semibold text-green focus-within:outline-none focus-within:ring-2 focus-within:ring-green focus-within:ring-offset-2 focus-within:ring-offset-black hover:text-opacity-80">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-black/50 px-4 py-3 sm:px-6 flex justify-end gap-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20">
                            Cancel
                        </button>
                        <button type="submit" disabled={!activity.title?.trim()} className="inline-flex justify-center rounded-md bg-green px-3 py-2 text-sm font-bold text-black shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {activityToEdit?.id ? 'Save Changes' : 'Add Activity'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const ActivityDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    activity: Activity | null;
    onEdit: (activity: Activity) => void;
    onDelete: (id: string) => void;
}> = ({ isOpen, onClose, activity, onEdit, onDelete }) => {
    
    if (!isOpen || !activity) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex justify-center items-center p-4">
            <motion.div initial={{opacity:0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.95}} className="bg-[#2f2828] rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-white/10">
                <img src={activity.image_url || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop'} alt={activity.title} className="w-full h-64 object-cover rounded-t-xl" />
                <div className="p-6 flex-grow overflow-y-auto">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryStyles[activity.category || 'Default'] || categoryStyles.Default}`}>{activity.category}</span>
                    <h3 className="text-3xl font-bold text-white mt-2">{activity.title}</h3>
                    {activity.date && <p className="text-sm text-gray-400 mt-2 flex items-center"><CalendarIcon className="h-4 w-4 mr-2" />{new Date(activity.date + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                    {activity.location && <p className="text-sm text-gray-400 mt-1 flex items-center"><MapPinIcon className="h-4 w-4 mr-2" />{activity.location}</p>}
                    <p className="text-gray-300 mt-4">{activity.description}</p>
                </div>

                <div className="bg-black/50 px-6 py-3 flex justify-between items-center rounded-b-xl border-t border-white/10">
                    <DropdownMenu>
                         <DropdownMenuItem onClick={() => { onEdit(activity); onClose(); }}>
                             <PencilIcon className="h-4 w-4 mr-3" /> Edit
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => { onDelete(activity.id); onClose(); }} className="text-pink">
                             <TrashIcon className="h-4 w-4 mr-3" /> Delete
                         </DropdownMenuItem>
                    </DropdownMenu>
                    <button onClick={onClose} className="rounded-md border border-gray-600 px-4 py-2 bg-white/10 text-white hover:bg-white/20">Close</button>
                </div>
            </motion.div>
        </div>
    );
};

const CompleteActivityModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    onComplete: (feeling: string) => void
}> = ({ isOpen, onClose, onComplete }) => {
    const feelings = ['😄', '😍', '😂', '🤓', '🤔', '😢'];
    if (!isOpen) return null;
    return (
         <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <motion.div initial={{opacity:0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.95}} className="relative bg-[#2f2828] rounded-xl shadow-xl max-w-sm w-full border border-white/10">
                 <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-white">Activity Complete!</h3>
                    <p className="text-gray-400 mt-2">How did this activity make you feel?</p>
                    <div className="mt-6 flex justify-center gap-4">
                        {feelings.map(feeling => (
                            <button key={feeling} onClick={() => onComplete(feeling)} className="text-4xl p-2 rounded-full hover:bg-green/10 transform hover:scale-125 transition-transform">
                                {feeling}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
         </div>
    );
};

const InspireMeModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSelectIdea: (idea: Idea) => void;
}> = ({ isOpen, onClose, onSelectIdea }) => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIdeas = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (!config.gemini.apiKey) throw new Error("API key is missing.");
            const ai = new GoogleGenAI({ apiKey: config.gemini.apiKey });
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: "Generate 5 creative and fun date ideas for a long-distance couple. For each idea, provide a category (from this list: Movie Night, Creative, Cultural, Planning, Learning, Game Night), a title, and a short description.",
                config: {
                    responseMimeType: "application/json",
                    responseSchema: { type: Type.OBJECT, properties: { ideas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, title: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["category", "title", "description"] } } } }
                }
            });

            const parsed = JSON.parse(response.text);
            setIdeas(parsed.ideas || []);

        } catch (err) {
            setError("Could not generate ideas. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => { if(isOpen) fetchIdeas(); }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <motion.div initial={{opacity:0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.95}} className="relative bg-[#2f2828] rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-white/10">
                 <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white flex items-center"><SparklesIcon className="h-6 w-6 text-yellow-400 mr-2"/>AI-Powered Ideas</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-white/10"><XMarkIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {isLoading && <div className="text-center py-8 text-gray-300">Loading ideas...</div>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!isLoading && !error && ideas.map((idea, index) => (
                        <div key={index} className="p-4 mb-4 border border-white/10 rounded-lg bg-black/20">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryStyles[idea.category] || categoryStyles.Default}`}>{idea.category}</span>
                                    <h4 className="font-bold text-white mt-1">{idea.title}</h4>
                                    <p className="text-sm text-gray-400 mt-1">{idea.description}</p>
                                </div>
                                <button onClick={() => onSelectIdea(idea)} className="ml-4 flex-shrink-0 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-bold rounded-md shadow-sm text-black bg-green hover:bg-opacity-90"><PlusIcon className="h-4 w-4 mr-1"/> Add & Edit</button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

const ActivityCard: React.FC<{
    activity: Activity;
    onViewDetails: (activity: Activity) => void;
    onComplete: (id: string) => void;
    onEdit: (activity: Activity) => void;
    onDelete: (id: string) => void;
}> = ({ activity, onViewDetails, onComplete, onEdit, onDelete }) => (
    <div className="group relative rounded-lg bg-white/5 shadow-lg hover:shadow-xl hover:shadow-green/10 transition-shadow duration-300 overflow-hidden border border-white/10">
        <div className="cursor-pointer" onClick={() => onViewDetails(activity)}>
            <img src={activity.image_url || 'https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?q=80&w=2070&auto=format&fit=crop'} alt={activity.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            {activity.completed && (
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-1.5 shadow-lg text-2xl">{activity.feeling}</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-white/10 backdrop-blur-sm`}>{activity.category}</span>
                <h3 className="font-bold text-lg mt-2 drop-shadow">{activity.title}</h3>
            </div>
        </div>
        <div className="absolute top-1 right-1">
            <DropdownMenu>
                {!activity.completed && activity.date &&
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onComplete(activity.id); }}>
                        <CheckCircleIcon className="h-4 w-4 mr-3" /> Mark Complete
                    </DropdownMenuItem>
                }
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(activity); }}>
                    <PencilIcon className="h-4 w-4 mr-3" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(activity.id); }} className="text-pink">
                    <TrashIcon className="h-4 w-4 mr-3" /> Delete
                </DropdownMenuItem>
            </DropdownMenu>
        </div>
    </div>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full text-center px-3 py-2 font-medium text-sm rounded-full transition-colors duration-200 ${
                active ? 'bg-green text-black shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
        >
            {children}
        </button>
    );
};

const Badge: React.FC<{ count: number }> = ({ count }) => (
    <span className={`ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold transition-colors ${count > 0 ? 'bg-green/20 text-green' : 'bg-white/10 text-gray-400'}`}>
        {count}
    </span>
);

const ActivityPlannerPage: React.FC = () => {
    const { user } = useAuth();
    const { couple } = usePartner();
    const [allActivities, setAllActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'ideaBin'>('upcoming');
    const toast = useToast();

    // Modal States
    const [addEditModal, setAddEditModal] = useState<{ isOpen: boolean, activity?: Partial<Activity> | null }>({ isOpen: false });
    const [detailsModal, setDetailsModal] = useState<{ isOpen: boolean, activity: Activity | null }>({ isOpen: false, activity: null });
    const [completeModal, setCompleteModal] = useState<{ isOpen: boolean, activityId: string | null }>({ isOpen: false, activityId: null });
    const [inspireModalOpen, setInspireModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });
    
    useEffect(() => {
        const fetchActivities = async () => {
            if (!couple) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('activities')
                .select('*')
                .eq('couple_id', couple.id);
            
            if (error) {
                toast.error(error.message);
            } else {
                setAllActivities(data || []);
            }
            setLoading(false);
        };
        fetchActivities();
    }, [couple, toast]);


    const handleSaveActivity = async (activityData: Partial<Activity>, id?: string, imageFile?: File | null) => {
        if (!user || !couple) return;
        
        let imageUrl = activityData.image_url || null;

        if (imageFile) {
            const fileName = `${couple.id}/${Date.now()}_${imageFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('activity-images')
                .upload(fileName, imageFile, { upsert: !!id });

            if (uploadError) {
                toast.error(`Image upload failed: ${uploadError.message}`);
                return;
            }
            
            const { data: urlData } = supabase.storage.from('activity-images').getPublicUrl(uploadData.path);
            imageUrl = urlData.publicUrl;
        }

        if (id) { // Editing existing activity
             const dataToSave: Database['public']['Tables']['activities']['Update'] = { ...activityData, image_url: imageUrl };
            const { data: updatedData, error } = await supabase
                .from('activities')
                .update(dataToSave)
                .eq('id', id)
                .select()
                .single();

            if (error) { toast.error(error.message); } 
            else if (updatedData) {
                setAllActivities(allActivities.map(act => act.id === id ? updatedData : act));
                toast.success("Activity updated!");
            }
        } else { // Adding new activity
            const insertData: Database['public']['Tables']['activities']['Insert'] = { ...activityData, couple_id: couple.id, user_id: user.id, title: activityData.title || 'Untitled', image_url: imageUrl };
            const { data: newActivity, error } = await supabase
                .from('activities')
                .insert(insertData)
                .select()
                .single();
                
            if (error) { toast.error(error.message); } 
            else if (newActivity) {
                setAllActivities(prev => [...prev, newActivity].sort((a,b) => (a.date && b.date) ? new Date(a.date).getTime() - new Date(b.date).getTime() : 0));
                setActiveTab(newActivity.date ? 'upcoming' : 'ideaBin');
                toast.success("Activity added!");
            }
        }
    };
    
    const handleSelectAIIdea = (idea: Idea) => {
        setInspireModalOpen(false);
        setAddEditModal({ isOpen: true, activity: { title: idea.title, description: idea.description, category: idea.category } });
    };

    const handleCompleteClick = (id: string) => setCompleteModal({ isOpen: true, activityId: id });
    const handleCompleteConfirm = async (feeling: string) => {
        if (completeModal.activityId) {
             const { data, error } = await supabase
                .from('activities')
                .update({ completed: true, feeling })
                .eq('id', completeModal.activityId)
                .select()
                .single();
            
            if(error) { toast.error(error.message); }
            else if (data) {
                setAllActivities(allActivities.map(act => act.id === data.id ? data : act));
                toast.success("Activity marked as complete!");
            }
        }
        setCompleteModal({ isOpen: false, activityId: null });
    };
    
    const handleDeleteRequest = (id: string) => setDeleteModal({ isOpen: true, id });
    const handleDeleteConfirm = async () => {
        if(deleteModal.id) {
            const { error } = await supabase.from('activities').delete().eq('id', deleteModal.id);
            if(error) { toast.error(error.message); }
            else {
                setAllActivities(allActivities.filter(a => a.id !== deleteModal.id));
                toast.success("Activity deleted.");
            }
        }
        setDeleteModal({ isOpen: false, id: null });
    };
    
    const handleEditClick = (activity: Activity) => setAddEditModal({ isOpen: true, activity });

    const upcomingActivities = allActivities.filter(a => !a.completed && a.date).sort((a,b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
    const completedActivities = allActivities.filter(a => a.completed && a.date).sort((a,b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
    const ideaBin = allActivities.filter(a => !a.date);

    const renderContent = () => {
        if (loading) return <div className="text-center py-16 text-gray-500">Loading activities...</div>;

        let items, emptyText;
        switch (activeTab) {
            case 'upcoming': items = upcomingActivities; emptyText = "No upcoming activities. Plan something fun!"; break;
            case 'completed': items = completedActivities; emptyText = "You haven't completed any activities yet."; break;
            case 'ideaBin': items = ideaBin; emptyText = "Your idea bin is empty. Need some inspiration?"; break;
            default: items = []; emptyText = "";
        }

        if (items.length === 0) return <div className="text-center py-16"><p className="text-gray-500">{emptyText}</p></div>;

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map(act => (
                    <ActivityCard key={act.id} activity={act} onViewDetails={activity => setDetailsModal({ isOpen: true, activity })} onComplete={handleCompleteClick} onEdit={handleEditClick} onDelete={handleDeleteRequest} />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <AddEditActivityModal isOpen={addEditModal.isOpen} onClose={() => setAddEditModal({ isOpen: false })} onSave={handleSaveActivity} activityToEdit={addEditModal.activity} />
            <ActivityDetailsModal isOpen={detailsModal.isOpen} onClose={() => setDetailsModal({ isOpen: false, activity: null })} activity={detailsModal.activity} onEdit={handleEditClick} onDelete={handleDeleteRequest} />
            <CompleteActivityModal isOpen={completeModal.isOpen} onClose={() => setCompleteModal({ isOpen: false, activityId: null })} onComplete={handleCompleteConfirm} />
            <InspireMeModal isOpen={inspireModalOpen} onClose={() => setInspireModalOpen(false)} onSelectIdea={handleSelectAIIdea} />
            <ConfirmationModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, id: null })} onConfirm={handleDeleteConfirm} title="Delete Activity" message="Are you sure you want to delete this activity? This action is permanent." confirmText="Delete"/>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">🎯 Activity Planner</h1>
                    <p className="mt-1 text-gray-400">Plan, track, and get inspired for your next adventure.</p>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                     <button onClick={() => setInspireModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-yellow-400 text-sm font-medium rounded-md shadow-sm text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20">
                         <LightBulbIcon className="h-5 w-5 mr-2"/> Inspire Me
                    </button>
                    <button onClick={() => setAddEditModal({ isOpen: true, activity: null })} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md shadow-sm text-black bg-green hover:bg-opacity-90">
                        <PlusIcon className="h-5 w-5 mr-2" /> Add Activity
                    </button>
                </div>
            </div>

            <div className="w-full max-w-md mx-auto">
                <div className="bg-black/50 p-1 rounded-full flex items-center space-x-1 border border-white/10">
                    <TabButton active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')}>
                        Upcoming <Badge count={upcomingActivities.length} />
                    </TabButton>
                    <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
                        Completed <Badge count={completedActivities.length} />
                    </TabButton>
                    <TabButton active={activeTab === 'ideaBin'} onClick={() => setActiveTab('ideaBin')}>
                        Idea Bin <Badge count={ideaBin.length} />
                    </TabButton>
                </div>
            </div>
            
            <div>{renderContent()}</div>
        </div>
    );
};

export default ActivityPlannerPage;
