import { NewChannelForm } from '@/components/forms/new-channel-form';

export const metadata = {
  title: 'Create Channel - Magic Box',
};

export default function NewChannelPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950 flex items-center">
      <div className="container mx-auto px-4 py-8">
        <NewChannelForm />
      </div>
    </div>
  );
}
