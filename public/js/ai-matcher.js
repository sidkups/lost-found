import { db, ai } from './app.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getGenerativeModel } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-ai.js";

// Initialize Gemini model with structured output
const model = getGenerativeModel(ai, {
    model: "gemini-3.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
            type: "object",
            properties: {
                matches: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            candidateId: { type: "string" },
                            confidenceScore: { type: "number", description: "Score from 0 to 100" },
                            reasoning: { type: "string", description: "Brief explanation of the match" }
                        },
                        required: ["candidateId", "confidenceScore", "reasoning"]
                    }
                }
            },
            required: ["matches"]
        }
    }
});

export const findMatches = async (targetItem) => {
    if (!ai) {
        console.error("AI Logic not initialized.");
        return [];
    }

    try {
        // Fetch candidate items
        // If target is "lost", fetch "found" items, and vice versa.
        const candidateType = targetItem.type === 'lost' ? 'found' : 'lost';
        const itemsRef = collection(db, "items");
        const q = query(itemsRef, where("type", "==", candidateType), where("status", "==", "open"));
        const querySnapshot = await getDocs(q);
        
        const candidates = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            candidates.push({
                id: doc.id,
                title: data.title,
                description: data.description,
                category: data.category,
                location: data.location,
                date: data.date
            });
        });

        if (candidates.length === 0) {
            return []; // No candidates to match against
        }

        // Construct the prompt
        const prompt = `
        You are an AI assistant helping to match lost and found items.
        
        Target Item (The item we want to find a match for):
        Title: ${targetItem.title}
        Description: ${targetItem.description}
        Category: ${targetItem.category}
        Location: ${targetItem.location}
        Date: ${targetItem.date}
        
        Candidate Items (Potential matches):
        ${JSON.stringify(candidates, null, 2)}
        
        Analyze the target item against the candidate items. Consider the similarity in descriptions, category, location, and dates.
        Return a JSON object containing a list of "matches" that have a reasonable probability of being the same item.
        If there are no good matches, return an empty array for "matches".
        Limit the matches to the top 5 most likely candidates.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const data = JSON.parse(responseText);
        
        const matches = data.matches || [];
        // Inject candidate title for easier UI rendering
        return matches.map(m => {
            const candidate = candidates.find(c => c.id === m.candidateId);
            return {
                ...m,
                candidateTitle: candidate ? candidate.title : 'Unknown Item'
            };
        });
    } catch (error) {
        console.error("Error finding matches:", error);
        throw error;
    }
};
