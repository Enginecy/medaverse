'use server'


export async function createAgent(
    
) { 

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return {
        id: "agent-123",
        name: "New Agent",
        description: "This is a new agent created for testing purposes.",
        createdAt: new Date().toISOString(),
    };


}