const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        console.log(`📧 Attempting to send email to: ${to}`);
        const info = await transporter.sendMail({
            from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('✅ Message sent successfully! ID: %s', info.messageId);
    } catch (error) {
        console.error('❌ Error sending email to:', to);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
    }
};


async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger!';
    const text = `Hello ${name},\n\nThank you for registering at Backend Ledger. We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Successful!';
    const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} was successful.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Your transaction of $${amount} to account ${toAccount} was successful.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Failed';
    const text = `Hello ${name},\n\nWe regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>We regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendLoginEmail(userEmail, name) {
    const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const subject = 'New Login Detected - Backend Ledger';
    const text = `Hello ${name},\n\nA new login was detected on your Backend Ledger account at ${loginTime} (IST).\n\nIf this was you, no action is needed.\nIf this wasn't you, please contact support immediately.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">🔐 New Login Detected</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>A new login was detected on your <strong>Backend Ledger</strong> account.</p>
            <table style="background: #f5f5f5; padding: 15px; border-radius: 8px; width: 100%;">
                <tr><td><strong>Time:</strong></td><td>${loginTime} (IST)</td></tr>
            </table>
            <br/>
            <p>✅ If this was <strong>you</strong>, no action is needed.</p>
            <p>⚠️ If this was <strong>NOT you</strong>, please contact support immediately.</p>
            <br/>
            <p>Best regards,<br/><strong>The Backend Ledger Team</strong></p>
        </div>
    `;
    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendLoginEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};