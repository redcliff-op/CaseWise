export const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good Morning";
  } else if (currentHour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

export const clearMarkdown = (markdown: string) => {
  return markdown.replace(/\*/g, "");
};

export const navigatorInfo = `the Case Navigator will streamline the process into five key sections to guide you step-by-step!
      \nCase Filing: Begin by collecting all necessary client details, selecting the case type, and submitting required documents to officially start the case.
      \nEvidence Collection: Gather and upload critical evidence, such as physical or digital items, and ensure it is properly verified.
      \nLegal Research: Explore relevant laws, past cases, and legal precedents to build a strong foundation for your case.
      \nHearing Preparation: Get ready for court hearings by organizing agendas, required documents, and tracking hearing schedules.
      \nCase Resolution: Finalize the case by submitting the judgment, summarizing outcomes, and identifying any follow-up actions like appeals or settlements.  
    `;