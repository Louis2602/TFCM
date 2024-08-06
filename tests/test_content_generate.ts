import { POST } from "@/app/api/generate/content/route";
import { db } from "@/db/database";
import { getCurrentUser } from "@/lib/lucia";
import { streamText } from "ai";

// Mock dependencies
jest.mock("@/db/database");
jest.mock("@/lib/lucia");
jest.mock("@ai-sdk/openai");
jest.mock("ai");

describe("POST /api/content", () => {
  const mockUser = {
    id: "user123",
    credits: 100,
  };

  const mockRequest = {
    json: jest.fn().mockResolvedValue({ prompt: "Test prompt", price: 10 }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
  });

  it("should return 403 if user is not authenticated", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const response = await POST(mockRequest as any);

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("should return 403 if user does not have enough credits", async () => {
    mockUser.credits = 5;

    const response = await POST(mockRequest as any);

    expect(response.status).toBe(403);
    expect(await response.text()).toBe(
      "Not enough credits to perform this action.",
    );
  });

  it("should process the request and return a stream response on success", async () => {
    const mockTransaction = jest.fn().mockImplementation((callback) =>
      callback({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        values: jest.fn(),
      }),
    );
    (db.transaction as jest.Mock) = mockTransaction;

    const mockStreamResponse = {
      toAIStreamResponse: jest.fn().mockReturnValue("mocked stream response"),
    };
    (streamText as jest.Mock).mockResolvedValue(mockStreamResponse);

    const response = await POST(mockRequest as any);

    expect(mockTransaction).toHaveBeenCalled();
    expect(streamText).toHaveBeenCalled();
    expect(response).toBe("mocked stream response");
  });

  it("should handle errors and return a 500 response", async () => {
    const mockError = new Error("Test error");
    (db.transaction as jest.Mock).mockRejectedValue(mockError);

    const response = await POST(mockRequest as any);

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Something went wrong: Test error");
  });
});
