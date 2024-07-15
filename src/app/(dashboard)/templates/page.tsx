import CreateTemplate from '@/app/(dashboard)/templates/CreateTemplate';
import TemplateCardList from '@/app/(dashboard)/templates/TemplateCardList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Templates',
  description: 'Create templates for your content.',
};

export default function TemplatesPage() {
  return (
    <>
      <div className="flex justify-between">
        <div className="mb-6">
          <h2 className="font-heading text-3xl">Templates</h2>
          <p className="text-muted-foreground">
            Create templates for your content.
          </p>
        </div>

        <CreateTemplate />
      </div>

      <TemplateCardList />
    </>
  );
}
