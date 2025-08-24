import React, { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, FireIcon, CheckIcon as CheckSolidIcon, StarIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import { useToast } from '../../components/ToastProvider';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { DropdownMenu, DropdownMenuItem } from '../../components/DropdownMenu';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { usePartner } from '../../contexts/PartnerContext';
import type { Database } from '../../lib/supabaseClient';

// --- TYPES ---
type Quest = Database['public']['Tables']['quests']['Row'];
type QuestStatus = Database['public']['Enums']['quest_status'];
type QuestType = Database['public']['Enums']['quest_type'];
type QuestFrequency = Database['public']['Enums']['quest_frequency'];


// --- HELPER FUNCTIONS ---
const getYYYYMMDD = (date: Date): string => date.toISOString().split('T')[0];
const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
};


// --- MODAL COMPONENTS ---
const AddEditQuestModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (questData: Partial<Quest>, id?: string) => void;
    questToEdit?: Quest | null;
}> = ({ isOpen, onClose, onSave, questToEdit }) => {
    const [questData, setQuestData] = useState<Partial<Quest>>({});

    useEffect(() => {
        if (isOpen) {
            setQuestData(questToEdit || { type: 'challenge', status: 'available' });
        } else {
            setQuestData({});
        }
    }, [isOpen, questToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setQuestData(prev => ({ ...prev, [name]: name === 'weekly_goal' ? (parseInt(value, 10) || 1) : value }));
    };

    const handleTypeChange = (newType: QuestType) => {
        if (newType === questData.type) return;
        const baseData: Partial<Quest> = { title: questData.title, description: questData.description, category: questData.category, status: questData.status };
        if (newType === 'challenge') {
            setQuestData({ ...baseData, type: 'challenge' });
        } else {
            setQuestData({ ...baseData, type: 'routine', frequency: 'daily' });
        }
    };
    
    const handleFrequencyChange = (newFreq: QuestFrequency) => {
        setQuestData(prev => {
            if (prev.type === 'routine') {
                return { ...prev, frequency: newFreq };
            }
            return prev;
        });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!questData.title?.trim() || !questData.category?.trim()) return;
        onSave(questData, questToEdit?.id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex justify-center items-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#2f2828] rounded-xl shadow-xl max-w-lg w-full border border-white/10">
                <div className="flex justify-between items-center p-5 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white">{questToEdit ? 'Edit Quest' : 'Add a New Quest'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-white/10"><XMarkIcon className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {/* Type Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Quest Type</label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-black/50 rounded-lg border border-white/10">
                                <button type="button" onClick={() => handleTypeChange('challenge')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${questData.type === 'challenge' ? 'bg-green text-black' : 'text-gray-400 hover:bg-white/10'}`}>Challenge</button>
                                <button type="button" onClick={() => handleTypeChange('routine')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${questData.type === 'routine' ? 'bg-green text-black' : 'text-gray-400 hover:bg-white/10'}`}>Routine</button>
                            </div>
                        </div>

                        {/* Common Fields */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                            <input type="text" name="title" value={questData.title || ''} onChange={handleChange} required placeholder="e.g., Read a Chapter Together" className="mt-1 block w-full rounded-md border-gray-600 bg-black/50 text-white shadow-sm focus:border-pink focus:ring-pink" />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                            <input type="text" name="category" value={questData.category || ''} onChange={handleChange} required placeholder="e.g., Learning" className="mt-1 block w-full rounded-md border-gray-600 bg-black/50 text-white shadow-sm focus:border-pink focus:ring-pink" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                            <textarea name="description" value={questData.description || ''} onChange={handleChange} rows={3} placeholder="A short description of the quest" className="mt-1 block w-full rounded-md border-gray-600 bg-black/50 text-white shadow-sm focus:border-pink focus:ring-pink" />
                        </div>
                        
                        <div className="border-t border-white/10 my-4"></div>

                        {/* Conditional Fields */}
                        <AnimatePresence>
                        {questData.type === 'challenge' && (
                            <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} className="space-y-4 overflow-hidden">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-300">Start Date</label>
                                        <input type="date" name="start_date" value={questData.start_date || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-600 bg-black/50 text-white shadow-sm focus:border-pink focus:ring-pink" />
                                    </div>
                                    <div>
                                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-300">End Date</label>
                                        <input type="date" name="end_date" value={questData.end_date || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-600 bg-black/50 text-white shadow-sm focus:border-pink focus:ring-pink" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="restrictions" className="block text-sm font-medium text-gray-300">Restrictions / Rules</label>
                                    <textarea name="restrictions" value={questData.restrictions || ''} onChange={handleChange} rows={2} placeholder="e.g., Must complete before midnight" className="mt-1 block w-full rounded-md border-gray-600 bg-black/50 text-white shadow-sm focus:border-pink focus:ring-pink" />
                                </div>
                            </motion.div>
                        )}

                        {questData.type === 'routine' && (
                            <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} className="space-y-4 overflow-hidden">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
                                    <div className="grid grid-cols-2 gap-2 p-1 bg-black/50 rounded-lg border border-white/10">
                                        <button type="button" onClick={() => handleFrequencyChange('daily')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${questData.frequency === 'daily' ? 'bg-green/80 text-black' : 'text-gray-400 hover:bg-white/10'}`}>Daily</button>
                                        <button type="button" onClick={() => handleFrequencyChange('weekly')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${questData.frequency === 'weekly' ? 'bg-green/80 text-black' : 'text-gray-400 hover:bg-white/10'}`}>Weekly</button>
                                    </div>
                                </div>
                                {questData.frequency === 'weekly' && (
                                     <motion.div initial={{opacity: 0}} animate={{opacity: 1}} >
                                        <label htmlFor="weekly_goal" className="block text-sm font-medium text-gray-300">Times Per Week</label>
                                        <input type="number" name="weekly_goal" value={questData.weekly_goal || 1} onChange={handleChange} min="1" max="7" className="mt-1 block w-full rounded-md border-gray-600 bg-black/50 text-white shadow-sm focus:border-pink focus:ring-pink" />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                        </AnimatePresence>

                    </div>
                    <div className="bg-black/50 px-4 py-3 sm:px-6 flex justify-end gap-x-3 rounded-b-xl">
                        <button type="button" onClick={onClose} className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20">Cancel</button>
                        <button type="submit" className="inline-flex justify-center rounded-md bg-green px-3 py-2 text-sm font-bold text-black shadow-sm hover:bg-opacity-90">Save Quest</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// --- UI COMPONENTS ---
const CircularProgress: React.FC<{ progress: number; total: number; size?: number; strokeWidth?: number }> = ({ progress, total, size = 64, strokeWidth = 5 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = total > 0 ? circumference - (progress / total) * circumference : circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} fill="transparent" />
                <motion.circle 
                    cx={size/2} 
                    cy={size/2} 
                    r={radius} 
                    stroke="#CBD861" 
                    strokeWidth={strokeWidth} 
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-bold text-white">{progress}<span className="text-xs text-gray-400">/{total}</span></span>
            </div>
        </div>
    );
};


const QuestCard: React.FC<{
    quest: Quest;
    onEdit: (quest: Quest) => void;
    onDelete: (id: string) => void;
    onChangeStatus: (id: string, status: QuestStatus) => void;
    onRoutineCheckIn: (id: string) => void;
}> = ({ quest, onEdit, onDelete, onChangeStatus, onRoutineCheckIn }) => {
    
    const isCompletedToday = quest.type === 'routine' && quest.last_completed_date === getYYYYMMDD(new Date());
    const isWeeklyGoalMet = quest.type === 'routine' && quest.frequency === 'weekly' && quest.completed_this_week && quest.completed_this_week.length >= (quest.weekly_goal || 1);

    const cardClasses = {
        base: 'p-5 rounded-2xl transition-all duration-300 flex items-center gap-5 border',
        inProgress: 'bg-white/[.07] ring-2 ring-green/50 shadow-lg shadow-green/10 border-white/20',
        available: 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20',
        completed: 'bg-white/5 border-white/10 opacity-60 hover:opacity-100',
    };
    
    let currentClass = cardClasses.available;
    if (quest.status === 'in-progress') currentClass = cardClasses.inProgress;
    if (quest.status === 'completed') currentClass = cardClasses.completed;

    const ActionButton = () => {
        if (quest.status === 'available') {
            return <button onClick={() => onChangeStatus(quest.id, 'in-progress')} className="bg-green text-black font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap">Start</button>;
        }
        if (quest.status === 'in-progress') {
            if (quest.type === 'challenge') {
                return <button onClick={() => onChangeStatus(quest.id, 'completed')} className="bg-green text-black font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap">Complete</button>;
            }
            if (quest.type === 'routine') {
                return (
                    <button onClick={() => onRoutineCheckIn(quest.id)} disabled={isCompletedToday || isWeeklyGoalMet} className="bg-green text-black font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed whitespace-nowrap">
                        {isCompletedToday ? 'Done Today' : (isWeeklyGoalMet ? 'Goal Met' : 'Check-in')}
                    </button>
                );
            }
        }
        return null;
    };

    const StatusIndicator = () => {
         if (quest.status === 'completed') {
            return (
                <div className="w-16 h-16 flex items-center justify-center bg-green/20 rounded-full flex-shrink-0">
                    <CheckSolidIcon className="w-8 h-8 text-green" />
                </div>
            );
         }
         if (quest.type === 'routine' && quest.status === 'in-progress') {
            if (quest.frequency === 'daily') {
                return (
                     <div className="text-center flex-shrink-0">
                         <div className="w-16 h-16 relative flex items-center justify-center bg-white/5 border border-white/10 rounded-full">
                            <FireIcon className={`h-7 w-7 absolute transition-colors ${quest.streak > 0 ? 'text-orange-400' : 'text-orange-400/20'}`}/>
                            <span className="text-2xl font-bold text-white relative">{quest.streak || 0}</span>
                         </div>
                         <p className="text-xs font-bold text-gray-400 mt-1 tracking-wider">DAY STREAK</p>
                     </div>
                );
            }
            if (quest.frequency === 'weekly') {
                return (
                    <div className="text-center flex-shrink-0">
                        <CircularProgress progress={quest.completed_this_week?.length || 0} total={quest.weekly_goal || 1} />
                        <p className="text-xs font-bold text-gray-400 mt-1 tracking-wider">THIS WEEK</p>
                    </div>
                );
            }
         }
        return quest.type === 'challenge' && quest.end_date ? (
            <div className="text-center flex-shrink-0 w-16">
                 <CalendarDaysIcon className="h-8 w-8 text-pink/80 mx-auto"/>
                 <p className="text-xs font-bold text-gray-400 mt-1 tracking-wider">CHALLENGE</p>
            </div>
        ) : <div className="w-16 h-16 flex-shrink-0" />;
    };

    const getDaysLeft = () => {
        if (quest.type !== 'challenge' || !quest.end_date) return null;
        const diff = new Date(quest.end_date).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24));
        if (days < 0) return 'Ended';
        if (days === 0) return 'Ends today';
        return `${days} day${days > 1 ? 's' : ''} left`;
    }

    return (
        <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`${cardClasses.base} ${currentClass}`}>
            <StatusIndicator />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                    <p className="text-xs font-semibold text-pink uppercase tracking-wider">{quest.category} - {quest.type}</p>
                    {quest.type === 'challenge' && quest.status === 'in-progress' && quest.end_date && (
                        <p className="text-xs font-medium text-gray-400">{getDaysLeft()}</p>
                    )}
                </div>
                <h3 className="text-lg font-bold text-white mt-1 truncate">{quest.title}</h3>
                <p className="text-sm text-gray-400 truncate">{quest.description}</p>
            </div>
            <div className="flex items-center gap-4">
                <ActionButton />
                <div className="flex-shrink-0">
                    <DropdownMenu>
                        <DropdownMenuItem onClick={() => onEdit(quest)}><PencilIcon className="h-4 w-4 mr-3" />Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(quest.id)} className="text-pink"><TrashIcon className="h-4 w-4 mr-3" />Delete</DropdownMenuItem>
                    </DropdownMenu>
                </div>
            </div>
        </motion.div>
    );
};

// --- MAIN PAGE COMPONENT ---
const GrowthHubPage: React.FC = () => {
    const { user } = useAuth();
    const { couple } = usePartner();
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(true);
    const [addEditModal, setAddEditModal] = useState<{ isOpen: boolean, quest?: Quest | null }>({ isOpen: false });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });
    const toast = useToast();

    useEffect(() => {
        const fetchQuests = async () => {
            if (!couple) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('quests')
                .select('*')
                .eq('couple_id', couple.id);

            if (error) {
                toast.error(error.message);
            } else {
                setQuests(data || []);
            }
            setLoading(false);
        };
        fetchQuests();
    }, [couple, toast]);

    const handleSaveQuest = async (questData: Partial<Quest>, id?: string) => {
        if (!user || !couple) return;

        if (id) { // Editing
            const { id: questId, created_at, couple_id, user_id, ...dataToSave } = questData;
            const updatePayload: Database['public']['Tables']['quests']['Update'] = dataToSave;
            
            const { data: updatedData, error } = await supabase
                .from('quests')
                .update(updatePayload)
                .eq('id', id)
                .select()
                .single();

            if (error) { toast.error(error.message); }
            else if (updatedData) {
                setQuests(quests.map(q => q.id === id ? updatedData : q));
                toast.success("Quest updated!");
            }
        } else { // Adding
            const insertData: Database['public']['Tables']['quests']['Insert'] = { 
                ...questData,
                couple_id: couple.id, 
                user_id: user.id,
                title: questData.title || 'Untitled Quest',
                category: questData.category || 'General',
                type: questData.type || 'challenge'
            };
            const { data: newQuest, error } = await supabase
                .from('quests')
                .insert(insertData)
                .select()
                .single();
            
            if (error) { toast.error(error.message); }
            else if (newQuest) {
                setQuests(prev => [newQuest, ...prev]);
                toast.success("New quest added!");
            }
        }
    };
    
    const handleDeleteRequest = (id: string) => setDeleteModal({ isOpen: true, id });
    const handleDeleteConfirm = async () => {
        if (deleteModal.id) {
            const { error } = await supabase.from('quests').delete().eq('id', deleteModal.id);
            if (error) { toast.error(error.message); }
            else {
                setQuests(quests.filter(q => q.id !== deleteModal.id));
                toast.success("Quest deleted.");
            }
        }
        setDeleteModal({ isOpen: false, id: null });
    };

    const handleChangeStatus = async (id: string, status: QuestStatus) => {
        const { data, error } = await supabase
            .from('quests')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) { toast.error(error.message); }
        else if(data) {
            setQuests(quests.map(q => q.id === id ? data : q));
            if(status === 'in-progress') toast.info("Quest started! Let's go!");
            if(status === 'completed') toast.success("Quest complete! Well done!");
        }
    };
    
    const handleRoutineCheckIn = async (id: string) => {
        const quest = quests.find(q => q.id === id);
        if (!quest || quest.type !== 'routine') return;

        const today = new Date();
        const todayStr = getYYYYMMDD(today);
        if (quest.last_completed_date === todayStr) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getYYYYMMDD(yesterday);
        
        let newStreak = (quest.streak || 0);
        if (quest.frequency === 'daily') {
            newStreak = quest.last_completed_date === yesterdayStr ? newStreak + 1 : 1;
        }

        // Handle weekly progress
        let newCompletedThisWeek = [...(quest.completed_this_week || [])];
        const lastCompletionDate = quest.last_completed_date ? new Date(quest.last_completed_date) : null;
        const isNewWeek = !lastCompletionDate || getStartOfWeek(today).getTime() > getStartOfWeek(lastCompletionDate).getTime();
        
        if (isNewWeek) {
            newCompletedThisWeek = [todayStr];
        } else if (!newCompletedThisWeek.includes(todayStr)) {
            newCompletedThisWeek.push(todayStr);
        }
        
        const updatePayload: Database['public']['Tables']['quests']['Update'] = { 
            streak: newStreak, 
            last_completed_date: todayStr, 
            completed_this_week: newCompletedThisWeek 
        };

        const { data, error } = await supabase
            .from('quests')
            .update(updatePayload)
            .eq('id', id)
            .select()
            .single();

        if (error) { toast.error(error.message); }
        else if (data) {
            setQuests(quests.map(q => q.id === id ? data : q));
            toast.success(`Progress saved! Keep it up!`);
        }
    };

    const inProgressQuests = quests.filter(q => q.status === 'in-progress');
    const availableQuests = quests.filter(q => q.status === 'available');
    const completedQuests = quests.filter(q => q.status === 'completed');

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <AnimatePresence>
                {addEditModal.isOpen && <AddEditQuestModal isOpen={addEditModal.isOpen} onClose={() => setAddEditModal({ isOpen: false })} onSave={handleSaveQuest} questToEdit={addEditModal.quest} />}
            </AnimatePresence>
            <ConfirmationModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, id: null })} onConfirm={handleDeleteConfirm} title="Delete Quest" message="Are you sure? This quest and its progress will be permanently removed." confirmText="Delete" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3"><StarIcon className="h-8 w-8 text-yellow-400"/>Growth Hub</h1>
                    <p className="mt-1 text-gray-400">Complete challenges and build routines to grow together.</p>
                </div>
                <button onClick={() => setAddEditModal({ isOpen: true, quest: null })} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md shadow-sm text-black bg-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-green">
                    <PlusIcon className="h-5 w-5 mr-2" /> Add Quest
                </button>
            </div>
            
             {loading ? <div className="text-center py-16 text-gray-500">Loading quests...</div> :
                <div className="space-y-12">
                    {inProgressQuests.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase text-gray-500 tracking-widest mb-4 px-2">In Progress</h2>
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {inProgressQuests.map(quest => <QuestCard key={quest.id} quest={quest} onEdit={(q) => setAddEditModal({isOpen: true, quest: q})} onDelete={handleDeleteRequest} onChangeStatus={handleChangeStatus} onRoutineCheckIn={handleRoutineCheckIn} />)}
                                </AnimatePresence>
                            </div>
                        </section>
                    )}
                    {availableQuests.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase text-gray-500 tracking-widest mb-4 px-2">Available Quests</h2>
                            <div className="space-y-4">
                                 <AnimatePresence>
                                    {availableQuests.map(quest => <QuestCard key={quest.id} quest={quest} onEdit={(q) => setAddEditModal({isOpen: true, quest: q})} onDelete={handleDeleteRequest} onChangeStatus={handleChangeStatus} onRoutineCheckIn={handleRoutineCheckIn} />)}
                                </AnimatePresence>
                            </div>
                        </section>
                    )}
                     {completedQuests.length > 0 && (
                         <section>
                            <h2 className="text-sm font-bold uppercase text-gray-500 tracking-widest mb-4 px-2">Completed</h2>
                            <div className="space-y-4">
                                 <AnimatePresence>
                                    {completedQuests.map(quest => <QuestCard key={quest.id} quest={quest} onEdit={(q) => setAddEditModal({isOpen: true, quest: q})} onDelete={handleDeleteRequest} onChangeStatus={handleChangeStatus} onRoutineCheckIn={handleRoutineCheckIn} />)}
                                </AnimatePresence>
                            </div>
                        </section>
                    )}
                    {quests.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-500">Your Growth Hub is empty. Add a quest to get started!</p>
                        </div>
                    )}
                </div>
            }
        </div>
    );
};

export default GrowthHubPage;
