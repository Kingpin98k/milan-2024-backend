import { v4 } from "uuid";
import ErrorHandler from "../../utils/errors.handler";
import {
  IBookingGetResObj,
  ICreateBookingReqObj,
  IResendEmailReqObj,
  IUpdateTicketReqObj,
} from "./interface";
import JWTUtils from "../../utils/jwt.utils"; // Assuming you have a JWTUtils class
import BookingsHelper from "./helper"; // Assuming you have a BookingsHelper class
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

import dotenv from "dotenv";
dotenv.config();
const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
});

export default class BookingsService extends BookingsHelper {
  jwtHelper: JWTUtils;

  constructor() {
    super();
    this.jwtHelper = new JWTUtils();
  }

  protected createBookingService = async (
    reqObj: ICreateBookingReqObj
  ): Promise<any> => {
    const sqsResponse = await this.insertBookingInSqs(reqObj);
    const response = {
      messageId: sqsResponse.MessageId,
    };
    return response;
  };

  protected getLiveTicketCountService = async (): Promise<any> => {
    const countResponse: any = await this.getTotalBookingCount();
    const totalTicketCount = 10000 - countResponse.count;
    const response = {
      total_count: totalTicketCount,
    };
    return response;
  };
  protected updateTicketIssuedService = async (
    reqObj: IUpdateTicketReqObj
  ): Promise<any> => {
    const response = await this.updateOfflineTicketIssuedHelper(reqObj);
    // const responseObj = {
    // 	data: response,
    // };
    return response;
  };


  protected resendemailService = async ({
    user_id,
    payment_id,
    ticket_id,
    email,
  }: IResendEmailReqObj): Promise<any> => {
    const UserEmail = await this.UserEmail(user_id);
    if (!UserEmail) {
      throw new ErrorHandler({
        status_code: 400,
        message: "User not found, Send them to tech team!!",
        message_code: "USER_NOT_FOUND_IN_RESENDEMAIL",
        is_loggable: true,
        user: user_id,
      });
    }

    const getEmailCount = await this.getEmailCount(email);

    if (getEmailCount != null && getEmailCount >= 5) {
      throw new ErrorHandler({
        status_code: 400,
        message: "Resend Email limit exceeded",
        message_code: "RESEND_EMAIL_LIMIT_EXCEEDED",
      });
    }

    const messageData = {
      Email: email,
      UserId: user_id,
      PaymentId: payment_id,
      TicketId: ticket_id,
    };

    if (!process.env.SQS_EMAIL_QUEUE_URL)
      throw new ErrorHandler({
        status_code: 400,
        message: "SQS_EMAIL_QUEUE_URL not found",
        message_code: "SQS_EMAIL_QUEUE_URL_NOT_FOUND",
      });

    const queueUrl =
      process.env.SQS_EMAIL_QUEUE_URL ||
      "https://sqs.ap-south-1.amazonaws.com/322653267300/email";

    const sendMessageCommand = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(messageData),
    });

    const result = await sqsClient.send(sendMessageCommand);
    const responseData = {
      MessageId: result.MessageId,
    };
    return responseData;
  };
}
