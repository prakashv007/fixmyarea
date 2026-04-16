const { GoogleGenAI, Type } = require('@google/genai');

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

/**
 * Modernized AI Triage Prompt for gemini-2.5-flash
 */
const SYSTEM_PROMPT = `
Act as a Smart City Triage AI. Read this citizen complaint. 
It may be in English, Hinglish, or transliterated Tamil. 
Output ONLY a valid JSON object with: 
- 'assignedDepartment' (Must be one of: Roads, Water, Electricity, Sanitation)
- 'priorityScore' (Number 1-10 based on urgency)
- 'ackMessage' (A friendly auto-reply acknowledging the specific issue)
`;

const processComplaintWithAI = async (text) => {
    if (!ai) {
        throw new Error("Gemini API Key is missing. Critical system failure.");
    }
    
    try {
        const fullPrompt = `${SYSTEM_PROMPT}\n\nComplaint Text: "${text}"`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        assignedDepartment: { type: Type.STRING },
                        priorityScore: { type: Type.INTEGER },
                        ackMessage: { type: Type.STRING }
                    },
                    required: ["assignedDepartment", "priorityScore", "ackMessage"]
                }
            }
        });
        
        const result = JSON.parse(response.text);
        
        // Map back to our system's expected structure for now
        return {
            normalized_text: result.ackMessage,
            department: result.assignedDepartment,
            priority_score: result.priorityScore,
            severity_label: result.priorityScore >= 8 ? "Critical" : result.priorityScore >= 5 ? "High" : "Medium",
            estimated_resolution_time: result.priorityScore >= 8 ? "12 Hours" : "48 Hours",
            sla_risk: result.priorityScore >= 8
        };
    } catch (error) {
        console.error("Gemini AI Triage failed:", error.message);
        throw error; // Let the controller handle it
    }
};

module.exports = { processComplaintWithAI };
