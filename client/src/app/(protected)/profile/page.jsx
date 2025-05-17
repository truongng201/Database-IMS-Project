"use client";

import { Tabs } from '@/components/ui/tabs';
import withAuth from '@/hooks/withAuth';

function ProfilePage() {
  return (
    <Tabs defaultValue="all">
      Your information is being loaded...
    </Tabs>
  );
}

export default withAuth(ProfilePage);
