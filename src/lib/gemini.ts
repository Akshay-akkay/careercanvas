import { CoreProfile } from "../types";
import { supabase } from "./supabaseClient";

const CORE_PROFILE_SCHEMA = `
{
  "personalDetails": { 
    "name": "string", 
    "email": "string", 
    "phone": "string", 
    "links": [{ "type": "linkedin" | "github" | "portfolio" | "other", "url": "string", "text": "string" }] 
  },
  "summary": "string",
  "skills": {
    "Category Name (e.g., 'Frontend', 'Backend')": ["string"]
  },
  "experience": [{ "title": "string", "company": "string", "duration": "string", "responsibilities": ["string"] }],
  "education": [{ "degree": "string", "university": "string", "year": "string" }],
  "projects": [{ "title": "string", "description": ["string"], "techStack": ["string"], "link": "string" }],
  "certifications": [{ "name": "string", "authority": "string", "year": "string" }]
}
`;

export const AI_MERGE_PROMPT_TEMPLATE = `
You are a meticulous, deterministic data-consolidation engine.

OUTPUT SPECIFICATION  
Your reply **MUST** consist of exactly two top-level XML-like blocks **in this order**:
<reasoning>…</reasoning>
<json_output>…</json_output>
Nothing — absolutely nothing — may appear outside these tags.  
• Do **NOT** include Markdown, code fences, or any additional commentary.  
• The content inside <json_output> must be valid JSON that conforms **exactly** to the schema below.

JSON Schema:
---
${CORE_PROFILE_SCHEMA}
---

Profiles to Merge:
---
Primary Profile:
{primaryProfileJson}

Secondary Profiles:
{secondaryProfilesJson}
---

Merging Rules (follow **all** with extreme precision):

1.  **Primary Data Precedence** – The final 'name', 'email', and 'phone' fields come **only** from the Primary Profile.

2.  **Synthesised Summary** – Create a brand-new 'summary' (2-4 sentences) that factually blends the candidate's core role, total years of experience, key technical domains, and headline technologies from **all** profiles.

3.  **Skills Consolidation & Categorisation**  
a. Combine skills from every profile into a master list.  
b. Normalise spelling/casing (e.g. "NodeJS", "Node.js" → "Node.js").  
c. Remove duplicates (case-insensitive).  
d. Assign each distinct skill to **one** of: "Languages", "Frontend", "Backend", "Databases", "DevOps & Cloud", "Testing", "Tools & Platforms", "Methodologies & Practices".  
e. The final 'skills' object is a dictionary whose keys are the category names; values are alphabetically-sorted arrays of skills.  
f. Sort the categories alphabetically too.

4.  **Experience Merging**  
• Uniqueness is determined by a case-insensitive match on 'company'.  
• If the company exists in only one profile → include the entry as-is (but still apply rule 4d).  
• If it appears in multiple profiles:
    a. Output **one** combined entry.  
    b. 'duration' spans the entire employment period.  
    c. 'title' is the most recent title; append earlier titles chronologically in parentheses.  
    d. **Responsibilities**  
       i.   Merge all responsibility bullets; delete exact duplicates (case-sensitive).  
       ii.  Tag each bullet as "Backend", "Mobile", "Frontend", or "Other".  
       iii. Order bullets strictly: Backend → Mobile → Frontend → Other.  
       iv.  Re-phrase each bullet to use strong, achievement-oriented verbs **without discarding information**.

5.  **Project Merging** – Similar logic applies, keyed on case-insensitive 'title'. Merge 'description' arrays, de-duplicate, and keep the record with the richest 'techStack'/'link'.

6.  **Education & Certification De-duplication** – Merge and keep the most detailed record when duplicates by 'university'/'degree' (education) or 'name' (certifications) are found.

7.  **Links** – Merge by 'url'; keep the first occurrence.

Begin.  Output only the two required blocks — no additional text.`;


const EXTRACTION_PROMPT_TEMPLATE = `
You are a state-of-the-art resume-parsing AI.  Convert the raw resume text below into a structured JSON object.

Rules:
1. Follow the JSON schema **exactly**.  No extra keys, no missing keys.  
2. Return **only** the JSON — no <json_output> tag, no Markdown fences, no commentary.  
3. Ensure the JSON is syntactically valid (no trailing commas, proper quoting).

JSON Schema:
---
${CORE_PROFILE_SCHEMA}
---

Resume Text:
---
{resumeText}
---

Respond now with the structured JSON.`;


