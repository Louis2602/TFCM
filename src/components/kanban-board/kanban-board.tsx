import { useMemo, useState } from "react"
import { Column, Card } from "@/types/kanban" 
import PlusIcon from "@/components/ui/plus-icon";
import KanbanColumn from "@/components/kanban-board/kanban-component/kanban-column";
import { 
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
 } from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "@/components/kanban-board/kanban-component/kanban-card";

const columns: Column[] = [
    {
        index: "1",
        columnName: "💡 Ideas",
    },
    {
        index: "2",
        columnName: "⏳ In Progress"
    },
    {
        index: "3",
        columnName: "📋 Under review"
    },
    {
        index: "4",
        columnName: "✅ Complete"
    }
];

const defaultCards: Card[] = [
    {
      id: "1",
      column: "3",
      content: "List admin APIs for dashboard",
      tags: ["API", "Dashboard", "Admin"]
    },
    {
      id: "2",
      column: "1",
      content:
        "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
        tags: ["Authentication"]
    },
    {
      id: "3",
      column: "2",
      content: "Conduct security testing",
      tags: []
    },
    {
      id: "4",
      column: "2",
      content: "Analyze competitors",
      tags: ["Analysis"]
    },
    {
      id: "5",
      column: "4",
      content: "Create UI kit documentation",
      tags: ["Document", "UI"]
    },
    {
      id: "6",
      column: "4",
      content: "Dev meeting",
      tags: ["Meeting"]
    },
    {
      id: "7",
      column: "3",
      content: "Deliver dashboard prototype",
      tags: ["Prototype", "Dashboard"]
    },
    {
      id: "8",
      column: "3",
      content: "Optimize application performance",
      tags: ["Performance"]
    },
]

function kanbanBoard(){
    const colIndex = useMemo(() => columns.map((col) => col.index), [columns]);
    const [activeCard, setActiveCard] = useState<Card | null>(null);
    const [cards, setCards] = useState(defaultCards);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
            distance: 10,
            },
        })
    );

    function onDragStart(event: DragStartEvent){
        setActiveCard(cards.find(card => card.id === event.active.id) || null);
    }

    function onDragEnd(event: DragEndEvent){
        setActiveCard(null);
        const { active, over } = event;
        if (!over) return;

        if ( active.id !== over.id ){
            setCards((cards) => {
                const activeCard = cards.findIndex( (c) => c.id === active.id );
                const overCard = cards.findIndex( (c) => c.id === over.id )

                if (cards[activeCard].column != cards[overCard].column){
                    cards[activeCard].column = cards[overCard].column
                    return arrayMove(cards, activeCard, overCard - 1);
                }

                return arrayMove(cards, activeCard, overCard);
            });
        }
    }

    function createCard(col: string){
        const newCard: Card = {
            id: generateId(),
            column: col,
            content: "New Content here",
            tags: []
        }

        setCards([...cards, newCard]);
    }

    function deleteCard(cardID: string){
        setCards(cards.filter((c) => {c.id !== cardID}))
    }

    function updateCard(cardID: string, content: string){
        setCards(cards.map((card) => {
            if (card.id !== cardID) return card;
            return {...card, content};
        }))
    }

    function addFlair(cardID: string, tag: string){
        setCards(cards.map((card) => {
            if (card.id !== cardID) return card;
            return {...card, tags: {...card.tags, tag}};
        }))
    }

    function removeFlair(cardID: string, tag: string){
        setCards(cards.map((card) => {
            if (card.id !== cardID) return card;
            return {...card, tags: card.tags.filter((tagItem) => tagItem !== tag)};
        }))
    }

    return (
        <div
            className="
            m-auto
            flex
            min-h-full
            w-full
            items-center
            overflow-x-auto
            overflow-y-hidden
            "
        >
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            <div className="m-auto flex gap-4">
                <div className="flex gap-4">
                    <SortableContext items={colIndex}>
                        {columns.map((col) => (
                            <KanbanColumn
                                key={col.index}
                                col={col}
                                createCard={createCard}
                                deleteCard={deleteCard}
                                updateCard={updateCard}
                                addFlair={addFlair}
                                removeFlair={removeFlair}
                                cards={cards.filter((card) => card.column === col.index)}
                            />
                        ))}
                    </SortableContext>
                </div>
            </div>
            {createPortal(
                <DragOverlay>
                    {activeCard && (
                        <TaskCard
                            card={activeCard}
                            deleteCard={deleteCard}
                            updateCard={updateCard}
                            addFlair={addFlair}
                            removeFlair={removeFlair}
                        />
                    )}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
        </div>
    )
}


function generateId() {
    /* Generate a random number between 0 and 10000 */
    return (Math.floor(Math.random() * 10001)).toString();
  }
export default kanbanBoard;