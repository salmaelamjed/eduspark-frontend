import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiClient } from '@/lib/client';
import { User } from '@/types/user';

export default async function DashboardLayout({
  children,
  admin,
  teacher,
}: {
  children: React.ReactNode;
  admin?: React.ReactNode;
  teacher?: React.ReactNode;
}) {
 
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) {
    redirect('/sign-in?redirect=/dashboard');
  }

  let user: User | null = null;
  
  try {
    const response = await apiClient.get<User>('/me', token);
    
    user = response || null;
    
  } catch (err: any) {
    redirect('/sign-in?error=session_expired');
  }
  if (!user) {
    redirect('/sign-in?error=no_user');
  }
  if (user.role === 'admin' && admin) {
    return admin;
  }

  if (user.role === 'teacher' && teacher) {
    return teacher;
  }
  
  return <>{children}</>;
}