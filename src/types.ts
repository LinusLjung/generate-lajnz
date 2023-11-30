export type RcType = {
  types: Record<
    string,
    {
      rootDir?: string;
      variables?: string[];
    }
  >;
};

export type ActionType = 'init' | 'add';

export type PromptType = {
  action: ActionType;
} & Record<'type' | 'name', string>;
