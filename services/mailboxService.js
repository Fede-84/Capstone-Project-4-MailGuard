import axios from "axios";

const BASE_URL = "https://apilayer.net/api/check";

export async function checkEmail(API_KEY, email) {
  const response = await axios.get(
    `${BASE_URL}?access_key=${API_KEY}&email=${encodeURIComponent(email)}`,
  );

  const rawMaildata = response.data;

  const score = response.data.score;
  let qualityLabel;

  if (score >= 0.65) qualityLabel = "Good 🟢";
  else if (score >= 0.33) qualityLabel = "Medium 🟡";
  else qualityLabel = "Bad 🔴";

  const MailGuardResult = {
    email: rawMaildata.email,
    suggestion: rawMaildata.did_you_mean,
    formatValid: rawMaildata.format_valid,
    hasMX: rawMaildata.mx_found,
    smtpCheck: rawMaildata.smtp_check,
    isDisposable: rawMaildata.disposable,
    isRole: rawMaildata.role,
    isFree: rawMaildata.free,
    isCatchAll: rawMaildata.catch_all,
    score: rawMaildata.score,
    qualityLabel: qualityLabel,
  };

  return MailGuardResult;
}
