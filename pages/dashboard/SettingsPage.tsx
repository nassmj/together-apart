import React, { useState, ChangeEvent, FormEvent, useRef, ReactNode, ReactElement, useEffect } from 'react';
import { UserCircleIcon, LockClosedIcon, TrashIcon, CameraIcon, PaintBrushIcon, BellIcon, SparklesIcon, QuestionMarkCircleIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '../../components/ToastProvider';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeProvider';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { OnboardingFlow } from '../../components/onboarding/OnboardingFlow';
import { NotificationPreferences } from '../../components/NotificationPreferences';
import { AccessibilitySettings } from '../../components/accessibility/AccessibilitySettings';

const panelVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const TabButton = ({ label, icon, isActive, onClick }: { label: string, icon: ReactElement, isActive: boolean, onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className={`group w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                ? 'bg-green text-black'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
        >
            {React.cloneElement(icon, Object.assign({}, icon.props, { className: `h-6 w-6 mr-3 transition-colors ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-white'}` }))}
            <span className="truncate">{label}</span>
        </button>
    );
};

const FormPanel: React.FC<{ title: string, description?: string, children: ReactNode, footer: ReactNode }> = ({ title, description, children, footer }) => (
    <div className="bg-white/5 shadow-lg rounded-lg border border-white/10">
        <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-medium leading-6 text-white">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="p-6 space-y-6">
                {children}
            </div>
            <div className="bg-black/20 px-6 py-3 rounded-b-lg flex justify-end">
                {footer}
            </div>
        </form>
    </div>
);

const ProfileSettings = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({ fullName: '', bio: '', avatarUrl: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setProfile({
                fullName: user.user_metadata.full_name || '',
                bio: user.user_metadata.bio || '',
                avatarUrl: user.user_metadata.avatar_url || '',
            });
        }
    }, [user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(p => ({ ...p, avatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.updateUser({
            data: {
                full_name: profile.fullName,
                bio: profile.bio,
                avatar_url: profile.avatarUrl
            }
        });
        setLoading(false);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Profile updated successfully! Refresh may be needed to see changes.");
        }
    };

    return (
        <motion.div variants={panelVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
            <FormPanel
                title="Profile Information"
                description="This information will be displayed to your partner."
                footer={
                    <button type="button" onClick={handleSave} disabled={loading} className="inline-flex justify-center rounded-md bg-green px-3 py-2 text-sm font-bold text-black shadow-sm hover:bg-opacity-90 disabled:opacity-50">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                }
            >
                <div>
                    <label className="block text-sm font-medium text-gray-300">Photo</label>
                    <div className="mt-2 flex items-center space-x-5">
                        <span className="inline-block h-16 w-16 overflow-hidden rounded-full bg-gray-700">
                            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Profile preview" className="h-full w-full object-cover"/> : <UserCircleIcon className="h-full w-full text-gray-500" />}
                        </span>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20"
                        >
                            <CameraIcon className="inline h-4 w-4 mr-2" /> Change
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Full Name</label>
                    <input type="text" name="fullName" id="fullName" value={profile.fullName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-600 bg-black/50 text-white shadow-sm focus:border-pink focus:ring-pink" />
                </div>
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Bio</label>
                    <textarea name="bio" id="bio" rows={3} value={profile.bio} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-600 bg-black/50 text-white shadow-sm focus:border-pink focus:ring-pink" />
                    <p className="mt-2 text-xs text-gray-500">A brief description about yourself.</p>
                </div>
            </FormPanel>
        </motion.div>
    );
};

const AccountSettings = () => {
    const toast = useToast();
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handlePasswordUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        if (passwords.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
        setLoading(false);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Password updated successfully!");
            setPasswords({ newPassword: '', confirmPassword: '' });
        }
    };

    const handleDeleteAccount = () => {
        setDeleteModalOpen(false);
        // This is a protected action and should be handled by a secure backend function.
        // For this beta, we inform the user it's not implemented.
        toast.info("Account deletion must be handled by support for security reasons.");
    };

    return (
        <motion.div variants={panelVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            <FormPanel
                title="Change Password"
                description="Update your password for enhanced security. You will be logged out after changing your password."
                footer={
                     <button type="button" onClick={handlePasswordUpdate} disabled={loading} className="inline-flex justify-center rounded-md bg-green px-3 py-2 text-sm font-bold text-black shadow-sm hover:bg-opacity-90 disabled:opacity-50">
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                }
            >
                 <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">New Password</label>
                    <input type="password" name="newPassword" id="newPassword" value={passwords.newPassword} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-600 bg-black/50 text-white shadow-sm focus:border-pink focus:ring-pink" />
                </div>
                 <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm New Password</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-600 bg-black/50 text-white shadow-sm focus:border-pink focus:ring-pink" />
                </div>
            </FormPanel>

             <div className="bg-red-900/20 shadow-lg rounded-lg border border-red-500/30">
                <div className="p-6">
                    <h3 className="text-lg font-medium leading-6 text-red-400">Danger Zone</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-300">
                        <p>Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                    <div className="mt-5">
                        <button
                            type="button"
                            onClick={() => setDeleteModalOpen(true)}
                            className="inline-flex items-center gap-x-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                            <TrashIcon className="-ml-0.5 h-5 w-5" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                message="Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently erase all your shared data."
                confirmText="Yes, delete my account"
            />
        </motion.div>
    );
};

const AppearanceSettings = () => {
    const { theme, setTheme } = useTheme();
    
    const isDarkMode = theme === 'dark';

    const toggleTheme = () => {
        setTheme(isDarkMode ? 'light' : 'dark');
    };

    return (
        <motion.div variants={panelVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
            <FormPanel
                title="Appearance"
                description="Customize the look and feel of the application."
                footer={ <div/> } // No save button needed, change is instant
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">Dark Mode</h4>
                        <p className="text-sm text-gray-400">Toggle between light and dark themes.</p>
                    </div>
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`${
                            isDarkMode ? 'bg-green' : 'bg-gray-700'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink focus:ring-offset-2 focus:ring-offset-black`}
                        role="switch"
                        aria-checked={isDarkMode}
                    >
                        <span className="sr-only">Use setting</span>
                        <span
                            aria-hidden="true"
                            className={`${
                                isDarkMode ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                    </button>
                </div>
            </FormPanel>
        </motion.div>
    );
};

const NotificationSettings = () => {
    const handlePreferencesChange = (preferences: any) => {
        // Save notification preferences to database
        console.log('Notification preferences changed:', preferences);
    };

    const handleScheduleChange = (schedule: any) => {
        // Save notification schedule to database
        console.log('Notification schedule changed:', schedule);
    };

    return (
        <motion.div variants={panelVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
            <NotificationPreferences
                onPreferencesChange={handlePreferencesChange}
                onScheduleChange={handleScheduleChange}
                className="bg-transparent border-white/10"
            />
        </motion.div>
    );
};

const HelpAndSupport = () => {
    const [showOnboarding, setShowOnboarding] = useState(false);

    return (
        <motion.div variants={panelVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
            <FormPanel
                title="Help & Support"
                description="Get help and learn more about the app."
                footer={ <div/> }
            >
                <div className="space-y-4">
                    <button
                        onClick={() => setShowOnboarding(true)}
                        className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <SparklesIcon className="h-5 w-5 text-green" />
                            <div className="text-left">
                                <h4 className="font-medium text-white">Show Onboarding</h4>
                                <p className="text-sm text-gray-400">Replay the app introduction</p>
                            </div>
                        </div>
                        <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" />
                    </button>

                    <a
                        href="mailto:support@togetherapart.com"
                        className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <QuestionMarkCircleIcon className="h-5 w-5 text-green" />
                            <div className="text-left">
                                <h4 className="font-medium text-white">Contact Support</h4>
                                <p className="text-sm text-gray-400">Get help from our team</p>
                            </div>
                        </div>
                        <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" />
                    </a>
                </div>
            </FormPanel>

            <OnboardingFlow
                isOpen={showOnboarding}
                onClose={() => setShowOnboarding(false)}
            />
        </motion.div>
    );
};


const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'appearance' | 'notifications' | 'help'>('profile');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                <p className="mt-1 text-gray-400">Manage your profile, account, and application settings.</p>
            </div>
            
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
                    <nav className="space-y-1">
                        <TabButton 
                            label="Profile" 
                            icon={<UserCircleIcon />} 
                            isActive={activeTab === 'profile'} 
                            onClick={() => setActiveTab('profile')} 
                        />
                        <TabButton 
                            label="Account" 
                            icon={<LockClosedIcon />} 
                            isActive={activeTab === 'account'} 
                            onClick={() => setActiveTab('account')} 
                        />
                        <TabButton 
                            label="Appearance" 
                            icon={<PaintBrushIcon />} 
                            isActive={activeTab === 'appearance'} 
                            onClick={() => setActiveTab('appearance')} 
                        />
                        <TabButton 
                            label="Notifications" 
                            icon={<BellIcon />} 
                            isActive={activeTab === 'notifications'} 
                            onClick={() => setActiveTab('notifications')} 
                        />
                        <TabButton 
                            label="Accessibility" 
                            icon={<AdjustmentsHorizontalIcon />} 
                            isActive={activeTab === 'accessibility'} 
                            onClick={() => setActiveTab('accessibility')} 
                        />
                        <TabButton 
                            label="Help & Support" 
                            icon={<QuestionMarkCircleIcon />} 
                            isActive={activeTab === 'help'} 
                            onClick={() => setActiveTab('help')} 
                        />
                    </nav>
                </aside>
                
                <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
                     <AnimatePresence mode="wait">
                        {activeTab === 'profile' && <ProfileSettings key="profile" />}
                        {activeTab === 'account' && <AccountSettings key="account" />}
                        {activeTab === 'appearance' && <AppearanceSettings key="appearance" />}
                        {activeTab === 'notifications' && <NotificationSettings key="notifications" />}
                        {activeTab === 'accessibility' && <AccessibilitySettings key="accessibility" />}
                        {activeTab === 'help' && <HelpAndSupport key="help" />}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;