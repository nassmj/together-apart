import React, { useState, Fragment, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, LinkIcon, FilmIcon, BookOpenIcon, MusicalNoteIcon, MapPinIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useToast } from '../../components/ToastProvider';
import { GoogleGenAI, Type } from "@google/genai";
import { supabase } from '../../lib/supabaseClient';
import { config } from '../../lib/config';
import { useAuth } from '../../contexts/AuthContext';
import { usePartner } from '../../contexts/PartnerContext';
import type { Database } from '../../lib/supabaseClient';

// --- TYPES ---
type Discovery = Database['public']['Tables']['discoveries']['Row'];
type DiscoveryCategory = Database['public']['Enums']['discovery_category'];

const categories: { name: DiscoveryCategory; icon: React.ElementType }[] = [
    { name: 'Music', icon: MusicalNoteIcon },
    { name: 'Movie', icon: FilmIcon },
    { name: 'Book', icon: BookOpenIcon },
    { name: 'Place', icon: MapPinIcon },
    { name: 'Link', icon: LinkIcon },
];

// --- UI COMPONENTS ---
const DiscoveryCard: React.FC<{ discovery: Discovery }> = ({ discovery }) => {
    const { user } = useAuth();
    const { partner } = usePartner();

    const isSentByYou = discovery.sender_id === user?.id;

    const partnerAvatar = partner?.full_name?.[0].toUpperCase() || 'P';
    const userAvatar = user?.user_metadata?.full_name?.[0].toUpperCase() || 'Y';
    const CategoryIcon = categories.find(c => c.name === discovery.category)?.icon || LinkIcon;

    const renderCardDetails = () => {
        switch (discovery.category) {
            case 'Music': return <><h3 className="font-bold text-white text-xl">{discovery.title}</h3><p className="text-sm text-gray-300">{discovery.artist}</p></>;
            case 'Movie': return <><h3 className="font-bold text-white text-xl">{discovery.title}</h3><p className="text-sm text-gray-300">{discovery.director}{discovery.year && `, ${discovery.year}`}</p></>;
            case 'Book': return <><h3 className="font-bold text-white text-xl">{discovery.title}</h3><p className="text-sm text-gray-300">{discovery.author}</p></>;
            case 'Place': return <><h3 className="font-bold text-white text-xl">{discovery.name}</h3><p className="text-sm text-gray-300">{discovery.address}</p></>;
            case 'Link': return <h3 className="font-bold text-white text-xl">{discovery.title}</h3>;
        }
    };

    const cardContent = (
      <div className="group w-full max-w-xs rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out bg-[#312B33]">
        <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
                <CategoryIcon className="h-5 w-5 text-pink" />
                <span className="text-sm font-bold uppercase tracking-wider text-pink">{discovery.category}</span>
            </div>
            {renderCardDetails()}
        </div>
        
        {discovery.note && (
          <>
            <div className="mx-4 border-t border-white/10"></div>
            <div className="p-4">
                <div className="bg-black p-3 rounded-lg">
                    <p className="text-base text-gray-200 italic">"{discovery.note}"</p>
                </div>
            </div>
          </>
        )}
      </div>
    );

    return (
        <motion.div layout initial={{ opacity: 0, y: 50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }} className={`flex items-end gap-3 ${isSentByYou ? 'justify-end' : ''}`}>
            {!isSentByYou && <div className="flex-shrink-0 h-10 w-10 mb-4 rounded-full bg-pink/20 flex items-center justify-center ring-2 ring-pink/30"><span className="font-bold text-pink text-sm">{partnerAvatar}</span></div>}
            
            <div className="transform hover:-translate-y-1 transition-transform">
                {discovery.url ? (
                    <a href={discovery.url} target="_blank" rel="noopener noreferrer" className="block">
                        {cardContent}
                    </a>
                ) : (
                    <div>{cardContent}</div>
                )}
            </div>

            {isSentByYou && <div className="flex-shrink-0 h-10 w-10 mb-4 rounded-full bg-green/20 flex items-center justify-center ring-2 ring-green/30"><span className="font-bold text-green text-sm">{userAvatar}</span></div>}
        </motion.div>
    );
};

