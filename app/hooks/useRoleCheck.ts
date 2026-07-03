import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';

export function useRoleCheck(requiredRole: 'admin' | 'user' = 'user') {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // Check user role from metadata
    const userRole = user.user_metadata?.role || 'user';

    if (requiredRole === 'admin' && userRole !== 'admin') {
      router.push('/');
      return;
    }

    setHasAccess(true);
    setIsChecking(false);
  }, [user, loading, requiredRole, router]);

  return { hasAccess, isChecking, user };
}
