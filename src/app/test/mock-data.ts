"use server";

export default async function getMockData(page = 1) {
    const limit = 10;

    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock data
    const items = Array.from({ length: limit }, (_, i) => ({
        id: (page - 1) * limit + i + 1,
        title: `Item ${(page - 1) * limit + i + 1}`,
        description: `This is a description for item ${(page - 1) * limit + i + 1
            }`,
    }));

    return { items, hasMore: page < 5 }; // Limit to 5 pages total
}