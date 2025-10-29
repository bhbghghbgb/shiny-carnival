--- 

# Working Rules for the Store Management System Project

This document outlines the detailed rules and guidelines for Agents working on the "Store Management System" project. These rules are designed to ensure consistency, efficiency, and adherence to project standards.

## 1. General Guidelines

- **Language:** Always use Vietnamese in all communications and documentation.

- **Communication:** Do not use icons in reports or official documents.

- **Confirm Codebase Structure Changes:** Before making any changes to the codebase structure, summarize the plan and seek confirmation from the user. Proceed only when approved.

- **Adherence to Plan:** When executing the plan, break down problems into smaller tasks. If an unresolvable implementation error or code logic error occurs, stop immediately and inform the user; do not unilaterally change logic or deviate from the plan.

## 2. Core Project Information (Augment Memory)

Agents must always remember and apply the following project information:

### 2.1. Project Overview

- **Project Name:** Store Management System.

- **Objective:** Internal web application for managing products, inventory, orders, customers, promotions.

- **Architecture:** Client-server (Frontend React, Backend RESTful API).

- **Database:** MySQL.

### 2.2. Frontend Technology and Structure

- **Language:** TypeScript.

- **Main Library:** React.

- **Folder Structure:** Based on Clean Architecture and Feature-Sliced Design (FSD), organizing code by `features` (business logic).

- **UI Components:** Ant Design (AntD).

- **State Management:** Zustand (global and local per feature).

- **Data Grids:** TanStack Table (headless UI).

- **Form Management:** Ant Design Form components with built-in validation and controls.

- **API Calls:** Axios (with pre-configured instance, interceptors).

- **Routing:** `@tanstack/react-router` with Code-Based Routing.

### 2.3. Backend Structure and API

- **Authentication:** JSON Web Token (JWT) via `Authorization: Bearer <token>` header.

- **API Conventions:**
  - **Data Format:** JSON (`application/json`).
  - **Naming Convention (JSON):** `camelCase` (e.g., `productId`).
  - **Response Structure:** `ApiResponse<T>` (`isError`, `message`, `data`, `timestamp`).
  - **Pagination:** Supported via `page`, `pageSize`, `search`, `sortBy`, `sortDesc` and returns `PagedList<T>`.

### 2.4. User Roles

- **Admin:** Manages users, products, categories, suppliers, promotions, reports.

- **Staff:** Processes orders, manages customers, updates inventory, handles payments.

### 2.5. Key Features

- **Product Management:** Add, edit, delete, search, filter products.

- **Order Management:** Create, update status, add/edit/delete products in orders, apply promotions.

- **Customer Management:** Add, manage information.

- **Inventory Management:** Automatic updates, low stock alerts.

- **Promotion Management:** Create, manage discount codes, duration, usage limits.

- **Payment:** Cash only, order status `paid` is equivalent to paid.

- **Reports:** Admin views revenue reports, best-selling products.

- **PDF Export:** Export PDF invoices from paid order information.

### 2.6. Data Model (ERD)

- **Entities:** `Users`, `Customers`, `Categories`, `Suppliers`, `Products`, `Inventory`, `Promotions`, `Orders`, `Order_Items`, `Payments`.

- **Relationships:** Clearly defined in the ERD document (e.g., `Customers` 1-N `Orders`, `Products` 1-1 `Inventory`).

## 3. Task Execution Guidelines

### 3.1. Initial Analysis (Sequence Thinking)

- Break down requirements into core components.

- Identify key concepts and relationships.

- Strategize search and verification.

- Determine the most effective tools.

### 3.2. Information Retrieval (Search)

- **Brave Search:** Start with broad contextual searches, then use targeted searches for specific aspects. Record and analyze results.

- **Perplexity Search:** Use for in-depth analysis/search of concepts/information from Brave Search, providing necessary context.

### 3.3. In-depth Verification (Browser/Puppeteer)

- Navigate to key websites from search results.

- Take screenshots of relevant content.

- Extract specific data.

- Interact with the website (click, fill forms) if necessary.

- Always verify that the correct page has been accessed and necessary information gathered.

### 3.4. Synthesis & Presentation

- Combine findings from all tools.

- Present information in a structured format.

- Create artifacts for code snippets, visualizations, or lengthy documents.

- Highlight key insights and relationships.

## 4. Source Documentation Requirements

- All search results must include the full URL and title.

- Screenshots must include the source URL and timestamp.

- Data sources must be clearly cited with access dates.

- Items in Memory must maintain source links.

- All findings must be traceable to their original source.

- Quoted external content must include a direct source link.

## 5. Work Report Format

After completing a major task, create a report in Vietnamese in Markdown (.md) format with the following sections:

### A. Task Summary

### B. Code Implementation Details

- Quote important code snippets (File Name, Line).

- Explain the logic, purpose, and design decisions for each code snippet.

- Provide specific and detailed code examples. Reference actual files in the codebase.

### C. Testing

- Describe the types of tests performed (unit test, integration test, manual test).

- Specify key test cases and results.

- (If applicable) Quote relevant test code.

- When writing tests, clearly identify the reason for test failure: if due to incorrect test, modify the test; if due to code logic error, stop implementation and inform the user.

### D. Challenges and Solutions

- List problems and difficulties encountered.

- Describe the analysis and resolution methods.

### E. Improvements and Optimizations

- Highlight improvements for code optimization (performance, readability, security).

### F. Tools and Technologies Used

- **Development:** Languages, Frameworks, IDEs, Key Libraries.

- **Testing:** Frameworks, Tools.

- **Deployment:** Docker, K8s, Serverless platforms (if any).

- **Monitoring & Logging:** Tools.

- **Code Analysis:** Tools.

- **Other:** Other important tools or technologies used.

## 6. User Problem Solving Plan

When asked to create a plan, use the following structure:

1. **Step 1: Identify the Problem:** Break down the user's problem and group them into stages.

1. **Step 2: Analysis and Implementation:** Analyze the problem in detail, implement resolution steps for each stage (write detailed code).

1. **Step 3: Testing:** Ask the user about desired test types (unit test, e2e test, integration test) and proceed with testing.

