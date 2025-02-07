import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Session {
  user: {
    id: string;
    email?: string;
  } | null;
  access_token: string | null;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession({
          user: {
            id: session.user.id,
            email: session.user.email
          },
          access_token: session.access_token
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession({
          user: {
            id: session.user.id,
            email: session.user.email
          },
          access_token: session.access_token
        });
      } else {
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return session;
}
