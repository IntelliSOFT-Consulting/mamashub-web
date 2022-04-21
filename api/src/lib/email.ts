import { NodeMailgun } from 'ts-mailgun';



export async function sendEmail(){



const mailer = new NodeMailgun();
mailer.apiKey = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // Set your API key
mailer.domain = 'mail.my-sample-app.com'; // Set the domain you registered earlier
mailer.fromEmail = 'noreply@my-sample-app.com'; // Set your from email
mailer.fromTitle = 'My Sample App'; // Set the name you would like to send from

mailer.init();

// Send an email to test@example.com
mailer
	.send('test@example.com', 'Hello!', '<h1>hsdf</h1>')
	.then((result) => console.log('Done', result))
	.catch((error) => console.error('Error: ', error));
}