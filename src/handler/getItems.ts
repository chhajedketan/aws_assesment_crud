import { APIGatewayProxyHandler } from "aws-lambda";
import { ddbDocClient, tableName } from "../utils/dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const result = await ddbDocClient.send(
      new ScanCommand({
        TableName: tableName,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Items retrieved successfully",
        items: result.Items || [],
      }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Internal server error" };
  }
};
