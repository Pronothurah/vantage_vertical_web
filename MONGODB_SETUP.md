# MongoDB Setup Guide for Vantage Vertical

This guide helps you set up MongoDB for the Vantage Vertical project.

## Option 1: Local MongoDB Installation (Recommended for Development)

### Ubuntu/Debian Linux

```bash
# Import the public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongod --version
```

### macOS (with Homebrew)

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify installation
mongod --version
```

### Windows

1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Start MongoDB as a Windows service or run `mongod` in Command Prompt

## Option 2: MongoDB Atlas (Cloud Database - Recommended for Production)

### Setup Steps

1. **Create Account:**
   - Go to https://www.mongodb.com/atlas
   - Sign up for a free account

2. **Create Cluster:**
   - Click "Create a New Cluster"
   - Choose the free tier (M0)
   - Select a region close to you
   - Click "Create Cluster"

3. **Setup Database Access:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Set permissions to "Read and write to any database"

4. **Setup Network Access:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, you can use "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add your specific IP addresses

5. **Get Connection String:**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update Environment Variables:**
   ```env
   # In backend/.env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vantage_vertical?retryWrites=true&w=majority
   ```

## Verification

### Test Local MongoDB Connection

```bash
# Connect to MongoDB shell
mongosh

# Or if using older version
mongo

# Create test database
use vantage_vertical

# Insert test document
db.test.insertOne({message: "Hello Vantage Vertical!"})

# Query test document
db.test.find()

# Exit
exit
```

### Test Application Connection

1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```

2. Check the health endpoint:
   ```bash
   curl http://localhost:5000/health
   ```

3. You should see a response like:
   ```json
   {
     "status": "OK",
     "message": "Vantage Vertical API is running",
     "timestamp": "2024-01-XX..."
   }
   ```

## Troubleshooting

### Common Issues

1. **Connection Refused:**
   - Make sure MongoDB service is running
   - Check if the port 27017 is available
   - Verify the connection string in your .env file

2. **Authentication Failed:**
   - Check username and password in connection string
   - Ensure database user has proper permissions

3. **Network Timeout (Atlas):**
   - Verify your IP is whitelisted in Network Access
   - Check your internet connection
   - Try using a different network

### Useful Commands

```bash
# Check MongoDB service status (Linux)
sudo systemctl status mongod

# Start MongoDB service (Linux)
sudo systemctl start mongod

# Stop MongoDB service (Linux)
sudo systemctl stop mongod

# View MongoDB logs (Linux)
sudo journalctl -u mongod

# Check if MongoDB is listening on port 27017
sudo netstat -tlnp | grep 27017
```

## Database Structure

The Vantage Vertical application uses the following collections:

- **messages**: Stores contact form submissions
  ```javascript
  {
    _id: ObjectId,
    username: String,
    email: String,
    text: String,
    __v: Number
  }
  ```

## Security Best Practices

1. **Never commit credentials to version control**
2. **Use environment variables for sensitive data**
3. **Enable authentication in production**
4. **Use SSL/TLS connections**
5. **Regularly update MongoDB**
6. **Monitor database access logs**

## Next Steps

After setting up MongoDB:

1. Update your `backend/.env` file with the correct connection string
2. Start the application with `npm start`
3. Test the contact form functionality
4. Monitor the database for incoming messages

For more help, check the main README.md or create an issue in the repository.