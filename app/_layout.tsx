import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Tabs } from 'expo-router';

const CLERK_FRONTEND_API = 'pk_test_aGVhbHRoeS1raXdpLTIyLmNsZXJrLmFjY291bnRzLmRldiQ';

export default function Layout() {
  return (
    <ClerkProvider frontendApi={CLERK_FRONTEND_API}>
      <SignedIn>
        <Tabs />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}
