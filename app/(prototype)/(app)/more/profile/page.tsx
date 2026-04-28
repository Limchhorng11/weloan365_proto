"use client";

import { Camera } from "lucide-react";
import { NavHeader } from "@/components/ui/NavHeader";
import { Screen, ScreenBody } from "@/components/ui/Screen";
import { Avatar } from "@/components/ui/Avatar";
import { Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/lib/hooks/useToast";
import { mockUser } from "@/lib/mock";

export default function ProfilePage() {
  const toast = useToast();
  return (
    <Screen>
      <NavHeader
        title="User Profile"
        right={
          <button
            className="text-sm font-medium"
            style={{ color: "var(--primary)" }}
            onClick={() => toast("Profile saved", "success")}
          >
            Save
          </button>
        }
      />
      <ScreenBody>
        <div className="mb-4 text-center">
          <Avatar name={mockUser.name} size="lg" className="mx-auto" />
          <button
            className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium"
            style={{ color: "var(--primary)" }}
            onClick={() => toast("Photo picker opened", "info")}
          >
            <Camera className="h-3.5 w-3.5" />
            Change photo
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          <Input label="Full name" defaultValue={mockUser.name} />
          <Input label="Phone" defaultValue={mockUser.phone} readOnly />
          <Input label="Email" type="email" defaultValue={mockUser.email} />
          <Input label="National ID" placeholder="Add your ID" />
          <Input label="Date of birth" type="date" defaultValue="1992-06-15" />
          <Textarea label="Address" rows={2} defaultValue="#12, St. 271, Sangkat Toul Tumpung, Phnom Penh" />
          <Input label="Occupation" defaultValue="Software Engineer" />
          <Input label="Monthly income" type="number" defaultValue={850} />
        </div>
      </ScreenBody>
    </Screen>
  );
}
