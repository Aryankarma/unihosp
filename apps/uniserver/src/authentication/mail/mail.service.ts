import { Configuration, EmailsApi } from "@elasticemail/elasticemail-client-ts-axios";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { VerifyMail } from "./templates";
import { connectMail } from "./templates/views/connection.mail";

@Injectable()
export class MailService implements OnModuleInit {
  constructor(private config: ConfigService) { }

  private logger = new Logger();

  emailApi: EmailsApi;

  onModuleInit() {
    const configuration = new Configuration({
      apiKey: this.config.get('MAIL_API_KEY'),
    });
    this.emailApi = new EmailsApi(configuration);
  }

  async sendMail(recipient: string, username: string, verificationURL: string, otpCode: number) {
    try {
      const response = await this.emailApi.emailsPost(
        VerifyMail(recipient, username, verificationURL, otpCode)
      );
      this.logger.debug('Email Send Successfully');
      return {
        message: response.statusText,
        statusCode: response.status,
      };
    } catch (error) {
      this.logger.error(error.message);
      return error;
    }
  }

  async sendConnectionCount(ConnectionCount: number) {
    const recepients: string[] = this.config.get('MAIL_RECEPIENTS').split(",");
    try {
      const response = await this.emailApi.emailsPost(connectMail(ConnectionCount, recepients));
      return {
        message: response.statusText,
        statusCode: response.status,
      };
    } catch (error) {
      this.logger.error(error.message);
      return error;
    }
  }
}
