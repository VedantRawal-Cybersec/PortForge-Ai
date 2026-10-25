import type {PracticeLevel} from "./practiceLevels";
export type InterviewAnswerRecord={
  round:number;question:string;answer:string;mode:"AI-reviewed"|"Guided (not graded)";
  feedback:string;
};
const frameworks=[
  {title:"Explain the fundamentals",steps:["Define the central concept accurately","Give one real or realistic example","State how you would check that it works"]},
  {title:"Walk through an applied scenario",steps:["Clarify inputs, users and constraints","Explain your approach in a logical order","Identify how you would verify the result"]},
  {title:"Debug, evaluate and improve",steps:["Describe a failure mode or limitation","Compare potential fixes and trade-offs","Propose a test to validate the next improvement"]},
] as const;
export function interviewPreparation(round:number,level:PracticeLevel,projectTitle=""){
  const framework=frameworks[Math.max(0,Math.min(2,round))];
  const extra=projectTitle.trim()?
    "Ground your answer in your actual "+projectTitle.slice(0,100)+" project. Clearly separate what you did from what you would improve.":
    "Use your own project or a hypothetical example; label a hypothetical example clearly.";
  return {
    ...framework,
    levelTip:level==="beginner"?"Keep the explanation simple and concrete. Honest uncertainty is acceptable.":
      level==="intermediate"?"Support your decision with a realistic example and one alternative.":
      "Discuss constraints, failure modes, evidence and measurable trade-offs.",
    context:extra,
  };
}
export function interviewReport(topic:string,level:PracticeLevel,records:InterviewAnswerRecord[]):string{
  return [
    "PortForge interview practice notes",
    "Topic / role: "+topic.slice(0,120),
    "Selected experience level: "+level,
    "AI scores, when present, are advisory. Guided answers are not automatically graded.",
    ...records.slice(0,3).map(r=>["",
      "ROUND "+(r.round+1)+" — "+r.mode,
      "Question: "+r.question.slice(0,1600),
      "Answer:\n"+r.answer.slice(0,8000),
      r.feedback?"Feedback / next action:\n"+r.feedback.slice(0,1800):"Self-review using the checklist in your practice session.",
    ].join("\n")),
  ].join("\n");
}