const SendDiscoveryForm: React.FC<{ onSend: (discovery: Database['public']['Tables']['discoveries']['Insert']) => void }> = ({ onSend }) => {
    const { user } = useAuth();
    const { couple } = usePartner();
    const [category, setCategory] = useState<DiscoveryCategory>('Music');
    const [details, setDetails] = useState<Partial<Discovery>>({});
    const [note, setNote] = useState('');
    const [link, setLink] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const toast = useToast();
    
    const inputClasses = "block w-full rounded-lg border-0 py-3 px-4 bg-black/50 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink focus:ring-offset-black";

    useEffect(() => {
        setDetails({});
        setLink('');
    }, [category]);
    
    const handleAnalyzeLink = async () => {
        if (!link.trim()) {
            toast.error("Please enter a URL to analyze.");
            return;
        }
        if (!config.gemini.apiKey) {
            toast.error("AI features are currently unavailable.");
            return;
        }

        setIsAnalyzing(true);
        try {
            const ai = new GoogleGenAI({ apiKey: config.gemini.apiKey });
            const discoverySchema = {
                type: Type.OBJECT,
                properties: {
                    category: { 
                        type: Type.STRING,
                        enum: ['Music', 'Movie', 'Book', 'Place', 'Link'],
                        description: 'The category of the content. Must be one of the enum values.'
                    },
                    title: { type: Type.STRING, description: "Title of the item (for Music, Movie, Book, Link)." },
                    image_url: { type: Type.STRING, description: "URL of a relevant image." },
                    artist: { type: Type.STRING, description: "Artist of the music (if category is Music)." },
                    director: { type: Type.STRING, description: "Director of the movie (if category is Movie)." },
                    year: { type: Type.INTEGER, description: "Year the movie was released (if category is Movie)." },
                    author: { type: Type.STRING, description: "Author of the book (if category is Book)." },
                    name: { type: Type.STRING, description: "Name of the place (if category is Place)." },
                    address: { type: Type.STRING, description: "Address of the place (if category is Place)." },
                },
                required: ["category"]
            };
            const prompt = `Analyze the content of this URL: ${link}. Based on the content, identify its category and extract relevant details. Return a single JSON object that conforms to the provided schema. Only include fields relevant to the detected category. For example, for a song, include 'artist' but not 'director' or 'author'. For a place, use the 'name' field instead of 'title'.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { 
                    responseMimeType: "application/json",
                    responseSchema: discoverySchema
                }
            });

            const parsed = JSON.parse(response.text);
            
            const detectedCategory = categories.find(c => c.name.toLowerCase() === (parsed.category || '').toLowerCase())?.name;
            if (detectedCategory) {
                setCategory(detectedCategory);
                setDetails({ ...parsed, url: link });
                toast.success(`Analyzed link: ${parsed.title || parsed.name}`);
            } else {
                setCategory('Link');
                setDetails({ title: parsed.title || link, image_url: parsed.image_url, url: link } as any);
                toast.success(`Analyzed link: ${parsed.title || 'Link'}`);
            }

        } catch (e) {
            toast.error("Could not analyze the link. Please enter details manually.");
            console.error("Gemini API Error:", e);
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const title = details.title || details.name;
        if (!user || !couple) {
            toast.error("Could not send discovery. User or couple not found.");
            return;
        }
        if (!title?.trim() || !note.trim()) {
            toast.error("Please fill in the details and a note.");
            return;
        }
        const discoveryData: Database['public']['Tables']['discoveries']['Insert'] = {
            category,
            ...details,
            note,
            url: link || details.url,
            couple_id: couple.id,
            sender_id: user.id
        };

        onSend(discoveryData);
        setDetails({});
        setNote('');
        setLink('');
        toast.success("Discovery sent!");
    };
    
    const renderFields = () => {
        switch(category) {
            case 'Music': return <>
                <input name="title" value={details.title || ''} onChange={handleDetailChange} placeholder="Song/Album Title" className={inputClasses}/>
                <input name="artist" value={details.artist || ''} onChange={handleDetailChange} placeholder="Artist" className={inputClasses}/>
            </>
            case 'Movie': return <>
                <input name="title" value={details.title || ''} onChange={handleDetailChange} placeholder="Movie Title" className={inputClasses}/>
                <input name="director" value={details.director || ''} onChange={handleDetailChange} placeholder="Director" className={inputClasses}/>
            </>
            case 'Book': return <>
                <input name="title" value={details.title || ''} onChange={handleDetailChange} placeholder="Book Title" className={inputClasses}/>
                <input name="author" value={details.author || ''} onChange={handleDetailChange} placeholder="Author" className={inputClasses}/>
            </>
            case 'Place': return <>
                <input name="name" value={details.name || ''} onChange={handleDetailChange} placeholder="Place Name" className={inputClasses}/>
                <input name="address" value={details.address || ''} onChange={handleDetailChange} placeholder="Address" className={inputClasses}/>
            </>
            case 'Link': return <input name="title" value={details.title || ''} onChange={handleDetailChange} placeholder="Link Title" className={inputClasses}/>
        }
    }

    return (
        <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Share Something New</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="flex gap-2">
                    <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="Paste a link to analyze with AI..." className={`${inputClasses} flex-grow`} />
                    <button type="button" onClick={handleAnalyzeLink} disabled={isAnalyzing} className="px-4 py-2 bg-pink text-black font-bold rounded-lg hover:bg-opacity-90 disabled:bg-gray-500 flex-shrink-0 flex items-center gap-2">
                        <SparklesIcon className="h-5 w-5"/> {isAnalyzing ? '...' : 'Analyze'}
                    </button>
                </div>
                
                <div>
                    <label className="text-sm font-medium text-gray-300">Category</label>
                    <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {categories.map(({name, icon: Icon}) => (
                            <button key={name} type="button" onClick={() => setCategory(name)} className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-lg text-sm font-semibold transition-colors border-2 ${category === name ? 'bg-pink border-pink text-black' : 'bg-black/40 border-transparent hover:bg-white/10'}`}>
                                <Icon className="h-5 w-5" /> <span>{name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderFields()}
                </div>

                <textarea name="note" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a personal note..." rows={3} className={inputClasses} required/>
                <div className="text-right">
                     <button type="submit" disabled={!note.trim() || !(details.title || details.name)?.trim()} className="inline-flex items-center justify-center gap-2 px-6 py-2 border border-transparent text-sm font-bold rounded-full shadow-sm text-black bg-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-green disabled:opacity-50 disabled:cursor-not-allowed">
                        <PaperAirplaneIcon className="h-5 w-5" /> Send
                    </button>
                </div>
            </form>
        </div>
    );
}

