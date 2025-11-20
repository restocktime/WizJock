# Monitoring and Alerts Guide

This guide explains the monitoring and alerting system implemented for the WizJock platform.

## Overview

The monitoring system tracks:
- Application submission metrics
- Email delivery success/failure rates
- System health (database, email service, application rate)
- Core Web Vitals (frontend performance)

## Backend Monitoring

### MonitoringService

Located at `src/services/MonitoringService.ts`, this service provides:

#### Application Metrics
- Total applications
- Applications in last 24h, 7d, 30d
- Average applications per day
- Status breakdown (pending, approved, rejected, contacted)

#### Email Metrics
- Total emails sent
- Emails sent in last 24h
- Failed emails count
- Failure rate percentage

#### System Health Checks
- Database connectivity
- Email service health
- Application submission rate

### API Endpoints

All monitoring endpoints require admin authentication except `/health`.

#### GET /api/monitoring/health
Public health check endpoint. Returns system health status.

**Response:**
```json
{
  "status": "healthy" | "degraded" | "critical",
  "checks": {
    "database": true,
    "emailService": true,
    "applicationRate": true
  },
  "timestamp": "2025-11-19T10:00:00.000Z"
}
```

#### GET /api/monitoring/metrics
Get all metrics summary (admin only).

**Response:**
```json
{
  "applications": {
    "totalApplications": 150,
    "applicationsLast24h": 5,
    "applicationsLast7d": 35,
    "applicationsLast30d": 120,
    "averagePerDay": 4.0,
    "statusBreakdown": {
      "pending": 20,
      "approved": 100,
      "rejected": 10,
      "contacted": 20
    }
  },
  "emails": {
    "totalEmailsSent": 300,
    "emailsLast24h": 10,
    "failedEmails": 5,
    "failureRate": 1.67
  },
  "systemHealth": {
    "status": "healthy",
    "checks": { ... },
    "timestamp": "2025-11-19T10:00:00.000Z"
  }
}
```

#### GET /api/monitoring/applications/list
Get paginated list of applications (admin only).

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (optional: pending, approved, rejected, contacted)

**Response:**
```json
{
  "applications": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### PATCH /api/monitoring/applications/:id
Update application status and notes (admin only).

**Request Body:**
```json
{
  "status": "approved",
  "notes": "Contacted via email"
}
```

## Frontend Monitoring

### Core Web Vitals Tracking

Located at `packages/client-portal/src/utils/analytics.ts`, the `trackWebVitals()` function tracks:

#### Largest Contentful Paint (LCP)
- Good: < 2.5s
- Needs Improvement: 2.5s - 4.0s
- Poor: > 4.0s

#### First Input Delay (FID)
- Good: < 100ms
- Needs Improvement: 100ms - 300ms
- Poor: > 300ms

#### Cumulative Layout Shift (CLS)
- Good: < 0.1
- Needs Improvement: 0.1 - 0.25
- Poor: > 0.25

#### Time to First Byte (TTFB)
- Good: < 800ms
- Needs Improvement: 800ms - 1800ms
- Poor: > 1800ms

All metrics are automatically sent to Google Analytics 4 with ratings.

### Viewing Core Web Vitals in GA4

1. Go to Google Analytics 4
2. Navigate to Reports > Engagement > Events
3. Filter by event name: `web_vitals`
4. View custom dimensions:
   - `metric_name` (LCP, FID, CLS, TTFB)
   - `value` (metric value in ms or score)
   - `metric_rating` (good, needs_improvement, poor)

## Admin Dashboard

### Applications Dashboard

Located at `/applications` in the admin dashboard, this page provides:

- Real-time application metrics
- Status breakdown visualization
- Filterable application list
- Inline status updates
- Pagination for large datasets

**Features:**
- View all applications with details
- Filter by status
- Update application status
- View submission timestamps
- See SMS consent status

## Alerts

The monitoring service triggers alerts for:

### No Applications in 24 Hours
- **Trigger:** No applications received in 24h (when total > 0)
- **Severity:** Warning
- **Action:** Check if application form is working

### High Email Failure Rate
- **Trigger:** Email failure rate > 10%
- **Severity:** Critical
- **Action:** Check email service configuration and API key

### System Health Critical
- **Trigger:** Any health check fails
- **Severity:** Critical
- **Action:** Check database connection, email service, or application rate

### Alert Destinations

Currently, alerts are logged to the application logs. In production, you can extend the `triggerAlert()` method in `MonitoringService.ts` to:

- Send email notifications
- Post to Slack
- Trigger PagerDuty
- Send SMS alerts

## Logging

All monitoring events are logged using Winston logger:

- Application submissions: `application_submitted`
- Email sent: `email_sent`
- Email failed: `email_failed`
- Alerts: `alert_triggered`

Logs are stored in:
- `logs/combined-YYYY-MM-DD.log` (all logs)
- `logs/error-YYYY-MM-DD.log` (errors only)

## Best Practices

### Monitoring Checklist

Daily:
- [ ] Check application submission rate
- [ ] Review email delivery metrics
- [ ] Check for any alerts in logs

Weekly:
- [ ] Review Core Web Vitals trends in GA4
- [ ] Analyze application status breakdown
- [ ] Review error logs for patterns

Monthly:
- [ ] Analyze application trends
- [ ] Review system performance
- [ ] Update alert thresholds if needed

### Setting Up Production Monitoring

1. **Configure Environment Variables:**
   ```bash
   RESEND_API_KEY=your_key
   ADMIN_EMAIL=team@wizjock.com
   FROM_EMAIL=hello@wizjock.com
   ```

2. **Set Up Log Aggregation:**
   - Use a service like Datadog, New Relic, or CloudWatch
   - Configure log shipping from production servers
   - Set up dashboards for key metrics

3. **Configure Alerting:**
   - Extend `triggerAlert()` method
   - Add email/Slack/PagerDuty integrations
   - Test alert delivery

4. **Monitor Core Web Vitals:**
   - Set up GA4 custom reports
   - Create alerts for performance degradation
   - Monitor trends over time

5. **Database Monitoring:**
   - Monitor connection pool usage
   - Track query performance
   - Set up alerts for slow queries

## Troubleshooting

### High Email Failure Rate

1. Check Resend API key is valid
2. Verify domain authentication (SPF, DKIM, DMARC)
3. Check email service logs for specific errors
4. Verify rate limits not exceeded

### No Applications Received

1. Test application form manually
2. Check rate limiting configuration
3. Verify database connection
4. Check for JavaScript errors in browser console

### Poor Core Web Vitals

1. Review Lighthouse audit results
2. Optimize images (WebP, compression)
3. Implement code splitting
4. Use CDN for static assets
5. Minimize render-blocking resources

## API Rate Limits

- Application submissions: 5 per hour per IP
- Admin API endpoints: No rate limit (authenticated)
- Public health check: No rate limit

## Security Considerations

- All monitoring endpoints (except `/health`) require admin authentication
- PII (email addresses) are not logged in monitoring metrics
- Application IDs are used for tracking instead of personal data
- Admin dashboard requires JWT authentication

## Future Enhancements

Potential improvements:
- Real-time dashboard with WebSocket updates
- Advanced analytics and reporting
- Automated email reports to admins
- Integration with external monitoring services
- Custom alert rules configuration
- Performance benchmarking over time
- A/B testing metrics
