import { IEmail } from "../email.interfaces";

export const sendMailJob = ({ html, subject, to }: IEmail) => ({ to, subject, html });