const GENERATION_PROMPT_TEMPLATE = `
You are an elite AI resume-writing assistant.  Using the consolidated core profile and the target job description, craft a laser-focused resume.

Core Profile (already merged & categorised):
---
{coreProfileJson}
---

Target Job Description:
---
{jobDescription}
---

STRICT RULES – follow every point:

1. **Information Source** – Use **only** data present in the core profile. Never invent skills, dates, or achievements.

2. **Tailored Summary** – Rewrite the 'summary' into 2-4 compelling sentences that directly map to the job requirements.

3. **Experience Section**  
a. You may rephrase bullets to amplify achievements and align with the JD.  
b. Move the most relevant bullets to the top; keep max **6 bullets** per role.  
c. Each bullet ≤ 25 words; split longer ones.  
d. Bold (** … **) keywords from the JD that also exist in the bullet (technologies, methodologies, tools). Do **NOT** bold verbs or generic words.

4. **Skills Section**  
a. Derive the required skills from the JD.  
b. From the profile's skills, output **only** those that match JD needs.  
c. Preserve original categories; list skills alphabetically within each category.  
d. Do not add synonyms or skills absent from the profile.

5. **Preserve Core Facts** – Do not change company names, titles, dates ('duration'), project names, or education details.

6. **Output Format** – Deliver the complete, professionally formatted resume text (no JSON, no tags, no Markdown fences).

Begin when ready.`;

async function invokeAIGemini(prompt: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke('gemini-api', {
        body: { prompt },
    });

    if (error) {
        console.error("Error calling Supabase function:", error);
        throw new Error("The AI service is currently unavailable or encountered an error.");
    }

    return data;
}

function cleanAndParseJson<T>(rawAiResponse: string): T {
    let jsonString = rawAiResponse;

    // Check if the response contains the special <json_output> block.
    const jsonOutputMatch = rawAiResponse.match(/<json_output>([\s\S]*?)<\/json_output>/);

    if (jsonOutputMatch && jsonOutputMatch[1]) {
        // If it does, use the content of that block.
        jsonString = jsonOutputMatch[1];
    }

    try {
        // Clean up any remaining markdown fences, just in case.
        const cleanedText = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText) as T;
    } catch {
        console.error("Failed to parse AI JSON response. Raw text:", rawAiResponse);
        throw new Error("AI returned a response in an unexpected format. Could not parse JSON.");
    }
}

export const extractStructuredData = async (resumeText: string): Promise<CoreProfile> => {
  if (!resumeText.trim()) {
    throw new Error("Resume text cannot be empty.");
  }
  const prompt = EXTRACTION_PROMPT_TEMPLATE.replace('{resumeText}', resumeText);
  const rawResponse = await invokeAIGemini(prompt);
  const parsedJson = cleanAndParseJson<CoreProfile>(rawResponse);
  
  if (!parsedJson.personalDetails || !parsedJson.skills) {
      throw new Error("AI failed to return a valid profile structure during extraction.");
  }
  return parsedJson;
};

export const invokeAIMerge = async (prompt: string): Promise<CoreProfile> => {
    const rawResponse = await invokeAIGemini(prompt);
    return cleanAndParseJson<CoreProfile>(rawResponse);
};

export const generateTailoredResume = async (coreProfile: CoreProfile, jobDescription: string): Promise<string> => {
    const coreProfileJson = JSON.stringify(coreProfile, null, 2);
    const prompt = GENERATION_PROMPT_TEMPLATE
        .replace('{coreProfileJson}', coreProfileJson)
        .replace('{jobDescription}', jobDescription);

    return await invokeAIGemini(prompt);
};

/**
 * Given the current core profile and a natural-language instruction, ask Gemini
 * to return an updated profile JSON. The response **must** be valid JSON (plain
 * or wrapped in <json_output> tags) conforming to the CoreProfile schema.
 */
export const applyProfileEdit = async (currentProfile: CoreProfile, instruction: string): Promise<CoreProfile> => {
    const EDIT_PROMPT = `
You are a JSON transformation AI. Given a user's instruction, modify the source JSON.
Your reply **MUST** be only the transformed, valid JSON, with no commentary, tags, or markdown.

Instruction: "${instruction}"

Source JSON:
---
${JSON.stringify(currentProfile, null, 2)}
---

Now, output the modified JSON.
`;

    const rawResponse = await invokeAIGemini(EDIT_PROMPT);
    return cleanAndParseJson<CoreProfile>(rawResponse);
}
