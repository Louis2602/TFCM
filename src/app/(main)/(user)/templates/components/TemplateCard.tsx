import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Template } from '@/types/db';
import React from 'react';

interface TemplateCardProps {
  template: Template;
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  return (
    <Card className="w-[400px] relative transition-transform transform hover:scale-105 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="truncate">{template.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm">{template.body}</p>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
