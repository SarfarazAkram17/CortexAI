import { jsonrepair } from "jsonrepair";
import { getModel } from "../config/llmModels.js";
import { generatePdf } from "../utils/generatePdf.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "pdf");

    const llm = await getModel("pdf");
    const prompt = `
        You are an expert document writer.

        Return ONLY valid JSON.

        Do NOT return markdown.

        Do NOT return explanations.

        Structure:

        {
        "title": "",
        "subtitle": "",
        "sections": [
        {
        "heading": "",
        "points": [],
        }
        ],
        }

        Generate 4-8 sections.

        Each section should have 3-6 concise bullet points.

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
            "Sorry, I couldn't generate valid PDF this time. Please try again.",
        };
      }
    }
    await deductCredits(state.userId, "pdf");

    const pdfBuffer = await generatePdf(data);

    const filename = `pdf-${Date.now()}.pdf`;
    await uploadToS3(filename, pdfBuffer, "application/pdf");

    const downloadUrl = await getFromS3(filename, 24 * 60);
    return {
      ...state,
      aiResponse: `
# PDF Generated
 
**${data.title}**

📥 [Download PDF](${downloadUrl})

_Link expires in 1 day._
`,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to generate PDF",
    };
  }
};
