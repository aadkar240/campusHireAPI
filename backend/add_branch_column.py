"""
Script to add the 'branch' column to the users table.
Run this once to update your existing database.
"""
import sqlite3
import os
from pathlib import Path

# Get the database path
db_path = Path(__file__).parent / "campushire.db"

if not db_path.exists():
    print(f"Database not found at {db_path}")
    print("The column will be created automatically when you start the server.")
    exit(0)

try:
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    # Check if column already exists
    cursor.execute("PRAGMA table_info(users)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'branch' in columns:
        print("Column 'branch' already exists in users table.")
    else:
        # Add the branch column
        cursor.execute("ALTER TABLE users ADD COLUMN branch VARCHAR")
        conn.commit()
        print("Successfully added 'branch' column to users table.")
    
    conn.close()
    print("Database migration completed!")
    
except Exception as e:
    print(f"Error: {e}")
    print("If you encounter issues, you may need to recreate the database.")
    print("The column will be created automatically for new databases.")
