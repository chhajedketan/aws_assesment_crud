import { APIGatewayProxyHandler } from "aws-lambda";
import { ddbDocClient, tableName } from "../utils/dynamodb"; 
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: "Missing request body" };

    const { id, name, price } = JSON.parse(event.body);

    if (!id || !name || price === undefined) {
      return { statusCode: 400, body: "id, name, and price are required" };
    }

    await ddbDocClient.send(
      new PutCommand({
        TableName: tableName, 
        Item: { id, name, price },
      })
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Item created", item: { id, name, price } }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Internal server error" }; 
  }
};
