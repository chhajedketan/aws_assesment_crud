import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
//Test
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;
if (!TABLE_NAME) throw new Error("TABLE_NAME environment variable is not defined");

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: "Missing request body" };

    const { id, name, price } = JSON.parse(event.body);
    if (!id || !name || price === undefined) {
      return { statusCode: 400, body: "id, name, and price are required" };
    }
    
    await ddbDocClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: { id, name, price },
      })
    );

    return { statusCode: 201, body: JSON.stringify({ message: "Item created", item: { id, name, price } }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Internal server error" };
  }
};
