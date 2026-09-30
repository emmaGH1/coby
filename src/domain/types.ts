export type ItemKind = 'task' | 'event' | 'reminder';
export type ItemStatus = 'captured' | 'planned' | 'active' | 'completed' | 'archived';
export type CommitmentMode = 'none' | 'gentle' | 'persistent' | 'locked';
export type ExplicitPriority = 'urgent' | 'important' | null;

export type ParsedItem = {
  title: string;
  sourceFragment: string;
  kind: ItemKind;
  dueDate: string | null;
  dueAt: string | null;
  durationMinutes: number | null;
  explicitPriority: ExplicitPriority;
  confidence: number;
  needsClarification: boolean;
  clarificationQuestion: string | null;
};

export type ParseResult = { items: ParsedItem[] };

export type CobyItem = ParsedItem & {
  id: string;
  sourceText: string;
  createdAt: string;
  status: ItemStatus;
  commitmentMode: CommitmentMode;
  completedAt: string | null;
  reminderAt?: string | null;
  lastNudgeResponseId?: string;
};
