export interface Quest {
  category: string;
  name: string;
  "quest-type": string;
  reward: number;
  "contract-fee": number;
  "time-limit": number;
  location: string;
  "main-monsters": string[];
  "goal-condition": string;
  client: string;
  "quest-details": string;
  difficulty: number;
}
