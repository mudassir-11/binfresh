export function getBookingConfirmationEmailHTML({
  name,
  planName,
  binCount,
  scent,
  serviceDate,
  isSubscription,
  portalUrl,
}: {
  name: string;
  planName: string;
  binCount: number;
  scent: string;
  serviceDate: string;
  isSubscription: boolean;
  portalUrl: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
    .header { background-color: #16a34a; padding: 40px 20px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 800; }
    .content { padding: 40px; }
    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 24px; }
    .card { background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
    .row:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
    .label { color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-weight: 600; text-align: right; }
    .button { display: inline-block; background-color: #16a34a; color: white; text-decoration: none; padding: 14px 28px; border-radius: 999px; font-weight: 600; text-align: center; margin-top: 16px; }
    .footer { text-align: center; padding: 32px; color: #94a3b8; font-size: 14px; background-color: #f8fafc; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmed! 🎉</h1>
    </div>
    <div class="content">
      <div class="greeting">Hi ${name},</div>
      <p>Thank you for choosing CleanBinSolutions! Your bin cleaning service has been successfully scheduled.</p>
      
      <div class="card">
        <div class="row">
          <span class="label">Plan</span>
          <span class="value">${planName}</span>
        </div>
        <div class="row">
          <span class="label">First Service Date</span>
          <span class="value">${serviceDate}</span>
        </div>
        <div class="row">
          <span class="label">Bins</span>
          <span class="value">${binCount} Garbage Bin${binCount > 1 ? 's' : ''}</span>
        </div>
        <div class="row">
          <span class="label">Scent</span>
          <span class="value">${scent === "Lemon" ? "🍋" : scent === "Mint" ? "🌿" : "💜"} ${scent}</span>
        </div>
      </div>

      <p>Please ensure your bins are left empty and accessible by the curb on your scheduled service date.</p>

      ${isSubscription ? `
        <p style="margin-top: 32px; font-size: 14px; color: #475569;">
          You are on a recurring subscription. You can manage your billing details or cancel at any time using our secure customer portal.
        </p>
        <div style="text-align: center;">
          <a href="${portalUrl}" class="button">Manage Subscription</a>
        </div>
      ` : ''}
    </div>
    <div class="footer">
      <p>CleanBinSolutions Professional Services</p>
      <p>Moorpark, CA 93021</p>
    </div>
  </div>
</body>
</html>
  `;
}
