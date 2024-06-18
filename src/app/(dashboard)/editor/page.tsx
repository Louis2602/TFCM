import Editor from "@/components/editor/editor";

const EditorPage = () => {
  return (
    <div>
      <div className="mb-4">
        <h2 className="font-heading text-3xl">AI Editor</h2>
        <p className="text-muted-foreground">
          A powerful AI Editor for writing your content
        </p>
      </div>
      <Editor />
    </div>
  );
};

export default EditorPage;
