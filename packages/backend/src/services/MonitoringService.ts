import { logger } from '../utils/logger';
import pool from '../db/connection';

interface MetricData {
  timestamp: Date;
  value: number;
  metadata?: Record<string, any>;
}

interface ApplicationMetrics {
  totalApplications: number;
  applicationsLast24h: number;
  applicationsLast7d: number;
  applicationsLast30d: number;
  averagePerDay: number;
  statusBreakdown: {
    pending: number;
    approved: number;
    rejected: number;
    contacted: number;
  };
}

interface EmailMetrics {
  totalEmailsSent: number;
  emailsLast24h: number;
  failedEmails: number;
  failureRate: number;
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  checks: {
    database: boolean;
    emailService: boolean;
    applicationRate: boolean;
  };
  timestamp: Date;
}

class MonitoringService {
  private metrics: Map<string, MetricData[]> = new Map();
  private alertThresholds = {
    minApplicationsPerDay: 1, // Alert if no applications in 24h
    maxErrorRate: 0.05, // Alert if error rate exceeds 5%
    maxEmailFailureRate: 0.1, // Alert if email failure rate exceeds 10%
  };

  /**
   * Track a metric
   */
  trackMetric(name: string, value: number, metadata?: Record<string, any>): void {
    const metric: MetricData = {
      timestamp: new Date(),
      value,
      metadata,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricArray = this.metrics.get(name)!;
    metricArray.push(metric);

    // Keep only last 1000 entries per metric
    if (metricArray.length > 1000) {
      metricArray.shift();
    }

    logger.info(`Metric tracked: ${name}`, { value, metadata });
  }

  /**
   * Get application metrics
   */
  async getApplicationMetrics(): Promise<ApplicationMetrics> {
    try {
      // Total applications
      const totalResult = await pool.query('SELECT COUNT(*) as count FROM applications');
      const totalApplications = parseInt(totalResult.rows[0].count);

      // Applications in last 24 hours
      const last24hResult = await pool.query(
        `SELECT COUNT(*) as count FROM applications 
         WHERE created_at >= NOW() - INTERVAL '24 hours'`
      );
      const applicationsLast24h = parseInt(last24hResult.rows[0].count);

      // Applications in last 7 days
      const last7dResult = await pool.query(
        `SELECT COUNT(*) as count FROM applications 
         WHERE created_at >= NOW() - INTERVAL '7 days'`
      );
      const applicationsLast7d = parseInt(last7dResult.rows[0].count);

      // Applications in last 30 days
      const last30dResult = await pool.query(
        `SELECT COUNT(*) as count FROM applications 
         WHERE created_at >= NOW() - INTERVAL '30 days'`
      );
      const applicationsLast30d = parseInt(last30dResult.rows[0].count);

      // Status breakdown
      const statusResult = await pool.query(
        `SELECT status, COUNT(*) as count FROM applications GROUP BY status`
      );
      const statusBreakdown = {
        pending: 0,
        approved: 0,
        rejected: 0,
        contacted: 0,
      };
      statusResult.rows.forEach((row) => {
        statusBreakdown[row.status as keyof typeof statusBreakdown] = parseInt(row.count);
      });

      // Calculate average per day (last 30 days)
      const averagePerDay = applicationsLast30d / 30;

      const metrics: ApplicationMetrics = {
        totalApplications,
        applicationsLast24h,
        applicationsLast7d,
        applicationsLast30d,
        averagePerDay: Math.round(averagePerDay * 100) / 100,
        statusBreakdown,
      };

      // Check for alerts
      if (applicationsLast24h === 0 && totalApplications > 0) {
        this.triggerAlert('no_applications_24h', {
          message: 'No applications received in the last 24 hours',
          severity: 'warning',
        });
      }

      return metrics;
    } catch (error) {
      logger.error('Error fetching application metrics', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get email delivery metrics from logs
   */
  getEmailMetrics(): EmailMetrics {
    const emailSentMetrics = this.metrics.get('email_sent') || [];
    const emailFailedMetrics = this.metrics.get('email_failed') || [];

    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;

    const emailsLast24h = emailSentMetrics.filter(
      (m) => m.timestamp.getTime() > last24h
    ).length;

    const failedEmailsLast24h = emailFailedMetrics.filter(
      (m) => m.timestamp.getTime() > last24h
    ).length;

    const totalEmailsSent = emailSentMetrics.length;
    const failedEmails = emailFailedMetrics.length;
    const failureRate =
      totalEmailsSent > 0 ? failedEmails / (totalEmailsSent + failedEmails) : 0;

    // Check for alerts
    if (failureRate > this.alertThresholds.maxEmailFailureRate) {
      this.triggerAlert('high_email_failure_rate', {
        message: `Email failure rate is ${(failureRate * 100).toFixed(2)}%`,
        severity: 'critical',
        failureRate,
      });
    }

    return {
      totalEmailsSent,
      emailsLast24h,
      failedEmails,
      failureRate: Math.round(failureRate * 10000) / 100, // Percentage with 2 decimals
    };
  }

  /**
   * Check system health
   */
  async checkSystemHealth(): Promise<SystemHealth> {
    const checks = {
      database: await this.checkDatabase(),
      emailService: this.checkEmailService(),
      applicationRate: await this.checkApplicationRate(),
    };

    const allHealthy = Object.values(checks).every((check) => check === true);
    const anyFailed = Object.values(checks).some((check) => check === false);

    const status: SystemHealth['status'] = allHealthy
      ? 'healthy'
      : anyFailed
      ? 'critical'
      : 'degraded';

    const health: SystemHealth = {
      status,
      checks,
      timestamp: new Date(),
    };

    if (status === 'critical') {
      this.triggerAlert('system_health_critical', {
        message: 'System health check failed',
        severity: 'critical',
        checks,
      });
    }

    return health;
  }

  /**
   * Check database connectivity
   */
  private async checkDatabase(): Promise<boolean> {
    try {
      await pool.query('SELECT 1');
      return true;
    } catch (error) {
      logger.error('Database health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * Check email service health
   */
  private checkEmailService(): boolean {
    // Check if we have recent email failures
    const emailFailedMetrics = this.metrics.get('email_failed') || [];
    const now = Date.now();
    const last5min = now - 5 * 60 * 1000;

    const recentFailures = emailFailedMetrics.filter(
      (m) => m.timestamp.getTime() > last5min
    ).length;

    // If more than 3 failures in last 5 minutes, consider unhealthy
    return recentFailures < 3;
  }

  /**
   * Check application submission rate
   */
  private async checkApplicationRate(): Promise<boolean> {
    try {
      const metrics = await this.getApplicationMetrics();
      
      // If we have applications but none in last 24h, might be an issue
      if (metrics.totalApplications > 10 && metrics.applicationsLast24h === 0) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Trigger an alert
   */
  private triggerAlert(alertType: string, data: Record<string, any>): void {
    logger.warn(`ALERT: ${alertType}`, data);

    // Track alert metric
    this.trackMetric('alert_triggered', 1, { alertType, ...data });

    // In production, this could:
    // - Send email to admin
    // - Send Slack notification
    // - Trigger PagerDuty
    // - Send SMS
    // For now, we just log it
  }

  /**
   * Get all metrics summary
   */
  async getMetricsSummary(): Promise<{
    applications: ApplicationMetrics;
    emails: EmailMetrics;
    systemHealth: SystemHealth;
  }> {
    const applications = await this.getApplicationMetrics();
    const emails = this.getEmailMetrics();
    const systemHealth = await this.checkSystemHealth();

    return {
      applications,
      emails,
      systemHealth,
    };
  }

  /**
   * Record email sent
   */
  recordEmailSent(context: string, applicationId: string): void {
    this.trackMetric('email_sent', 1, { context, applicationId });
  }

  /**
   * Record email failed
   */
  recordEmailFailed(context: string, applicationId: string, error: string): void {
    this.trackMetric('email_failed', 1, { context, applicationId, error });
  }

  /**
   * Record application submitted
   */
  recordApplicationSubmitted(applicationId: string): void {
    this.trackMetric('application_submitted', 1, { applicationId });
  }
}

// Export singleton instance
const monitoringService = new MonitoringService();
export default monitoringService;
