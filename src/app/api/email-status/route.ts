import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email/emailService';
import { getAsyncEmailQueue } from '@/lib/email/asyncEmailQueue';
import { templateCache } from '@/lib/email/templateCache';

/**
 * GET /api/email-status
 * Returns comprehensive email service status including async queue metrics
 */
export async function GET(request: NextRequest) {
  try {
    // Get email service status
    const serviceStatus = emailService.getServiceStatus();
    
    // Get async queue metrics and status
    const queue = getAsyncEmailQueue();
    const queueMetrics = queue.getMetrics();
    const queueStatus = queue.getQueueStatus();
    
    // Get template cache statistics
    const cacheStats = templateCache.getStats();
    
    // Get current queued emails (limited for security)
    const queuedEmails = queue.getQueuedEmails().slice(0, 10).map(email => ({
      id: email.id,
      recipient: email.recipient.replace(/(.{3}).*(@.*)/, '$1***$2'), // Mask email for privacy
      subject: email.subject.length > 50 ? email.subject.substring(0, 50) + '...' : email.subject,
      priority: email.priority,
      attempts: email.attempts,
      scheduledAt: email.scheduledAt,
      createdAt: email.createdAt
    }));

    const response = {
      timestamp: new Date().toISOString(),
      service: {
        configured: serviceStatus.isConfigured,
        circuitBreakerOpen: serviceStatus.circuitBreakerOpen,
        consecutiveFailures: serviceStatus.consecutiveFailures,
        lastFailureTime: serviceStatus.lastFailureTime,
        metrics: serviceStatus.metrics
      },
      asyncQueue: {
        processing: queueStatus.processing,
        currentlyProcessing: queueStatus.currentlyProcessing,
        queueSize: queueStatus.queueSize,
        nextScheduledEmail: queueStatus.nextScheduledEmail,
        rateLimitConfig: queueStatus.rateLimitConfig,
        metrics: {
          totalQueued: queueMetrics.totalQueued,
          totalProcessed: queueMetrics.totalProcessed,
          totalFailed: queueMetrics.totalFailed,
          processingRate: queueMetrics.processingRate,
          averageProcessingTime: queueMetrics.averageProcessingTime,
          lastProcessedAt: queueMetrics.lastProcessedAt
        },
        recentEmails: queuedEmails
      },
      templateCache: {
        size: cacheStats.size,
        maxSize: cacheStats.maxSize,
        hitRate: Math.round(cacheStats.hitRate * 100),
        totalRenders: cacheStats.metrics.totalRenders,
        cacheHits: cacheStats.metrics.cacheHits,
        cacheMisses: cacheStats.metrics.cacheMisses,
        averageRenderTime: Math.round(cacheStats.metrics.averageRenderTime)
      },
      performance: {
        emailsPerMinute: queueMetrics.processingRate,
        averageEmailProcessingTime: Math.round(queueMetrics.averageProcessingTime),
        averageTemplateRenderTime: Math.round(cacheStats.metrics.averageRenderTime),
        templateCacheEfficiency: Math.round(cacheStats.hitRate * 100)
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error getting email status:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get email service status',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/email-status
 * Allows administrative actions on the email service
 */
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    switch (action) {
      case 'reset_circuit_breaker':
        emailService.resetCircuitBreaker();
        return NextResponse.json({ 
          message: 'Circuit breaker reset successfully',
          timestamp: new Date().toISOString()
        });

      case 'clear_template_cache':
        templateCache.clear();
        return NextResponse.json({ 
          message: 'Template cache cleared successfully',
          timestamp: new Date().toISOString()
        });

      case 'clear_queue':
        const queue = getAsyncEmailQueue();
        queue.clearQueue();
        return NextResponse.json({ 
          message: 'Email queue cleared successfully',
          timestamp: new Date().toISOString()
        });

      case 'test_connection':
        const connectionTest = await emailService.testConnection();
        return NextResponse.json({ 
          connectionTest,
          message: connectionTest ? 'SMTP connection successful' : 'SMTP connection failed',
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error performing email service action:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to perform email service action',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}