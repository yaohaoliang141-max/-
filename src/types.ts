export interface TitleOption {
  title: string;
  coverText: string;
  appliedFormula: string;
  rationale: string;
}

export interface GenerateResponse {
  douyin: TitleOption[];
  bilibili: TitleOption[];
  financial: TitleOption[];
}
