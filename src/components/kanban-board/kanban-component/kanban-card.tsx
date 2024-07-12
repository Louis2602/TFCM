import type { Card as CardType } from "@/types/kanban"
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from "@/components/ui/trash-icon";
import PlusIcon from "@/components/ui/plus-icon";

interface cardPrototype{
    card: CardType;
    deleteCard: (id: string) => void;
    updateCard: (id: string, content: string) => void;
    addFlair: (id: string, flair: string) => void;
    removeFlair: (id: string, flair: string) => void
}

function TaskCard({ card, deleteCard, updateCard, addFlair, removeFlair }: cardPrototype) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [content, setContent] = useState(card.content);
    const [newTag, setNewTag] = useState("");
    const [addingTag, setAddingTag] = useState(false);;
    const toggleEditMode = () => {
      setEditMode((prev) => !prev);
    };

    const saveContent = () => {
      updateCard(card.id, content);
      setEditMode(false);
    };

    const {
      setNodeRef,
      attributes,
      listeners,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: card.id,
      data: {
        type: "Card",
        card,
      },
    });
  
    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
    };
    if (isDragging){
      return(
        <div
          ref={setNodeRef}
          style={style}
          className="
            kanbanCard
            flex 
            rounded-x1
            border-2
            border-rose-500
            relative
          "
        />
      );
    }


    return(
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onMouseEnter={() => {
          setMouseIsOver(true);
        }}

        onMouseLeave={() => {
          setMouseIsOver(false);
        }}
        className="
          kanbanCard
          rounded-x1
          hover:ring-2 
          hover:ring-inset 
          hover:ring-rose-500 
          relative
        "
      >
        <div className="flex">
          { editMode ? (
            <textarea 
              className="
                h-[90%]
                w-full
                resize-none
                border-none
                bg-transparent
                text-white
                focus:outline-none
              "
              name="cardContent" 
              value={card.content} 
              placeholder="Task content here"
              onBlur={() => {
                if (window.confirm("You have an unsaved change. Do you want to save?") && content){
                  saveContent();
                } 
                setContent(card.content);
                toggleEditMode();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey && content){
                  setContent(card.content);
                  saveContent();
                }
                toggleEditMode();
              }}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          ) : (
            <p className="
              my-auto 
              h-[90%] 
              w-full 
              overflow-y-auto 
              overflow-x-hidden 
              whitespace-pre-wrap
              hover:ring-pink-500
              hover:ring-2 
              hover:ring-inset 
            "
              onDoubleClick={toggleEditMode}>
              {card.content}
            </p>
          )}

          {mouseIsOver && (
          <button
            onClick={() => {
              deleteCard(card.id);
            }}
            className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
          >
            <TrashIcon />
          </button>
          )}
        </div>
        <div className="mt-2 flex flex-wrap">
            { card.tags && card.tags.map((tag) => (
                <div key={tag} className="bg-gray-200 rounded-full px-3 py-1 m-1 flex items-center">
                <span>{tag}</span>
                <button
                  className="ml-2 text-red-500"
                  onClick={(e) => removeFlair(card.id, tag)}
                >
                  <TrashIcon/>
                </button>
              </div>
            )) }
            { addingTag ? (
              <div className="ml-2 text-green-500 rounded-x1">
                <input
                  className="bg-transparent border-none outline-none"
                  type="text"
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTag){
                      setNewTag("");
                      addFlair(card.id, newTag);
                    }
                    setAddingTag(false);
                  }}
                  onBlur={() => {
                    if (window.confirm("Do you want to add the tag?")){
                      addFlair(card.id, newTag)
                    }
                    setNewTag("");
                    setAddingTag(false);
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <button className="ml-2 text-green-500 rounded-x1">
                <PlusIcon/>
              </button>
            )}
        </div>
      </div>
    );
}

export default TaskCard;