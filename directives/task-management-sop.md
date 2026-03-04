# Task Management SOP

**Objective:**
Provide RESTful API for creating, updating, pausing, resuming, and deleting tasks executed by the AI agent.

**Inputs:**
- Title, description, command
- Priority, scheduled time
- Action endpoints for pause/resume/cancel

**Expected Outputs:**
- Task documents in MongoDB with appropriate status transitions
- Endpoints return updated task object or confirmation

**Tools/Scripts to Use:**
- Mongoose Task model
- Express routes/controllers
- Socket.IO events to notify frontend of changes

**Edge Cases:**
- Starting tasks with invalid fields
- Pausing/resuming tasks not in correct state
- Cancelling a completed or failed task

**Error Handling:**
- 404 for non-existent task
- 400 for invalid payload
- 500 for server errors

**Rate Limits:**
- Limit creation endpoints to prevent spam

**Notes:**
Requests must be authenticated; store `createdBy` user id. Future versions may integrate with scheduler or job queue (BullMQ).