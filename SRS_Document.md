# Software Requirements Specification (SRS)
## Together Apart - Relationship Management Application

**Document Version:** 1.0  
**Date:** December 2024  
**Prepared for:** Quality Control Team  
**Application:** Together Apart - Couple Relationship Management Platform  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [User Interface Requirements](#5-user-interface-requirements)
6. [Technical Architecture](#6-technical-architecture)
7. [Database Schema](#7-database-schema)
8. [Security Requirements](#8-security-requirements)
9. [Performance Requirements](#9-performance-requirements)
10. [Testing Requirements](#10-testing-requirements)
11. [Deployment Requirements](#11-deployment-requirements)
12. [Quality Assurance Checklist](#12-quality-assurance-checklist)

---

## 1. Executive Summary

### 1.1 Purpose
Together Apart is a comprehensive relationship management application designed to help couples maintain strong connections even when physically apart. The application provides tools for daily communication, memory sharing, activity planning, and relationship growth.

### 1.2 Scope
The application serves as a complete relationship management platform with the following core capabilities:
- User authentication and partner connection
- Daily connection prompts and conversations
- Memory timeline and photo sharing
- Activity planning and calendar management
- Relationship growth tracking and insights
- Discovery exchange for learning about partners
- Real-time notifications and messaging

### 1.3 Target Users
- **Primary Users:** Couples in long-distance relationships or those seeking to strengthen their connection
- **Secondary Users:** Relationship counselors, therapists, and relationship coaches
- **Age Range:** 18-65 years
- **Technical Proficiency:** Basic to intermediate smartphone/computer users

---

## 2. System Overview

### 2.1 Application Type
- **Platform:** Progressive Web Application (PWA)
- **Architecture:** Single Page Application (SPA)
- **Technology Stack:** React 19, TypeScript, Vite, Supabase, Google Gemini AI
- **Deployment:** Cloud-based with Vercel hosting

### 2.2 Core Features
1. **Authentication System** - Secure user registration and login
2. **Partner Connection** - Invite and connect with romantic partners
3. **Daily Connections** - AI-powered conversation starters
4. **Memory Timeline** - Shared photo and memory storage
5. **Activity Planner** - Collaborative event planning
6. **Growth Hub** - Relationship insights and analytics
7. **Discovery Exchange** - Learn more about your partner
8. **Real-time Notifications** - Instant updates and alerts

### 2.3 System Architecture
```
Frontend (React/TypeScript)
    ↓
API Layer (Supabase)
    ↓
Database (PostgreSQL)
    ↓
AI Services (Google Gemini)
```

---

## 3. Functional Requirements

### 3.1 User Authentication & Management

#### 3.1.1 User Registration
- **FR-001:** Users must be able to register with email and password
- **FR-002:** Email validation must be performed during registration
- **FR-003:** Password must meet security requirements (minimum 8 characters, mixed case, numbers)
- **FR-004:** Users must verify their email address before accessing the app
- **FR-005:** Users must provide full name during registration

#### 3.1.2 User Login
- **FR-006:** Users must be able to login with email and password
- **FR-007:** Failed login attempts must be limited to prevent brute force attacks
- **FR-008:** Users must be able to reset their password via email
- **FR-009:** Session management must maintain user login state
- **FR-010:** Users must be able to logout from any page

#### 3.1.3 Profile Management
- **FR-011:** Users must be able to update their profile information
- **FR-012:** Users must be able to upload and change profile pictures
- **FR-013:** Users must be able to add/edit bio information
- **FR-014:** Profile changes must be saved automatically

### 3.2 Partner Connection System

#### 3.2.1 Partner Invitation
- **FR-015:** Users must be able to generate invitation codes
- **FR-016:** Invitation codes must be unique and time-limited
- **FR-017:** Users must be able to share invitation codes via multiple methods
- **FR-018:** Invitation codes must be validated before partner connection

#### 3.2.2 Partner Connection
- **FR-019:** Users must be able to accept partner invitations
- **FR-020:** Partner connection must be mutual (both users must accept)
- **FR-021:** Users must be able to view partner's profile information
- **FR-022:** Partner connection status must be clearly displayed

### 3.3 Daily Connection Feature

#### 3.3.1 Daily Questions
- **FR-023:** System must generate daily conversation starters
- **FR-024:** Questions must be relationship-focused and engaging
- **FR-025:** Questions must be appropriate for all relationship stages
- **FR-026:** Users must be able to answer daily questions
- **FR-027:** Partner's answers must be visible after both users respond

#### 3.3.2 Conversation History
- **FR-028:** Users must be able to view past daily connections
- **FR-029:** Conversation history must be organized by date
- **FR-030:** Users must be able to search through conversation history
- **FR-031:** Conversation data must be preserved indefinitely

### 3.4 Memory Timeline

#### 3.4.1 Memory Creation
- **FR-032:** Users must be able to create new memories with title and description
- **FR-033:** Users must be able to upload photos to memories
- **FR-034:** Users must be able to add location information to memories
- **FR-035:** Users must be able to tag memories with categories
- **FR-036:** Users must be able to set memory dates

#### 3.4.2 Memory Management
- **FR-037:** Users must be able to edit existing memories
- **FR-038:** Users must be able to delete memories
- **FR-039:** Users must be able to mark memories as favorites
- **FR-040:** Users must be able to search and filter memories
- **FR-041:** Memories must be displayed in chronological order

#### 3.4.3 Memory Sharing
- **FR-042:** All memories must be visible to both partners
- **FR-043:** Memory creation must be attributed to the creator
- **FR-044:** Users must be able to export memory albums

### 3.5 Activity Planner

#### 3.5.1 Activity Creation
- **FR-045:** Users must be able to create new activities
- **FR-046:** Activities must include title, description, date, and location
- **FR-047:** Users must be able to categorize activities
- **FR-048:** Users must be able to set activity reminders

#### 3.5.2 Activity Management
- **FR-049:** Users must be able to edit existing activities
- **FR-050:** Users must be able to mark activities as completed
- **FR-051:** Users must be able to delete activities
- **FR-052:** Activities must be displayed in calendar view
- **FR-053:** Users must be able to filter activities by category

### 3.6 Growth Hub

#### 3.6.1 Relationship Insights
- **FR-054:** System must provide relationship strength metrics
- **FR-055:** Users must be able to view communication patterns
- **FR-056:** System must track relationship milestones
- **FR-057:** Users must be able to set relationship goals

#### 3.6.2 Growth Tracking
- **FR-058:** System must track daily connection streaks
- **FR-059:** Users must be able to view relationship progress
- **FR-060:** System must provide personalized growth recommendations
- **FR-061:** Users must be able to celebrate achievements

### 3.7 Discovery Exchange

#### 3.7.1 Content Sharing
- **FR-062:** Users must be able to share music, movies, books, and places
- **FR-063:** Shared content must include metadata (artist, director, author, etc.)
- **FR-064:** Users must be able to add personal notes to shared content
- **FR-065:** Users must be able to categorize shared discoveries

#### 3.7.2 Discovery Management
- **FR-066:** Users must be able to view partner's shared discoveries
- **FR-067:** Users must be able to mark discoveries as favorites
- **FR-068:** Users must be able to search through discoveries
- **FR-069:** Discoveries must be organized by category

### 3.8 Notifications & Communication

#### 3.8.1 Real-time Notifications
- **FR-070:** Users must receive notifications for new daily questions
- **FR-071:** Users must receive notifications when partner responds
- **FR-072:** Users must receive notifications for upcoming activities
- **FR-073:** Users must receive notifications for relationship milestones

#### 3.8.2 Notification Preferences
- **FR-074:** Users must be able to customize notification settings
- **FR-075:** Users must be able to enable/disable specific notification types
- **FR-076:** Users must be able to set notification timing preferences
