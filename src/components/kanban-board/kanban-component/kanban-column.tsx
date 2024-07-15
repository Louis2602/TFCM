import { SortableContext } from "@dnd-kit/sortable";
import type { Column, Card  } from "@/types/kanban"
import { useMemo } from "react";
import PlusIcon from "@/components/ui/plus-icon";

import KanbanCard from "./kanban-card";

interface ColumnPrototype{
    col: Column;

    cards: Card[];
    createCard: (index: string) => void;
    deleteCard: (id: string) => void;
    updateCard: (id: string, content: string) => void;
    addFlair: (id: string, flair: string) => void;
    removeFlair: (id: string, flair: string) => void
}

function KanbanColumn({col, cards, createCard, deleteCard, updateCard, addFlair, removeFlair}: ColumnPrototype){

    const cardIDs = useMemo(() => {
        return cards.map((card) => card.id)
    }, [cards]);

    return(
        <div
            className="
                kanbanCol
                rounded-md
                flex
                flex-col
            "
        >
            <div
                className="
                    bg-[#575757]
                    text-md
                    h-[60px]
                    cursor-grab
                    rounded-md
                    rounded-b-none
                    p-3
                    font-bold
                    border-4
                    border-[#390341]
                    flex
                    items-center
                    justify-between
                "
            >
                <div className="flex gap-2">
                    <div
                            className="
                        flex
                        justify-center
                        items-center
                        bg-columnBackgroundColor
                        px-2
                        py-1
                        text-sm
                        rounded-full
                        "
                    >
                        {col.index}
                    </div>

                    {col.columnName}
                </div>
            </div>
            <div className="
                flex
                flex-grow
                flex-col
                gap-4
                p-2
                overflow-x-hidden
                overflow-y-auto
            ">
                <SortableContext items={(cardIDs)}>
                    {cards.map((card) => (
                        <KanbanCard
                            key={card.id}
                            card={card}
                            deleteCard={deleteCard}
                            updateCard={updateCard}
                            addFlair={addFlair}
                            removeFlair={removeFlair}
                        />
                    ))}
                </SortableContext>
            </div>
            <button
                onClick={() => {
                    createCard(col.index)
                }} 
                className="
                flex 
                gap-2 
                items-center 
                border-[#390341] 
                border-2 
                rounded-md p-4 
                border-x-[#390341] 
                hover:bg-[#575757]
                hover:text-rose-500 
                active:bg-black">
                <PlusIcon/>
                Add new Card
            </button>
        </div>
    );
}

export default KanbanColumn;