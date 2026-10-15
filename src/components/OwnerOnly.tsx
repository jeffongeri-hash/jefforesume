import { ReactNode, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/** Renders children only for the signed-in site owner (admin_users); otherwise `fallback`. */
export function useIsOwner() {
  const [state, setState] = useState<boolean | null>(null);
  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return setState(false);
      const { data } = await supabase.from('admin_users').select('id').eq('user_id', session.user.id).maybeSingle();
      setState(!!data);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { check(); });
    return () => sub.subscription.unsubscribe();
  }, []);
  return state;
}

export default function OwnerOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const isOwner = useIsOwner();
  if (isOwner === null) return null;
  return <>{isOwner ? children : fallback}</>;
}
