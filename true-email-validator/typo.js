import EmailValidatorPro from "email-validator-pro";
let evp = new EmailValidatorPro()

const typo = (email) => {
    return evp.isValidAddress(email)
}

export default typo