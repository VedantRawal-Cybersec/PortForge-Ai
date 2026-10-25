import type {Track,Lesson} from "./academy";
export type LessonSpec=[title:string,concept:string,example:string,prompt:string,answer:string,distractorA:string,distractorB:string,why:string,hint:string];
export type TrackSpec=[id:string,name:string,category:string,icon:string,description:string,project:string,sourcePath:string,lessons:[LessonSpec,LessonSpec,LessonSpec]];
export function composeAcademyTracks(specs:TrackSpec[]):Track[]{
 return specs.map(([id,name,category,icon,description,project,sourcePath,parts],i)=>({
   id,name,category,icon,description,deliverable:project,
   resourceUrl:sourcePath ? "https://roadmap.sh/"+sourcePath : undefined,
   lessons:parts.map(([title,concept,example,prompt,answer,wrongA,wrongB,why,hint],j):Lesson=>{
     const choices=[answer,wrongA,wrongB];
     const offset=(i+j)%3;
     return {id:id+"-"+(j+1),title,summary:concept.split(/[.!?]/)[0].trim()+".",
       minutes:8+j*2,concept,example,prompt,
       choices:[...choices.slice(offset),...choices.slice(0,offset)],
       correct:(3-offset)%3,why,hint};
   })
 }));
}
