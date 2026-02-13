import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect the root route to the overview
  redirect('/overview');
}