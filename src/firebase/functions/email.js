export const sendConfirmationEmail= (from,to,content)=> {
	//write a script to send confirmation email
	const msg = {
		to: to,
	  from: from,
	  subject: 'Event Confirmation',
	  text: content
	};
	return transporteer.sendMail(msg);
}