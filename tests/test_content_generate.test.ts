/**
 * @jest-environment node
 */
import { getCurrentUser } from "@/lib/lucia";
import { db } from "@/db/database";
import { streamText } from "ai";
import { POST } from "@/app/api/generate/content/route";

// Mock dependencies
jest.mock("@/lib/lucia", () => ({
  getCurrentUser: jest.fn(),
}));
jest.mock("@/db/database", () => ({
  db: {
    transaction: jest.fn().mockImplementation(async (callback: Function) => {
      const mockTransaction = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        values: jest.fn(),
      };
      await callback(mockTransaction);
    }),
  },
}));
jest.mock("@ai-sdk/openai", () => ({
  openai: jest.fn(),
}));
jest.mock("ai", () => ({
  streamText: jest.fn(),
}));

describe("POST /api/endpoint", () => {
  it("should return streamed response and update user credits", async () => {
    const requestObj = {
      json: async () => ({ prompt: "Sample content", price: 10 }),
    } as any;

    // Mock successful current user and OpenAI response
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: "shcypnhzv9ltswsq35n1zej7",
      credits: 20,
    });
    (streamText as jest.Mock).mockResolvedValue({
      toAIStreamResponse: jest
        .fn()
        .mockResolvedValue(new Response("streamed content", { status: 200 })),
    });

    const response = await POST(requestObj);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toBe("streamed content");
    expect(streamText).toHaveBeenCalledTimes(1);
    expect(db.transaction).toHaveBeenCalledTimes(1);
  });

  it("should return status 403 when user is unauthorized", async () => {
    const requestObj = {
      json: async () => ({ prompt: "Sample content", price: 10 }),
    } as any;

    // Mock unauthorized user
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const response = await POST(requestObj);
    const body = await response.text();

    expect(response.status).toBe(403);
    expect(body).toBe("Unauthorized");
    expect(streamText).not.toHaveBeenCalled();
    expect(db.transaction).not.toHaveBeenCalled();
  });

  it("should return status 403 when user has insufficient credits", async () => {
    const requestObj = {
      json: async () => ({ prompt: "Sample content", price: 10 }),
    } as any;

    // Mock user with insufficient credits
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: "shcypnhzv9ltswsq35n1zej7",
      credits: 5,
    });

    const response = await POST(requestObj);
    const body = await response.text();

    expect(response.status).toBe(403);
    expect(body).toBe("Not enough credits to perform this action.");
    expect(streamText).not.toHaveBeenCalled();
    expect(db.transaction).not.toHaveBeenCalled();
  });

  it("should return status 500 on server error", async () => {
    const requestObj = {
      json: async () => ({ prompt: "Sample content", price: 10 }),
    } as any;

    // Mock successful user but failing transaction
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: "shcypnhzv9ltswsq35n1zej7",
      credits: 20,
    });
    (db.transaction as jest.Mock).mockImplementation(
      async (callback: Function) => {
        throw new Error("Transaction failed");
      },
    );

    const response = await POST(requestObj);
    const body = await response.text();

    expect(response.status).toBe(500);
    expect(body).toContain("Something went wrong");
    expect(streamText).not.toHaveBeenCalled();
  });
});
