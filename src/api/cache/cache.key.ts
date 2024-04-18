/**
 * [STRING] 이메일 인증번호 발송 키
 * @param email
 * @param userId
 * @returns
 */
export const EMAIL_AUTH_NUMBER_KEY = (email: string) => {
  return `email_auth_number_key:${email}`;
};

/**
 * [STRING] 이메일 인증번호 키
 * @param email
 * @returns
 */
export const StringEmailAuthNumberKey = (email: string) => {
  return `string-email-auth-number-key:${email}`;
};

/**
 * [STRING] 이메일 인증번호 최대 발송 횟수 키
 * @param ip
 * @returns
 */
export const StringEmailAuthMaxCountKey = (ip: string) => {
  return `string-email-auth-max-count-key:${ip}`;
};
