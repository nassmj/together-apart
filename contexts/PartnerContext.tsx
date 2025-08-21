import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

import type { User } from '@supabase/supabase-js';

// The 'couple' record from your database
interface Couple {
  id: string;
  user1_id: string;
  user2_id: string;
}

// Your partner's profile information
interface PartnerProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
}

interface PartnerContextType {
  couple: Couple | null;
  partner: PartnerProfile | null;
  loading: boolean;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export const PartnerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || !user) {
      setLoading(false);
      setCouple(null);
      setPartner(null);
      return;
    }



    const fetchPartnerData = async () => {
      setLoading(true);

      // Find the couple record
      const { data: coupleData, error: coupleError } = await supabase
        .from('couples')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .single();

      // 'PGRST116' is the code for 'No rows found', which is expected if the user has no partner.
      if (coupleError && coupleError.code !== 'PGRST116') {
        console.error("Error fetching couple:", coupleError);
        setCouple(null);
        setPartner(null);
        setLoading(false);
        return;
      }

      if (!coupleData) {
        setCouple(null);
        setPartner(null);
        setLoading(false);
        return;
      }
      
      setCouple(coupleData);

      const partnerId = coupleData.user1_id === user.id ? coupleData.user2_id : coupleData.user1_id;

      // Fetch partner's profile
      const { data: partnerData, error: partnerError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', partnerId)
        .single();
        
      if (partnerError || !partnerData) {
        console.error("Error fetching partner profile:", partnerError?.message);
        setPartner(null);
      } else {
        setPartner(partnerData as PartnerProfile);
      }
      
      setLoading(false);
    };

    fetchPartnerData();
    
    // Listen for changes to the couples table to refetch data if needed
    const subscription = supabase.channel('public:couples')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'couples', filter: `user1_id=eq.${user.id}` }, payload => {
        fetchPartnerData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'couples', filter: `user2_id=eq.${user.id}` }, payload => {
        fetchPartnerData();
      })
      .subscribe();
      
    return () => {
        supabase.removeChannel(subscription);
    }

  }, [session, user]);

  const value = {
    couple,
    partner,
    loading,
  };

  return <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>;
};

export const usePartner = () => {
  const context = useContext(PartnerContext);
  if (context === undefined) {
    throw new Error('usePartner must be used within a PartnerProvider');
  }
  return context;
};
