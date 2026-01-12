import { APIGatewayProxyHandler } from "aws-lambda";
import { ddbDocClient, tableName } from "..//utils/dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    
    const id = event.pathParameters?.id;
    if (!id) {
      return { statusCode: 400, body: "Missing id parameter" };
    }

    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { id },
      })
    );

    // If item does not exist
    if (!result.Item) {
      return { statusCode: 404, body: "Item not found" };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Item retrieved successfully",
        item: result.Item,
      }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Internal server error" };
  }
};
