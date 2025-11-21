declare global {
  namespace Express {
    export interface Request {
      userId?: string
    }
  }
}

export {}; // make this as a module