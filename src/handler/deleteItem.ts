import { APIGatewayProxyHandler } from "aws-lambda";
import { ddbDocClient, tableName } from "../utils/dynamodb";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return { statusCode: 400, body: "Missing id parameter" };
    }

    const result = await ddbDocClient.send(
      new DeleteCommand({
        TableName: tableName,
        Key: { id },
        ReturnValues: "ALL_OLD",
      })
    );

    if (!result.Attributes) {
      return { statusCode: 404, body: "Item not found" };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Item deleted successfully",
        item: result.Attributes,
      }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Internal server error" };
  }
};