const DiscoveryExchangePage: React.FC = () => {
    const { user } = useAuth();
    const { couple } = usePartner();
    const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!couple) return;

        const fetchDiscoveries = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('discoveries')
                .select('*')
                .eq('couple_id', couple.id)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error("Error fetching discoveries:", error);
            } else {
                setDiscoveries(data || []);
            }
            setLoading(false);
        };
        
        fetchDiscoveries();

        const subscription = supabase.channel('public:discoveries')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'discoveries', filter: `couple_id=eq.${couple.id}` }, 
          payload => {
            setDiscoveries(current => [payload.new as Discovery, ...current]);
          })
          .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        }

    }, [couple]);

    const handleSend = async (discoveryData: Database['public']['Tables']['discoveries']['Insert']) => {
        const { error } = await supabase.from('discoveries').insert(discoveryData);
        if (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">🎵 Discovery Exchange</h1>
                <p className="mt-1 text-gray-400">A shared space to exchange music, movies, books, and places that move you.</p>
            </div>
            
            <SendDiscoveryForm onSend={handleSend} />

            <div className="space-y-8">
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading discoveries...</div>
                ) : discoveries.length === 0 ? (
                  <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/20">
                      <SparklesIcon className="mx-auto h-12 w-12 text-pink/50" />
                      <h3 className="mt-4 text-xl font-semibold text-white">Your Exchange is Empty</h3>
                      <p className="mt-2 text-gray-400">Share something you love to get the conversation started.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                      {discoveries.map((discovery) => (
                          <DiscoveryCard key={discovery.id} discovery={discovery} />
                      ))}
                  </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default DiscoveryExchangePage;
