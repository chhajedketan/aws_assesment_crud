import { APIGatewayProxyHandler } from "aws-lambda";
import { ddbDocClient, tableName } from "..//utils/dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    
    const id = event.pathParameters?.id;
    if (!id) {
      return { statusCode: 400, body: "Missing id parameter" };
    }

    
    if (!event.body) {
      return { statusCode: 400, body: "Missing request body" };
    }

    const { name, price } = JSON.parse(event.body);

   
    if (name === undefined && price === undefined) {
      return { statusCode: 400, body: "At least one field (name or price) must be provided" };
    }

    // Build DynamoDB update expression dynamically
    let UpdateExpression = "set";
    const ExpressionAttributeNames: Record<string, string> = {};
    const ExpressionAttributeValues: Record<string, any> = {};

    if (name !== undefined) {
      UpdateExpression += " #name = :name";
      ExpressionAttributeNames["#name"] = "name";
      ExpressionAttributeValues[":name"] = name;
    }

    if (price !== undefined) {
      if (UpdateExpression !== "set") UpdateExpression += ",";
      UpdateExpression += " #price = :price";
      ExpressionAttributeNames["#price"] = "price";
      ExpressionAttributeValues[":price"] = price;
    }

    // Update the item in DynamoDB
    const result = await ddbDocClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW", 
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Item updated successfully",
        item: result.Attributes,
      }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Internal server error" };
  }
};
