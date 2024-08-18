import TemplateCard from "@/app/(main)/(user)/templates/components/TemplateCard";
import { Empty } from "@/components/global/empty";
import { getUserTemplates } from "@/lib/actions/templates/query";
import React from "react";

const TemplateCardList = async () => {
  const { data: templates, success } = await getUserTemplates();

  if (!success) {
    return null;
  }

  if (templates === undefined) {
    return null;
  }

  return (
    <div>
      {templates.length === 0 ? (
        <Empty label="No contents found" src="/note.svg" />
      ) : (
        <div className="flex flex-wrap gap-4">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateCardList;
