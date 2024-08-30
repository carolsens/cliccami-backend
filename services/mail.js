// const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
//
// const sesClient = new SESClient({ region: 'us-east-2' });
//
// async function sendEmail(params) {
//     try {
//         const command = new SendEmailCommand(params);
//         const data = await sesClient.send(command);
//         console.log('Email sent:', data.MessageId);
//         return data;
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw error;
//     }
// }
//
// module.exports = { sendEmail };
