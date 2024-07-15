"use server";

import { db } from "@/db/database";
import { kanbanCards as cards, cardFlairs, content } from "@/db/schema";
import { Card } from "@/types/kanban";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

export async function getCards(): Promise<Card[]>{
    try{
        await db.transaction(async (slt) => {
            const allCards = await slt.select({ id: cards.id, column: cards.column, content: cards.content }).from(cards);

            const flairsPromises = allCards.map(async (card) => {
                const flairs = await slt
                    .select({
                        tag: cardFlairs.flair,
                    })
                    .from(cardFlairs)
                    .where(eq(cardFlairs.cardId, card.id));

                return {
                    ...card,
                    flairs: flairs.map((flair) => flair.tag),
                };
            });
            const cardsWithFlairs = await Promise.all(flairsPromises);
            
            return cardsWithFlairs as Card[];
        })
        return [];
    }catch(error){
        return [];
    }
} 

export async function addCard(column: string, content: string){
    try{
        await db.transaction(async (crt) => {
        const newCard = await crt.insert(cards).values({
            id: uuidv4(),
            column: column,
            content: content,
        }).returning();

        return newCard;
    })}
    catch (error) {
        throw error; // Optional: Rethrow or handle the error as needed
    }
}

export async function removeCard(cardId: string) {
    try{
        await db.transaction(async (dlt) => {
            await dlt.delete(cardFlairs)
            .where(eq(cardFlairs.cardId, cardId)) // Use type casting to any
            .execute();

            await dlt.delete(cards)
            .where(eq(cards.id, cardId)) // Use type casting to any
            .execute();
        })
    }catch (error) {
        throw error; // Optional: Rethrow or handle the error as needed
    }
}

export async function updateCardContent(cardId: string, content: string){
    try{
        await db.transaction(async (upt) => {
            await upt.update(cards).set({ content: content }).where(eq(cards.id, cardId)).execute();
        })
    }catch (error) {
        throw error; 
    }
}

export async function changeColumn(cardId: string, column: string){
    try{
        await db.transaction(async (upt) => {
            await upt.update(cards).set({ column: column }).where(eq(cards.id, cardId)).execute();
        })
    }catch (error) {
        throw error; 
    }
}

export async function addNewFlair(cardId: string, flair: string){
    try{
        await db.transaction(async (crt) => {
        const newFlair = await crt.insert(cardFlairs).values({
            cardId: cardId,
            flair: flair
        }).returning();

        return newFlair;
    })}
    catch (error) {
        throw error; // Optional: Rethrow or handle the error as needed
    }
}

export async function deleteAFlair(cardId: string, flair: string){
    try{
        await db.transaction(async (dlt) => {
            await dlt.delete(cardFlairs)
            .where(eq(cardFlairs.cardId, cardId) && eq(cardFlairs.flair, flair)) // Use type casting to any
            .execute();
        })
    }
    catch (error){
        throw error;
    }
}

export async function swapCard(card1: Card, card2: Card){
    try{
        await updateCardContent(card1.id, card2.content);
        await changeColumn(card1.id, card2.column);

        await updateCardContent(card2.id, card1.content)
        await changeColumn(card2.id, card1.column);

        await db.transaction(async (flr) => {
            await flr.delete(cardFlairs)
            .where(eq(cardFlairs.cardId, card1.id))
            .execute();

            const flairInserts1 = card2.flairs.map((flair) => ({
                cardId: card1.id,
                flair: flair,
            }));
            
            await db.insert(cardFlairs)
            .values(flairInserts1)
            .execute();

            await flr.delete(cardFlairs)
            .where(eq(cardFlairs.cardId, card2.id))
            .execute();
            
            const flairInserts2 = card1.flairs.map((flair) => ({
                cardId: card2.id,
                flair: flair,
            }));
            
            await db.insert(cardFlairs)
            .values(flairInserts2)
            .execute();
        })
    }
    catch (error){
        throw error;
    }
}