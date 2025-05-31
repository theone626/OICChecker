import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, qualified } = req.body;
  console.log('Received request:', { email, qualified });

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // These URLs should be stored in environment variables in production
  const pdfUrls = {
    qualified: process.env.QUALIFIED_PDF_URL || 'https://drive.google.com/uc?export=download&id=1eqOC5lqZnsgDbURvcdjQOLZI-6AOMaUJ',
    notQualified: process.env.NOT_QUALIFIED_PDF_URL || 'https://drive.google.com/uc?export=download&id=1o0TxBE9xOpCxfrYWzNj3aCEA_8AXrff9'
  };

  try {
    console.log('Attempting to send email...');
    
    // Fetch the PDF from the URL
    const pdfUrl = qualified ? pdfUrls.qualified : pdfUrls.notQualified;
    
    try {
      const pdfResponse = await fetch(pdfUrl);
      if (!pdfResponse.ok) throw new Error('Failed to fetch PDF');
      
      const pdfBuffer = await pdfResponse.arrayBuffer();
      console.log('PDF file loaded successfully');

      const result = await resend.emails.send({
        from: 'Demetri Chambers <support@verifiedtaxresolution.com>',
        to: email,
        subject: 'Your IRS Resolution Guide',
        attachments: [
          {
            filename: 'Tax_Resolution_Guide.pdf',
            content: Buffer.from(pdfBuffer)
          }
        ],
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a365d; margin-bottom: 20px;">Your Tax Resolution Guide</h2>
            
            <p>Hello,</p>
            
            <p>Thank you for using our OIC eligibility checker. Based on the information you provided, 
            ${qualified 
              ? "you may be eligible for an Offer in Compromise. This is a great first step towards resolving your tax situation." 
              : "while you may not qualify for an OIC at this time, there are several other options available to help resolve your tax situation."
            }</p>

            <p>I've prepared a comprehensive guide that will walk you through:</p>
            
            <ul style="margin-bottom: 20px;">
              <li>Understanding the IRS collection process</li>
              <li>Different resolution options available to you</li>
              <li>Step-by-step instructions for moving forward</li>
              <li>Tips for working with the IRS</li>
            </ul>

            <p style="margin-bottom: 20px;">
              ${qualified 
                ? "Your results suggest you might be a good candidate for an Offer in Compromise. The guide will explain how to prepare a strong OIC application and what to expect during the process." 
                : "While an OIC might not be the best fit currently, don't worry - there are several effective strategies that could work better for your situation. The guide covers various IRS resolution options including installment agreements, currently not collectible status, and penalty abatement. These alternatives might be more suitable for your circumstances and could help you resolve your tax debt more effectively."
              }
            </p>

            <p style="margin-bottom: 20px;">I've attached your personalized Tax Resolution Guide to this email.</p>

            <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #2d3748;">
                ${qualified
                  ? "Would you like to discuss your OIC qualification and next steps? Email me at <a href=\"mailto:demetrichambers.ea@gmail.com\">demetrichambers.ea@gmail.com</a> to schedule a free consultation about your specific situation."
                  : "Would you like to explore which tax resolution option might work best for you? Email me at <a href=\"mailto:demetrichambers.ea@gmail.com\">demetrichambers.ea@gmail.com</a> to schedule a free consultation about your specific situation."
                }
              </p>
            </div>

            <p style="margin-top: 20px;">Best regards,</p>
            <p style="margin-bottom: 20px;">Demetri Chambers, EA</p>
            
            <div style="font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0; padding-top: 20px;">
              <p>This email is for informational purposes only and does not constitute legal or tax advice. Please consult with a qualified tax professional for advice specific to your situation.</p>
            </div>
          </div>
        `,
      });
      console.log('Email sent successfully:', result);
      return res.status(200).json({ success: true, result });
    } catch (fetchError) {
      console.error('Error fetching PDF:', fetchError);
      // If PDF fails to load, send email without attachment but include the download link
      const result = await resend.emails.send({
        from: 'Demetri Chambers <support@verifiedtaxresolution.com>',
        to: email,
        subject: 'Your IRS Resolution Guide',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a365d; margin-bottom: 20px;">Your Tax Resolution Guide</h2>
            
            <p>Hello,</p>
            
            <p>Thank you for using our OIC eligibility checker. Based on the information you provided, 
            ${qualified 
              ? "you may be eligible for an Offer in Compromise. This is a great first step towards resolving your tax situation." 
              : "while you may not qualify for an OIC at this time, there are several other options available to help resolve your tax situation."
            }</p>

            <p>I've prepared a comprehensive guide that will walk you through:</p>
            
            <ul style="margin-bottom: 20px;">
              <li>Understanding the IRS collection process</li>
              <li>Different resolution options available to you</li>
              <li>Step-by-step instructions for moving forward</li>
              <li>Tips for working with the IRS</li>
            </ul>

            <p style="margin-bottom: 20px;">
              ${qualified 
                ? "Your results suggest you might be a good candidate for an Offer in Compromise. The guide will explain how to prepare a strong OIC application and what to expect during the process." 
                : "While an OIC might not be the best fit currently, don't worry - there are several effective strategies that could work better for your situation. The guide covers various IRS resolution options including installment agreements, currently not collectible status, and penalty abatement. These alternatives might be more suitable for your circumstances and could help you resolve your tax debt more effectively."
              }
            </p>

            <p style="margin-bottom: 20px;">You can download your personalized Tax Resolution Guide here: <a href="${pdfUrl}">Download Guide</a></p>

            <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #2d3748;">
                ${qualified
                  ? "Would you like to discuss your OIC qualification and next steps? Email me at <a href=\"mailto:demetrichambers.ea@gmail.com\">demetrichambers.ea@gmail.com</a> to schedule a free consultation about your specific situation."
                  : "Would you like to explore which tax resolution option might work best for you? Email me at <a href=\"mailto:demetrichambers.ea@gmail.com\">demetrichambers.ea@gmail.com</a> to schedule a free consultation about your specific situation."
                }
              </p>
            </div>

            <p style="margin-top: 20px;">Best regards,</p>
            <p style="margin-bottom: 20px;">Demetri Chambers, EA</p>
            
            <div style="font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0; padding-top: 20px;">
              <p>This email is for informational purposes only and does not constitute legal or tax advice. Please consult with a qualified tax professional for advice specific to your situation.</p>
            </div>
          </div>
        `,
      });
      console.log('Email sent with download link:', result);
      return res.status(200).json({ success: true, result, warning: 'PDF sent as link instead of attachment' });
    }
  } catch (error) {
    console.error('Email failed:', error);
    if (error.message.includes('403')) {
      return res.status(403).json({ 
        error: 'Email sending failed', 
        details: 'You need to verify your email address first. Please go to https://resend.com/verify and verify your email address.'
      });
    }
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
