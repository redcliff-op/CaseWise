import { DocumentAnalysis } from "@/global";

export const documentPrompt = `Analyze the following legal document and extract all key information that a user should know, including terms, obligations, conditions, and potential risks. Highlight any clauses or terms that could be unfavorable, hidden, or misleading, and flag them as 'concerning' or 'shady' if applicable. Summarize the key takeaways clearly and list any specific actions the user should take
        
        Return the response the following JSON response WITHOUT ANY PARSING OR SYNTAX ERRORS 

        {
          \"document_name\": \"\",
          \"document_type\": \"\",
          \"parties_involved\": [],
          \"effective_date\": \"\",
          \"termination_date\": \"\",
          \"key_terms\": {
            \"description\": \"\",
            \"terms\": [
              {
                \"term\": \"\",
                \"importance\": \"\"
              }
            ]
          },
          \"obligations\": [
            {
              \"obligation\": \"\",
              \"description\": \"\",
              \"due_date\": null
            }
          ],
          \"risks\": {
            \"general\": [
              {
                \"risk\": \"\",
                \"impact\": \"\",
                \"likelihood\": \"\",
                \"concerning\": false
              }
            ],
            \"legal\": [],
            \"financial\": [],
            \"reputational\": []
          },
          \"shady_clauses\": [
            {
              \"clause\": \"\",
              \"description\": \"\",
              \"reason\": \"\",
              \"potential_impact\": \"\"
            }
          ],
          \"action_items\": [
            {
              \"action\": \"\",
              \"deadline\": null
            }
          ],
          \"dispute_resolution\": {
            \"method\": \"\",
            \"jurisdiction\": \"\"
          },
          \"termination_conditions\": [],
          \"review_recommendations\": \"\",
          \"user_protection_tips\": \"\",
          \"overall_analysis\": \"\"
        }
        `;
export const imagePrompt = ``;

export const summaryPrompt = (lang: string, document: DocumentAnalysis) => {
  return ` LIMIT TO 600 WORDS ( IMPORTANT ) - Summarise this legal document in ${lang} Language, as if you are verbally Explaining it to someone, making it easier for him to understand all the necessary information along with risks associated with it, here is the document ${JSON.stringify(
    document
  )}`;
};

export const initialPrompt = `REMEMBER that your name is CaseWise LawBot and you are supposed to answer law or legal related questions or requests ONLY, apart from this if user asks anything else just reply with "I am Sorry, CaseWise LawBot is only limited to provide legal and law related help!"`;

export const predictionPrompt = `Analyze the given case scenario and provide a detailed prediction with all relevant insights. Include factors influencing the prediction, potential improvement strategies, associated risks, potential rewards, estimated cost, timeline, and any uncertainties affecting the prediction

Return the response in the following JSON response WITHOUT ANY PARSING OR SYNTAX ERRORS:

        {
          \"predictedOutcome\": \"\",
          \"predictionConfidence\": "Low" | "Medium" | "High",
          \"keyFactors\": [
            \"\"
          ],
          \"improvementStrategies\": [
            \"\"
          ],
          \"riskLevel\":  "Low" | "Medium" | "High",
          \"potentialRewards\": \"\",
          \"uncertaintyFactors\": [
            \"\"
          ],
          \"successRate\": \"\"
        }
`;

export const newCasePrompt = (caseTitle: string, caseDesc: string): string => {
  return `
  Based on the provided case details:

  Title: ${caseTitle}
  Description: ${caseDesc}

  Extract the following information:

  Provide the output in JSON format adhering to the following interface:
  {
    \"caseTitle\": \"\",
    \"clientDetails\": {
      \"name\": \"\",
      \"contact\": \"\",
      \"email\": \"\",
      \"address\": \"\"
    },
    \"caseType\": \"Civil\" | \"Criminal\" | \"Corporate\" | \"Family\" | \"Other\",
    \"filingDate\": \"\",
    \"jurisdiction\": \"\",
    \"documentsRequired\": [\"\"],
    \"status\": \"Draft\" | \"Submitted\" | \"Rejected\",
  }
  `;
};