export interface Participant {
  id: string;
  name: string;
}

export enum AppMode {
  Input = 'INPUT',
  Draw = 'DRAW',
  Group = 'GROUP'
}

export interface DrawSettings {
  allowRepeats: boolean;
}

export interface GroupSettings {
  groupSize: number;
}
