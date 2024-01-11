export type RulesInterface = {
  id: number;
  name: string;
  description: string;
  idRules: number;
  idUsers: number;
  hasActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RuleFormData = {
  id: number;
  name: string;
  description: string;
  idRules: number;
  idUsers?: number;
  hasActive: boolean;
};
