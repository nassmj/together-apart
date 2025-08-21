import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { PlusIcon, PhotoIcon, CalendarDaysIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { useToast } from '../../components/ToastProvider';
import { DropdownMenu, DropdownMenuItem } from '../../components/DropdownMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { usePartner } from '../../contexts/PartnerContext';
import type { Database } from '../../lib/supabaseClient';

// Define the Memory type from the database schema
type Memory = Database['public']['Tables']['memories']['Row'];
type MemoryFormData = Pick<Memory, 'title' | 'date' | 'description'> & { image_url?: string | null };

const MemoryModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (memory: MemoryFormData, id?: string, imageFile?: File | null) => void;
    memoryToEdit?: Memory | null;
}> = ({ isOpen, onClose, onSave, memoryToEdit }) => {
    const today = new Date().toISOString().split('T')[0];
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(today);
    const [description, setDescription] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen && memoryToEdit) {
            setTitle(memoryToEdit.title);
            setDate(memoryToEdit.date);
            setDescription(memoryToEdit.description || '');
            setImagePreview(memoryToEdit.image_url || null);
            setImageFile(null);
        } else {
            resetForm();
        }
    }, [isOpen, memoryToEdit]);
    
    const resetForm = () => {
        setTitle('');
        setDate(today);
        setDescription('');
        setImagePreview(null);
        setImageFile(null);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setImageFile(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!title || !date) return;
        onSave({ title, date, description, image_url: imagePreview }, memoryToEdit?.id, imageFile);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex justify-center items-center p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white dark:bg-[#2f2828] rounded-xl shadow-xl max-w-lg w-full border border-gray-200 dark:border-white/10"
            >
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-white/10">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{memoryToEdit ? 'Edit Memory' : 'Add a New Memory'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white shadow-sm focus:border-pink focus:ring-pink" />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} max={today} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white shadow-sm focus:border-pink focus:ring-pink" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white shadow-sm focus:border-pink focus:ring-pink" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
                             <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300/50 dark:border-gray-600/50 px-6 py-10 bg-gray-100/50 dark:bg-black/20">
                                {imagePreview ? (
                                    <div className="relative w-full h-48">
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-md" />
                                        <button type="button" onClick={removeImage} className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-black">
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-500 dark:text-gray-400">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-pink hover:text-pink/80">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-black/50 rounded-b-xl px-4 py-3 sm:px-6 flex justify-end gap-x-3">
                        <button type="button" onClick={onClose} className="rounded-md bg-white dark:bg-white/10 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/20 hover:bg-gray-50 dark:hover:bg-white/20">Cancel</button>
                        <button type="submit" className="inline-flex justify-center rounded-md bg-green px-3 py-2 text-sm font-bold text-black shadow-sm hover:bg-opacity-90 disabled:bg-green/50">Save Memory</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const TimelineItem: React.FC<{ memory: Memory; side: 'left' | 'right'; onEdit: (memory: Memory) => void; onDelete: (id: string) => void; }> = ({ memory, side, onEdit, onDelete }) => {
    return (
        <div className="mb-8 flex justify-between items-center w-full" style={{ flexDirection: side === 'left' ? 'row' : 'row-reverse' }}>
            <div className="order-1 w-5/12"></div>
            <div className="z-20 flex items-center order-1 bg-green shadow-xl w-8 h-8 rounded-full">
                <CalendarDaysIcon className="h-4 w-4 mx-auto text-black" />
            </div>
            <motion.div 
                className="order-1 bg-white dark:bg-white/5 rounded-lg shadow-xl w-5/12 px-6 py-4 border border-gray-200 dark:border-white/10"
                initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="absolute top-2 right-2">
                    <DropdownMenu>
                        <DropdownMenuItem onClick={() => onEdit(memory)}>
                            <PencilIcon className="mr-3 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(memory.id)} className="text-pink">
                             <TrashIcon className="mr-3 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenu>
                </div>
                {memory.image_url && <img src={memory.image_url} alt={memory.title} className="w-full h-40 object-cover rounded-md mb-4" />}
                <h3 className="mb-3 font-bold text-gray-900 dark:text-white text-xl">{memory.title}</h3>
                <p className="text-sm leading-snug tracking-wide text-gray-600 dark:text-gray-400 text-opacity-100">{memory.description}</p>
                <time className="text-xs text-green mt-4 block">{new Date(memory.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </motion.div>
        </div>
    );
};

const MemoryTimelinePage: React.FC = () => {
    const { user } = useAuth();
    const { couple } = usePartner();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [memoryToEdit, setMemoryToEdit] = useState<Memory | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    const toast = useToast();

    useEffect(() => {
        const fetchMemories = async () => {
            if (!couple) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('memories')
                .select('*')
                .eq('couple_id', couple.id)
                .order('date', { ascending: false });
            
            if (error) {
                toast.error(error.message);
            } else {
                setMemories(data || []);
            }
            setLoading(false);
        };

        fetchMemories();
    }, [couple, toast]);


    const handleOpenModal = (memory?: Memory) => {
        setMemoryToEdit(memory || null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setMemoryToEdit(null);
    };

    const handleSaveMemory = async (memoryData: MemoryFormData, id?: string, imageFile?: File | null) => {
        if (!user || !couple) return;
        
        let imageUrl = memoryToEdit?.image_url || memoryData.image_url || null;

        if (imageFile) {
            const fileName = `${couple.id}/${Date.now()}_${imageFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('memory-images')
                .upload(fileName, imageFile, { upsert: !!id }); // upsert if editing

            if (uploadError) {
                toast.error(`Image upload failed: ${uploadError.message}`);
                return;
            }
            
            const { data: urlData } = supabase.storage.from('memory-images').getPublicUrl(uploadData.path);
            imageUrl = urlData.publicUrl;
        }

        if (id) { // Editing
            const dataToSave: Database['public']['Tables']['memories']['Update'] = {
                ...memoryData,
                image_url: imageUrl,
            };

            const { data, error } = await supabase
                .from('memories')
                .update(dataToSave)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                toast.error(error.message);
            } else if (data) {
                setMemories(memories.map(m => m.id === id ? data : m));
                toast.success("Memory updated!");
            }
        } else { // Adding
            const insertData: Database['public']['Tables']['memories']['Insert'] = { 
                ...memoryData, 
                image_url: imageUrl, 
                couple_id: couple.id, 
                user_id: user.id 
            };
            const { data, error } = await supabase
                .from('memories')
                .insert(insertData)
                .select()
                .single();
            
            if (error) {
                toast.error(error.message);
            } else if (data) {
                setMemories(prev => [data, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                toast.success("New memory added!");
            }
        }
        handleCloseModal();
    };

    const handleDeleteRequest = (id: string) => {
        setDeleteModal({ isOpen: true, id });
    };

    const handleDeleteConfirm = async () => {
        if (deleteModal.id) {
            const { error } = await supabase.from('memories').delete().eq('id', deleteModal.id);
            if(error) {
                toast.error(error.message);
            } else {
                setMemories(memories.filter(m => m.id !== deleteModal.id));
                toast.success("Memory deleted.");
            }
        }
        setDeleteModal({ isOpen: false, id: null });
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <AnimatePresence>
                {modalOpen && (
                    <MemoryModal
                        isOpen={modalOpen}
                        onClose={handleCloseModal}
                        onSave={handleSaveMemory}
                        memoryToEdit={memoryToEdit}
                    />
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDeleteConfirm}
                title="Delete Memory"
                message="Are you sure you want to delete this memory? This action cannot be undone."
                confirmText="Delete"
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">📅 Memory Timeline</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Your shared history, beautifully captured.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md shadow-sm text-black bg-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-green"
                >
                    <PlusIcon className="h-5 w-5 mr-2" /> Add Memory
                </button>
            </div>
            
            <div className="relative">
                <div className="border-r-2 border-gray-300 dark:border-gray-700 absolute h-full top-0 left-1/2 -ml-px"></div>
                {loading ? (
                     <div className="text-center py-16 text-gray-500">Loading memories...</div>
                ) : memories.length > 0 ? (
                    memories.map((memory, index) => (
                        <TimelineItem
                            key={memory.id}
                            memory={memory}
                            side={index % 2 === 0 ? 'left' : 'right'}
                            onEdit={() => handleOpenModal(memory)}
                            onDelete={handleDeleteRequest}
                        />
                    ))
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500 dark:text-gray-400">Your timeline is empty. Add your first memory!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemoryTimelinePage;
