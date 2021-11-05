const sendGridAPIkey = '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';
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

// sgMail.send({
//     to: 'sherdg@i.ua',
//     from: 'sherdg@i.ua',
//     subject: "Testing SendGrid",
//     text: "Testing SendGrid"
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sherdg@i.ua',
        subject: "Thanks for joining!",
        text: `Thanks for joining ${name}!`
    })
};

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sherdg@i.ua',
        subject: "See you!",
        text: `Goodbye ${name}!`
    })
};


module.exports = {sendWelcomeEmail, sendCancelEmail};
