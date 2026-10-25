import { useEffect, useMemo, useState } from "react";
import { runIsolatedJavaScript } from "@/lib/sandbox";
import { Link } from "react-router-dom";
import { workspaceRecipes, findWorkspaceRecipe } from "@/lib/workspaceRecipes";
import { Panel, ScoreBar } from "@/components/Panel";
import { ModuleIntro } from "@/components/ModuleIntro";
import AIAccountNotice from "@/components/AIAccountNotice";
import { addToPortfolio } from "@/lib/portfolio";
import { practiceLevels, levelGuidance, type PracticeLevel } from "@/lib/practiceLevels";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Download, Loader2, Play, Save, Search, Send, Terminal } from "lucide-react";

type PEval = {
  scores: { logic: number; quality: number; structure: number; creativity: number };
  level: "Beginner"|"Intermediate"|"Strong"; verdict: string;
  whatWentWrong: string; improvedCode: string;
  resources: { title: string; why: string; kind: "free"|"paid"; url: string }[];
  upgrades: { tier: "beginner"|"intermediate"|"advanced"; name: string; description: string }[];
};

type LangDef = { id: string; label: string; category: string; starter: string; runnable?: boolean };

const HELLO = (lang: string) => `// ${lang} starter — write your code, then SUBMIT for AI grading.\n`;

