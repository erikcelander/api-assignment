# API Documentation

This document describes the resource URIs and their corresponding HTTP methods in the API.

# Authentication

### POST /api/v1/auth/register

Registers a new user.

### POST /api/v1/auth/login

Authenticates a user and returns a JWT token.

# Workouts

### GET /api/v1/workouts

Retrieves a list of all workouts.

### GET /api/v1/workouts/:id

Retrieves a specific workout by its ID.

### POST /api/v1/workouts

Creates a new workout.

### POST /api/v1/workouts/:id

Adds an exercise to an existing workout by its ID.

### PATCH /api/v1/workouts/:id

Partially updates an existing workout by its ID.

### PUT /api/v1/workouts/:id

Updates an existing workout by its ID.

### DELETE /api/v1/workouts/:id

Deletes a workout by its ID.

# Exercises

### GET /api/v1/exercises

Retrieves a list of all exercises.

### GET /api/v1/exercises/:id

Retrieves a specific exercise by its ID.

### POST /api/v1/exercises

Creates a new exercise.

### PATCH /api/v1/exercises/:id

Partially updates an existing exercise by its ID.

### PUT /api/v1/exercises/:id

Updates an existing exercise by its ID.

### DELETE /api/v1/exercises/:id

Deletes an exercise by its ID.

