# Kickoff Arena - Authentication & Data Structure Guide

## Overview

This document outlines the new authentication system, database models, and overall architecture for the Kickoff Arena application.

## Database Models

### 1. User Model (`lib/models/User.js`)
**Purpose:** Stores user account information and profile data.

**Key Fields:**
- `username` - Unique username (3-24 chars)
- `password` - Hashed password (6+ chars)
- `email` - Optional email address
- `displayName` - Display name for the user
- `profilePicture` - URL to profile image
- `bio` - User biography
- `country` - User's country
- `emailVerified` - Email verification status
- `theme` - Light/Dark theme preference
- `language` - Language preference (default: 'en')
- `budget` - Current budget for transfers
- `teams` - Array of Team references (one-to-many)
- `activeTeamId` - Reference to currently active team

**Career State Fields:**
- `selectedLeague` - Currently selected league
- `selectedTeam` - Selected team object
- `selectedManager` - Selected manager object
- `formation` - Selected formation
- `goalkeeper`, `defenders`, `midfielders`, `forwards` - Squad players
- `transfers` - Transfer history
- `matchHistory` - Match results history

### 2. Team Model (`lib/models/Team.js`)
**Purpose:** Represents a team managed by a user in a specific league.

**Key Fields:**
- `name` - Team name
- `userId` - Reference to User (owner)
- `leagueId` - League ID
- `badge` - Team badge URL
- `stadium` - Stadium name
- `formation` - Team formation
- `goalkeeper`, `defenders`, `midfielders`, `forwards` - Squad composition
- `budget` - Team budget
- `season` - Season year
- `matchesPlayed`, `wins`, `draws`, `losses` - Statistics
- `goalsFor`, `goalsAgainst` - Goal statistics
- `squadValue` - Total squad value

**Virtual Field:**
- `squadOverall` - Calculated average rating of squad

### 3. Squad Model (`lib/models/Squad.js`)
**Purpose:** Tracks detailed squad information for a specific season.

**Key Fields:**
- `teamId` - Reference to Team
- `userId` - Reference to User
- `season` - Season year
- `totalBudget` - Total budget for season
- `availableBudget` - Remaining budget
- `transfers` - Transfer history for the season
- `benchPlayers` - Bench player list
- `youthAcademy` - Youth academy players

### 4. Match Model (`lib/models/Match.js`)
**Purpose:** Records match results and performance data.

**Key Fields:**
- `teamId` - Reference to Team
- `userId` - Reference to User
- `opponentTeam` - Opponent team name
- `goals`, `opponentGoals` - Final score
- `result` - 'win', 'draw', or 'loss'
- `playerPerformances` - Array of player performance data
- `breakdown` - Match events breakdown
- `formation` - Formation used
- `startingXI`, `substitutes` - Lineup data
- `pointsEarned`, `moneyEarned` - Rewards

## API Routes

### Authentication Routes

#### `POST /api/auth/register`
Create a new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string (optional)"
}
```

**Response:**
```json
{
  "ok": true,
  "username": "string",
  "userId": "string"
}
```

#### `POST /api/auth/login`
Login to an existing account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "ok": true,
  "username": "string",
  "userId": "string"
}
```

#### `GET /api/auth/me`
Get current user session and full career state.

**Response:**
```json
{
  "_id": "string",
  "username": "string",
  "email": "string",
  "displayName": "string",
  "profilePicture": "string",
  "bio": "string",
  "country": "string",
  "theme": "string",
  "language": "string",
  "budget": "number",
  "transfers": "array",
  "matchHistory": "array",
  "teams": "array",
  "activeTeamId": "string",
  "squadOvr": "number"
}
```

#### `POST /api/auth/logout`
Logout current user.

#### `GET|PATCH /api/auth/profile`
Get or update user profile.

**PATCH Request Body:**
```json
{
  "displayName": "string (optional)",
  "email": "string (optional)",
  "profilePicture": "string (optional)",
  "bio": "string (optional)",
  "country": "string (optional)",
  "theme": "string (optional)",
  "language": "string (optional)",
  "activeTeamId": "string (optional)"
}
```

### Teams Routes

#### `GET /api/teams`
Fetch all teams for current user.

**Response:**
```json
{
  "teams": [
    {
      "_id": "string",
      "name": "string",
      "leagueId": "string",
      "badge": "string",
      "budget": "number",
      "squad": "object",
      "squadOverall": "number",
      "season": "number",
      "matchesPlayed": "number",
      "wins": "number",
      "draws": "number",
      "losses": "number"
    }
  ]
}
```

