import { redirect } from 'next/navigation';

export default function Home() {
  // Root page redirects to dashboard (middleware will handle auth check)
  redirect('/dashboard');
}
