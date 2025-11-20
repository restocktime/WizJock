import { Resend } from 'resend';
import { logger } from '../utils/logger';
import monitoringService from './MonitoringService';

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bettingExperience: string;
  smsConsent: boolean;
  createdAt: Date;
}

interface EmailServiceConfig {
  apiKey: string;
  fromEmail: string;
  adminEmail: string;
}

class EmailService {
  private resend: Resend;
  private fromEmail: string;
  private adminEmail: string;
  private maxRetries: number = 3;
  private baseDelay: number = 1000; // 1 second

  constructor(config: EmailServiceConfig) {
    this.resend = new Resend(config.apiKey);
    this.fromEmail = config.fromEmail;
    this.adminEmail = config.adminEmail;
  }

  /**
   * Send confirmation email to applicant
   */
  async sendApplicationConfirmation(application: Application): Promise<void> {
    const subject = 'WizJock Application Received - Next Steps';
    const html = this.getConfirmationEmailTemplate(application);

    await this.sendEmailWithRetry({
      to: application.email,
      subject,
      html,
      context: 'application_confirmation',
      applicationId: application.id,
    });
  }

  /**
   * Send notification email to admin
   */
  async sendAdminNotification(application: Application): Promise<void> {
    const subject = `New WizJock Application: ${application.fullName}`;
    const html = this.getAdminNotificationTemplate(application);

    await this.sendEmailWithRetry({
      to: this.adminEmail,
      subject,
      html,
      context: 'admin_notification',
      applicationId: application.id,
    });
  }

  /**
   * Send email with exponential backoff retry logic
   */
  private async sendEmailWithRetry(params: {
    to: string;
    subject: string;
    html: string;
    context: string;
    applicationId: string;
  }): Promise<void> {
    const { to, subject, html, context, applicationId } = params;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logger.info(`Attempting to send ${context} email`, {
          attempt,
          applicationId,
          // Note: recipient email not logged to protect PII
        });

        const { data, error } = await this.resend.emails.send({
          from: this.fromEmail,
          to,
          subject,
          html,
        });

        if (error) {
          throw new Error(`Resend API error: ${error.message}`);
        }

        logger.info(`Successfully sent ${context} email`, {
          attempt,
          applicationId,
          emailId: data?.id,
          // Note: recipient email not logged to protect PII
        });

        // Record successful email delivery
        monitoringService.recordEmailSent(context, applicationId);

        return; // Success, exit retry loop
      } catch (error) {
        const isLastAttempt = attempt === this.maxRetries;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        logger.error(`Failed to send ${context} email`, {
          attempt,
          maxRetries: this.maxRetries,
          applicationId,
          error: errorMessage,
          isLastAttempt,
          // Note: recipient email not logged to protect PII
        });

        if (isLastAttempt) {
          // Log final failure but don't throw - we don't want to block application submission
          logger.error(`Email delivery failed after ${this.maxRetries} attempts`, {
            context,
            applicationId,
            error: errorMessage,
            // Note: recipient email not logged to protect PII
          });
          
          // Record email failure for monitoring
          monitoringService.recordEmailFailed(context, applicationId, errorMessage);
          
          return;
        }

        // Exponential backoff: wait before retrying
        const delay = this.baseDelay * Math.pow(2, attempt - 1);
        logger.info(`Retrying email send after ${delay}ms`, {
          attempt,
          nextAttempt: attempt + 1,
          applicationId,
        });

        await this.sleep(delay);
      }
    }
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get confirmation email template for applicant
   */
  private getConfirmationEmailTemplate(application: Application): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>WizJock Application Received</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; margin: 0;">WizJock</h1>
          </div>
          
          <div style="background-color: #f9f9f9; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${application.fullName},</h2>
            
            <p>Thanks for your interest in WizJock!</p>
            
            <p>We've received your application and our team will review it within <strong>24-48 hours</strong>.</p>
            
            <h3 style="color: #1a1a1a; margin-top: 30px;">What happens next:</h3>
            <ol style="padding-left: 20px;">
              <li style="margin-bottom: 10px;">We'll review your application</li>
              <li style="margin-bottom: 10px;">If approved, you'll receive an email with subscription options and WhatsApp group access</li>
              <li style="margin-bottom: 10px;">You can reply to this email if you have any questions</li>
            </ol>
            
            <p style="margin-top: 30px;">In the meantime, check out our WhatsApp community to see what members are saying:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://chat.whatsapp.com/your-group-link" 
                 style="display: inline-block; background-color: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Join WhatsApp Community
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px;">
            <p style="margin: 10px 0;">
              Questions? Reply to this email or visit 
              <a href="https://wizjock.com/contact" style="color: #1a73e8;">wizjock.com/contact</a>
            </p>
            <p style="margin: 10px 0;">
              <a href="https://wizjock.com/privacy" style="color: #666; text-decoration: none;">Privacy Policy</a> | 
              <a href="https://wizjock.com/terms" style="color: #666; text-decoration: none;">Terms of Use</a>
            </p>
            <p style="margin: 10px 0; color: #999;">
              © ${new Date().getFullYear()} WizJock. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Get admin notification email template
   */
  private getAdminNotificationTemplate(application: Application): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New WizJock Application</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f0f7ff; border-left: 4px solid #1a73e8; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #1a1a1a; margin-top: 0;">New Application Received</h2>
          </div>
          
          <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Name:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${application.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Email:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                  <a href="mailto:${application.email}" style="color: #1a73e8;">${application.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Phone:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${application.phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Experience:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${this.formatExperience(application.bettingExperience)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>SMS Consent:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                  ${application.smsConsent ? '✅ Yes' : '❌ No'}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Submitted:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                  ${this.formatDate(application.createdAt)}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;"><strong>Application ID:</strong></td>
                <td style="padding: 10px 0; font-family: monospace; font-size: 12px;">${application.id}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; padding: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
            <p style="margin: 0;">This is an automated notification from the WizJock application system.</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Format betting experience for display
   */
  private formatExperience(experience: string): string {
    return experience.charAt(0).toUpperCase() + experience.slice(1);
  }

  /**
   * Format date for display
   */
  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  }
}

// Export singleton instance
let emailServiceInstance: EmailService | null = null;

export const initializeEmailService = (config: EmailServiceConfig): EmailService => {
  emailServiceInstance = new EmailService(config);
  return emailServiceInstance;
};

export const getEmailService = (): EmailService => {
  if (!emailServiceInstance) {
    throw new Error('EmailService not initialized. Call initializeEmailService first.');
  }
  return emailServiceInstance;
};

export default EmailService;