#### `POST /api/teams`
Create a new team.

**Request Body:**
```json
{
  "name": "string",
  "leagueId": "string"
}
```

**Response:**
```json
{
  "ok": true,
  "team": "object"
}
```

#### `GET /api/teams/[id]`
Get a specific team by ID.

#### `PATCH /api/teams/[id]`
Update a specific team.

**Request Body:**
```json
{
  "name": "string (optional)",
  "badge": "string (optional)",
  "formation": "object (optional)",
  "goalkeeper": "object (optional)",
  "defenders": "array (optional)",
  "midfielders": "array (optional)",
  "forwards": "array (optional)",
  "budget": "number (optional)"
}
```

#### `DELETE /api/teams/[id]`
Delete a specific team.

## Authentication Context (`context/AuthContext.jsx`)

The AuthContext provides global state management for authentication and user data.

### Provided Values and Functions

```javascript
{
  user,              // Current user object or null
  budget,           // Current budget
  transfers,        // Transfer history
  matchHistory,     // Match history
  teams,            // User's teams array
  activeTeam,       // Currently active team ID
  isLoading,        // Loading state
  isLoggedIn,       // Boolean indicating if user is authenticated
  
  // Functions
  login(username, password),           // Login user
  register(username, password),        // Register new user
  logout(),                            // Logout current user
  saveSquad(data),                     // Save squad data
  saveMatchResult(result),             // Save match result
  executeTransfer(position, out, in),  // Execute player transfer
  setActiveTeamId(teamId),            // Set active team
  fetchTeams()                         // Fetch user's teams
}
```

## User Flow

### 1. Landing Page (`/`)
- Shows hero section with features
- Shows login/signup call-to-action
- Redirects to dashboard if user is logged in

### 2. Authentication (`/auth`)
- Shows login/register form
- On successful auth, redirects to `/dashboard`
- Redirect to dashboard if already logged in

### 3. Dashboard (`/dashboard`)
- Shows user stats, squad info, and quick actions
- Requires authentication
- Shows relevant next steps

### 4. Squad Selection Flow
- League selection (`/league`)
- Team selection (`/team-select`)
- Manager selection (`/manager-select`)
- Formation selection (`/formation-select`)
- Player selection by position (`/select/[position]`)
- Squad review (`/squad/review`)

### 5. Match Arena (`/match`)
- Launch matches with current squad
- View detailed match statistics

### 6. Transfer Market (`/transfer`)
- Buy/sell players
- Transfer history

## Key Features

### Session Management
- JWT-based authentication with HTTP-only cookies
- 7-day session expiration
- Automatic session validation on app load

### Data Persistence
- LocalStorage fallback for guest users
- Database persistence for authenticated users
- Automatic syncing between client and server

### Team Management
- Users can create multiple teams
- Manage separate squads per team
- Track season-specific statistics

### Squad Management
- Full player roster management (GK, DEF, MID, FWD)
- Formation-based squad composition
- Squad overall rating calculation
- Transfer history tracking

## Security Considerations

1. **Password Hashing:** Passwords are hashed using bcryptjs before storage
2. **HTTP-Only Cookies:** JWT tokens stored in HTTP-only cookies
3. **CORS:** Configured for secure cross-origin requests
4. **Rate Limiting:** Recommended to implement rate limiting on auth routes
5. **Email Verification:** Email verification can be added in future

## Database Indexes

- User: Unique index on `username`, `email`
- Team: Indexes on `userId`, `leagueId`, `userId + leagueId`
- Squad: Indexes on `teamId + season`, `userId`
- Match: Indexes on `teamId + userId`, `matchDate`, `season + league`

## Environment Variables Required

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development|production
```

## Future Enhancements

1. Email verification system
2. Password reset functionality
3. Social login (Google, Apple, etc.)
4. Friend system and multiplayer challenges
5. Leaderboards
6. In-app notifications
7. Real-time match simulation
8. Advanced statistics and analytics
9. Coaching badges and achievements
10. Seasonal rewards system

## Troubleshooting

### User Not Persisting After Refresh
- Ensure cookies are enabled
- Check browser console for CORS errors
- Verify `NEXT_PUBLIC_API_URL` is correctly set

### Teams Not Loading
- Verify user is logged in via `/api/auth/me`
- Check database connection
- Review browser network tab for API errors

### Match History Not Saving
- Ensure user is authenticated
- Check available storage quota
- Verify Match model is properly defined

## Support

For issues or questions regarding authentication and data structure, refer to the main README.md or create an issue on the repository.
