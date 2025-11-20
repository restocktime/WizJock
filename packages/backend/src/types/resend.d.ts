declare module 'resend' {
  export interface EmailResponse {
    id?: string;
  }

  export interface EmailError {
    message: string;
  }

  export interface SendEmailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
  }

  export class Resend {
    constructor(apiKey: string);
    emails: {
      send(options: SendEmailOptions): Promise<{
        data: EmailResponse | null;
        error: EmailError | null;
      }>;
    };
  }
}
