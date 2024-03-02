import {
	IBookingGetResObj,
	ICreateBookingReqObj,
	IUpdateTicketReqObj,
} from "./interface";
import ErrorHandler from "../../utils/errors.handler";
import BookingsDB from "./db";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

import dotenv from "dotenv";
import { disc_info_logger } from "../../utils/disc_logger";
dotenv.config();

const sqsClient = new SQSClient({
	region: process.env.AWS_REGION,
});
export default class BookingsHelper extends BookingsDB {
	protected insertBookingInSqs = async (reqObj: ICreateBookingReqObj) => {
		const UserEmail = await this.UserEmail(reqObj.user_id);
		if (!UserEmail) {
			throw new ErrorHandler({
				status_code: 400,
				message: "User not found, Send them to tech team!!",
				message_code: "USER_NOT_FOUND_IN_CREATE_BOOKING",
				is_loggable: true,
				user: reqObj.user_id,
			});
		}
		const messageData = {
			id: reqObj.id,
			ticket_type: reqObj.ticket_type,
			user_id: reqObj.user_id,
			email: UserEmail.email,
			payment_id: reqObj.payment_id,
			ticket_id: reqObj.ticket_id,
			payment_status: reqObj.payment_status,
			ticket_status: reqObj.ticket_status,
			offline_ticket_issued: reqObj.offline_ticket_issued,
			updated_at: reqObj.updated_at,
			created_at: reqObj.created_at,
		};
		if (!process.env.SQS_BOOKING_URL)
			throw new ErrorHandler({
				status_code: 400,
				message: "SQS_QUEUE_URL not found",
				message_code: "SQS_URL_NOT_FOUND",
			});

		const queueUrl =
			process.env.SQS_BOOKING_URL ||
			"https://sqs.ap-south-1.amazonaws.com/322653267300/post-booking.fifo";
		const messageGroupId: string = "booking-post";
		const sendMessageCommand = new SendMessageCommand({
			QueueUrl: queueUrl,
			MessageBody: JSON.stringify(messageData),
			MessageGroupId: messageGroupId,
		});

		const result = await sqsClient.send(sendMessageCommand);
		// console.log("Message sent to SQS:", result.MessageId);

		disc_info_logger.info({
			message: `Booking Created Successfully`,
			description: `
			# Booking Details
			
			### UserId : ${reqObj.user_id}

			### TicketId : ${reqObj.ticket_id}

			### PaymentId : ${reqObj.payment_id}
			
			## Email : ${UserEmail.email}

			### Timestamp : 
			${reqObj.created_at.toLocaleString()}
			`,
		});

		return result;
	};

	protected updateOfflineTicketIssuedHelper = async (
		reqObj: IUpdateTicketReqObj
	) => {
		const isUserExists = await this.checkUserExists(reqObj.user_id);
		if (!isUserExists) {
			throw new ErrorHandler({
				status_code: 400,
				message: "User not found, Send them to tech team!!",
				message_code: "USER_NOT_FOUND",
				is_loggable: true,
				user: reqObj.user_id,
			});
		}

		const checkIsAlreadyIssued: any = await this.checkTicketIssued(
			reqObj.ticket_id
		);

		if (!checkIsAlreadyIssued) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Ticket not found, Ticket id is wrong",
				message_code: "TICKET_NOT_FOUND",
			});
		}

		if (checkIsAlreadyIssued.offline_ticket_issued) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Ticket already issued",
				message_code: "TICKET_ALREADY_ISSUED",
			});
		}
		const updatedBooking = await this.updateOfflineTicketIssued(
			reqObj.user_id,
			reqObj.ticket_id,
			reqObj.payment_id
		);

		if (!updatedBooking) {
			throw new ErrorHandler({
				status_code: 400,
				message: "Booking not found, Send them to tech team!!",
				message_code: "BOOKING_NOT_FOUND",
				is_loggable: true,
				user: reqObj.user_id,
			});
		}
		return updatedBooking;
	};
}
