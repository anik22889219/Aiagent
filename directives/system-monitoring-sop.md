# System Monitoring SOP

**Objective:**
Expose system health metrics, agent status, and access logs to frontend clients.

**Inputs:**
- HTTP GET requests for status, health, logs

**Expected Outputs:**
- JSON payloads containing agent state, CPU/memory usage, uptime, and recent log entries

**Tools/Scripts to Use:**
- `os` module for system stats
- Mongoose SystemLog model
- Socket.IO for live log streaming

**Edge Cases:**
- Database connectivity issues
- No logs available

**Error Handling:**
- 500 when data cannot be fetched

**Notes:**
Agent status is simulated; integrate with actual agent processes later. Logs must also be recorded from various parts of the system (use `execution/logger.py` or custom middleware).