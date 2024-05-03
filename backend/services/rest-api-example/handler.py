import json

def hello(event, context):
    body = {
        "message": "Go Serverless v3.0! Your function executed successfully!",
        "input": event,
    }

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response

def example(event, context):
    # Extract the query parameter named 'input_param' from the event object
    input_param = event.get('queryStringParameters', {}).get('input_param', 'No input')

    # Preparing the response body
    body = {
        "response": input_param + " received, the setup was successful!"
    }

    # Creating the response object
    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response