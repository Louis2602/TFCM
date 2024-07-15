import { useEffect, useMemo, useState } from "react"
import { Column, Card } from "@/types/kanban" 
import KanbanColumn from "@/components/kanban-board/kanban-component/kanban-column";
import { 
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
 } from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import KanbanCard from "@/components/kanban-board/kanban-component/kanban-card";
import { getCards, addCard, removeCard, updateCardContent, swapCard, addNewFlair, deleteAFlair } from "@/lib/actions/kanban";

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


function KanbanBoard(){
    const colIndex = useMemo(() => columns.map((col) => col.index), [columns]);
    const [activeCard, setActiveCard] = useState<Card | null>(null);
    const [cards, setCards] = useState<Card[]>([]);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const cards = await getCards();
                setCards(cards);
            } catch (error) {
                console.error('Error fetching cards:', error);
                // Handle error as needed
            }
        };

        fetchCards();
    }, []);
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
            const activeCard = cards.findIndex( (c) => c.id === active.id );
            const overCard = cards.findIndex( (c) => c.id === over.id )
            swapCard(cards[activeCard], cards[overCard])
            .then(() => {
                setCards((cards) => {
                    if (cards[activeCard].column != cards[overCard].column){
                        cards[activeCard].column = cards[overCard].column;
                        return arrayMove(cards, activeCard, overCard - 1);
                    }

                    return arrayMove(cards, activeCard, overCard);
                });
            })
            .catch((error) => {
                console.error('Error deleting:', error);
                throw error;
            });
        }
    }

    function createCard(col: string){
        const newCard: Card = {
            id: generateId(),
            column: col,
            content: "New Content here",
            flairs: []
        }
        addCard(col, newCard.content)
        .then(() => {
            setCards([...cards, newCard]);
        })
        .catch((error) => {
            console.error('Error deleting:', error);
            throw error;
        });
    }

    function deleteCard(cardID: string){
        removeCard(cardID)
        .then(() => {
            setCards(cards.filter((c) => {c.id !== cardID}));
        })
        .catch((error) => {
            console.error('Error deleting:', error);
            throw error;
        });
    }

    function updateCard(cardID: string, content: string){
        updateCardContent(cardID, content)
        .then(() => {
          setCards((cards) =>
            cards.map((card) => {
              if (card.id !== cardID) return card;
              return { ...card, content };
            })
          );
        })
        .catch((error) => {
          console.error('Error updating card content:', error);
          throw error;
        });
    }

    function addFlair(cardID: string, flair: string){
        addNewFlair(cardID, flair).then(() => {
            setCards(cards.map((card) => {
                if (card.id !== cardID) return card;
                return {...card, flairs: {...card.flairs, flair}};
            }))
        })
        .catch((error) => {
            console.error('Error updating card content:', error);
            throw error;
        });
    }

    function removeFlair(cardID: string, flair: string){
        deleteAFlair(cardID, flair).then(() => {
            setCards(cards.map((card) => {
                if (card.id !== cardID) return card;
                return {...card, flairs: card.flairs.filter((flairItem) => flairItem !== flair)};
            }))
        })
        .catch((error) => {
            console.error('Error updating card content:', error);
            throw error;
        });
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
                        <KanbanCard
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
export default KanbanBoard;