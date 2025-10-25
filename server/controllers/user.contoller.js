import User from '../modles/user.model.js';
import geminiResponse from '../gemini.js';

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch(errors) {
        console.error("Get current user error:", errors);
        return res.status(500).json({ message: "Server error" });
    }
}

export const updateUser = async (req, res) => {
    try {
        console.log("=== UPDATE USER REQUEST ===");
        console.log("User ID:", req.userId);
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);
        
        const userId = req.userId;
        const { assistantName, imageUrl } = req.body;
        
        if (!assistantName) {
            console.log("ERROR: Assistant name is required");
            return res.status(400).json({ message: "Assistant name is required" });
        }
        
        // Map color names to placeholder avatar URLs
        const colorToImageMap = {
            gray: 'https://ui-avatars.com/api/?name=AI&background=6b7280&color=fff&size=400&bold=true',
            blue: 'https://ui-avatars.com/api/?name=AI&background=3b82f6&color=fff&size=400&bold=true',
            green: 'https://ui-avatars.com/api/?name=AI&background=22c55e&color=fff&size=400&bold=true',
            red: 'https://ui-avatars.com/api/?name=AI&background=ef4444&color=fff&size=400&bold=true',
            yellow: 'https://ui-avatars.com/api/?name=AI&background=eab308&color=fff&size=400&bold=true',
            purple: 'https://ui-avatars.com/api/?name=AI&background=a855f7&color=fff&size=400&bold=true',
            pink: 'https://ui-avatars.com/api/?name=AI&background=ec4899&color=fff&size=400&bold=true'
        };

        const updates = { assistantName };
        
        // Handle uploaded image file
        if (req.file) {
            console.log("Processing uploaded file...");
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            updates.assistantImage = base64Image;
        }
        // Handle color selection
        else if (imageUrl && colorToImageMap[imageUrl]) {
            console.log("Using color selection:", imageUrl);
            updates.assistantImage = colorToImageMap[imageUrl];
        } else if (imageUrl) {
            console.log("Using provided image URL:", imageUrl);
            updates.assistantImage = imageUrl;
        } else {
            console.log("No image provided, using default");
            updates.assistantImage = colorToImageMap.blue; // default
        }
        
        console.log("Updates to apply:", updates);
        
        const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        if (!user) {
            console.log("ERROR: User not found");
            return res.status(404).json({ message: "User not found" });
        }
        
        console.log("User updated successfully:", user);
        return res.status(200).json(user);
    } catch(errors) {
        console.error("Update user error:", errors);
        return res.status(500).json({ message: "Server error", error: errors.message });
    }
}

export const askToAssistant = async (req, res) => {
    try {
        const userId = req.userId;
        const { command } = req.body;
        console.log("Command received:", command);
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        console.log("User:", user.name, "Assistant:", user.assistantName);
        const responseText = await geminiResponse(command, user.assistantName, user.name);
        
        console.log("Gemini raw response:", responseText);
        
        if (!responseText) {
            console.error("Gemini returned null - Check your API key!");
            return res.status(200).json({
                type: "general",
                userInput: command,
                response: "I'm having trouble connecting to my AI brain. Please check if the Gemini API key is configured correctly in the server environment file."
            });
        }
        
        // Try to parse the JSON response
        try {
            // Remove markdown code blocks if present
            let cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
            const parsedResponse = JSON.parse(cleanedResponse);
            console.log("Parsed response:", parsedResponse);
            return res.status(200).json(parsedResponse);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw response that failed:", responseText);
            
            // Fallback response
            return res.status(200).json({
                type: "general",
                userInput: command,
                response: "I understood your question, but I'm having trouble formatting my answer. Please try again or check the server logs."
            });
        }
    } catch(errors) {
        console.error("Ask to assistant error:", errors);
        console.error("Error details:", errors.message);
        console.error("Stack trace:", errors.stack);
        return res.status(200).json({
            type: "general",
            userInput: req.body.command || "unknown",
            response: "Sorry, I encountered an error. Please check the server console for details."
        });
    }
}

