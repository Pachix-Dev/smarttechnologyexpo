const email_template_ecommerce_purchase = async ({
  visitor,
  items,
  pricing,
  orderId,
  transactionId,
}) => {
  const fullName = `${visitor?.name || ''} ${visitor?.paternSurname || ''}`.trim();

  const rows = (items || [])
    .map((item) => {
      const qty = Number(item.quantity || 0);
      const unit = Number(item.unit_price || 0);
      const total = Number(item.total ?? unit * qty);
      return `
        <tr>
          <td style="padding:10px; border:1px solid #e5e7eb; font-size:13px;">${item.name || '-'}</td>
          <td style="padding:10px; border:1px solid #e5e7eb; text-align:right; font-size:13px;">${qty}</td>
          <td style="padding:10px; border:1px solid #e5e7eb; text-align:right; font-size:13px;">$${unit.toFixed(2)}</td>
          <td style="padding:10px; border:1px solid #e5e7eb; text-align:right; font-size:13px;">$${total.toFixed(2)}</td>
        </tr>
      `;
    })
    .join('');

  return `
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f5f5f5; margin:0; padding:20px 0;">
    <tr>
      <td align="center">
        <table width="620" border="0" cellspacing="0" cellpadding="0" style="width:620px; max-width:620px; background-color:#ffffff;">
          <tr>
            <td align="center">
              <img src="https://smarttechnologyexpo.mx/header_email_ste.jpg" alt="Smart Technology Expo 2026" width="620" style="display:block; width:100%; border:0;" />
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 10px 28px; font-family:Arial, sans-serif; color:#111827;">
              <h2 style="margin:0 0 10px 0; font-size:24px;">Thank you for your purchase</h2>
              <p style="margin:0; font-size:15px; line-height:1.6;">Hello ${fullName || 'Visitor'}, your payment has been successfully confirmed.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 16px 28px; font-family:Arial, sans-serif; color:#111827;">
              <p style="margin:0; font-size:14px; line-height:1.6;">
                <strong>Order ID:</strong> ${orderId}<br/>
                <strong>Transaction ID:</strong> ${transactionId || 'N/A'}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 8px 28px; font-family:Arial, sans-serif; color:#111827;">
              <h3 style="margin:0 0 10px 0; font-size:18px;">Purchased Workshops / Products</h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr style="background:#f3f4f6;">
                  <th style="padding:10px; border:1px solid #e5e7eb; text-align:left; font-size:12px;">Product</th>
                  <th style="padding:10px; border:1px solid #e5e7eb; text-align:right; font-size:12px;">Qty</th>
                  <th style="padding:10px; border:1px solid #e5e7eb; text-align:right; font-size:12px;">Unit Price</th>
                  <th style="padding:10px; border:1px solid #e5e7eb; text-align:right; font-size:12px;">Total</th>
                </tr>
                ${rows}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 28px 20px 28px; font-family:Arial, sans-serif; color:#111827; text-align:right;">
              <div style="font-size:14px; line-height:1.6;">
                Subtotal: $${Number(pricing?.subtotal || 0).toFixed(2)}<br/>
                Discount: -$${Number(pricing?.discount || 0).toFixed(2)}<br/>
                <strong>Total: $${Number(pricing?.final_amount || 0).toFixed(2)}</strong>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 24px 28px; font-family:Arial, sans-serif; color:#111827;">
              <p style="margin:0; font-size:14px; line-height:1.6;">
                We have attached two documents in this email:
              </p>
              <ul style="font-size:14px; line-height:1.7; color:#111827;">
                <li>Purchase receipt PDF with detailed table breakdown.</li>
                <li>Expo access badge PDF.</li>
              </ul>
              <p style="margin:0; font-size:14px; line-height:1.6;">
                For invoicing support please contact: <br/>
                <a href="mailto:emmanuel.heredia@igeco.mx">emmanuel.heredia@igeco.mx</a><br/>
                <a href="mailto:jesus.zermeno@igeco.mx">jesus.zermeno@igeco.mx</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f3f4f6; padding:18px 28px; font-family:Arial, sans-serif; color:#6b7280; font-size:12px; text-align:center;">
              Smart Technology Expo 2026 · Italian German Exhibition Company Mexico
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
};

export { email_template_ecommerce_purchase };
