export const welcomeEmailTemplate = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Welcome to FormType</title>

  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #101112; }

    a { color: #e8914a; }

    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .fluid-padding { padding-left: 24px !important; padding-right: 24px !important; }
      .hero-heading { font-size: 30px !important; line-height: 1.15 !important; }
      .section-heading { font-size: 22px !important; }
      .cta-button { width: 100% !important; }
      .cta-button a { display: block !important; width: 100% !important; box-sizing: border-box; }
      .step-card { max-width: 100% !important; padding-right: 0 !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#101112;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
    Welcome to FormType — let's build your first form together.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#101112;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">

          <!-- Logo / wordmark -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#f4f1ea; border-radius:8px; width:32px; height:32px; text-align:center; vertical-align:middle;" width="32" height="32">
                    <span style="font-family: Arial, Helvetica, sans-serif; font-size:16px; line-height:32px; color:#101112; font-weight:700;">F</span>
                  </td>
                  <td style="padding-left:10px; font-family: Arial, Helvetica, sans-serif; font-size:20px; font-weight:700; color:#f4f1ea; letter-spacing:-0.5px;">
                    FormType
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero card -->
          <tr>
            <td style="background-color:#181a19; border:1px solid #2e302d; border-radius:24px; padding: 44px 40px;" class="fluid-padding">

              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#202220; border:1px solid #41433f; border-radius:999px; padding:7px 14px; font-family: Arial, Helvetica, sans-serif; font-size:12px; font-weight:600; color:#c5c0b5;">
                    &#10022;&nbsp; You're in
                  </td>
                </tr>
              </table>

              <h1 class="hero-heading" style="margin: 22px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 38px; line-height: 1.1; letter-spacing:-1px; font-weight:700; color:#f4f1ea;">
                Welcome to FormType, let&rsquo;s make your first form <span style="color:#e8914a;">count.</span>
              </h1>

              <p style="margin: 18px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 26px; color:#aaa59b;">
                Your account is ready. FormType helps you build clear, thoughtful forms in minutes &mdash; and actually understand what comes back.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px;">
                <tr>
                  <td class="cta-button" style="border-radius:999px; background-color:#e8914a;">
                    <a href="https://formtype.app/dashboard" target="_blank" style="display:inline-block; padding:14px 30px; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:700; color:#101112; text-decoration:none; border-radius:999px;">
                      Start building &nbsp;&rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 16px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color:#817f76;">
                &#10003;&nbsp; No credit card required
              </p>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="line-height:40px; font-size:40px;">&nbsp;</td></tr>

          <!-- Section heading -->
          <tr>
            <td class="fluid-padding" style="padding: 0 4px;">
              <p style="margin:0; font-family: Arial, Helvetica, sans-serif; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#e8914a;">
                Getting started
              </p>
              <h2 class="section-heading" style="margin: 10px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 26px; line-height:1.2; letter-spacing:-0.5px; font-weight:700; color:#f4f1ea;">
                Three steps to your first response.
              </h2>
            </td>
          </tr>

          <!-- Steps (fluid hybrid: divs wrap naturally on narrow screens even without media-query support; .step-card media rule forces full width on mobile as an enhancement; Outlook gets a fixed 3-col table) -->
          <tr>
            <td style="padding-top: 24px;" class="fluid-padding">
              <!--[if mso]>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td width="192" valign="top">
              <![endif]-->
              <div class="step-card" style="display:inline-block; width:100%; max-width:192px; vertical-align:top; box-sizing:border-box; padding:0 6px 12px 0;">
                <div style="background-color:#202522; border-radius:18px; padding:24px 20px;">
                  <div style="width:40px; height:40px; border-radius:10px; background-color:#df7850; text-align:center; line-height:40px; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:700; color:#ffffff;">01</div>
                  <p style="margin:16px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:700; color:#f4f1ea;">Build</p>
                  <p style="margin:6px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:19px; color:#aaa59b;">Start from a blank canvas and shape the fields you need.</p>
                </div>
              </div>
              <!--[if mso]>
              </td>
              <td width="192" valign="top">
              <![endif]-->
              <div class="step-card" style="display:inline-block; width:100%; max-width:192px; vertical-align:top; box-sizing:border-box; padding:0 6px 12px 0;">
                <div style="background-color:#1d2927; border-radius:18px; padding:24px 20px;">
                  <div style="width:40px; height:40px; border-radius:10px; background-color:#668f7b; text-align:center; line-height:40px; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:700; color:#ffffff;">02</div>
                  <p style="margin:16px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:700; color:#f4f1ea;">Collect</p>
                  <p style="margin:6px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:19px; color:#aaa59b;">Share one link and let responses come in on their own.</p>
                </div>
              </div>
              <!--[if mso]>
              </td>
              <td width="192" valign="top">
              <![endif]-->
              <div class="step-card" style="display:inline-block; width:100%; max-width:192px; vertical-align:top; box-sizing:border-box; padding:0 0 12px 0;">
                <div style="background-color:#25222b; border-radius:18px; padding:24px 20px;">
                  <div style="width:40px; height:40px; border-radius:10px; background-color:#8871a8; text-align:center; line-height:40px; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:700; color:#ffffff;">03</div>
                  <p style="margin:16px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size:15px; font-weight:700; color:#f4f1ea;">Understand</p>
                  <p style="margin:6px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size:13px; line-height:19px; color:#aaa59b;">See every submission together and track what matters.</p>
                </div>
              </div>
              <!--[if mso]>
              </td>
              </tr></table>
              <![endif]-->
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="line-height:40px; font-size:40px;">&nbsp;</td></tr>

          <!-- Help / support strip -->
          <tr>
            <td style="background-color:#202220; border:1px solid #454640; border-radius:18px; padding: 24px 28px;" class="fluid-padding">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="font-family: Arial, Helvetica, sans-serif; font-size:14px; color:#f4f1ea;">
                    Have a question? Just reply to this email &mdash; a real person reads every message.
                  </td>
                  <td valign="middle" align="right" style="white-space:nowrap; padding-left:16px;">
                    <a href="mailto:hello@aneesh.space" style="font-family: Arial, Helvetica, sans-serif; font-size:14px; font-weight:700; color:#e8914a; text-decoration:none;">Say hi &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 36px 16px 8px 16px;">
              <p style="margin:0; font-family: Arial, Helvetica, sans-serif; font-size:13px; color:#817f76;">
                FormType &middot; Make the questions count.
              </p>
              <p style="margin:10px 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size:12px; color:#5c5b56;">
                You're receiving this because you created a FormType account.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;