const LANGUAGES: LangDef[] = [
  // Web
  { id: "javascript", label: "JavaScript", category: "Web", runnable: true, starter:
`// JavaScript runs inside an isolated practice sandbox. Try it!
function fizzbuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push('FizzBuzz');
    else if (i % 3 === 0) out.push('Fizz');
    else if (i % 5 === 0) out.push('Buzz');
    else out.push(i);
  }
  return out;
}
console.log(fizzbuzz(15).join(', '));
` },
  { id: "typescript", label: "TypeScript", category: "Web", starter:
`function add(a: number, b: number): number { return a + b; }
console.log(add(2, 3));
` },
  { id: "html", label: "HTML", category: "Web", starter: `<!doctype html>\n<html><body><h1>Hello</h1></body></html>\n` },
  { id: "css", label: "CSS", category: "Web", starter: `body { font-family: system-ui; background: #0a0a0a; color: #eaeaea; }\n` },
  { id: "jsx", label: "React (JSX)", category: "Web", starter: `export default function App(){ return <h1>Hello</h1> }\n` },
  { id: "vue", label: "Vue", category: "Web", starter: `<template><h1>{{ msg }}</h1></template>\n<script setup>const msg = 'Hello'</script>\n` },
  { id: "svelte", label: "Svelte", category: "Web", starter: `<script>let name='world'</script>\n<h1>Hello {name}</h1>\n` },

  // Backend / general
  { id: "python", label: "Python", category: "Backend", starter:
`def fizzbuzz(n):
    out = []
    for i in range(1, n+1):
        if i % 15 == 0: out.append('FizzBuzz')
        elif i % 3 == 0: out.append('Fizz')
        elif i % 5 == 0: out.append('Buzz')
        else: out.append(i)
    return out

print(', '.join(map(str, fizzbuzz(15))))
` },
  { id: "java", label: "Java", category: "Backend", starter:
`public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, world");
  }
}
` },
  { id: "csharp", label: "C#", category: "Backend", starter:
`using System;
class Program { static void Main() { Console.WriteLine("Hello"); } }
` },
  { id: "go", label: "Go", category: "Backend", starter:
`package main
import "fmt"
func main() { fmt.Println("Hello") }
` },
  { id: "rust", label: "Rust", category: "Backend", starter:
`fn main() { println!("Hello, world!"); }
` },
  { id: "kotlin", label: "Kotlin", category: "Backend", starter: `fun main() { println("Hello") }\n` },
  { id: "scala", label: "Scala", category: "Backend", starter: `object Main extends App { println("Hello") }\n` },
  { id: "ruby", label: "Ruby", category: "Backend", starter: `puts "Hello, world"\n` },
  { id: "php", label: "PHP", category: "Backend", starter: `<?php echo "Hello, world";\n` },
  { id: "elixir", label: "Elixir", category: "Backend", starter: `IO.puts "Hello"\n` },
  { id: "erlang", label: "Erlang", category: "Backend", starter: `-module(main).\n-export([start/0]).\nstart() -> io:format("Hello~n").\n` },
  { id: "clojure", label: "Clojure", category: "Backend", starter: `(println "Hello, world")\n` },
  { id: "haskell", label: "Haskell", category: "Backend", starter: `main = putStrLn "Hello, world"\n` },
  { id: "ocaml", label: "OCaml", category: "Backend", starter: `let () = print_endline "Hello"\n` },
  { id: "fsharp", label: "F#", category: "Backend", starter: `printfn "Hello"\n` },
  { id: "perl", label: "Perl", category: "Backend", starter: `print "Hello, world\\n";\n` },
  { id: "lua", label: "Lua", category: "Backend", starter: `print("Hello, world")\n` },
  { id: "dart", label: "Dart", category: "Backend", starter: `void main() { print('Hello'); }\n` },

  // Systems
  { id: "c", label: "C", category: "Systems", starter:
`#include <stdio.h>
int main(){ printf("Hello, world\\n"); return 0; }
` },
  { id: "cpp", label: "C++", category: "Systems", starter:
`#include <iostream>
int main(){ std::cout << "Hello, world\\n"; }
` },
  { id: "zig", label: "Zig", category: "Systems", starter: `const std = @import("std");\npub fn main() !void { try std.io.getStdOut().writer().print("Hello\\n", .{}); }\n` },
  { id: "nim", label: "Nim", category: "Systems", starter: `echo "Hello"\n` },
  { id: "crystal", label: "Crystal", category: "Systems", starter: `puts "Hello"\n` },
  { id: "assembly", label: "Assembly (x86)", category: "Systems", starter: `; nasm -f elf64 hello.asm\nsection .data\nmsg db "Hello",0xa\nlen equ $-msg\nsection .text\nglobal _start\n_start:\n  mov eax,4\n  mov ebx,1\n  mov ecx,msg\n  mov edx,len\n  int 0x80\n  mov eax,1\n  xor ebx,ebx\n  int 0x80\n` },

  // Mobile
  { id: "swift", label: "Swift", category: "Mobile", starter: `print("Hello, world")\n` },
  { id: "objectivec", label: "Objective-C", category: "Mobile", starter: `#import <Foundation/Foundation.h>\nint main(){ NSLog(@"Hello"); return 0; }\n` },
  { id: "flutter", label: "Flutter (Dart)", category: "Mobile", starter: `import 'package:flutter/material.dart';\nvoid main() => runApp(MaterialApp(home: Scaffold(body: Center(child: Text('Hello')))));\n` },
  { id: "reactnative", label: "React Native", category: "Mobile", starter: `import {Text} from 'react-native';\nexport default () => <Text>Hello</Text>;\n` },

  // Data / ML
  { id: "r", label: "R", category: "Data", starter: `print("Hello, world")\n` },
  { id: "julia", label: "Julia", category: "Data", starter: `println("Hello, world")\n` },
  { id: "matlab", label: "MATLAB", category: "Data", starter: `disp('Hello, world')\n` },
  { id: "sql", label: "SQL", category: "Data", starter: `SELECT 'Hello, world' AS greeting;\n` },
  { id: "pyspark", label: "PySpark", category: "Data", starter: `from pyspark.sql import SparkSession\nspark = SparkSession.builder.getOrCreate()\nspark.range(5).show()\n` },

  // Shell / DevOps
  { id: "bash", label: "Bash", category: "Shell", starter: `#!/usr/bin/env bash\necho "Hello, world"\n` },
  { id: "powershell", label: "PowerShell", category: "Shell", starter: `Write-Host "Hello, world"\n` },
  { id: "zsh", label: "Zsh", category: "Shell", starter: `#!/usr/bin/env zsh\nprint "Hello"\n` },
  { id: "dockerfile", label: "Dockerfile", category: "DevOps", starter: `FROM alpine:3\nCMD ["echo","hello"]\n` },
  { id: "yaml", label: "YAML", category: "DevOps", starter: `name: build\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo hello\n` },
  { id: "terraform", label: "Terraform (HCL)", category: "DevOps", starter: `resource "null_resource" "hello" {}\n` },
  { id: "nginx", label: "Nginx config", category: "DevOps", starter: `server { listen 80; location / { return 200 'hello'; } }\n` },

  // Smart contracts / blockchain
  { id: "solidity", label: "Solidity", category: "Blockchain", starter: `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\ncontract Hello { string public greet = "Hello"; }\n` },
  { id: "vyper", label: "Vyper", category: "Blockchain", starter: `# @version ^0.3.0\ngreet: public(String[20])\n` },
  { id: "move", label: "Move", category: "Blockchain", starter: `module hello::Hello { public fun greet(): u64 { 42 } }\n` },

  // Functional / academic
  { id: "lisp", label: "Common Lisp", category: "Functional", starter: `(format t "Hello, world~%")\n` },
  { id: "scheme", label: "Scheme", category: "Functional", starter: `(display "Hello") (newline)\n` },
  { id: "elm", label: "Elm", category: "Functional", starter: `import Html exposing (text)\nmain = text "Hello"\n` },
  { id: "purescript", label: "PureScript", category: "Functional", starter: `module Main where\nimport Effect.Console (log)\nmain = log "Hello"\n` },

  // Game / graphics
  { id: "gdscript", label: "GDScript (Godot)", category: "Game", starter: `extends Node\nfunc _ready(): print("Hello")\n` },
  { id: "glsl", label: "GLSL Shader", category: "Game", starter: `void main(){ gl_FragColor = vec4(1.0,0.5,0.2,1.0); }\n` },
  { id: "hlsl", label: "HLSL Shader", category: "Game", starter: `float4 main():SV_Target { return float4(1,0,0,1); }\n` },

  // Misc
  { id: "groovy", label: "Groovy", category: "Misc", starter: `println "Hello"\n` },
  { id: "fortran", label: "Fortran", category: "Misc", starter: `program hello\n  print *, "Hello"\nend program\n` },
  { id: "cobol", label: "COBOL", category: "Misc", starter: `IDENTIFICATION DIVISION.\nPROGRAM-ID. HELLO.\nPROCEDURE DIVISION.\n  DISPLAY 'Hello'.\n  STOP RUN.\n` },
  { id: "ada", label: "Ada", category: "Misc", starter: `with Ada.Text_IO; procedure Main is begin Ada.Text_IO.Put_Line("Hello"); end;\n` },
  { id: "prolog", label: "Prolog", category: "Misc", starter: `:- write('Hello, world'), nl.\n` },
  { id: "racket", label: "Racket", category: "Misc", starter: `#lang racket\n(displayln "Hello")\n` },
  { id: "vhdl", label: "VHDL", category: "Hardware", starter: `entity hello is end; architecture a of hello is begin end;\n` },
  { id: "verilog", label: "Verilog", category: "Hardware", starter: `module hello; initial $display("Hello"); endmodule\n` },
];

