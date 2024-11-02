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
export const imagePrompt = ``

export const summaryPrompt = (lang: string) => {
  return ` LIMIT TO 600 WORDS ( IMPORTANT ) - Summarise that document in ${lang} Language, as if you are verbally Explaining it to someone, making it easier for him to understand all the necessary information along with risks associated with it`
}