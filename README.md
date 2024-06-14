# Umfragetool

# Backend
The serverless backend is managed via the [Serverless Framework](https://www.serverless.com/). To use features like the serverless dashboard you need to sign up or use your github account to sign in.

## Installation
### This Setup requires <b>Node.js</b>!

**Installation Windows/MacOS**: https://nodejs.org/en

**Installation macos via homebrew**: `brew install node`

**Installation Linux:** via your package manager ;)


### 1. Clone the repository
```bash
git clone https://gitlab.rz.hft-stuttgart.de/sose2024-informatikprojekt-2/umfragetool.git
cd backend
```

### 2. Install npm modules
```bash
npm install
```

### 3. Login to serverless
```bash
npx serverless login
```
Note: Because serverless is not installed globally you need to execute it with `npx`

### 4. Python Installation and Backend Dependencies
**Installation macos via homebrew**: `brew install python`
**check on macos**: `python3 --version`

Add Virtual Enviorment and install Dependencies
```bash
cd backend/services/rest-apis/
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```
To exit the virtual environment:
```bash
deactivate
```

### 5. Creating the database
with `backend/services/rest-apis/`:

1. Edit the .env file according to the template and the database name you created with mysql
2. ```serverless invoke local -f createDatabase``` to create the database


### 6. Starting all endpoints for testing with the frontend
with `backend/services/rest-apis/`:

Execute the command `serverless offline`. This should start all Endpoints and you should see a overview displayed in the Terminal.


## Ressources

**Documentation**: https://www.serverless.com/framework/docs

**Example templates**: https://github.com/serverless/examples

**API Gateway Integration (important)**: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
