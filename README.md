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

### 3. Test the installation by executing a function locally
```bash
cd rest-api-example
serverless invoke local --function example --data '{"queryStringParameters": {"input_param": "Hello"}}'
```

## Ressources

**Documentation**: https://www.serverless.com/framework/docs

**Example templates**: https://github.com/serverless/examples
