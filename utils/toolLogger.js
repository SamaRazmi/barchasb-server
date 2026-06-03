const ToolUsageLog = require('../models/toolUsageLog');

async function logToolUsage({ userId, toolName, status, errorMessage, metadata, durationMs, ip, userAgent }) {
  try {
    await ToolUsageLog.create({
      userId,
      toolName,
      status,
      errorMessage: errorMessage || null,
      metadata: {
        inputSize: metadata?.inputSize || null,
        outputSize: metadata?.outputSize || null,
        inputFormat: metadata?.inputFormat || null,
        outputFormat: metadata?.outputFormat || null,
      },
      durationMs: durationMs || null,
      ip: ip || null,
      userAgent: userAgent || null,
    });
  } catch (logError) {
    console.error('خطا در ذخیره لاگ:', logError);
  }
}

module.exports = { logToolUsage };