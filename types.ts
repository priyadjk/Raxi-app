export interface Source {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
  sources?: Source[];
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
}
