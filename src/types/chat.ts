
  export interface Message {
    role: "user" | "agent";
    content: string;
    timestamp: Date;
  }
  
  export interface Session {
    id: string;
    title: string;
    date: string;
  }