const byId = (id: string) => LANGUAGES.find(l => l.id === id) || LANGUAGES[0];

// Per-language drafts prevent accidentally losing work when switching editors.
// Browser-local only: users should still export backups before clearing storage.
const DRAFTS_KEY = "portforge_workspace_language_drafts_v1";
type WorkspaceDraft = { code: string; desc: string };
function readDrafts(): Record<string, WorkspaceDraft> {
  try {
    const value = JSON.parse(localStorage.getItem(DRAFTS_KEY) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}
function storeDraft(id: string, code: string, desc: string) {
  if (code.length > 30000) return;
  const drafts = readDrafts();
  drafts[id] = { code, desc };
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export default function Workspace() {
  const [langId, setLangId] = useState<string>("javascript");
  const lang = byId(langId);
  const [code, setCode] = useState(lang.starter);
  const [desc, setDesc] = useState("FizzBuzz implementation");
  const [difficulty, setDifficulty] = useState<PracticeLevel>("beginner");
  const [recipeId, setRecipeId] = useState("");
  const [recipeChecks, setRecipeChecks] = useState<string[]>([]);
  const chosenRecipe=findWorkspaceRecipe(recipeId);
  const [output, setOutput] = useState<string[]>([]);
  const [evalData, setEvalData] = useState<PEval | null>(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);

  // Picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(l =>
      l.label.toLowerCase().includes(q) || l.id.includes(q) || l.category.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const g: Record<string, LangDef[]> = {};
    for (const l of filtered) (g[l.category] ||= []).push(l);
    return g;
  }, [filtered]);

  function loadRecipe(id:string){
    const recipe=findWorkspaceRecipe(id);
    if(!recipe)return;
    if(code.trim() && code!==byId(langId).starter &&
      !window.confirm("Load this guided project template? The current editor will be replaced. Your existing draft is saved separately for its language."))return;
    try{storeDraft(langId,code,desc);}catch{toast.info("Your existing draft could not be saved in this browser.");}
    setLangId(recipe.language);
    setCode(recipe.starter);
    setDesc(recipe.title);
    setDifficulty(recipe.difficulty);
    setRecipeId(recipe.id);
    setRecipeChecks([]);
    setEvalData(null);
    setOutput([]);
    toast.info("Project brief loaded. Complete the TODOs and verify the acceptance criteria before documenting your work.");
  }
  function selectLang(id: string) {
    if (id === langId) { setPickerOpen(false); return; }
    try { storeDraft(langId, code, desc); }
    catch { toast.error("Could not save the current language draft on this device."); }
    const l = byId(id);
    const saved = readDrafts()[id];
    setLangId(id);
    setCode(typeof saved?.code === "string" && saved.code.length <= 30000 ? saved.code : l.starter);
    setDesc(typeof saved?.desc === "string" ? saved.desc : l.label + " practice project");
    setEvalData(null);
    setOutput([]);
    setRecipeId("");
    setRecipeChecks([]);
    setPickerOpen(false);
    setSearch("");
  }

  // The execution frame has a unique opaque origin with no network access.
  async function run() {
    if (running) return;
    setOutput([]);
    if (!lang.runnable) {
      setOutput(["[INFO] This language is available for editing and AI review, but cannot be run in this browser preview.", "[INFO] Only JavaScript examples have an isolated local runtime."]);
      return;
    }
    setRunning(true);
    try {
      setOutput(await runIsolatedJavaScript(code));
    } catch (error) {
      setOutput(["[ERROR] " + (error instanceof Error ? error.message : "Execution failed")]);
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem("aero_workspace");
      if (!raw) return;
      const state = JSON.parse(raw);
      if (typeof state.langId === "string" && typeof state.code === "string" && typeof state.desc === "string" && state.code.length < 30001) {
        setLangId(byId(state.langId).id);
        setCode(state.code);
        setDesc(state.desc);
      }
    } catch { /* malformed local draft: start with a safe example */ }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        storeDraft(langId, code, desc);
        localStorage.setItem("aero_workspace", JSON.stringify({ langId, code, desc }));
      } catch { /* Private mode or full storage: manual Save reports the error. */ }
    }, 650);
    return () => window.clearTimeout(timer);
  }, [langId, code, desc]);

  function save() {
    try {
      storeDraft(langId, code, desc);
      localStorage.setItem("aero_workspace", JSON.stringify({ langId, code, desc }));
      toast.success("Saved on this device");
    } catch {
      toast.error("Your browser could not save the project. Copy the code to a safe location.");
    }
  }

  async function submit() {
    if (!code.trim() || loading) return;
    if (code.length > 30000) { toast.error("Use up to 30,000 characters for review."); return; }
    setLoading(true);
    let data: PEval | null = null;
    let error: unknown = null;
    try {
      const response = await supabase.functions.invoke("ai-evaluate", {
        body: { mode: "project_evaluate", code, description: desc.trim().slice(0, 500) || lang.label + " project", language: lang.label, difficulty },
      });
      data = response.data as PEval | null;
      error = response.error;
    } catch {
      toast.error("AI review unavailable. Your draft remains safely saved on this device.");
      return;
    } finally {
      setLoading(false);
    }
    if (error || !data) { toast.error("AI review is unavailable. Your draft is preserved."); return; }
    if (!data?.scores || !["logic", "quality", "structure", "creativity"].every(k =>
      typeof data.scores[k] === "number" && Number.isFinite(data.scores[k]) &&
      data.scores[k] >= 0 && data.scores[k] <= 5
    ) || !["Beginner", "Intermediate", "Strong"].includes(data.level) ||
      typeof data.verdict !== "string" || !Array.isArray(data.resources) ||
      !Array.isArray(data.upgrades)) {
      toast.error("The AI review was incomplete. Your draft has been preserved.");
      return;
    }
    setEvalData({
      ...data,
      resources: data.resources.filter((r: {url?:unknown}) =>
        typeof r.url === "string" && /^https:\/\/[^\s]+$/i.test(r.url)
      ).slice(0, 5),
      upgrades: data.upgrades.slice(0, 3),
    });
    try { addToPortfolio({
      type: "project", title: desc || "Untitled Project", skill: lang.label,
      level: data.level, scores: { logic:data.scores.logic, clarity:data.scores.quality, depth:data.scores.structure, quality:data.scores.quality, structure:data.scores.structure, creativity:data.scores.creativity }, verdict: data.verdict,
    });
    toast.success("AI-reviewed project saved locally. Review is advisory, not a passed test.");
    } catch { toast.info("Review completed, but browser storage could not save it."); }
  }

  function downloadSource() {
    const ext = ({javascript:"js",typescript:"ts",python:"py",html:"html",css:"css",java:"java",go:"go",rust:"rs"} as Record<string,string>)[langId] || "txt";
    const file = new Blob([code], {type:"text/plain;charset=utf-8"});
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portforge-project-" + langId + "." + ext;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-7 sm:py-10 grid lg:grid-cols-12 gap-5 sm:gap-6">
      <ModuleIntro eyebrow="03 / BUILD" title="Give your ideas somewhere to grow."
        description="Write real code, keep drafts organised and improve through clear feedback. JavaScript examples run in a restricted sandbox; other languages support editing and review."
        highlights={["Autosaved drafts", "Safe JavaScript practice", "Project feedback"]} icon={<Terminal size={16}/>} />
      <div className="lg:col-span-12"><AIAccountNotice /></div>
      <section className="lg:col-span-12 panel p-4 sm:p-6 space-y-4" aria-labelledby="workspace-project-briefs">
        <div className="flex flex-wrap justify-between gap-3 items-start">
          <div>
            <h2 id="workspace-project-briefs" className="text-xl sm:text-2xl font-bold">Build something real, one project at a time.</h2>
            <p className="text-sm text-muted-foreground mt-2">Start with a clear problem, editable starter code, and observable acceptance criteria. JavaScript runs in a restricted browser sandbox; Python and SQL are editor-only.</p>
          </div>
          <span className="chip chip-cyan text-xs">7 guided project briefs</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {workspaceRecipes.map(recipe=><button type="button" key={recipe.id}
            onClick={()=>loadRecipe(recipe.id)}
            aria-pressed={recipeId===recipe.id}
            className={"text-left rounded-xl border p-4 space-y-2 "+(recipeId===recipe.id?"border-led-cyan bg-led-cyan/10":"border-border bg-surface-2/30 hover:border-led-cyan/40")}>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase text-led-cyan"><span>{recipe.language}</span><span>· {recipe.difficulty}</span></div>
            <h3 className="font-bold text-sm">{recipe.title}</h3>
            <p className="text-xs text-muted-foreground">{recipe.description}</p>
          </button>)}
        </div>
        {chosenRecipe&&<div className="rounded-xl border border-led-cyan/30 bg-led-cyan/5 p-4 space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div><h3 className="font-bold">{chosenRecipe.title} — project requirements</h3>
              <p className="text-sm text-muted-foreground mt-1">{chosenRecipe.brief}</p></div>
            <Link to="/portfolio" className="rounded-lg border border-border px-3 py-2 text-xs font-bold">
              Document your genuine outcome in Portfolio
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">{recipeChecks.length}/{chosenRecipe.acceptance.length} requirements self-checked. These boxes are not automated test results.</p>
          <div className="grid md:grid-cols-3 gap-3">
            {chosenRecipe.acceptance.map((criterion,i)=><label key={criterion} className="text-xs flex gap-2 items-start p-3 rounded-lg border border-border/70 bg-background/40">
              <input type="checkbox" aria-label={"Requirement "+(i+1)+": "+criterion}
                checked={recipeChecks.includes(criterion)}
                onChange={e=>setRecipeChecks(prev=>e.target.checked?[...prev,criterion]:prev.filter(x=>x!==criterion))}
                className="mt-0.5 accent-led-cyan"/>
              <span>{criterion}</span>
            </label>)}
          </div>
        </div>}
      </section>
      {/* CENTER — Editor */}
      <section className="lg:col-span-8 space-y-4">
        <Panel label="WORKSPACE" status={`MOD 03 // ${lang.label.toUpperCase()}`} statusVariant="cyan">
          <div className="p-5 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={desc} maxLength={180} aria-label="Project name or description" onChange={(e) => { setDesc(e.target.value); setEvalData(null); }}
                placeholder="Project description (e.g. A todo CRUD app)"
                className="flex-1 min-w-[200px] bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-led-cyan/50"
              />

              {/* Language picker */}
              <div className="relative">
                <button
                  onClick={() => setPickerOpen(o => !o)}
                  className="inline-flex items-center gap-2 border border-border rounded px-3 py-2 text-xs font-mono tracking-wider bg-surface-2 hover:border-led-cyan/50 min-w-[180px] justify-between"
                >
                  <span className="text-led-cyan">{lang.label}</span>
                  <ChevronsUpDown className="size-3.5 text-muted-foreground" />
                </button>

                {pickerOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setPickerOpen(false)} />
                    <div className="absolute right-0 mt-1 w-[320px] max-h-[420px] z-40 bg-background border border-border rounded shadow-xl overflow-hidden flex flex-col">
                      <div className="p-2 border-b border-border flex items-center gap-2 bg-surface-2">
                        <Search className="size-3.5 text-muted-foreground" />
                        <input
                          autoFocus
                          value={search} onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search language…"
                          className="flex-1 bg-transparent text-xs focus:outline-none"
                        />
                        <span className="text-[10px] font-mono text-muted-foreground">{filtered.length}</span>
                      </div>
                      <div className="overflow-y-auto flex-1">
                        {Object.entries(grouped).map(([cat, items]) => (
                          <div key={cat}>
                            <div className="px-3 py-1.5 text-[9px] font-mono tracking-widest text-muted-foreground uppercase bg-surface-2/50 sticky top-0">
                              {cat}
                            </div>
                            {items.map(l => (
                              <button
                                key={l.id}
                                onClick={() => selectLang(l.id)}
                                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-led-cyan/10 ${l.id === langId ? "text-led-cyan" : ""}`}
                              >
                                <span>{l.label}</span>
                                {l.id === langId && <Check className="size-3.5" />}
                                {l.runnable && l.id !== langId && <span className="chip chip-green text-[8px]">RUN</span>}
                              </button>
                            ))}
                          </div>
                        ))}
                        {filtered.length === 0 && (
                          <div className="p-4 text-xs text-muted-foreground text-center">No matches.</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <textarea
              value={code} onChange={(e) => { setCode(e.target.value); setEvalData(null); }}
              aria-label={lang.label + " source code editor"}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                  e.preventDefault(); save();
                }
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && lang.runnable) {
                  e.preventDefault(); void run();
                }
              }}
              spellCheck={false}
              className="w-full h-[420px] bg-background border border-border rounded p-4 text-sm font-mono leading-relaxed focus:outline-none focus:border-led-cyan/50 resize-none"
            />

            <p className="text-xs text-muted-foreground" role="note">
              Autosaved on this device · Ctrl/⌘+S to save · {lang.runnable ? "Ctrl/⌘+Enter to run JavaScript" : "Editing and AI review only — no runtime for " + lang.label} · {code.length.toLocaleString()} characters
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="workspace-review-level" className="text-xs text-muted-foreground">Review difficulty</label>
              <select id="workspace-review-level" value={difficulty} onChange={e => {setDifficulty(e.target.value as PracticeLevel);setEvalData(null);}}
                className="rounded-lg border border-border bg-background px-3 py-2 text-xs">
                {practiceLevels.map(level=><option key={level} value={level}>{levelGuidance[level].label}</option>)}
              </select>
              <span className="text-xs text-muted-foreground">AI reviews are advisory; only JavaScript runs here.</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={run} disabled={running} className="bg-foreground text-background font-bold text-sm px-4 py-2.5 rounded hover:bg-led-green transition-colors inline-flex items-center gap-2">
                <Play className="size-4" /> {running ? "RUNNING…" : lang.runnable ? "RUN JAVASCRIPT" : "RUNTIME UNAVAILABLE"}
              </button>
              <button onClick={save} className="border border-border bg-surface-2 text-sm px-4 py-2.5 rounded hover:border-led-cyan/50 inline-flex items-center gap-2">
                <Save className="size-4" /> SAVE
              </button>
              <button onClick={downloadSource} type="button"
                className="border border-border bg-surface-2 text-sm px-4 py-2.5 rounded hover:border-led-cyan/50 inline-flex items-center gap-2">
                <Download className="size-4" /> EXPORT CODE
              </button>
              <button onClick={submit} disabled={loading || !code.trim() || code.length > 30000} className="ml-auto bg-led-cyan text-background font-bold text-sm px-5 py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                REQUEST AI CODE REVIEW
              </button>
            </div>
          </div>
        </Panel>

        <Panel label="CONSOLE" status="OUTPUT" statusVariant="green">
          <div className="p-5">
            <div className="bg-background border border-border rounded p-4 min-h-[120px] font-mono text-xs leading-relaxed">
              {output.length === 0 ? <span className="text-muted-foreground">— Run code to see output —</span> :
                output.map((l, i) => (
                  <div key={i} className={l.startsWith("[ERROR]") ? "text-led-alert" : l.startsWith("[INFO]") ? "text-led-amber" : "text-foreground"}>
                    <span className="text-muted-foreground mr-2">{i + 1}</span>{l}
                  </div>
                ))
              }
            </div>
          </div>
        </Panel>
      </section>

      {/* RIGHT — Eval */}
      <aside className="lg:col-span-4 space-y-4">
        <Panel label="AI GRADER" status={evalData ? "GRADED" : "STANDBY"} statusVariant={evalData ? "green" : "cyan"}>
          <div className="p-5 space-y-4">
            {!evalData && (
              <p className="text-sm text-muted-foreground py-8 text-center">
                <Terminal className="size-8 mx-auto mb-3 text-led-cyan" />
                Request advisory AI feedback for {lang.label}. Only JavaScript can run in the isolated browser sandbox; other languages are not execution-tested.
              </p>
            )}
            {evalData && (
              <div className="space-y-4 animate-fade-up">
                <div className="flex items-center justify-between">
                  <span className={`chip ${evalData.level === "Strong" ? "chip-green" : evalData.level === "Intermediate" ? "chip-amber" : "chip-alert"}`}>{evalData.level}</span>
                  <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">AI REVIEWED</span>
                </div>
                <p className="text-sm font-semibold leading-snug">{evalData.verdict}</p>
                <div className="space-y-2">
                  <ScoreBar label="Logic" value={evalData.scores.logic} variant="cyan" />
                  <ScoreBar label="Code Quality" value={evalData.scores.quality} variant="violet" />
                  <ScoreBar label="Structure" value={evalData.scores.structure} variant="green" />
                  <ScoreBar label="Creativity" value={evalData.scores.creativity} variant="amber" />
                </div>
                <div className="p-3 rounded border border-led-alert/30 bg-led-alert/5">
                  <div className="text-[10px] font-mono tracking-widest text-led-alert uppercase mb-1">❌ ISSUES</div>
                  <p className="text-xs leading-relaxed">{evalData.whatWentWrong}</p>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-led-green uppercase mb-2">✅ IMPROVED</div>
                  <pre className="bg-background border border-border rounded p-3 text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">{evalData.improvedCode}</pre>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-led-cyan uppercase mb-2">📘 RESOURCES</div>
                  <div className="space-y-2">
                    {evalData.resources.map((r) => (
                      <a key={r.title} href={r.url} target="_blank" rel="noreferrer" className="block p-2 rounded border border-border bg-surface-2 hover:border-led-cyan/40 text-xs">
                        <div className="font-semibold flex items-center justify-between">
                          {r.title}
                          <span className={`chip text-[9px] ${r.kind === "free" ? "chip-green" : "chip-amber"}`}>{r.kind}</span>
                        </div>
                        <div className="text-muted-foreground text-[11px] mt-1">{r.why}</div>
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-led-violet uppercase mb-2">🚀 UPGRADES</div>
                  {evalData.upgrades.map((u) => {
                    const dot = u.tier === "beginner" ? "🟢" : u.tier === "intermediate" ? "🟡" : "🔴";
                    return (
                      <div key={u.name} className="p-2 rounded border border-border bg-surface-2 mb-2 text-xs">
                        <div className="font-semibold">{dot} {u.name}</div>
                        <div className="text-muted-foreground text-[11px] mt-1">{u.description}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Panel>
      </aside>
    </div>
  );
}
