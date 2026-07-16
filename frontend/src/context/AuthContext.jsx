import { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signUpWithEmail = async ({ fullName, email, password }) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
      },
    });
  };

  const signInWithEmail = async ({ email, password }) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  const sendPasswordReset = async (email) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
  };

  const signOut = async () => supabase.auth.signOut();

  const value = {
    session,
    user: session?.user || null,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    sendPasswordReset,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
