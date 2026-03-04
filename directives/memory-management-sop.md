# Memory Management SOP

**Objective:**
Enable CRUD operations on the AI agent's memory entries.

**Inputs:**
- Title, content, category, tags
- Optional embedding field for future vector store

**Expected Outputs:**
- Memory documents stored in MongoDB
- Search endpoint supporting text queries and tag/category filters

**Tools/Scripts to Use:**
- Mongoose Memory model with text index
- Express routes/controllers

**Edge Cases:**
- Empty content or title
- Searching without query string
- Category not in allowed values

**Error Handling:**
- 404 for missing memory item
- 400 for bad payloads
- 500 for server errors

**Notes:**
Indexing on category and tags improves filtering. Embeddings remain null until a vectorization service is integrated. Future features include Pinecone or similar stores.