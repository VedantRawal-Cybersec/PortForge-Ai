import {beforeEach,describe,expect,it} from "vitest";
import {tracks} from "./academy";
import {TRACK_CHECKS_KEY,evaluateTrackCheck,saveTrackCheck,readTrackChecks,trackCheckSummary,exportTrackCheck} from "./trackChecks";
import {exportLocalBackup,restoreLocalBackup,PORTABLE_KEYS} from "./backup";

describe("69-track locally assessed knowledge reviews",()=>{
 beforeEach(()=>localStorage.clear());
 it("grades all introductory subjects deterministically, from each subject's actual answer keys",()=>{
  expect(tracks).toHaveLength(69);
  for(const t of tracks){
   const full=evaluateTrackCheck(t.id,t.lessons.slice(0,3).map(l=>l.correct));
   expect(full.correct).toBe(3);
   expect(full.trackId).toBe(t.id);
   expect(exportTrackCheck(full)).toContain(t.name);
   const wrong=evaluateTrackCheck(t.id,t.lessons.slice(0,3).map(l=>(l.correct+1)%l.choices.length));
   expect(wrong.correct).toBe(0);
  }
 });
 it("enforces exact three-question answers and rejects invalid identifiers/indices",()=>{
  expect(()=>evaluateTrackCheck("unknown-subject",[0,0,0])).toThrow();
  expect(()=>evaluateTrackCheck("rust",[0,0])).toThrow();
  expect(()=>evaluateTrackCheck("rust",[-1,0,0])).toThrow();
  expect(()=>evaluateTrackCheck("rust",[0,99,0])).toThrow();
  expect(()=>evaluateTrackCheck("rust",[0,1,NaN])).toThrow();
 });
 it("stores local attempts and an accurate evidence summary, without inventing credentials",()=>{
  const t=tracks.find(x=>x.id==="rust")!;
  saveTrackCheck(evaluateTrackCheck(t.id,t.lessons.slice(0,3).map(l=>l.correct)));
  const s=trackCheckSummary();
  expect(s.attempted).toBe(1);
  expect(s.average).toBe(100);
  expect(s.distinctTracks).toBe(1);
  expect(exportTrackCheck(readTrackChecks()[0])).toContain("not a verified professional skill certification");
  localStorage.setItem(TRACK_CHECKS_KEY,"malformed");
  expect(readTrackChecks()).toEqual([]);
 });
 it("exports and safely restores the track assessment record",()=>{
  const t=tracks.find(x=>x.id==="react")!;
  saveTrackCheck(evaluateTrackCheck(t.id,t.lessons.slice(0,3).map(l=>l.correct)));
  expect(PORTABLE_KEYS).toContain(TRACK_CHECKS_KEY);
  const backup=JSON.stringify(exportLocalBackup());
  localStorage.clear();
  expect(restoreLocalBackup(backup)).toBe(1);
  expect(readTrackChecks()[0].trackId).toBe("react");
  const poisoned=JSON.parse(backup);
  poisoned.items[TRACK_CHECKS_KEY][0].answers=[888,0,0];
  expect(()=>restoreLocalBackup(JSON.stringify(poisoned))).toThrow(/invalid|damaged/);
 });
});
