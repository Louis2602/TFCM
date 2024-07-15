import Editor from '@/app/(dashboard)/templates/components/TemplateEditor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';

const CreateTemplate = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create template</Button>
      </DialogTrigger>
      <DialogContent className="w-[1000px] h-[650px]">
        <Editor className="h-full" />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplate;
