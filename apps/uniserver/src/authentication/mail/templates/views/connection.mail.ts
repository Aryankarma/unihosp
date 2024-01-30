import { EmailMessageData } from "@elasticemail/elasticemail-client-ts-axios";

export function connectMail(connectionCount: number, recepient: string[]): EmailMessageData {
  return {
    Recipients: [
      ...recepient.map((id) => ({ Email: id }))
    ],
    Content: {
      Body: [
        {
          ContentType: 'HTML',
          Charset: 'utf-8',
          Content: `
          <h1>User Connected</h1>
          <p>Total number of users connected are: {connectionCount}</p>
          `
        },
      ],
      Merge: {
        connectionCount: `${connectionCount}`
      },
      From: `hello@unihosp.live`,
      Subject: `Unihosp user Count`,
    },
  };
}