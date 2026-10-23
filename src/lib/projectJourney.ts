export type InterviewStory={id:string;exerciseId:string;answers:string[];createdAt:number;updatedAt:number};
const KEY="portforge_project_interviews_v1";
export function getProjectInterviews():InterviewStory[]{
 try{const parsed=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(parsed)?parsed.filter((x:InterviewStory)=>x&&typeof x.exerciseId==="string"&&Array.isArray(x.answers)).slice(0,30):[];}catch{return [];}
}
export function saveProjectInterview(story:InterviewStory){
 const list=[{...story,answers:story.answers.map(a=>a.slice(0,2000))},...getProjectInterviews().filter(x=>x.exerciseId!==story.exerciseId)].slice(0,30);
 localStorage.setItem(KEY,JSON.stringify(list));
 window.dispatchEvent(new Event("portforge:project-interview"));
}
export const interviewPrompts=[
 {title:"Describe the problem",question:"What was the task, and what did your solution need to accomplish?",guidance:"Explain the inputs, outputs and what successful behavior means."},
 {title:"Explain your decisions",question:"Walk me through your approach. Why did you choose this logic or data structure?",guidance:"Give a specific example from your own code. Mention a tradeoff."},
 {title:"Discuss testing and failure",question:"Which edge case or bug was most interesting, and how did you investigate it?",guidance:"Reference a test case, expected behavior and what you changed."},
 {title:"Propose the next improvement",question:"How would you improve this project if you had another hour?",guidance:"Choose a realistic improvement and explain how you would verify it."}
];
