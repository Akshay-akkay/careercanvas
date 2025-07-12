import { CoreProfile } from '../types';
import { AI_MERGE_PROMPT_TEMPLATE, invokeAIMerge } from './gemini';

/**
 * Merges a primary profile with an array of secondary profiles using a sophisticated AI model.
 * The AI is instructed to handle complex de-duplication, semantic merging of experiences,
 * and generation of a new, consolidated summary based on a precise set of rules.
 *
 * @param primaryProfile The base profile. Its root-level identity properties (`name`, `email`, `phone`) take precedence.
 * @param secondaryProfiles An array of profiles to merge into the primary one.
 * @returns A Promise resolving to a new, AI-consolidated CoreProfile instance.
 */
export async function mergeProfiles(primaryProfile: CoreProfile, secondaryProfiles: CoreProfile[]): Promise<CoreProfile> {
  
  const primaryProfileJson = JSON.stringify(primaryProfile, null, 2);
  const secondaryProfilesJson = JSON.stringify(secondaryProfiles, null, 2);

  const prompt = AI_MERGE_PROMPT_TEMPLATE
    .replace('{primaryProfileJson}', primaryProfileJson)
    .replace('{secondaryProfilesJson}', secondaryProfilesJson);

  try {
    const mergedProfile = await invokeAIMerge(prompt);
    return mergedProfile;
  } catch (error) {
    console.error("AI-powered profile merging failed:", error);
    // Re-throw the error to be caught by the caller in the store
    throw error;
  }
}
