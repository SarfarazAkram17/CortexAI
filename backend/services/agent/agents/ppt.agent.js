import { getModel } from "../config/llmModels.js";
import { jsonrepair } from "jsonrepair";
import { generatePpt } from "../utils/generatePpt.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pptAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "ppt");

    const llm = await getModel("ppt");
    const prompt = `
            You are an professional presentation designer.
    
            Return ONLY valid JSON.
    
            Format:
    
            {
            "title": "",
            "subtitle": "",
            "slides": [
            {
            "title": "",
            "points": [
            "",
            "",
            "",
            ""
            ],
            }
            ],
            }
    
            Rules:

            - Generate exactly 6 content slides.
            - Each slide should have 7 concise bullet points.
            - No markdown.
            - No explanation.
            - No code block.
            - Return ONLY JSON.
    
            Topic:
    
            ${state.prompt}
            `;

    const res = await llm.invoke(prompt);
    let data;
    try {
      data = JSON.parse(res.content);
    } catch (e) {
      try {
        data = JSON.parse(jsonrepair(res.content));
      } catch (repairErr) {
        return {
          ...state,
          aiResponse:
            "Sorry, I couldn't generate valid PPT this time. Please try again.",
        };
      }
    }
    await deductCredits(state.userId, "ppt");

    const ppt = await generatePpt(data);
    const buffer = await ppt.write({
      outputType: "nodebuffer",
    });

    const filename = `ppt-${Date.now()}.pptx`;
    await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );

    const downloadUrl = await getFromS3(filename, 24 * 60);
    return {
      ...state,
      aiResponse: `
# ✅ Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

_Link expires in 1 day._
    `,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to generate PPT",
    };
  }
};
