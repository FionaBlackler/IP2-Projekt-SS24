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

### 4. Test the installation by executing a function locally
```bash
cd rest-api-example
npx serverless invoke local --function example --data '{"queryStringParameters": {"input_param": "Hello"}}'
```
This should return the following output:
```json
{
    "statusCode": 200,
    "body": "{\"response\": \"Hello received, the setup was successful!\"}"
}
```


## Ressources

**Documentation**: https://www.serverless.com/framework/docs

**Example templates**: https://github.com/serverless/examples

**API Gateway Integration (important)**: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html


